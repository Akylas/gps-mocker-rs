package com.akylas.gpsmocker.mocklocation

import android.annotation.SuppressLint
import android.app.AppOpsManager
import android.content.Context
import android.location.Criteria
import android.location.Location
import android.location.LocationManager
import android.os.Build
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
                // a stale registration survives a crash, and addTestProvider
                // throws on a name that is already registered
                runCatching { locationManager.removeTestProvider(provider) }
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

    fun release() {
        for (provider in providers) {
            runCatching { locationManager.setTestProviderEnabled(provider, false) }
            runCatching { locationManager.removeTestProvider(provider) }
        }
        active = false
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
    }
}
