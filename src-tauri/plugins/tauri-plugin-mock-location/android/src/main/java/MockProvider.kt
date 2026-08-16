package com.akylas.gpsmocker.mocklocation

import android.annotation.SuppressLint
import android.app.AppOpsManager
import android.content.Context
import android.location.Criteria
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.Process
import android.os.SystemClock
import android.util.Log

/**
 * Owns Android's test location providers.
 *
 * Nothing here works until the user selects this app under Developer options →
 * "Select mock location app"; before that every call throws SecurityException,
 * which is the signal the UI uses to show its onboarding card.
 */
class MockProvider(private val context: Context) {

    private val locationManager =
        context.getSystemService(Context.LOCATION_SERVICE) as LocationManager

    /**
     * Fused reads through the platform providers once the app is the selected
     * mock app, but apps that ask for NETWORK directly would otherwise keep
     * getting real fixes, so both are driven.
     */
    private val providers = listOf(
        LocationManager.GPS_PROVIDER,
        LocationManager.NETWORK_PROVIDER
    )

    var active: Boolean = false
        private set

    /** True once the app is the selected mock location app. */
    @SuppressLint("NewApi")
    fun isSelectedAsMockApp(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as? AppOpsManager
            ?: return false
        return try {
            val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                appOps.unsafeCheckOpNoThrow(
                    AppOpsManager.OPSTR_MOCK_LOCATION,
                    Process.myUid(),
                    context.packageName
                )
            } else {
                @Suppress("DEPRECATION")
                appOps.checkOpNoThrow(
                    AppOpsManager.OPSTR_MOCK_LOCATION,
                    Process.myUid(),
                    context.packageName
                )
            }
            mode == AppOpsManager.MODE_ALLOWED
        } catch (e: Exception) {
            Log.w(TAG, "could not read the mock location app op", e)
            false
        }
    }

    /**
     * Registers the test providers. Returns false when the app is not the
     * selected mock app.
     */
    fun acquire(): Boolean {
        if (active) return true
        try {
            for (provider in providers) {
                // A registration outlives the process that made it, so after a
                // force-stop or a low-memory kill it is still there. Reuse it:
                // removing and re-adding drops the location listener in
                // whatever app is being tested, which is the whole failure this
                // is meant to avoid. setTestProviderEnabled only succeeds on a
                // provider that is already registered, so it doubles as the
                // check.
                if (runCatching { locationManager.setTestProviderEnabled(provider, true) }.isSuccess) {
                    Log.i(TAG, "reusing the existing test provider $provider")
                    continue
                }

                Log.i(TAG, "registering test provider $provider")
                @Suppress("DEPRECATION")
                locationManager.addTestProvider(
                    provider,
                    /* requiresNetwork = */ false,
                    /* requiresSatellite = */ false,
                    /* requiresCell = */ false,
                    /* hasMonetaryCost = */ false,
                    /* supportsAltitude = */ true,
                    /* supportsSpeed = */ true,
                    /* supportsBearing = */ true,
                    Criteria.POWER_LOW,
                    Criteria.ACCURACY_FINE
                )
                locationManager.setTestProviderEnabled(provider, true)
            }
            active = true
        } catch (e: SecurityException) {
            Log.w(TAG, "not selected as the mock location app", e)
            release()
            active = false
        } catch (e: IllegalArgumentException) {
            // a provider the device does not have at all
            Log.w(TAG, "test provider rejected", e)
            release()
            active = false
        }
        return active
    }

    /**
     * Hands the providers back and gets real fixes flowing again.
     *
     * Deliberately does *not* disable the test provider on the way out.
     * `setTestProviderEnabled(false)` does not mean "stop mocking", it means
     * "this provider is off", and the platform broadcasts exactly that: every
     * client on the device gets onProviderDisabled(gps), and a client that has
     * been told GPS is gone stops asking for it. removeTestProvider a moment
     * later does restore the real provider, but by then there is nobody left
     * listening to it — which is why the device looked like it needed a reboot,
     * when what actually needed restarting was the app being tested.
     */
    fun release() {
        for (provider in providers) {
            val removed = runCatching { locationManager.removeTestProvider(provider) }
            if (removed.isFailure) {
                // could not hand it back — usually because the app is no longer
                // the selected mock app, in which case the platform has already
                // dropped the registration itself. Leaving it *enabled* is the
                // one thing that matters: a registration we cannot remove and
                // cannot re-enable is what survives until a reboot.
                Log.w(TAG, "could not remove test provider $provider", removed.exceptionOrNull())
                runCatching { locationManager.setTestProviderEnabled(provider, true) }
            }
        }
        active = false
        rearm()
    }

    /**
     * Asks the platform for real fixes for a few seconds after a release.
     *
     * Removing a test provider restores the real one, but nothing re-arms it:
     * the GNSS engine is only powered while somebody has a request in, and a
     * client that gave up during the session has none. One short real request
     * turns the hardware back on and makes the platform re-publish the
     * provider's state, which is what nudges a stalled client back to life.
     */
    private fun rearm() {
        val listener = object : LocationListener {
            override fun onLocationChanged(location: Location) {}
            override fun onProviderEnabled(provider: String) {}
            override fun onProviderDisabled(provider: String) {}

            @Deprecated("still abstract below API 30")
            override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
        }

        val looper = Looper.getMainLooper()
        var requested = false
        for (provider in providers) {
            // no permission, or a provider the device does not have
            runCatching {
                locationManager.requestLocationUpdates(provider, 0L, 0f, listener, looper)
                requested = true
            }.onFailure { Log.i(TAG, "cannot re-arm $provider", it) }
        }
        if (!requested) return
        Handler(looper).postDelayed(
            { runCatching { locationManager.removeUpdates(listener) } },
            REARM_MS
        )
    }

    fun push(fix: Fix) {
        if (!active) return
        for (provider in providers) {
            val location = Location(provider).apply {
                latitude = fix.lat
                longitude = fix.lon
                // consumers that see accuracy 0 treat the fix as invalid
                accuracy = fix.accuracy
                time = System.currentTimeMillis()
                elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos()
                altitude = fix.altitude ?: 0.0
                fix.bearing?.let { bearing = it }
                fix.speed?.let { speed = it }
                // API 26+ rejects a test location that is missing these
                verticalAccuracyMeters = 3f
                bearingAccuracyDegrees = if (fix.bearing != null) 5f else 0f
                speedAccuracyMetersPerSecond = if (fix.speed != null) 1f else 0f
            }
            runCatching { locationManager.setTestProviderLocation(provider, location) }
                .onFailure { Log.w(TAG, "could not publish to $provider", it) }
        }
    }

    companion object {
        private const val TAG = "MockProvider"

        /** Long enough for the GNSS engine to actually come back up. */
        private const val REARM_MS = 5_000L
    }
}
