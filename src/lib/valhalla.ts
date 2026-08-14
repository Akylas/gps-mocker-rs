import type { Position } from './geo';
import { decimate, type Maneuver } from './route';

export const COSTING_MODELS = ['auto', 'bicycle', 'pedestrian', 'motorcycle', 'bus', 'truck', 'motor_scooter'] as const;
export type Costing = (typeof COSTING_MODELS)[number];

export const DEFAULT_VALHALLA_URL = 'https://valhalla1.openstreetmap.de';

/** Public instances reject very long shapes; map matching is the greedy one. */
const MAX_TRACE_POINTS = 1500;

/**
 * Valhalla manoeuvre type ids. Only the ones we treat specially are named; the
 * rest fall through to the default sharpness.
 * @see https://valhalla.github.io/valhalla/api/turn-by-turn/api-reference/#maneuver-types
 */
const MANEUVER_SHARPNESS: Record<number, number> = {
    0: 0, // none
    1: 0, // start
    2: 0,
    3: 0,
    4: 1, // destination — stop completely
    5: 1,
    6: 1,
    7: 0.05, // becomes
    8: 0.05, // continue
    9: 0.3, // slight right
    10: 0.6, // right
    11: 0.9, // sharp right
    12: 1, // uturn right
    13: 1, // uturn left
    14: 0.9, // sharp left
    15: 0.6, // left
    16: 0.3, // slight left
    17: 0.2, // ramp straight
    18: 0.45, // ramp right
    19: 0.45, // ramp left
    20: 0.45, // exit right
    21: 0.45, // exit left
    22: 0.1, // stay straight
    23: 0.25, // stay right
    24: 0.25, // stay left
    25: 0.3, // merge
    26: 0.7, // roundabout enter
    27: 0.5, // roundabout exit
    28: 0.8, // ferry enter
    29: 0.8 // ferry exit
};

export function maneuverSharpness(type: number) {
    return MANEUVER_SHARPNESS[type] ?? 0.5;
}

/** Valhalla encodes shapes as Google polyline with six decimals of precision. */
export function decodePolyline(encoded: string, precision = 6): Position[] {
    const factor = Math.pow(10, precision);
    const points: Position[] = [];
    let index = 0;
    let lat = 0;
    let lon = 0;

    while (index < encoded.length) {
        let result = 0;
        let shift = 0;
        let byte: number;
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);
        lat += result & 1 ? ~(result >> 1) : result >> 1;

        result = 0;
        shift = 0;
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);
        lon += result & 1 ? ~(result >> 1) : result >> 1;

        points.push({ lat: lat / factor, lon: lon / factor });
    }

    return points;
}

export interface ValhallaTrip {
    points: Position[];
    maneuvers: Maneuver[];
    /** valhalla's own estimate, in seconds */
    duration: number;
    length: number;
}

function endpoint(baseUrl: string, path: string) {
    return `${(baseUrl || DEFAULT_VALHALLA_URL).replace(/\/+$/, '')}${path}`;
}

async function post(baseUrl: string, path: string, body: unknown, signal?: AbortSignal) {
    let response: Response;
    try {
        response = await fetch(endpoint(baseUrl, path), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal
        });
    } catch (error) {
        throw new Error(`cannot reach Valhalla at ${endpoint(baseUrl, path)}: ${error?.message || error}`);
    }

    const text = await response.text();
    let payload: any;
    try {
        payload = JSON.parse(text);
    } catch {
        throw new Error(`Valhalla returned a non-JSON response (HTTP ${response.status})`);
    }
    if (!response.ok || payload.error) {
        throw new Error(payload.error || `Valhalla request failed (HTTP ${response.status})`);
    }
    return payload;
}

/**
 * Flattens a valhalla trip into one continuous shape. Legs each carry their own
 * shape and shape-relative manoeuvre indices, so both need re-basing.
 */
function readTrip(trip: any): ValhallaTrip {
    const points: Position[] = [];
    const maneuvers: Maneuver[] = [];

    for (const leg of trip.legs || []) {
        const legPoints = decodePolyline(leg.shape);
        // consecutive legs repeat the shared point
        const offset = points.length > 0 ? points.length - 1 : 0;
        points.push(...(points.length > 0 ? legPoints.slice(1) : legPoints));

        for (const maneuver of leg.maneuvers || []) {
            const pointIndex = Math.min(points.length - 1, offset + (maneuver.begin_shape_index || 0));
            maneuvers.push({
                pointIndex,
                distance: 0, // filled in by the caller, which owns the cumulative table
                type: maneuver.type ?? 0,
                instruction: maneuver.instruction || '',
                turnAngle: 0,
                length: maneuver.length !== undefined ? maneuver.length * 1000 : undefined
            });
        }
    }

    return {
        points,
        maneuvers,
        duration: trip.summary?.time ?? 0,
        length: (trip.summary?.length ?? 0) * 1000
    };
}

export interface RouteRequest {
    baseUrl: string;
    locations: Position[];
    costing: Costing;
    signal?: AbortSignal;
}

/** Turn-by-turn route through the given waypoints. */
export async function route({ baseUrl, locations, costing, signal }: RouteRequest): Promise<ValhallaTrip> {
    if (locations.length < 2) {
        throw new Error('a route needs at least two waypoints');
    }
    const payload = await post(
        baseUrl,
        '/route',
        {
            locations: locations.map((l) => ({ lat: l.lat, lon: l.lon })),
            costing,
            directions_options: { units: 'kilometers' }
        },
        signal
    );
    if (!payload.trip?.legs?.length) {
        throw new Error('Valhalla returned no route for those waypoints');
    }
    return readTrip(payload.trip);
}

export interface MatchRequest {
    baseUrl: string;
    points: Position[];
    costing: Costing;
    signal?: AbortSignal;
}

/**
 * Snaps a recorded trace to the road network and returns its manoeuvres. Used
 * to give an imported GPX turn-by-turn data it never had.
 */
export async function traceRoute({ baseUrl, points, costing, signal }: MatchRequest): Promise<ValhallaTrip> {
    let shape = points;
    if (shape.length > MAX_TRACE_POINTS) {
        // spread the budget evenly rather than truncating the tail
        const gap = Math.ceil(shape.length / MAX_TRACE_POINTS);
        shape = decimate(shape, gap);
        if (shape.length > MAX_TRACE_POINTS) {
            shape = shape.filter((_, i) => i % Math.ceil(shape.length / MAX_TRACE_POINTS) === 0 || i === shape.length - 1);
        }
    }

    const payload = await post(
        baseUrl,
        '/trace_route',
        {
            shape: shape.map((p) => ({ lat: p.lat, lon: p.lon })),
            costing,
            shape_match: 'map_snap',
            directions_options: { units: 'kilometers' }
        },
        signal
    );
    if (!payload.trip?.legs?.length) {
        throw new Error('Valhalla could not match that track to the road network');
    }
    return readTrip(payload.trip);
}

/** Cheap reachability probe, so the UI can say why routing is unavailable. */
export async function ping(baseUrl: string, signal?: AbortSignal) {
    try {
        const response = await fetch(endpoint(baseUrl, '/status'), { signal });
        return response.ok;
    } catch {
        return false;
    }
}
