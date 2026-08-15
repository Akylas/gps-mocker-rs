package com.akylas.gpsmocker.mocklocation

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

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
 * The fix is published from right here. A test provider registration lives in
 * the system and outlives the process that made it, and the desktop sends one
 * broadcast per fix on its own clock, so there is nothing for a foreground
 * service to keep alive — and nothing to justify a notification on a device
 * whose user is looking at some other app entirely.
 *
 * Guarded by WRITE_SECURE_SETTINGS in the manifest. That is not a permission an
 * ordinary app can hold, but the adb shell does, so the surface is open to a
 * developer's own machine and to nothing else on the device.
 */
class MockControlReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        MockEngine.attach(context)

        // `am broadcast` sends an ordered broadcast and prints the result code,
        // so this is a free channel back to the desktop — no extra adb round
        // trip to work out why a fix did not land.
        if (action == MockLocationService.ACTION_STOP) {
            MockEngine.stop()
            resultCode = RESULT_OK
            return
        }

        if (!MockEngine.isSelectedAsMockApp()) {
            Log.w(TAG, "not selected under Developer options > Select mock location app")
            resultCode = RESULT_NOT_MOCK_APP
            return
        }

        try {
            when (action) {
                MockLocationService.ACTION_ACQUIRE -> {
                    if (!MockEngine.claim()) {
                        resultCode = RESULT_NOT_MOCK_APP
                        return
                    }
                }
                MockLocationService.ACTION_SET_LOCATION -> {
                    if (!MockEngine.claim()) {
                        resultCode = RESULT_NOT_MOCK_APP
                        return
                    }
                    val fix = fixFrom(intent)
                    if (fix == null) {
                        Log.w(TAG, "no usable coordinate in $action")
                        resultCode = RESULT_BAD_FIX
                        return
                    }
                    MockEngine.pushOneShot(fix)
                }
                else -> {
                    Log.w(TAG, "ignoring unknown action $action")
                    resultCode = RESULT_UNKNOWN_ACTION
                    return
                }
            }
            resultCode = RESULT_OK
        } catch (e: Exception) {
            Log.e(TAG, "could not publish the fix", e)
            resultCode = RESULT_REFUSED
        }
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

    companion object {
        private const val TAG = "MockControlReceiver"

        /** Mirrored in lib/adb.ts, which reads them off `am broadcast`. */
        const val RESULT_OK = 1
        const val RESULT_NOT_MOCK_APP = 2
        const val RESULT_REFUSED = 3
        const val RESULT_UNKNOWN_ACTION = 4
        const val RESULT_BAD_FIX = 5
    }
}
