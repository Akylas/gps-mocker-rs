package com.akylas.gpsmocker.mocklocation

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.os.Build
import android.provider.Settings
import app.tauri.PermissionState
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.Permission
import app.tauri.annotation.PermissionCallback
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import androidx.core.view.WindowCompat

@InvokeArg
class SampleArg {
    var t: Double = 0.0
    var lat: Double = 0.0
    var lon: Double = 0.0
    var altitude: Double? = null
    var bearing: Double? = null
    var speed: Double? = null
}

@InvokeArg
class SetRouteArgs {
    var samples: List<SampleArg> = emptyList()
    var durationMs: Double = 0.0
}

@InvokeArg
class SetPlaybackArgs {
    var playing: Boolean? = null
    var positionMs: Double? = null
    var speedMultiplier: Double? = null
    var looping: Boolean? = null
}

@InvokeArg
class SystemBarsArgs {
    var dark: Boolean = false
}

@InvokeArg
class PushLocationArgs {
    var lat: Double = 0.0
    var lon: Double = 0.0
    var altitude: Double? = null
    var bearing: Double? = null
    var speed: Double? = null
    var accuracy: Double? = null
}

@InvokeArg
class NotificationArgs {
    /** `always`, `playing` or `never`; see NotificationMode. */
    var mode: String = "playing"
}

private const val ALIAS_LOCATION = "location"
private const val ALIAS_NOTIFICATIONS = "notifications"

@TauriPlugin(
    permissions = [
        Permission(
            strings = [Manifest.permission.ACCESS_FINE_LOCATION],
            alias = ALIAS_LOCATION
        ),
        Permission(
            strings = [Manifest.permission.POST_NOTIFICATIONS],
            alias = ALIAS_NOTIFICATIONS
        )
    ]
)
class MockLocationPlugin(private val activity: Activity) : Plugin(activity) {

    override fun load(webView: android.webkit.WebView) {
        super.load(webView)

        MockEngine.attach(activity.applicationContext)
        // takes back a session we remember — which may be a desktop's, running
        // with no service and no notification — and drops a registration left
        // behind by a force-stop or a crash, so the device is never stuck on a
        // mocked position with nobody driving it
        MockEngine.adopt()

        MockEngine.progressListener = { positionMs, ended, fix ->
            val payload = JSObject()
                .put("positionMs", positionMs)
                .put("ended", ended)
            if (fix != null) {
                payload.put("lat", fix.lat)
                payload.put("lon", fix.lon)
                fix.bearing?.let { payload.put("bearing", it.toDouble()) }
                fix.speed?.let { payload.put("speed", it.toDouble()) }
            }
            trigger("progress", payload)
        }
        MockEngine.statusListener = {
            trigger("stopped", JSObject())
        }
    }

    @Command
    fun checkStatus(invoke: Invoke) {
        invoke.resolve(status())
    }

    /**
     * Status- and navigation-bar icon colour.
     *
     * The app is edge to edge, so these sit over the map, and they are the one
     * part of the chrome CSS cannot reach. values-night gets it right at launch
     * but only then: uiMode is in the activity's configChanges, so the window
     * is never recreated, and the in-app Appearance override is invisible to
     * the resource qualifier in the first place. Both are why the webview
     * drives this directly.
     *
     * It lives on this plugin rather than one of its own because it is the only
     * native UI call the app makes; give it company and it should move out.
     */
    @Command
    fun setSystemBarsAppearance(invoke: Invoke) {
        val args = invoke.parseArgs(SystemBarsArgs::class.java)
        activity.runOnUiThread {
            val window = activity.window
            val controller = WindowCompat.getInsetsController(window, window.decorView)
            // "light bars" means light *background*, so dark icons
            controller.isAppearanceLightStatusBars = !args.dark
            controller.isAppearanceLightNavigationBars = !args.dark
        }
        invoke.resolve(JSObject())
    }

    @Command
    fun openDeveloperSettings(invoke: Invoke) {
        val intent = Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try {
            activity.startActivity(intent)
        } catch (e: Exception) {
            // some OEM builds hide the screen; the top-level settings app is
            // still better than a dead button
            activity.startActivity(
                Intent(Settings.ACTION_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
        }
        invoke.resolve(JSObject())
    }

    @Command
    fun startMocking(invoke: Invoke) {
        if (getPermissionState(ALIAS_LOCATION) != PermissionState.GRANTED) {
            requestPermissionForAlias(ALIAS_LOCATION, invoke, "locationPermissionResult")
            return
        }
        beginMocking(invoke)
    }

    @PermissionCallback
    fun locationPermissionResult(invoke: Invoke) {
        if (getPermissionState(ALIAS_LOCATION) != PermissionState.GRANTED) {
            invoke.reject("location permission is required to run the mock provider")
            return
        }
        beginMocking(invoke)
    }

    private fun beginMocking(invoke: Invoke) {
        // the notification is how a run is stopped from outside the app, but a
        // denied prompt must not block mocking — and there is nothing to ask
        // for when the user has already said they do not want one
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            MockEngine.notificationMode != NotificationMode.NEVER &&
            getPermissionState(ALIAS_NOTIFICATIONS) != PermissionState.GRANTED
        ) {
            requestPermissionForAlias(ALIAS_NOTIFICATIONS, invoke, "notificationPermissionResult")
            return
        }
        startSession(invoke)
    }

    @PermissionCallback
    fun notificationPermissionResult(invoke: Invoke) {
        startSession(invoke)
    }

    private fun startSession(invoke: Invoke) {
        if (!MockEngine.start()) {
            invoke.reject(ERR_NOT_SELECTED)
            return
        }
        invoke.resolve(status())
    }

    @Command
    fun stopMocking(invoke: Invoke) {
        MockEngine.stop()
        invoke.resolve(status())
    }

    /**
     * How much of itself the app may put in the notification shade.
     *
     * Persisted natively: the service that reads it can be started before the
     * webview has had a chance to say anything.
     */
    @Command
    fun setNotificationMode(invoke: Invoke) {
        val args = invoke.parseArgs(NotificationArgs::class.java)
        MockEngine.notificationMode = NotificationMode.from(args.mode)
        invoke.resolve(JSObject())
    }

    @Command
    fun pushLocation(invoke: Invoke) {
        val args = invoke.parseArgs(PushLocationArgs::class.java)
        if (!MockEngine.active) {
            invoke.reject(ERR_NOT_RUNNING)
            return
        }
        MockEngine.pushOneShot(
            Fix(
                lat = args.lat,
                lon = args.lon,
                altitude = args.altitude,
                bearing = args.bearing?.toFloat(),
                speed = args.speed?.toFloat(),
                accuracy = args.accuracy?.toFloat() ?: 4f
            )
        )
        invoke.resolve(JSObject())
    }

    @Command
    fun setRoute(invoke: Invoke) {
        val args = invoke.parseArgs(SetRouteArgs::class.java)
        val track = Track(
            args.samples.map {
                TrackSample(it.t, it.lat, it.lon, it.altitude, it.bearing, it.speed)
            },
            args.durationMs
        )
        MockEngine.setTrack(track)
        invoke.resolve(JSObject())
    }

    @Command
    fun setPlayback(invoke: Invoke) {
        val args = invoke.parseArgs(SetPlaybackArgs::class.java)
        if (!MockEngine.active) {
            invoke.reject(ERR_NOT_RUNNING)
            return
        }
        // order matters: seek and speed both rewrite the playback anchor, so
        // they have to land before the clock is allowed to start
        args.speedMultiplier?.let { MockEngine.setSpeedMultiplier(it) }
        args.looping?.let { MockEngine.setLooping(it) }
        args.positionMs?.let { MockEngine.seek(it) }
        args.playing?.let { MockEngine.setPlaying(it) }
        invoke.resolve(JSObject())
    }

    private fun status(): JSObject {
        return JSObject()
            .put("available", true)
            .put("selectedAsMockApp", MockEngine.isSelectedAsMockApp())
            .put("mocking", MockEngine.active)
    }

    companion object {
        const val ERR_NOT_SELECTED =
            "this app is not selected under Developer options > Select mock location app"
        const val ERR_NOT_RUNNING = "no mock location session is running"
    }
}
