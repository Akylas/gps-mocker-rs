import { bearing, distance, type Position } from './geo';
import { keptIndices, type Maneuver } from './route';
import { COSTING_MODELS } from './valhalla';

/**
 * Reading routes out of GeoJSON.
 *
 * A plain LineString is enough to replay, but exports from routing apps carry
 * the turn-by-turn data alongside the shape, and throwing that away would mean
 * asking Valhalla to work out manoeuvres the file already knows. So the
 * annotations are read when they are there and ignored when they are not.
 */

export interface GeoJsonRoute {
    name: string;
    points: Position[];
    maneuvers?: Maneuver[];
    /** the points the route was planned through, when the file records them */
    waypoints?: Position[];
    costing?: string;
}

/**
 * Valhalla manoeuvre type ids, which is what the rest of the app speaks.
 * @see https://valhalla.github.io/valhalla/api/turn-by-turn/api-reference/#maneuver-types
 */
const START = 1;
const DESTINATION = 4;
const CONTINUE = 8;
const ROUNDABOUT_ENTER = 26;
const ROUNDABOUT_EXIT = 27;

/**
 * The compact action codes seen in exports, mapped to the family of manoeuvre
 * they name.
 *
 * Only the codes an export has actually demonstrated are listed, and only for
 * what the shape cannot say on its own: that a point is a start, an arrival, or
 * a roundabout. How hard the turn is comes from the geometry instead — the
 * `angle` these files carry is the router's own figure and disagrees with the
 * line often enough (a "bear right" at 83°, a "turn right" at 15°) that it is
 * the worse source for a speed model.
 */
const ACTION_FAMILY: Record<number, 'start' | 'destination' | 'right' | 'left' | 'roundabout-enter' | 'roundabout-exit'> = {
    0: 'start',
    1: 'destination',
    4: 'right',
    6: 'left',
    8: 'roundabout-enter',
    9: 'roundabout-exit'
};

function rightType(angle: number) {
    if (angle >= 160) return 12; // uturn right
    if (angle <= 40) return 9; // slight right
    return angle >= 110 ? 11 : 10; // sharp right, right
}

function leftType(angle: number) {
    if (angle >= 160) return 13; // uturn left
    if (angle <= 40) return 16; // slight left
    return angle >= 110 ? 14 : 15; // sharp left, left
}

/** Heading change is measured across this much line either side of a turn. */
const TURN_WINDOW_M = 20;

/**
 * How far the heading swings across `index`, in −180..180; positive turns
 * right.
 *
 * Measured over a short stretch rather than the two neighbouring segments,
 * because a shape dense enough to draw well puts several points inside one
 * corner and each of them carries only a slice of the turn.
 */
function headingChangeAt(points: Position[], index: number) {
    let before = index;
    for (let span = 0; before > 0 && span < TURN_WINDOW_M; before--) {
        span += distance(points[before - 1], points[before]);
    }
    let after = index;
    for (let span = 0; after < points.length - 1 && span < TURN_WINDOW_M; after++) {
        span += distance(points[after], points[after + 1]);
    }
    if (before === index || after === index) {
        return undefined;
    }
    const incoming = bearing(points[before], points[index]);
    const outgoing = bearing(points[index], points[after]);
    return ((((outgoing - incoming) % 360) + 540) % 360) - 180;
}

interface RawInstruction {
    /** action code; see ACTION_FAMILY */
    a?: number;
    /** length of the leg that follows, in metres */
    dist?: number;
    /** index into the feature's own coordinate list */
    index?: number;
    inst?: string;
    name?: string;
}

function isFinitePair(value: unknown): value is number[] {
    return Array.isArray(value) && isFinite(Number(value[0])) && isFinite(Number(value[1]));
}

/** GeoJSON positions are [lon, lat] with an optional altitude. */
function readPosition(coordinate: unknown): Position | undefined {
    if (!isFinitePair(coordinate)) {
        return undefined;
    }
    const point: Position = { lat: Number(coordinate[1]), lon: Number(coordinate[0]) };
    const ele = Number(coordinate[2]);
    if (coordinate.length > 2 && isFinite(ele)) {
        point.ele = ele;
    }
    return point;
}

function readLine(coordinates: unknown): Position[] {
    if (!Array.isArray(coordinates)) {
        return [];
    }
    const points: Position[] = [];
    for (const coordinate of coordinates) {
        const point = readPosition(coordinate);
        if (point) {
            points.push(point);
        }
    }
    return points;
}

/**
 * Turns the instruction list into manoeuvres against the built route.
 *
 * `kept` maps raw coordinate indices onto the deduplicated ones `buildRoute`
 * produces, because an instruction pointing at a coordinate that got dropped
 * would otherwise land on the wrong turn.
 */
function readManeuvers(raw: unknown, points: Position[]): Maneuver[] | undefined {
    if (!Array.isArray(raw) || raw.length === 0) {
        return undefined;
    }

    const kept = keptIndices(points);
    // raw index -> index in the deduplicated shape, rounded down to the last
    // surviving point at or before it
    const remap = new Array<number>(points.length).fill(0);
    let next = 0;
    for (let i = 0; i < points.length; i++) {
        if (next + 1 < kept.length && kept[next + 1] <= i) {
            next++;
        }
        remap[i] = next;
    }

    const maneuvers: Maneuver[] = [];

    for (let i = 0; i < raw.length; i++) {
        const instruction = raw[i] as RawInstruction;
        if (!instruction || typeof instruction !== 'object') {
            continue;
        }

        const rawIndex = Number(instruction.index);
        if (!isFinite(rawIndex)) {
            continue;
        }

        const clamped = Math.max(0, Math.min(points.length - 1, Math.round(rawIndex)));
        const swing = headingChangeAt(points, clamped);

        maneuvers.push({
            pointIndex: remap[clamped],
            // filled in against the route's own cumulative table by the caller
            distance: 0,
            type: maneuverType(instruction, swing, i === raw.length - 1),
            instruction: typeof instruction.inst === 'string' ? instruction.inst : '',
            turnAngle: swing === undefined ? 0 : Math.round(Math.abs(swing)),
            length: isFinite(Number(instruction.dist)) ? Number(instruction.dist) : undefined
        });
    }

    return maneuvers.length > 0 ? maneuvers.sort((a, b) => a.pointIndex - b.pointIndex) : undefined;
}

function maneuverType(instruction: RawInstruction, swing: number | undefined, last: boolean) {
    const angle = swing === undefined ? 0 : Math.abs(swing);

    switch (ACTION_FAMILY[Number(instruction.a)]) {
        case 'start':
            return START;
        case 'destination':
            return DESTINATION;
        case 'right':
            return rightType(angle);
        case 'left':
            return leftType(angle);
        case 'roundabout-enter':
            return ROUNDABOUT_ENTER;
        case 'roundabout-exit':
            return ROUNDABOUT_EXIT;
    }

    // No action code, or one this does not recognise: the line still says which
    // way it bends, which is the whole difference between a left and a right.
    if (last) {
        return DESTINATION;
    }
    if (swing === undefined || angle < 10) {
        return CONTINUE;
    }
    return swing > 0 ? rightType(angle) : leftType(angle);
}

function readWaypoints(raw: unknown): Position[] | undefined {
    if (!Array.isArray(raw)) {
        return undefined;
    }
    const waypoints: Position[] = [];
    for (const entry of raw) {
        // exports wrap each waypoint in a Point feature, but a bare coordinate
        // pair describes the same thing
        const coordinate = (entry as any)?.geometry?.coordinates ?? entry;
        const point = readPosition(coordinate);
        if (point) {
            waypoints.push(point);
        }
    }
    return waypoints.length >= 2 ? waypoints : undefined;
}

function readCosting(properties: any): string | undefined {
    const candidate = properties?.route?.costing ?? properties?.costing ?? properties?.profile?.costing ?? properties?.class;
    return typeof candidate === 'string' && (COSTING_MODELS as readonly string[]).includes(candidate) ? candidate : undefined;
}

function nameOf(properties: any, fallback: string) {
    const candidate = properties?.name ?? properties?.title;
    return typeof candidate === 'string' && candidate.trim().length > 0 ? candidate.trim() : fallback;
}

/** Every line a feature holds, with the annotations that belong to it. */
function readFeature(feature: any, fallbackName: string): GeoJsonRoute[] {
    const geometry = feature?.geometry ?? feature;
    const properties = feature?.properties ?? {};
    const name = nameOf(properties, fallbackName);

    if (geometry?.type === 'GeometryCollection') {
        return (geometry.geometries || []).flatMap((child: unknown, index: number) =>
            readFeature({ geometry: child, properties }, `${name} ${index + 1}`)
        );
    }

    const lines: Position[][] =
        geometry?.type === 'LineString'
            ? [readLine(geometry.coordinates)]
            : geometry?.type === 'MultiLineString'
              ? (geometry.coordinates || []).map(readLine)
              : [];

    const waypoints = readWaypoints(properties?.route?.waypoints ?? properties?.waypoints);
    const costing = readCosting(properties);

    return lines
        .filter((points) => points.length >= 2)
        .map((points, index) => ({
            name: lines.length > 1 ? `${name} ${index + 1}` : name,
            points,
            // instructions index into one coordinate list, so they only belong
            // to a feature that has exactly one
            maneuvers: lines.length === 1 ? readManeuvers(properties?.instructions ?? properties?.maneuvers, points) : undefined,
            waypoints,
            costing
        }));
}

/**
 * Every replayable line in a GeoJSON document, longest first.
 *
 * Points and polygons are skipped rather than rejected: a file mixing a track
 * with its waypoints is normal, and only the track can be played.
 */
export function parseGeoJson(text: string, fallbackName = 'GeoJSON'): GeoJsonRoute[] {
    let document: any;
    try {
        document = JSON.parse(text);
    } catch (error) {
        throw new Error(`not valid JSON: ${(error as Error).message}`);
    }

    const features: any[] = Array.isArray(document?.features) ? document.features : [document];

    const routes = features.flatMap((feature, index) =>
        readFeature(feature, features.length > 1 ? `${fallbackName} ${index + 1}` : fallbackName)
    );

    if (routes.length === 0) {
        throw new Error('no LineString with at least two points');
    }

    return routes;
}

/** True for text that should be handed to [`parseGeoJson`] rather than the GPX reader. */
export function looksLikeJson(text: string) {
    return /^\s*[[{]/.test(text);
}
