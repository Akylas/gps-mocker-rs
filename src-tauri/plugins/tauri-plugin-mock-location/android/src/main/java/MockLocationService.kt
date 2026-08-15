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
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import java.util.Locale

/**
 * Keeps the playback clock alive, and shows the notification that pays for it.
 *
 * It owns none of the mocking: [MockEngine] holds the providers, the track and
 * the clock, and goes on holding them when this service is not running. All the
 * service adds is a process the system will not freeze — a webview that loses
 * focus gets its timers throttled to a near stop — which is why it is started
 * for on-device playback and for nothing else. A desktop driving the app over
 * adb never needs it, and so never puts anything in the shade.
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
        MockEngine.notificationListener = { updateNotification() }
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
        updateNotification()
        // no START_STICKY: a restarted service would show a notification for a
        // session the webview knows nothing about
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        running = false
        instance = null
        MockEngine.notificationListener = null
        super.onDestroy()
    }

    // ---- notification ---------------------------------------------------

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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(NotificationManager::class.java)
            // the first release shipped an IMPORTANCE_LOW channel, and the
            // importance of a live channel belongs to the user from then on;
            // a new id is the only way to hand out a quieter default
            manager.deleteNotificationChannel(LEGACY_CHANNEL_ID)
            if (manager.getNotificationChannel(CHANNEL_ID) == null) {
                manager.createNotificationChannel(
                    NotificationChannel(
                        CHANNEL_ID,
                        "Mock location",
                        NotificationManager.IMPORTANCE_MIN
                    ).apply {
                        setShowBadge(false)
                        description = "Shown while this app is publishing mocked locations."
                    }
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
        if (!running) return
        getSystemService(NotificationManager::class.java)
            ?.notify(NOTIFICATION_ID, buildNotification())
    }

    /**
     * Says what is happening, and offers only what can be acted on.
     *
     * Nothing here is worth a sound or a peek, and a Play button with no route
     * behind it is worse than no button at all — which is what the shade got
     * every time a desktop was the one driving.
     */
    private fun buildNotification(): Notification {
        val launch = packageManager.getLaunchIntentForPackage(packageName)?.let {
            PendingIntent.getActivity(this, 0, it, PendingIntent.FLAG_IMMUTABLE)
        }
        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentTitle(title())
            .setOngoing(true)
            .setSilent(true)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setContentIntent(launch)

        detail()?.let { builder.setContentText(it) }

        if (MockEngine.hasTrack) {
            builder.addAction(
                0,
                if (MockEngine.playing) "Pause" else "Play",
                serviceAction(ACTION_TOGGLE, 1)
            )
        }
        builder.addAction(0, "Stop", serviceAction(ACTION_STOP, 2))
        return builder.build()
    }

    private fun title() = when {
        MockEngine.playing -> "Mocking location"
        MockEngine.hasTrack -> "Route paused"
        else -> "Mock location ready"
    }

    /** Where playback stands, or the fix on air when there is no route. */
    private fun detail(): String? {
        if (MockEngine.hasTrack) {
            return "${clock(MockEngine.positionMs())} / ${clock(MockEngine.durationMs)}"
        }
        val fix = MockEngine.lastFix ?: return null
        return String.format(Locale.US, "%.5f, %.5f", fix.lat, fix.lon)
    }

    private fun clock(ms: Double): String {
        val seconds = (ms / 1000).toLong().coerceAtLeast(0)
        return String.format(Locale.US, "%d:%02d", seconds / 60, seconds % 60)
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
        private const val CHANNEL_ID = "mock_location_quiet"
        private const val LEGACY_CHANNEL_ID = "mock_location"
        private const val NOTIFICATION_ID = 4711

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
