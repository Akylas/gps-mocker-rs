import { bearing, bearingDelta, distance, interpolate, projectOnSegment, type Position } from './geo';

export interface Maneuver {
    /** index into `Route.points` where the manoeuvre happens */
    pointIndex: number;
    /** distance from the route start, in metres */
    distance: number;
    /** valhalla manoeuvre type id, kept so we can pick an icon */
    type: number;
    instruction: string;
    /** heading change across the manoeuvre, in degrees; 0 when unknown */
    turnAngle: number;
    /** valhalla's own estimate for the leg that follows, in metres */
    length?: number;
}

export type RouteSource = 'gpx' | 'valhalla';

export interface Route {
    id: string;
    name: string;
    source: RouteSource;
    points: Position[];
    /** cumulative distance from the start, one entry per point */
    cumulative: number[];
    /** bearing of the segment starting at each point; last entry repeats */
    bearings: number[];
    /**
     * Heading change per 100 m centred on each point, in degrees. Drives the
     * curvature-based slowdown when a route has no manoeuvres.
     */
    curvature: number[];
    maneuvers?: Maneuver[];
    /** waypoints a valhalla route was built from, so it can be recomputed */
    waypoints?: Position[];
    /** valhalla costing model used, when the route came from valhalla */
    costing?: string;
    createdAt: number;
}

export interface RouteStats {
    length: number;
    pointCount: number;
    /** metres climbed, when the source carries elevation */
    ascent?: number;
    descent?: number;
    /** seconds, from the source's own timestamps */
    recordedDuration?: number;
}

const CURVATURE_WINDOW_M = 50;

/** Drops points closer together than `minGap`, always keeping the endpoints. */
export function decimate(points: Position[], minGap: number): Position[] {
    if (points.length <= 2) {
        return points.slice();
    }
    const result: Position[] = [points[0]];
    for (let i = 1; i < points.length - 1; i++) {
        if (distance(result[result.length - 1], points[i]) >= minGap) {
            result.push(points[i]);
        }
    }
    result.push(points[points.length - 1]);
    return result;
}

/** Drops consecutive duplicates, which break bearing and projection maths. */
function dedupe(points: Position[]): Position[] {
    const result: Position[] = [];
    for (const point of points) {
        const previous = result[result.length - 1];
        if (!previous || distance(previous, point) > 0.05) {
            result.push(point);
        }
    }
    return result;
}

export function buildRoute(input: {
    id?: string;
    name: string;
    source: RouteSource;
    points: Position[];
    maneuvers?: Maneuver[];
    waypoints?: Position[];
    costing?: string;
    createdAt?: number;
}): Route {
    const points = dedupe(input.points);
    if (points.length < 2) {
        throw new Error('a route needs at least two distinct points');
    }

    const cumulative = new Array<number>(points.length);
    const bearings = new Array<number>(points.length);
    cumulative[0] = 0;
    for (let i = 1; i < points.length; i++) {
        cumulative[i] = cumulative[i - 1] + distance(points[i - 1], points[i]);
        bearings[i - 1] = bearing(points[i - 1], points[i]);
    }
    bearings[points.length - 1] = bearings[points.length - 2];

    return {
        id: input.id || `route-${Date.now()}-${Math.round(Math.random() * 1e6).toString(36)}`,
        name: input.name,
        source: input.source,
        points,
        cumulative,
        bearings,
        curvature: computeCurvature(points, cumulative, bearings),
        maneuvers: input.maneuvers,
        waypoints: input.waypoints,
        costing: input.costing,
        createdAt: input.createdAt ?? Date.now()
    };
}

/**
 * Total heading change over a fixed-length window around each point, expressed
 * in degrees per 100 m. A straight motorway lands near 0, a hairpin near 180.
 */
function computeCurvature(points: Position[], cumulative: number[], bearings: number[]): number[] {
    const curvature = new Array<number>(points.length).fill(0);
    for (let i = 0; i < points.length; i++) {
        const from = cumulative[i] - CURVATURE_WINDOW_M / 2;
        const to = cumulative[i] + CURVATURE_WINDOW_M / 2;

        let start = i;
        while (start > 0 && cumulative[start] > from) {
            start--;
        }
        let end = i;
        while (end < points.length - 1 && cumulative[end] < to) {
            end++;
        }
        if (end <= start) {
            continue;
        }

        let total = 0;
        for (let j = start; j < end; j++) {
            total += Math.abs(bearingDelta(bearings[j], bearings[j + 1]));
        }
        const span = Math.max(1, cumulative[end] - cumulative[start]);
        curvature[i] = (total / span) * 100;
    }
    return curvature;
}

export function routeLength(route: Route) {
    return route.cumulative[route.cumulative.length - 1];
}

export function routeStats(route: Route): RouteStats {
    const stats: RouteStats = { length: routeLength(route), pointCount: route.points.length };

    let ascent = 0;
    let descent = 0;
    let hasElevation = false;
    for (let i = 1; i < route.points.length; i++) {
        const a = route.points[i - 1].ele;
        const b = route.points[i].ele;
        if (a === undefined || b === undefined) {
            continue;
        }
        hasElevation = true;
        const delta = b - a;
        // ignore sub-metre noise, which otherwise inflates the totals badly
        if (delta > 1) {
            ascent += delta;
        } else if (delta < -1) {
            descent -= delta;
        }
    }
    if (hasElevation) {
        stats.ascent = ascent;
        stats.descent = descent;
    }

    const first = route.points[0].time;
    const last = route.points[route.points.length - 1].time;
    if (first !== undefined && last !== undefined && last > first) {
        stats.recordedDuration = (last - first) / 1000;
    }

    return stats;
}

/** True when the source carries usable timestamps on most of its points. */
export function hasTimestamps(route: Route) {
    return route.points.filter((p) => p.time !== undefined).length > route.points.length * 0.9;
}

export interface RoutePosition {
    position: Position;
    /** index of the point at or before the location */
    index: number;
    bearing: number;
    curvature: number;
}

/** Position at `metres` along the route, interpolated inside the segment. */
export function positionAt(route: Route, metres: number): RoutePosition {
    const total = routeLength(route);
    const clamped = Math.max(0, Math.min(total, metres));
    const index = segmentIndexAt(route, clamped);
    const segmentStart = route.cumulative[index];
    const segmentLength = route.cumulative[index + 1] - segmentStart;
    const t = segmentLength > 0 ? (clamped - segmentStart) / segmentLength : 0;

    const position = interpolate(route.points[index], route.points[index + 1], t);
    if (route.points[index].time !== undefined && route.points[index + 1].time !== undefined) {
        position.time = route.points[index].time + (route.points[index + 1].time - route.points[index].time) * t;
    }

    return {
        position,
        index,
        bearing: route.bearings[index],
        curvature: route.curvature[index] + (route.curvature[index + 1] - route.curvature[index]) * t
    };
}

/** Binary search for the segment containing `metres`. */
function segmentIndexAt(route: Route, metres: number) {
    let low = 0;
    let high = route.cumulative.length - 2;
    while (low < high) {
        const mid = (low + high + 1) >> 1;
        if (route.cumulative[mid] <= metres) {
            low = mid;
        } else {
            high = mid - 1;
        }
    }
    return low;
}

export interface Snap {
    /** distance along the route of the closest point, in metres */
    along: number;
    /** how far off the route the input was, in metres */
    offset: number;
    point: Position;
    index: number;
}

/**
 * Closest point on the route. `nearAlong` restricts the search to a window
 * around a known location, which keeps lap-style routes from snapping to a
 * far-away crossing of themselves.
 */
export function snapToRoute(route: Route, position: Position, nearAlong?: number, window = 2000): Snap {
    let from = 0;
    let to = route.points.length - 2;
    if (nearAlong !== undefined) {
        from = segmentIndexAt(route, Math.max(0, nearAlong - window));
        to = segmentIndexAt(route, Math.min(routeLength(route), nearAlong + window));
    }

    let best: Snap = { along: 0, offset: Infinity, point: route.points[0], index: 0 };
    for (let i = from; i <= to; i++) {
        const projection = projectOnSegment(position, route.points[i], route.points[i + 1]);
        if (projection.distance < best.offset) {
            const segmentLength = route.cumulative[i + 1] - route.cumulative[i];
            best = {
                along: route.cumulative[i] + segmentLength * projection.t,
                offset: projection.distance,
                point: projection.point,
                index: i
            };
        }
    }
    return best;
}

/** The first manoeuvre at or after `metres`, if the route has any. */
export function nextManeuver(route: Route, metres: number): Maneuver | undefined {
    if (!route.maneuvers) {
        return undefined;
    }
    return route.maneuvers.find((m) => m.distance >= metres - 5);
}

export function toGeoJson(points: Position[]): GeoJSON.Feature<GeoJSON.LineString> {
    return {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: points.map((p) => [p.lon, p.lat]) }
    };
}

/** Slice of the route between two distances, for drawing the travelled part. */
export function sliceRoute(route: Route, fromMetres: number, toMetres: number): Position[] {
    const total = routeLength(route);
    const from = Math.max(0, Math.min(total, fromMetres));
    const to = Math.max(from, Math.min(total, toMetres));

    const start = positionAt(route, from);
    const end = positionAt(route, to);
    const points: Position[] = [start.position];
    for (let i = start.index + 1; i <= end.index; i++) {
        points.push(route.points[i]);
    }
    points.push(end.position);
    return points;
}
