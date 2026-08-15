import { get } from 'svelte/store';
import type { Position } from './geo';
import { mockStatus, pushLocation, setPlayback, setTrack } from './mockProvider';
import { isSelfMocking } from './platform';
import type { PlayerOptions } from './player';
import type { Route } from './route';
import { alongAt, bakeTrack, timeAt, type BakedTrack } from './track';

/**
 * Keeps the Android foreground service in step with the webview's player.
 *
 * The player stays the source of truth for the UI on every platform. What
 * changes on Android is who drives the *device*: the service replays a baked
 * track on its own clock, because a backgrounded webview gets its timers
 * throttled to a stop and mocking has to survive leaving the app.
 */

let track: BakedTrack | undefined;

/** True once a track has been handed over and the service is holding it. */
export function isDriving() {
    return isSelfMocking && !!track && get(mockStatus).mocking;
}

/** Where along the route a service progress report lands. */
export function alongAtPosition(positionMs: number) {
    return track ? alongAt(track, positionMs) : 0;
}

export function clearTrack() {
    track = undefined;
}

/**
 * Rebakes and hands over the track.
 *
 * Called on a route change and on any playback setting that changes the speed
 * profile. `speedMultiplier` is deliberately not one of those: the service
 * scales its own clock by it, so tapping 2× does not rebake anything.
 */
export async function syncRoute(route: Route | undefined, options: PlayerOptions) {
    if (!isSelfMocking) {
        return;
    }
    track = route ? bakeTrack(route, options) : undefined;
    if (!get(mockStatus).mocking) {
        return;
    }
    if (track) {
        await setTrack(track);
    } else {
        await setPlayback({ playing: false });
    }
}

export interface PlaybackSync {
    playing?: boolean;
    /** metres along the route, converted to track time on the way out */
    along?: number;
    speedMultiplier?: number;
    loop?: boolean;
}

export async function syncPlayback(next: PlaybackSync) {
    if (!isDriving()) {
        return;
    }
    const payload: Record<string, unknown> = {};
    if (next.playing !== undefined) {
        payload.playing = next.playing;
    }
    if (next.along !== undefined) {
        payload.positionMs = timeAt(track!, next.along);
    }
    if (next.speedMultiplier !== undefined) {
        payload.speedMultiplier = next.speedMultiplier;
    }
    if (next.loop !== undefined) {
        payload.looping = next.loop;
    }
    await setPlayback(payload);
}

/**
 * Publishes a single fix — a map tap, a search result, a drive-pad step.
 *
 * No-op while the service is replaying a track: it is already pushing at 5 Hz
 * and a one-shot in between would read as a jump.
 */
export async function pushFix(position: Position, bearing?: number, speedKmh?: number) {
    if (!isSelfMocking || !get(mockStatus).mocking) {
        return;
    }
    await pushLocation({
        lat: position.lat,
        lon: position.lon,
        altitude: position.ele,
        bearing,
        speed: speedKmh === undefined ? undefined : speedKmh / 3.6
    });
}
