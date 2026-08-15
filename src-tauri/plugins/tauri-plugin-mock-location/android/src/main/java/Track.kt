package com.akylas.gpsmocker.mocklocation

import kotlin.math.abs

/** A single location to publish. */
data class Fix(
    val lat: Double,
    val lon: Double,
    val altitude: Double? = null,
    val bearing: Float? = null,
    val speed: Float? = null,
    val accuracy: Float = 4f
)

/** One point of the track the webview baked. */
data class TrackSample(
    val t: Double,
    val lat: Double,
    val lon: Double,
    val altitude: Double?,
    val bearing: Double?,
    val speed: Double?
)

/**
 * A time-parameterised track.
 *
 * The webview decides how fast the vehicle goes — recorded speeds, smart
 * slowdown before maneuvers, the speed slider — and bakes the answer into the
 * sample timestamps. All that is left here is interpolation by wall clock, so
 * none of that logic exists twice.
 */
class Track(val samples: List<TrackSample>, val durationMs: Double) {

    val isEmpty: Boolean get() = samples.isEmpty()

    /** Index of the last sample at or before [timeMs]. */
    private fun indexAt(timeMs: Double): Int {
        var low = 0
        var high = samples.size - 1
        while (low < high) {
            val mid = (low + high + 1) / 2
            if (samples[mid].t <= timeMs) low = mid else high = mid - 1
        }
        return low
    }

    fun fixAt(timeMs: Double): Fix? {
        if (samples.isEmpty()) return null
        if (samples.size == 1) return samples[0].toFix()

        val clamped = timeMs.coerceIn(0.0, samples.last().t)
        val i = indexAt(clamped)
        if (i >= samples.size - 1) return samples.last().toFix()

        val a = samples[i]
        val b = samples[i + 1]
        val span = b.t - a.t
        val f = if (span <= 0.0) 0.0 else (clamped - a.t) / span

        return Fix(
            lat = lerp(a.lat, b.lat, f),
            lon = lerp(a.lon, b.lon, f),
            altitude = lerpNullable(a.altitude, b.altitude, f),
            bearing = lerpAngle(a.bearing, b.bearing, f)?.toFloat(),
            speed = lerpNullable(a.speed, b.speed, f)?.toFloat()
        )
    }

    private fun TrackSample.toFix() = Fix(
        lat = lat,
        lon = lon,
        altitude = altitude,
        bearing = bearing?.toFloat(),
        speed = speed?.toFloat()
    )

    private fun lerp(a: Double, b: Double, f: Double) = a + (b - a) * f

    private fun lerpNullable(a: Double?, b: Double?, f: Double): Double? {
        if (a == null) return b
        if (b == null) return a
        return lerp(a, b, f)
    }

    /** Interpolates the short way round so 350° → 10° does not sweep backwards. */
    private fun lerpAngle(a: Double?, b: Double?, f: Double): Double? {
        if (a == null) return b
        if (b == null) return a
        var delta = (b - a) % 360.0
        if (abs(delta) > 180.0) delta -= 360.0 * (if (delta > 0) 1.0 else -1.0)
        return (a + delta * f + 360.0) % 360.0
    }
}
