package com.akylas.gpsmocker.mocklocation

import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log

/**
 * Keeps the playback clock alive, and shows the notification that pays for it.
 *
 * It owns none of the mocking: [MockEngine] holds the providers, the track and
 * the clock, and goes on holding them when this service is not running. All the
 * service adds is a process the system will not freeze — a webview that loses
 * focus gets its timers throttled to a near stop — which is why it is started
 * for on-device playback and for nothing else. A desktop driving the app over
 * adb brings its own clock, so it never needs one; the warning it puts in the
 * shade is posted standalone by [MockNotification].
 */
class MockLocationService : Service() {

    /** notify() after stopSelf would leave a notification with no service. */
    private var running = false

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        MockEngine.attach(applicationContext)
        running = true
        instance = this
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> {
                MockEngine.stop()
                return START_NOT_STICKY
            }
            ACTION_TOGGLE -> {
                if (!startInForeground()) return START_NOT_STICKY
                // may stop this very service, when the notification is only
                // meant to be up while a route plays
                MockEngine.setPlaying(!MockEngine.playing)
            }
            else -> if (!startInForeground()) return START_NOT_STICKY
        }
        redraw()
        // no START_STICKY: a restarted service would show a notification for a
        // session the webview knows nothing about
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        running = false
        instance = null
        // the session outlives the clock whenever a route is merely paused, and
        // always when a desktop is driving — the warning has to outlive it too,
        // and this notification dies with the service
        MockNotification.sync(applicationContext)
        super.onDestroy()
    }

    /** Redraws the foreground notification in place. */
    fun redraw() {
        if (!running) return
        getSystemService(NotificationManager::class.java)
            ?.notify(MockNotification.ID, MockNotification.build(this))
    }

    /**
     * Returns false when the platform refused to let us go foreground.
     *
     * A `location` service started while the app is in the background needs
     * ACCESS_BACKGROUND_LOCATION. Without it the platform throws, and an
     * uncaught throw here takes the whole process down and has Android
     * reschedule the service half an hour later — so a refusal is reported
     * instead, and the session carries on without a clock of its own.
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
        MockNotification.ensureChannel(this)
        val notification = MockNotification.build(this)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                MockNotification.ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
            )
        } else {
            startForeground(MockNotification.ID, notification)
        }
    }

    companion object {
        private const val TAG = "MockLocationService"

        const val ACTION_TOGGLE = "com.akylas.gpsmocker.mocklocation.TOGGLE"
        const val ACTION_STOP = "com.akylas.gpsmocker.mocklocation.STOP"

        /** Sent by a desktop over adb; see MockControlReceiver. */
        const val ACTION_SET_LOCATION = "com.akylas.gpsmocker.mocklocation.SET_LOCATION"
        const val ACTION_ACQUIRE = "com.akylas.gpsmocker.mocklocation.ACQUIRE"

        /** Set for as long as the service lives; everything lives in one process. */
        @Volatile
        var instance: MockLocationService? = null
            private set

        fun start(context: Context) {
            // sent even when the service is already up: a start is also what
            // cancels a stop that has been asked for and not yet run
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
