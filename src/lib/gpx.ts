import type { Position } from './geo';

export interface GpxTrack {
    name: string;
    points: Position[];
}

export interface GpxDocument {
    name?: string;
    tracks: GpxTrack[];
}

function textOf(parent: Element, tag: string) {
    const node = parent.getElementsByTagName(tag)[0];
    return node?.textContent?.trim() || undefined;
}

function readPoint(element: Element): Position | null {
    const lat = parseFloat(element.getAttribute('lat') || '');
    const lon = parseFloat(element.getAttribute('lon') || '');
    if (!isFinite(lat) || !isFinite(lon)) {
        return null;
    }

    const point: Position = { lat, lon };

    const ele = textOf(element, 'ele');
    if (ele !== undefined) {
        const parsed = parseFloat(ele);
        if (isFinite(parsed)) {
            point.ele = parsed;
        }
    }

    const time = textOf(element, 'time');
    if (time !== undefined) {
        const parsed = Date.parse(time);
        if (isFinite(parsed)) {
            point.time = parsed;
        }
    }

    return point;
}

function collectPoints(container: Element, tag: string): Position[] {
    const points: Position[] = [];
    const elements = container.getElementsByTagName(tag);
    for (let i = 0; i < elements.length; i++) {
        const point = readPoint(elements[i]);
        if (point) {
            points.push(point);
        }
    }
    return points;
}

/**
 * Parses GPX 1.0/1.1. Track segments of one track are concatenated: a recorder
 * that paused mid-ride splits a single ride across segments, and replaying them
 * as one route is what you want.
 */
export function parseGpx(xml: string, fallbackName = 'GPX'): GpxDocument {
    const document = new DOMParser().parseFromString(xml, 'application/xml');

    const failure = document.getElementsByTagName('parsererror')[0];
    if (failure) {
        throw new Error(`not valid XML: ${failure.textContent?.trim().split('\n')[0] || 'parse error'}`);
    }

    const root = document.documentElement;
    if (!root || root.localName !== 'gpx') {
        throw new Error('not a GPX file (no <gpx> root element)');
    }

    const tracks: GpxTrack[] = [];

    const trkElements = root.getElementsByTagName('trk');
    for (let i = 0; i < trkElements.length; i++) {
        const points = collectPoints(trkElements[i], 'trkpt');
        if (points.length >= 2) {
            tracks.push({ name: textOf(trkElements[i], 'name') || `${fallbackName} ${i + 1}`, points });
        }
    }

    // routes are a planned rather than recorded line, but replay the same way
    const rteElements = root.getElementsByTagName('rte');
    for (let i = 0; i < rteElements.length; i++) {
        const points = collectPoints(rteElements[i], 'rtept');
        if (points.length >= 2) {
            tracks.push({ name: textOf(rteElements[i], 'name') || `${fallbackName} route ${i + 1}`, points });
        }
    }

    // last resort: a file that is nothing but waypoints still describes a path
    if (tracks.length === 0) {
        const points = collectPoints(root, 'wpt');
        if (points.length >= 2) {
            tracks.push({ name: fallbackName, points });
        }
    }

    if (tracks.length === 0) {
        throw new Error('no track, route or waypoint list with at least two points');
    }

    const metadata = root.getElementsByTagName('metadata')[0];
    return { name: metadata ? textOf(metadata, 'name') : undefined, tracks };
}

export function buildGpx(name: string, points: Position[]) {
    const escape = (value: string) => value.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);
    const body = points
        .map((point) => {
            const parts = [`    <trkpt lat="${point.lat.toFixed(7)}" lon="${point.lon.toFixed(7)}">`];
            if (point.ele !== undefined) {
                parts.push(`      <ele>${point.ele.toFixed(2)}</ele>`);
            }
            if (point.time !== undefined) {
                parts.push(`      <time>${new Date(point.time).toISOString()}</time>`);
            }
            parts.push('    </trkpt>');
            return parts.join('\n');
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GPS Mocker" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${escape(name)}</name></metadata>
  <trk>
    <name>${escape(name)}</name>
    <trkseg>
${body}
    </trkseg>
  </trk>
</gpx>
`;
}
