package com.akylas.gpsmocker.mocklocation

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.core.content.ContextCompat

/**
 * How a desktop drives this app over adb.
 *
 * A receiver rather than an exported service, because a broadcast is the only
 * thing that reaches a package in Android's *stopped* state — which is where a
 * package sits after a fresh install it has never been launched from, and after
 * any force-stop by the user or the OEM's battery manager. Sent with
 * FLAG_INCLUDE_STOPPED_PACKAGES it both starts the process and clears the flag,
 * so recovering never means throwing an activity onto the screen and
 * interrupting whatever app is being tested.
 *
 * Guarded by WRITE_SECURE_SETTINGS in the manifest. That is not a permission an
 * ordinary app can hold, but the adb shell does, so the surface is open to a
 * developer's own machine and to nothing else on the device.
 */
class MockControlReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return

        val forwarded = Intent(context, MockLocationService::class.java).setAction(action)
        intent.extras?.let { forwarded.putExtras(it) }

        try {
            when (action) {
                MockLocationService.ACTION_SET_LOCATION,
                MockLocationService.ACTION_ACQUIRE -> ContextCompat.startForegroundService(context, forwarded)
                MockLocationService.ACTION_STOP -> MockLocationService.stop(context)
                else -> Log.w(TAG, "ignoring unknown action $action")
            }
        } catch (e: Exception) {
            // Starting a foreground service from the background is refused
            // unless the app is exempt from battery optimisation, which is what
            // the desktop's setup step asks for. Say so rather than dying
            // silently, since adb only ever sees "Broadcast completed".
            Log.e(TAG, "could not start the mock service — is the app exempt from battery optimisation?", e)
        }
    }

    companion object {
        private const val TAG = "MockControlReceiver"
    }
}
