package com.akylas.gpsmocker.mocklocation

import android.content.Context
import android.os.Handler
import android.os.HandlerThread
import android.os.SystemClock

/** How much of itself the app is allowed to put in the notification shade. */
enum class NotificationMode {
    /**
     * For as long as the app holds the test providers. The default, because
     * held providers mean no app on the device can see the real GPS, and the
     * shade is the only place that is ever said.
     */
    ALWAYS,

    /** Only while a route is actually being replayed. */
    PLAYING,

    /**
     * Never. Playback then has no foreground service to live in, so it only
     * runs while the app itself is alive and in front.
     */
    NEVER;

    val storageValue: String get() = name.lowercase()

    companion object {
        fun from(value: String?): NotificationMode =
            values().firstOrNull { it.storageValue == value?.lowercase() } ?: ALWAYS
    }
}

/**
 * The mocking session: who holds the test providers, which track is loaded and
 * where playback stands.
 *
 * It deliberately lives outside the service. A foreground service is only ever
 * needed to keep a *clock* running while another app is in front — that is
 * on-device playback and nothing else. A desktop driving us over adb brings its
 * own clock and needs no more than a push, and holding a session open needs
 * nothing at all, because a test provider registration lives in the system and
 * outlives the process that made it.
 *
 * Keeping the state here is what lets the service — and with it the
 * notification — come and go without a session ever noticing.
 */
object MockEngine {

    private const val PREFS = "mock_location"

    /** True while we believe a session is running, across process deaths. */
    private const val KEY_SESSION = "session"
    private const val KEY_NOTIFICATION = "notification"

    /** True once a release failed and left an override on the providers. */
    private const val KEY_STRANDED = "stranded"

    private const val TICK_MS = 200L

    /** How often the notification's readout is allowed to be redrawn. */
    private const val NOTIFY_MS = 1000L

    private var appContext: Context? = null
    private var providerOrNull: MockProvider? = null

    private var tickerThread: HandlerThread? = null
    private var ticker: Handler? = null

    private var track: Track? = null
    private var looping = false
    private var speedMultiplier = 1.0

    /** Track position, in track milliseconds, as of [anchorRealtime]. */
    private var anchorPosition = 0.0
    private var anchorRealtime = 0L

    private var notifiedAt = 0L

    private var mode = NotificationMode.ALWAYS

    var playing = false
        private set

    /** The last fix published, whoever asked for it. */
    var lastFix: Fix? = null
        private set

    /** (positionMs, ended, fix) */
    @Volatile
    var progressListener: ((Double, Boolean, Fix?) -> Unit)? = null

    /** Fired when a session ends, so the UI can drop its mocking flag. */
    @Volatile
    var statusListener: (() -> Unit)? = null

    private val tick = object : Runnable {
        override fun run() {
            publish()
            ticker?.postDelayed(this, TICK_MS)
        }
    }

    /**
     * Every entry point calls this: the plugin on load, the service on create,
     * and the receiver on every broadcast — a broadcast is the one that can
     * arrive into a process that has just been started for it.
     */
    fun attach(context: Context) {
        if (appContext != null) return
        appContext = context.applicationContext
        mode = NotificationMode.from(prefs()?.getString(KEY_NOTIFICATION, null))
        // so the channel is in the app's notification settings from the first
        // launch, rather than appearing only once a session has been started
        appContext?.let { MockNotification.ensureChannel(it) }
    }

    // ---- state ----------------------------------------------------------

    val active: Boolean get() = providerOrNull?.active == true

    val hasTrack: Boolean get() = track?.isEmpty == false

    val durationMs: Double get() = track?.durationMs ?: 0.0

    fun isSelectedAsMockApp(): Boolean = provider()?.isSelectedAsMockApp() ?: false

    /**
     * True when a test provider override is still on the device and this app
     * can no longer take it off.
     *
     * That happens whenever the app stops being the selected mock app while it
     * holds the providers — the user picks another app, or reinstalls this one,
     * which clears the selection and changes the uid. The platform does not
     * drop the override with the permission: it stays, serving whatever it last
     * published, and no app on the device sees the real GPS again until this
     * app is selected once more or the device reboots.
     *
     * Surfacing it is the whole point. The recovery is one tap away, but it is
     * unguessable, and "my GPS is broken, I rebooted" is what happens instead.
     */
    val stranded: Boolean get() = remembered(KEY_STRANDED) && !isSelectedAsMockApp()

    var notificationMode: NotificationMode
        get() = mode
        set(value) {
            if (value == mode) return
            mode = value
            prefs()?.edit()?.putString(KEY_NOTIFICATION, value.storageValue)?.apply()
            sync()
        }

    // ---- session --------------------------------------------------------

    /** Claims the test providers for an on-device session. */
    fun start(): Boolean = claim()

    /**
     * Claims them, whoever is asking — the app's own screen or a desktop over
     * adb.
     *
     * The desktop path gets no service, because there is no clock of ours to
     * keep alive, but it does get the notification: from the device's point of
     * view a desktop-driven session is exactly as invisible and exactly as
     * disruptive as any other, and it is the one nobody can stop from the
     * screen in front of them.
     */
    fun claim(): Boolean {
        val provider = provider() ?: return false
        // a desktop claims the session again on every single fix
        val wasActive = provider.active
        if (!provider.acquire()) {
            remember(false)
            return false
        }
        remember(true)
        // an override is on the providers from here until a release takes it
        // off, and only this app — while it is still the selected mock app —
        // ever can
        remember(true, KEY_STRANDED)
        if (!wasActive) sync()
        return true
    }

    /** Ends the session: releases the providers and drops the notification. */
    fun stop() {
        val wasActive = active
        playing = false
        quitClock()
        // a track baked under settings that may since have changed is worse
        // than none: the webview re-syncs one when the next session starts
        track = null
        lastFix = null
        anchorPosition = 0.0
        // provider(), not the field: a STOP off the wire can land in a process
        // that was started for it and has never touched the providers
        if (provider()?.release() == true) remember(false, KEY_STRANDED)
        remember(false)
        appContext?.let {
            MockLocationService.stop(it)
            // the service's own onDestroy would get here too, but only if it
            // was running at all — a desktop's session never had one
            MockNotification.cancel(it)
        }
        if (wasActive) statusListener?.invoke()
    }

    /**
     * Reconciles the platform's registrations with what we believe on launch.
     *
     * A registration outlives the process that made it, so after a force-stop
     * or a low-memory kill the device can still be serving the last mocked fix
     * with nobody driving it. A session we remember is taken back — it may well
     * be a desktop's, which must survive the app being opened — and anything
     * else is dropped, so the device is never stuck on a mocked position.
     */
    fun adopt() {
        val provider = provider() ?: return
        if (remembered()) {
            if (provider.acquire()) remember(true, KEY_STRANDED)
        } else if (provider.release()) {
            remember(false, KEY_STRANDED)
        }
        sync()
    }

    // ---- playback -------------------------------------------------------

    fun setTrack(next: Track) {
        track = next
        anchorPosition = 0.0
        anchorRealtime = SystemClock.elapsedRealtime()
        publish()
        sync()
    }

    fun setPlaying(next: Boolean) {
        if (next == playing) return
        // fold the elapsed time into the anchor before the clock changes meaning
        anchorPosition = positionMs()
        anchorRealtime = SystemClock.elapsedRealtime()
        playing = next
        if (next) startClock() else stopClock()
        if (!next) publish()
        // the service exists for exactly this: a clock that keeps running once
        // the webview is no longer in front
        sync()
    }

    fun seek(positionMs: Double) {
        anchorPosition = positionMs.coerceAtLeast(0.0)
        anchorRealtime = SystemClock.elapsedRealtime()
        publish()
        sync()
    }

    fun setSpeedMultiplier(value: Double) {
        anchorPosition = positionMs()
        anchorRealtime = SystemClock.elapsedRealtime()
        speedMultiplier = value.coerceAtLeast(0.01)
    }

    fun setLooping(value: Boolean) {
        looping = value
    }

    /** Manual driving, a dragged pin, a fix off the wire — all bypass the track. */
    fun pushOneShot(fix: Fix) {
        setPlaying(false)
        push(fix)
        progressListener?.invoke(positionMs(), false, fix)
        notifyProgress()
    }

    fun positionMs(): Double {
        if (!playing) return anchorPosition
        val elapsed = (SystemClock.elapsedRealtime() - anchorRealtime).toDouble()
        return anchorPosition + elapsed * speedMultiplier
    }

    private fun publish() {
        val current = track
        if (current == null || current.isEmpty) return

        var position = positionMs()
        var ended = false

        if (position >= current.durationMs) {
            if (looping && current.durationMs > 0) {
                position %= current.durationMs
                anchorPosition = position
                anchorRealtime = SystemClock.elapsedRealtime()
            } else {
                position = current.durationMs
                anchorPosition = position
                anchorRealtime = SystemClock.elapsedRealtime()
                if (playing) {
                    playing = false
                    stopClock()
                    sync()
                }
                ended = true
            }
        }

        val fix = current.fixAt(position) ?: return
        push(fix)
        progressListener?.invoke(position, ended, fix)
        notifyProgress()
    }

    private fun push(fix: Fix) {
        lastFix = fix
        providerOrNull?.push(fix)
    }

    /**
     * Redraws the notification for a fix that changed nothing but the readout.
     *
     * Fixes come five times a second and a drive pad held down comes faster
     * still; a notification that says minutes and seconds has no use for any of
     * that, so the shade is left alone in between.
     */
    private fun notifyProgress() {
        val now = SystemClock.elapsedRealtime()
        if (now - notifiedAt < NOTIFY_MS) return
        notifiedAt = now
        sync()
    }

    // ---- clock ----------------------------------------------------------

    private fun startClock() {
        val thread = tickerThread ?: HandlerThread("mock-location").apply {
            start()
            tickerThread = this
        }
        val handler = ticker ?: Handler(thread.looper).also { ticker = it }
        handler.removeCallbacks(tick)
        handler.post(tick)
    }

    private fun stopClock() {
        ticker?.removeCallbacks(tick)
    }

    /** Only when a session ends: the thread is reused across pauses. */
    private fun quitClock() {
        stopClock()
        tickerThread?.quitSafely()
        tickerThread = null
        ticker = null
    }

    // ---- service and shade ----------------------------------------------

    /**
     * Brings the foreground service and the notification in line with the
     * session.
     *
     * The service is wanted for one reason and one only — a playback clock that
     * has to keep running once the webview is no longer in front — so it is
     * tied to playback and not to the notification, which the shade can hold
     * perfectly well on its own. That is what lets a desktop's session be
     * announced from a broadcast receiver, where starting a `location` service
     * would be refused outright.
     */
    private fun sync() {
        val context = appContext ?: return
        val wantsClock = active && playing && mode != NotificationMode.NEVER
        if (wantsClock) MockLocationService.start(context) else MockLocationService.stop(context)
        MockNotification.sync(context)
    }

    // ---- storage --------------------------------------------------------

    private fun provider(): MockProvider? {
        val context = appContext ?: return null
        return providerOrNull ?: MockProvider(context).also { providerOrNull = it }
    }

    private fun prefs() = appContext?.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    private fun remembered(key: String = KEY_SESSION) = prefs()?.getBoolean(key, false) ?: false

    private fun remember(value: Boolean, key: String = KEY_SESSION) {
        // a desktop claims the session again on every single fix, so this is
        // only ever written when it actually changes
        val prefs = prefs() ?: return
        if (prefs.getBoolean(key, false) == value) return
        prefs.edit().putBoolean(key, value).apply()
    }
}
