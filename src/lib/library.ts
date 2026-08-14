import { BaseDirectory, exists, mkdir, readDir, readTextFile, remove, writeTextFile } from '@tauri-apps/plugin-fs';
import type { Position } from './geo';
import { buildRoute, type Maneuver, type Route, type RouteSource } from './route';

const DIRECTORY = 'routes';
const FALLBACK_KEY = 'gps-mocker.routes';

export const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

/**
 * On-disk shape. Points are stored as flat tuples rather than objects: a long
 * recorded track is tens of thousands of points, and `{"lat":..,"lon":..}` per
 * point roughly triples the file for no gain.
 */
interface StoredRoute {
    version: 1;
    id: string;
    name: string;
    source: RouteSource;
    createdAt: number;
    /** [lat, lon, ele?, time?] */
    points: number[][];
    maneuvers?: Maneuver[];
    waypoints?: number[][];
    costing?: string;
}

export interface RouteSummary {
    id: string;
    name: string;
    source: RouteSource;
    createdAt: number;
    pointCount: number;
    hasManeuvers: boolean;
}

function encodePoint(point: Position): number[] {
    const tuple: number[] = [round(point.lat), round(point.lon)];
    if (point.ele !== undefined || point.time !== undefined) {
        tuple.push(point.ele !== undefined ? Math.round(point.ele * 100) / 100 : null);
    }
    if (point.time !== undefined) {
        tuple.push(point.time);
    }
    return tuple;
}

function round(value: number) {
    // ~1 cm, well past what any consumer of a mocked fix can tell apart
    return Math.round(value * 1e7) / 1e7;
}

function decodePoint(tuple: number[]): Position {
    const point: Position = { lat: tuple[0], lon: tuple[1] };
    if (tuple[2] !== undefined && tuple[2] !== null) {
        point.ele = tuple[2];
    }
    if (tuple[3] !== undefined && tuple[3] !== null) {
        point.time = tuple[3];
    }
    return point;
}

function serialize(route: Route): StoredRoute {
    return {
        version: 1,
        id: route.id,
        name: route.name,
        source: route.source,
        createdAt: route.createdAt,
        points: route.points.map(encodePoint),
        maneuvers: route.maneuvers,
        waypoints: route.waypoints?.map(encodePoint),
        costing: route.costing
    };
}

function deserialize(stored: StoredRoute): Route {
    return buildRoute({
        id: stored.id,
        name: stored.name,
        source: stored.source,
        createdAt: stored.createdAt,
        points: stored.points.map(decodePoint),
        maneuvers: stored.maneuvers,
        waypoints: stored.waypoints?.map(decodePoint),
        costing: stored.costing
    });
}

function summarize(stored: StoredRoute): RouteSummary {
    return {
        id: stored.id,
        name: stored.name,
        source: stored.source,
        createdAt: stored.createdAt,
        pointCount: stored.points.length,
        hasManeuvers: !!stored.maneuvers?.length
    };
}

/* ------------------------------------------------------------------ *
 * localStorage fallback, so the app still works in a plain browser    *
 * during `yarn dev:web`.                                             *
 * ------------------------------------------------------------------ */

function readFallback(): Record<string, StoredRoute> {
    try {
        return JSON.parse(localStorage.getItem(FALLBACK_KEY) || '{}');
    } catch {
        return {};
    }
}

function writeFallback(all: Record<string, StoredRoute>) {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(all));
}

/* ------------------------------------------------------------------ */

async function ensureDirectory() {
    if (!(await exists(DIRECTORY, { baseDir: BaseDirectory.AppData }))) {
        await mkdir(DIRECTORY, { baseDir: BaseDirectory.AppData, recursive: true });
    }
}

export async function listRoutes(): Promise<RouteSummary[]> {
    if (!isTauri) {
        return Object.values(readFallback())
            .map(summarize)
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    await ensureDirectory();
    const entries = await readDir(DIRECTORY, { baseDir: BaseDirectory.AppData });
    const summaries: RouteSummary[] = [];
    for (const entry of entries) {
        if (!entry.isFile || !entry.name.endsWith('.json')) {
            continue;
        }
        try {
            const raw = await readTextFile(`${DIRECTORY}/${entry.name}`, { baseDir: BaseDirectory.AppData });
            summaries.push(summarize(JSON.parse(raw)));
        } catch (error) {
            console.error(`skipping unreadable saved route ${entry.name}`, error);
        }
    }
    return summaries.sort((a, b) => b.createdAt - a.createdAt);
}

export async function loadRoute(id: string): Promise<Route> {
    if (!isTauri) {
        const stored = readFallback()[id];
        if (!stored) {
            throw new Error(`no saved route with id ${id}`);
        }
        return deserialize(stored);
    }

    const raw = await readTextFile(`${DIRECTORY}/${id}.json`, { baseDir: BaseDirectory.AppData });
    return deserialize(JSON.parse(raw));
}

export async function saveRoute(route: Route): Promise<void> {
    const stored = serialize(route);
    if (!isTauri) {
        const all = readFallback();
        all[route.id] = stored;
        writeFallback(all);
        return;
    }

    await ensureDirectory();
    await writeTextFile(`${DIRECTORY}/${route.id}.json`, JSON.stringify(stored), { baseDir: BaseDirectory.AppData });
}

export async function deleteRoute(id: string): Promise<void> {
    if (!isTauri) {
        const all = readFallback();
        delete all[id];
        writeFallback(all);
        return;
    }
    await remove(`${DIRECTORY}/${id}.json`, { baseDir: BaseDirectory.AppData });
}

export async function renameRoute(id: string, name: string): Promise<void> {
    const route = await loadRoute(id);
    route.name = name;
    await saveRoute(route);
}
