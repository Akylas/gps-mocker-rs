package com.akylas.gpsmocker.mocklocation

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import java.util.Locale

/**
 * The one notification the app ever shows, and the two places it can live.
 *
 * While a route plays on the device it belongs to the foreground service, which
 * is what keeps the playback clock running. The rest of the time — a held
 * session with nothing playing, and above all a desktop driving the app over
 * adb — there is no service and no reason to start one, so the same
 * notification is posted standalone. A broadcast receiver cannot legally start
 * a `location` foreground service from the background, but it can always post.
 *
 * It is not decoration. A held test provider means every app on the device is
 * reading a made-up position, that is visible nowhere else on the system, and
 * the way people otherwise find out is that their real GPS "broke".
 */
object MockNotification {

    /** Shared by the service's startForeground and the standalone post. */
    const val ID = 4711

    /**
     * A live channel's importance belongs to the user from then on, so the id
     * is the only way to change the default — hence the graveyard below. This
     * one is LOW rather than MIN because MIN keeps the icon out of the status
     * bar, and an unnoticed warning is the bug this is here to fix.
     */
    private const val CHANNEL_ID = "mock_location_active"
    private val LEGACY_CHANNEL_IDS = listOf("mock_location", "mock_location_quiet")

    private const val WARNING =
        "Apps on this device are reading a mocked position, not your real GPS. " +
            "Stop to get real fixes back."

    /** Whether the shade should be showing anything at all right now. */
    fun wanted(): Boolean = when (MockEngine.notificationMode) {
        NotificationMode.ALWAYS -> MockEngine.active
        NotificationMode.PLAYING -> MockEngine.active && MockEngine.playing
        NotificationMode.NEVER -> false
    }

    /**
     * Brings the shade in line with the session.
     *
     * The service gets right of way while it is up: it posted this id as its
     * foreground notification, so cancelling it here would be cancelling a live
     * foreground service's notification, which the platform refuses anyway.
     */
    fun sync(context: Context) {
        val service = MockLocationService.instance
        if (service != null) {
            service.redraw()
            return
        }
        if (wanted()) post(context) else cancel(context)
    }

    private fun post(context: Context) {
        ensureChannel(context)
        // notify() is a no-op without POST_NOTIFICATIONS rather than a throw,
        // but OEM builds have been known to disagree
        runCatching { manager(context)?.notify(ID, build(context)) }
            .onFailure { Log.w(TAG, "could not post the notification", it) }
    }

    fun cancel(context: Context) {
        runCatching { manager(context)?.cancel(ID) }
    }

    fun ensureChannel(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val manager = manager(context) ?: return
        for (id in LEGACY_CHANNEL_IDS) manager.deleteNotificationChannel(id)
        if (manager.getNotificationChannel(CHANNEL_ID) != null) return
        manager.createNotificationChannel(
            NotificationChannel(
                CHANNEL_ID,
                "Mock location",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                setShowBadge(false)
                description = "Shown for as long as this app is publishing mocked locations."
            }
        )
    }

    /**
     * Says what is happening, and offers only what can be acted on.
     *
     * A Play button with no route behind it is worse than no button at all,
     * which is what the shade used to get whenever a desktop was driving.
     */
    fun build(context: Context): Notification {
        val launch = context.packageManager.getLaunchIntentForPackage(context.packageName)?.let {
            PendingIntent.getActivity(context, 0, it, PendingIntent.FLAG_IMMUTABLE)
        }
        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentTitle(title())
            .setContentText(WARNING)
            .setStyle(NotificationCompat.BigTextStyle().bigText(bigText()))
            .setOngoing(true)
            .setSilent(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setContentIntent(launch)

        if (MockEngine.hasTrack) {
            builder.addAction(
                0,
                if (MockEngine.playing) "Pause" else "Play",
                action(context, MockLocationService.ACTION_TOGGLE, 1)
            )
        }
        builder.addAction(0, "Stop mocking", action(context, MockLocationService.ACTION_STOP, 2))
        return builder.build()
    }

    /** Progress rides in the title so the warning can own the text line. */
    private fun title(): String {
        if (!MockEngine.hasTrack) return "Mocking your location"
        val progress = "${clock(MockEngine.positionMs())} / ${clock(MockEngine.durationMs)}"
        return if (MockEngine.playing) {
            "Mocking your location · $progress"
        } else {
            "Route paused · $progress"
        }
    }

    private fun bigText(): String {
        val fix = MockEngine.lastFix ?: return WARNING
        return WARNING + "\n" + String.format(Locale.US, "%.5f, %.5f", fix.lat, fix.lon)
    }

    private fun clock(ms: Double): String {
        val seconds = (ms / 1000).toLong().coerceAtLeast(0)
        return String.format(Locale.US, "%d:%02d", seconds / 60, seconds % 60)
    }

    private fun action(context: Context, action: String, requestCode: Int): PendingIntent {
        val intent = Intent(context, MockLocationService::class.java).setAction(action)
        return PendingIntent.getService(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
    }

    private fun manager(context: Context) =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager

    private const val TAG = "MockNotification"
}
