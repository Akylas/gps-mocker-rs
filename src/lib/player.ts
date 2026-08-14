import { writable, type Readable } from 'svelte/store';
import { distance, type Position } from './geo';
import { hasTimestamps, nextManeuver, positionAt, routeLength, type Maneuver, type Route } from './route';
import { maneuverSharpness } from './valhalla';

export type PlayerState = 'stopped' | 'playing' | 'paused';

/** Playback tick. Fine enough to look smooth, coarse enough to stay cheap. */
const TICK_MS = 50;

/**
 * Largest jump a single tick may cover. Browsers and webviews throttle timers in
 * hidden windows, and a machine coming back from sleep can hand us minutes at
 * once; without this the vehicle would teleport.
 */
const MAX_STEP_SECONDS = 5;

export interface PlayerOptions {
    /** used when the route carries no timestamps, or replaying them is off */
    baseSpeedKmh: number;
    /** playback rate applied on top of whatever the base speed works out to */
    speedMultiplier: number;
    /** replay a recorded GPX at the speed it was recorded at */
    useRecordedSpeed: boolean;
    smartSlowdown: boolean;
    /** slowest the smart slowdown may go, as a fraction of the base speed */
    minSlowdownFactor: number;
    /** how far ahead of a manoeuvre the slowdown begins, in metres */
    maneuverLookahead: number;
    loop: boolean;
}

export const DEFAULT_PLAYER_OPTIONS: PlayerOptions = {
    baseSpeedKmh: 50,
    speedMultiplier: 1,
    useRecordedSpeed: true,
    smartSlowdown: true,
    minSlowdownFactor: 0.25,
    maneuverLookahead: 120,
    loop: false
};

export interface PlayerSnapshot {
    state: PlayerState;
    /** metres travelled along the main route */
    along: number;
    /** total length of the main route, in metres */
    total: number;
    position?: Position;
    bearing: number;
    /** effective ground speed being simulated, in km/h */
    speedKmh: number;
    /** what the smart slowdown is doing right now, 0..1 */
    slowdown: number;
    /** seconds of simulated travel since play was first pressed */
    elapsed: number;
    /** estimate for the remaining distance at the current speed, in seconds */
    eta: number;
    maneuver?: Maneuver;
    maneuverDistance: number;
    /** set while following a return-to-route detour */
    onDetour: boolean;
    detourRemaining: number;
    finished: boolean;
}

const EMPTY: PlayerSnapshot = {
    state: 'stopped',
    along: 0,
    total: 0,
    bearing: 0,
    speedKmh: 0,
    slowdown: 1,
    elapsed: 0,
    eta: 0,
    maneuverDistance: Infinity,
    onDetour: false,
    detourRemaining: 0,
    finished: false
};

interface Detour {
    route: Route;
    along: number;
    /** where on the main route the detour lands */
    rejoinAlong: number;
}

/**
 * Per-segment speeds recovered from a recording's timestamps. Segments with
 * implausible speeds (a paused recorder, a GPS jump) fall back to the base.
 */
export function recordedSpeeds(route: Route): number[] | undefined {
    if (!hasTimestamps(route)) {
        return undefined;
    }
    const speeds = new Array<number>(route.points.length - 1).fill(NaN);
    for (let i = 0; i < route.points.length - 1; i++) {
        const a = route.points[i];
        const b = route.points[i + 1];
        if (a.time === undefined || b.time === undefined) {
            continue;
        }
        const seconds = (b.time - a.time) / 1000;
        if (seconds <= 0) {
            continue;
        }
        const kmh = (distance(a, b) / seconds) * 3.6;
        // drop stationary stretches and teleports rather than replaying them
        if (kmh >= 0.5 && kmh <= 400) {
            speeds[i] = kmh;
        }
    }
    return speeds.some((s) => isFinite(s)) ? speeds : undefined;
}

/**
 * Base speed at a point, before the smart slowdown. Recorded speeds win when
 * the route has them and replaying them is enabled.
 *
 * Exported because the Android backend bakes the same model into a track ahead
 * of time instead of stepping it live; the two must not drift apart.
 */
export function baseSpeedKmh(speeds: number[] | undefined, index: number, options: PlayerOptions) {
    if (options.useRecordedSpeed && speeds) {
        const recorded = speeds[Math.min(index, speeds.length - 1)];
        if (isFinite(recorded)) {
            return recorded;
        }
    }
    return options.baseSpeedKmh;
}

/**
 * How much to scale the base speed by, in 0..1. Manoeuvres drive it when the
 * route has them; otherwise the geometry's own curvature does, so an
 * unannotated GPX still eases through hairpins instead of flying off them.
 */
export function slowdownFactor(route: Route, metres: number, curvature: number, options: PlayerOptions) {
    if (!options.smartSlowdown) {
        return 1;
    }

    let factor = 1;

    const maneuver = nextManeuver(route, metres);
    if (maneuver) {
        const ahead = maneuver.distance - metres;
        const sharpness = maneuverSharpness(maneuver.type);
        const target = 1 - sharpness * (1 - options.minSlowdownFactor);
        if (ahead <= 0) {
            // just past it: ease back up over the first 30 m
            const after = Math.min(1, -ahead / 30);
            factor = Math.min(factor, target + (1 - target) * after);
        } else if (ahead < options.maneuverLookahead) {
            // ease in with a cosine ramp so the change is not a step
            const approach = 1 - ahead / options.maneuverLookahead;
            const eased = (1 - Math.cos(approach * Math.PI)) / 2;
            factor = Math.min(factor, 1 - (1 - target) * eased);
        }
    }

    // degrees of heading change per 100 m; a motorway is ~0, a hairpin ~180
    if (curvature > 0) {
        factor = Math.min(factor, 1 / (1 + curvature * 0.022));
    }

    return Math.max(options.minSlowdownFactor, Math.min(1, factor));
}

export interface Player extends Readable<PlayerSnapshot> {
    setRoute(route: Route | undefined): void;
    setOptions(options: Partial<PlayerOptions>): void;
    play(): void;
    pause(): void;
    stop(): void;
    toggle(): void;
    /** jump to an absolute distance along the main route */
    seek(metres: number): void;
    /** jump to the fraction 0..1 of the main route */
    seekFraction(fraction: number): void;
    /** start following a detour that rejoins the main route at `rejoinAlong` */
    setDetour(route: Route, rejoinAlong: number): void;
    clearDetour(): void;
    /** align the main position with a manual move, without replaying anything */
    syncAlong(metres: number): void;
    destroy(): void;
}

export interface PlayerCallbacks {
    /** called on every tick with the position to push to the devices */
    onPosition(position: Position, snapshot: PlayerSnapshot): void;
    onFinished?(): void;
}

export function createPlayer(callbacks: PlayerCallbacks, initial: PlayerOptions = DEFAULT_PLAYER_OPTIONS): Player {
    const { subscribe, set } = writable<PlayerSnapshot>({ ...EMPTY });

    let options: PlayerOptions = { ...initial };
    let route: Route | undefined;
    let speeds: number[] | undefined;
    let detour: Detour | undefined;

    let state: PlayerState = 'stopped';
    let along = 0;
    let elapsed = 0;
    let frame = 0;
    let lastTime = 0;
    let currentSpeed = 0;
    let currentSlowdown = 1;
    let finished = false;

    function activeRoute() {
        return detour ? detour.route : route;
    }
    function activeAlong() {
        return detour ? detour.along : along;
    }

    // a detour is a freshly built route with no recording behind it, so its
    // segments never carry replayable speeds
    function baseSpeedAt(target: Route, index: number) {
        return baseSpeedKmh(!detour && target === route ? speeds : undefined, index, options);
    }

    function slowdownAt(target: Route, metres: number, curvature: number) {
        return slowdownFactor(target, metres, curvature, options);
    }

    function snapshot(): PlayerSnapshot {
        if (!route) {
            return { ...EMPTY, state };
        }
        const total = routeLength(route);
        const at = positionAt(route, along);
        const maneuver = nextManeuver(route, along);
        const speedMs = (currentSpeed * 1000) / 3600;

        const current = detour ? positionAt(detour.route, detour.along) : at;
        const detourRemaining = detour ? routeLength(detour.route) - detour.along : 0;

        return {
            state,
            along,
            total,
            position: current.position,
            bearing: current.bearing,
            speedKmh: currentSpeed,
            slowdown: currentSlowdown,
            elapsed,
            eta: speedMs > 0 ? (total - along + detourRemaining) / speedMs : Infinity,
            maneuver,
            maneuverDistance: maneuver ? maneuver.distance - along : Infinity,
            onDetour: !!detour,
            detourRemaining,
            finished
        };
    }

    function publish() {
        set(snapshot());
    }

    function emitPosition() {
        const current = snapshot();
        if (current.position) {
            callbacks.onPosition(current.position, current);
        }
        set(current);
    }

    function step() {
        if (state !== 'playing') {
            return;
        }
        const target = activeRoute();
        if (!target) {
            return;
        }

        const now = Date.now();
        // wall-clock delta rather than a fixed step: a backgrounded window gets
        // throttled ticks, and the drive must still cover the right ground
        const delta = lastTime ? Math.min(MAX_STEP_SECONDS, (now - lastTime) / 1000) : 0;
        lastTime = now;

        if (delta > 0) {
            const at = positionAt(target, activeAlong());
            const base = baseSpeedAt(target, at.index);
            currentSlowdown = slowdownAt(target, activeAlong(), at.curvature);
            currentSpeed = base * currentSlowdown * options.speedMultiplier;
            elapsed += delta;

            const advance = ((currentSpeed * 1000) / 3600) * delta;

            if (detour) {
                detour.along += advance;
                if (detour.along >= routeLength(detour.route)) {
                    // back on the line: hand control to the main route
                    along = detour.rejoinAlong;
                    detour = undefined;
                }
            } else {
                along += advance;
                const total = routeLength(route!);
                if (along >= total) {
                    if (options.loop) {
                        along -= total;
                    } else {
                        along = total;
                        state = 'paused';
                        finished = true;
                        stopTicking();
                        emitPosition();
                        callbacks.onFinished?.();
                        return;
                    }
                }
            }
        }

        emitPosition();
    }

    function start() {
        stopTicking();
        lastTime = Date.now();
        frame = setInterval(step, TICK_MS) as unknown as number;
    }

    function stopTicking() {
        clearInterval(frame);
        frame = 0;
    }

    return {
        subscribe,
        setRoute(next) {
            route = next;
            speeds = next ? recordedSpeeds(next) : undefined;
            detour = undefined;
            along = 0;
            elapsed = 0;
            finished = false;
            currentSpeed = 0;
            currentSlowdown = 1;
            state = 'stopped';
            stopTicking();
            publish();
        },
        setOptions(next) {
            options = { ...options, ...next };
            publish();
        },
        play() {
            if (!route || state === 'playing') {
                return;
            }
            if (finished) {
                along = 0;
                elapsed = 0;
                finished = false;
            }
            state = 'playing';
            start();
            publish();
        },
        pause() {
            if (state !== 'playing') {
                return;
            }
            state = 'paused';
            stopTicking();
            currentSpeed = 0;
            publish();
        },
        stop() {
            state = 'stopped';
            stopTicking();
            along = 0;
            elapsed = 0;
            detour = undefined;
            currentSpeed = 0;
            currentSlowdown = 1;
            finished = false;
            if (route) {
                emitPosition();
            } else {
                publish();
            }
        },
        toggle() {
            if (state === 'playing') {
                this.pause();
            } else {
                this.play();
            }
        },
        seek(metres) {
            if (!route) {
                return;
            }
            detour = undefined;
            along = Math.max(0, Math.min(routeLength(route), metres));
            finished = false;
            emitPosition();
        },
        seekFraction(fraction) {
            if (route) {
                this.seek(routeLength(route) * fraction);
            }
        },
        setDetour(next, rejoinAlong) {
            detour = { route: next, along: 0, rejoinAlong };
            finished = false;
            publish();
        },
        clearDetour() {
            detour = undefined;
            publish();
        },
        syncAlong(metres) {
            if (!route) {
                return;
            }
            along = Math.max(0, Math.min(routeLength(route), metres));
            publish();
        },
        destroy() {
            stopTicking();
        }
    };
}
