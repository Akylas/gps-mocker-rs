export interface Position {
    lat: number;
    lon: number;
    /** metres above sea level, when the source provides it */
    ele?: number;
    /** epoch millis, when the source provides it */
    time?: number;
}

export const EARTH_RADIUS_M = 6371008.8;

export function toRad(degrees: number) {
    return (degrees * Math.PI) / 180;
}

export function toDeg(radians: number) {
    return (radians * 180) / Math.PI;
}

/** Great-circle distance in metres. */
export function distance(a: Position, b: Position) {
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const dLat = lat2 - lat1;
    const dLon = toRad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Initial bearing from `a` to `b`, in degrees clockwise from north. */
export function bearing(a: Position, b: Position) {
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const dLon = toRad(b.lon - a.lon);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Point reached by travelling `metres` from `from` along `bearingDeg`. */
export function destination(from: Position, metres: number, bearingDeg: number): Position {
    const lat1 = toRad(from.lat);
    const lon1 = toRad(from.lon);
    const d = metres / EARTH_RADIUS_M;
    const b = toRad(bearingDeg);
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(b));
    const lon2 = lon1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
    return { lat: toDeg(lat2), lon: toDeg(lon2) };
}

/** Linear interpolation between two positions. `t` is 0..1. */
export function interpolate(a: Position, b: Position, t: number): Position {
    const result: Position = {
        lat: a.lat + (b.lat - a.lat) * t,
        lon: a.lon + (b.lon - a.lon) * t
    };
    if (a.ele !== undefined && b.ele !== undefined) {
        result.ele = a.ele + (b.ele - a.ele) * t;
    }
    return result;
}

/** Signed difference between two bearings, in -180..180. */
export function bearingDelta(from: number, to: number) {
    return ((((to - from) % 360) + 540) % 360) - 180;
}

/**
 * Equirectangular metres-per-degree at a given latitude. Good enough for the
 * local projections below, and much cheaper than repeated haversine calls.
 */
function metresPerDegree(lat: number) {
    const latRad = toRad(lat);
    return {
        x: (Math.PI / 180) * EARTH_RADIUS_M * Math.cos(latRad),
        y: (Math.PI / 180) * EARTH_RADIUS_M
    };
}

export interface Projection {
    /** distance from the point to the segment, in metres */
    distance: number;
    /** 0..1 position of the closest point along the segment */
    t: number;
    /** the closest point itself */
    point: Position;
}

/** Closest point on segment `a`-`b` to `p`, projected locally. */
export function projectOnSegment(p: Position, a: Position, b: Position): Projection {
    const scale = metresPerDegree(p.lat);
    const ax = a.lon * scale.x;
    const ay = a.lat * scale.y;
    const bx = b.lon * scale.x;
    const by = b.lat * scale.y;
    const px = p.lon * scale.x;
    const py = p.lat * scale.y;

    const dx = bx - ax;
    const dy = by - ay;
    const lengthSquared = dx * dx + dy * dy;

    let t = 0;
    if (lengthSquared > 0) {
        t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
    }

    const point = interpolate(a, b, t);
    const cx = ax + dx * t;
    const cy = ay + dy * t;
    return { distance: Math.hypot(px - cx, py - cy), t, point };
}

export function formatDistance(metres: number) {
    if (!isFinite(metres)) {
        return '—';
    }
    if (Math.abs(metres) < 1000) {
        return `${Math.round(metres)} m`;
    }
    return `${(metres / 1000).toFixed(metres < 10000 ? 2 : 1)} km`;
}

export function formatDuration(seconds: number) {
    if (!isFinite(seconds) || seconds < 0) {
        return '—';
    }
    const total = Math.round(seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) {
        return `${h}h ${String(m).padStart(2, '0')}m`;
    }
    if (m > 0) {
        return `${m}m ${String(s).padStart(2, '0')}s`;
    }
    return `${s}s`;
}
