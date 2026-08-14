import { baseSpeedKmh, recordedSpeeds, slowdownFactor, type PlayerOptions } from './player';
import { positionAt, routeLength, type Route } from './route';

/**
 * One point of a time-parameterised track.
 *
 * Native playback only lerps between these by wall clock, so every rule about
 * how fast the vehicle goes has to be resolved here, on the way in.
 */
export interface TrackSample {
    /** milliseconds from the start, strictly increasing */
    t: number;
    lat: number;
    lon: number;
    altitude?: number;
    bearing?: number;
    /** metres per second, which is what Android's Location wants */
    speed?: number;
}

export interface BakedTrack {
    samples: TrackSample[];
    durationMs: number;
    /**
     * Distance along the route for each sample. Kept on the webview side only:
     * it is how a progress event coming back from the service is turned into
     * the `along` the UI works in.
     */
    along: number[];
}

/** Below this the sample count explodes on long routes for no visible gain. */
const MIN_STEP_M = 5;
/** Above this a slowdown ramp starts to show as a visible speed staircase. */
const MAX_STEP_M = 50;
/** Keeps the IPC payload for a very long route in the low megabytes. */
const MAX_SAMPLES = 20000;
/** Stops a zero-speed sample from producing an infinite crossing time. */
const MIN_SPEED_MS = 0.1;

/**
 * Bakes a route into a track the mock service can replay on its own clock.
 *
 * `speedMultiplier` is deliberately left out: it changes while a run is in
 * flight, and the service scales its own clock by it rather than forcing a
 * rebake on every tap of the speed control.
 */
export function bakeTrack(route: Route, options: PlayerOptions): BakedTrack {
    const total = routeLength(route);
    const samples: TrackSample[] = [];
    const along: number[] = [];

    if (!route.points.length) {
        return { samples, durationMs: 0, along };
    }

    const speeds = options.useRecordedSpeed ? recordedSpeeds(route) : undefined;
    const step = Math.min(MAX_STEP_M, Math.max(MIN_STEP_M, total / MAX_SAMPLES));

    let metres = 0;
    let t = 0;
    let previousSpeedMs = 0;

    for (;;) {
        const at = positionAt(route, metres);
        const kmh = baseSpeedKmh(speeds, at.index, options) * slowdownFactor(route, metres, at.curvature, options);
        const speedMs = Math.max(MIN_SPEED_MS, kmh / 3.6);

        if (samples.length) {
            // trapezoidal: cross the step just walked at the mean of the speeds
            // at both ends, so a ramp integrates to the same time the live
            // player would have accumulated over it
            const covered = metres - along[along.length - 1];
            t += (covered / ((previousSpeedMs + speedMs) / 2)) * 1000;
        }

        samples.push({
            t,
            lat: at.position.lat,
            lon: at.position.lon,
            altitude: at.position.ele,
            bearing: at.bearing,
            speed: speedMs
        });
        along.push(metres);
        previousSpeedMs = speedMs;

        if (metres >= total) {
            break;
        }
        metres = Math.min(total, metres + step);
    }

    return { samples, durationMs: t, along };
}

/** Distance along the route at a track time, for a progress event coming back. */
export function alongAt(track: BakedTrack, positionMs: number) {
    const { samples, along } = track;
    if (!samples.length) {
        return 0;
    }
    if (positionMs <= samples[0].t) {
        return along[0];
    }
    const last = samples.length - 1;
    if (positionMs >= samples[last].t) {
        return along[last];
    }

    let low = 0;
    let high = last;
    while (low < high) {
        const mid = (low + high + 1) >> 1;
        if (samples[mid].t <= positionMs) {
            low = mid;
        } else {
            high = mid - 1;
        }
    }

    const span = samples[low + 1].t - samples[low].t;
    const f = span > 0 ? (positionMs - samples[low].t) / span : 0;
    return along[low] + (along[low + 1] - along[low]) * f;
}

/** Track time at a distance along the route, for a seek going the other way. */
export function timeAt(track: BakedTrack, metres: number) {
    const { samples, along } = track;
    if (!samples.length) {
        return 0;
    }
    if (metres <= along[0]) {
        return samples[0].t;
    }
    const last = along.length - 1;
    if (metres >= along[last]) {
        return samples[last].t;
    }

    let low = 0;
    let high = last;
    while (low < high) {
        const mid = (low + high + 1) >> 1;
        if (along[mid] <= metres) {
            low = mid;
        } else {
            high = mid - 1;
        }
    }

    const span = along[low + 1] - along[low];
    const f = span > 0 ? (metres - along[low]) / span : 0;
    return samples[low].t + (samples[low + 1].t - samples[low].t) * f;
}

/** The payload the plugin wants: no `along`, no undefined fields. */
export function trackPayload(track: BakedTrack) {
    return {
        samples: track.samples.map((s) => {
            const out: Record<string, number> = { t: s.t, lat: s.lat, lon: s.lon };
            if (s.altitude !== undefined) out.altitude = s.altitude;
            if (s.bearing !== undefined) out.bearing = s.bearing;
            if (s.speed !== undefined) out.speed = s.speed;
            return out;
        }),
        durationMs: track.durationMs
    };
}
