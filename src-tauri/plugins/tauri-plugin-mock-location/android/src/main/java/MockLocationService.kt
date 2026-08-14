package com.akylas.gpsmocker.mocklocation

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.Handler
import android.os.HandlerThread
import android.os.IBinder
import android.os.SystemClock
import android.util.Log
import androidx.core.app.NotificationCompat

/**
 * Publishes the mocked track from a foreground service.
 *
 * The whole point of the app is to keep feeding locations while some *other*
 * app is in front. A webview that loses focus gets its timers throttled to a
 * near stop, so the playback clock has to live out here.
 */
class MockLocationService : Service() {

    private lateinit var provider: MockProvider
    private lateinit var ticker: Handler
    private lateinit var tickerThread: HandlerThread

    private var track: Track? = null
    private var playing = false
    private var looping = false
    private var speedMultiplier = 1.0

    /** Track position, in track milliseconds, as of [anchorRealtime]. */
    private var anchorPosition = 0.0
    private var anchorRealtime = 0L

    private val tick = object : Runnable {
        override fun run() {
            publish()
            ticker.postDelayed(this, TICK_MS)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        provider = MockProvider(this)
        tickerThread = HandlerThread("mock-location").apply { start() }
        ticker = Handler(tickerThread.looper)
        instance = this
        pendingTrack?.let { track = it; pendingTrack = null }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_TOGGLE -> setPlaying(!playing)
            ACTION_STOP -> {
                stopSelf()
                return START_NOT_STICKY
            }
            ACTION_SET_LOCATION -> {
                // A desktop is driving us over adb. Go foreground first — the
                // system kills a service that does not within a few seconds —
                // then publish. acquire() is a no-op once the providers are
                // held, so a stream of fixes never re-registers them and never
                // drops the location listener in the app under test.
                if (startInForeground() && provider.acquire()) {
                    fixFrom(intent)?.let { pushOneShot(it) }
                }
            }
            else -> {
                if (startInForeground()) {
                    provider.acquire()
                }
            }
        }
        updateNotification()
        // no START_STICKY: a restarted service would hold the test providers
        // with no track and no way to tell the webview about it
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        ticker.removeCallbacksAndMessages(null)
        tickerThread.quitSafely()
        provider.release()
        playing = false
        instance = null
        statusListener?.invoke()
        super.onDestroy()
    }

    // ---- state ----------------------------------------------------------

    val isMocking: Boolean get() = provider.active

    fun isSelectedAsMockApp() = provider.isSelectedAsMockApp()

    fun acquire(): Boolean = provider.acquire()

    fun setTrack(next: Track) {
        track = next
        anchorPosition = 0.0
        anchorRealtime = SystemClock.elapsedRealtime()
        publish()
        updateNotification()
    }

    fun setPlaying(next: Boolean) {
        if (next == playing) return
        // fold the elapsed time into the anchor before the clock changes meaning
        anchorPosition = positionMs()
        anchorRealtime = SystemClock.elapsedRealtime()
        playing = next
        ticker.removeCallbacks(tick)
        if (playing) ticker.post(tick) else publish()
        updateNotification()
    }

    fun seek(positionMs: Double) {
        anchorPosition = positionMs.coerceAtLeast(0.0)
        anchorRealtime = SystemClock.elapsedRealtime()
        publish()
    }

    fun setSpeedMultiplier(value: Double) {
        anchorPosition = positionMs()
        anchorRealtime = SystemClock.elapsedRealtime()
        speedMultiplier = value.coerceAtLeast(0.01)
    }

    fun setLooping(value: Boolean) {
        looping = value
    }

    fun pushOneShot(fix: Fix) {
        // manual driving and pin dragging bypass the track entirely
        setPlaying(false)
        provider.push(fix)
        progressListener?.invoke(positionMs(), false, fix)
    }

    /**
     * Reads a fix out of an adb-sent intent.
     *
     * Coordinates arrive as strings because `am` only offers `--ef`, and a
     * float carries about seven significant digits — not enough for a degree
     * with six decimals, which is roughly 0.1 m.
     */
    private fun fixFrom(intent: Intent): Fix? {
        val lat = intent.getStringExtra("lat")?.toDoubleOrNull() ?: return null
        val lon = intent.getStringExtra("lon")?.toDoubleOrNull() ?: return null
        return Fix(
            lat = lat,
            lon = lon,
            altitude = intent.getStringExtra("altitude")?.toDoubleOrNull(),
            bearing = intent.getStringExtra("bearing")?.toFloatOrNull(),
            speed = intent.getStringExtra("speed")?.toFloatOrNull(),
            accuracy = intent.getStringExtra("accuracy")?.toFloatOrNull() ?: 4f
        )
    }

    fun positionMs(): Double {
        if (!playing) return anchorPosition
        val elapsed = (SystemClock.elapsedRealtime() - anchorRealtime).toDouble()
        return anchorPosition + elapsed * speedMultiplier
    }

    // ---- playback -------------------------------------------------------

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
                    ticker.removeCallbacks(tick)
                    updateNotification()
                }
                ended = true
            }
        }

        val fix = current.fixAt(position) ?: return
        provider.push(fix)
        progressListener?.invoke(position, ended, fix)
    }

    // ---- notification ---------------------------------------------------

    /**
     * Returns false when the platform refused to let us go foreground.
     *
     * A `location` service started while the app is in the background needs
     * ACCESS_BACKGROUND_LOCATION, which the desktop's setup grants over adb.
     * Without it the platform throws, and an uncaught throw here takes the
     * whole process down and has Android reschedule the service half an hour
     * later — so a refusal is reported instead.
     */
    private fun startInForeground(): Boolean {
        return try {
            startInForegroundOrThrow()
            true
        } catch (e: Exception) {
            Log.e(TAG, "refused to start in the foreground — is ACCESS_BACKGROUND_LOCATION granted?", e)
            stopSelf()
            false
        }
    }

    private fun startInForegroundOrThrow() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(NotificationManager::class.java)
            if (manager.getNotificationChannel(CHANNEL_ID) == null) {
                manager.createNotificationChannel(
                    NotificationChannel(
                        CHANNEL_ID,
                        "Mock location",
                        NotificationManager.IMPORTANCE_LOW
                    ).apply { setShowBadge(false) }
                )
            }
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                NOTIFICATION_ID,
                buildNotification(),
                ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
            )
        } else {
            startForeground(NOTIFICATION_ID, buildNotification())
        }
    }

    private fun updateNotification() {
        if (!provider.active) return
        getSystemService(NotificationManager::class.java)
            ?.notify(NOTIFICATION_ID, buildNotification())
    }

    private fun buildNotification(): Notification {
        val launch = packageManager.getLaunchIntentForPackage(packageName)?.let {
            PendingIntent.getActivity(this, 0, it, PendingIntent.FLAG_IMMUTABLE)
        }
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentTitle(if (playing) "Mocking location" else "Mock location ready")
            .setContentText(if (track == null) "No route loaded" else "Route loaded")
            .setOngoing(true)
            .setSilent(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setContentIntent(launch)
            .addAction(
                0,
                if (playing) "Pause" else "Play",
                serviceAction(ACTION_TOGGLE, 1)
            )
            .addAction(0, "Stop", serviceAction(ACTION_STOP, 2))
            .build()
    }

    private fun serviceAction(action: String, requestCode: Int): PendingIntent {
        val intent = Intent(this, MockLocationService::class.java).setAction(action)
        return PendingIntent.getService(
            this,
            requestCode,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
    }

    companion object {
        private const val TAG = "MockLocationService"
        private const val CHANNEL_ID = "mock_location"
        private const val NOTIFICATION_ID = 4711
        private const val TICK_MS = 200L

        const val ACTION_TOGGLE = "com.akylas.gpsmocker.mocklocation.TOGGLE"
        const val ACTION_STOP = "com.akylas.gpsmocker.mocklocation.STOP"

        /** Sent by a desktop over adb; see MockControlReceiver. */
        const val ACTION_SET_LOCATION = "com.akylas.gpsmocker.mocklocation.SET_LOCATION"
        const val ACTION_ACQUIRE = "com.akylas.gpsmocker.mocklocation.ACQUIRE"

        /** Set for as long as the service lives; both live in the app process. */
        @Volatile
        var instance: MockLocationService? = null
            private set

        /** A track handed over before the service finished starting. */
        @Volatile
        var pendingTrack: Track? = null

        /** (positionMs, ended, fix) */
        @Volatile
        var progressListener: ((Double, Boolean, Fix?) -> Unit)? = null

        /** Fired when the service goes away, so the UI can drop its mocking flag. */
        @Volatile
        var statusListener: (() -> Unit)? = null

        fun start(context: Context) {
            val intent = Intent(context, MockLocationService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, MockLocationService::class.java))
        }
    }
}
