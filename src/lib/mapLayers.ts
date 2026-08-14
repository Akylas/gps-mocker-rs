import type { Map } from 'maplibre-gl';
import type { Position } from './geo';
import { sliceRoute, toGeoJson, type Route } from './route';

const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

const SOURCES = ['gm-route', 'gm-route-done', 'gm-detour', 'gm-maneuvers', 'gm-waypoints'] as const;
const LAYERS = [
    'gm-route-casing',
    'gm-route-line',
    'gm-route-done-line',
    'gm-detour-line',
    'gm-maneuver-circles',
    'gm-waypoint-circles',
    'gm-waypoint-labels'
] as const;

export const ROUTE_COLOR = '#0f62fe';
export const DONE_COLOR = '#78a9ff';
export const DETOUR_COLOR = '#ff832b';

/**
 * Owns every route-related source and layer on the map. Kept apart from the
 * component so a style change can simply re-run `install()`: maplibre drops all
 * user sources and layers when the style is swapped.
 */
export default class RouteLayers {
    private map: Map;
    private installed = false;

    private route?: Route;
    private detour?: Route;
    private progress = 0;
    private waypoints: Position[] = [];

    constructor(map: Map) {
        this.map = map;
    }

    /**
     * (Re)creates every source and layer. Safe to call repeatedly: a style swap
     * drops them all, so the component calls this again on `styledata`.
     *
     * Deliberately not gated on `isStyleLoaded()`. That stays false for as long
     * as any source has tiles outstanding, and the terrain DEM source can sit
     * there forever when its host is unreachable — which would leave the route
     * permanently undrawn. Adding to a parsed style is fine; if it is not parsed
     * yet the call throws and we retry on the next style event.
     */
    install() {
        try {
            this.build();
        } catch {
            this.map.once('styledata', () => this.install());
        }
    }

    private build() {
        for (const id of SOURCES) {
            if (!this.map.getSource(id)) {
                this.map.addSource(id, { type: 'geojson', data: EMPTY as any });
            }
        }

        this.addLayer({
            id: 'gm-route-casing',
            type: 'line',
            source: 'gm-route',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#0b1a33', 'line-width': 9, 'line-opacity': 0.5 }
        });
        this.addLayer({
            id: 'gm-route-line',
            type: 'line',
            source: 'gm-route',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': ROUTE_COLOR, 'line-width': 5 }
        });
        this.addLayer({
            id: 'gm-route-done-line',
            type: 'line',
            source: 'gm-route-done',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': DONE_COLOR, 'line-width': 5, 'line-opacity': 0.95 }
        });
        this.addLayer({
            id: 'gm-detour-line',
            type: 'line',
            source: 'gm-detour',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': DETOUR_COLOR, 'line-width': 4, 'line-dasharray': [1.5, 1.2] }
        });
        this.addLayer({
            id: 'gm-maneuver-circles',
            type: 'circle',
            source: 'gm-maneuvers',
            paint: {
                'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 3, 16, 6],
                'circle-color': '#ffffff',
                'circle-stroke-color': ROUTE_COLOR,
                'circle-stroke-width': 2
            }
        });
        this.addLayer({
            id: 'gm-waypoint-circles',
            type: 'circle',
            source: 'gm-waypoints',
            paint: {
                'circle-radius': 9,
                'circle-color': ['case', ['==', ['get', 'kind'], 'start'], '#24a148', ['==', ['get', 'kind'], 'end'], '#da1e28', '#f1c21b'],
                'circle-stroke-color': '#ffffff',
                'circle-stroke-width': 2
            }
        });
        this.addLayer({
            id: 'gm-waypoint-labels',
            type: 'symbol',
            source: 'gm-waypoints',
            layout: { 'text-field': ['get', 'label'], 'text-size': 11, 'text-allow-overlap': true },
            paint: { 'text-color': '#161616' }
        });

        this.installed = true;
        this.redraw();
    }

    private addLayer(layer: any) {
        if (!this.map.getLayer(layer.id)) {
            this.map.addLayer(layer);
        }
    }

    setRoute(route?: Route) {
        this.route = route;
        this.progress = 0;
        this.redraw();
    }

    setProgress(metres: number) {
        this.progress = metres;
        this.redrawProgress();
    }

    setDetour(detour?: Route) {
        this.detour = detour;
        this.setData('gm-detour', detour ? (toGeoJson(detour.points) as any) : EMPTY);
    }

    setWaypoints(waypoints: Position[]) {
        this.waypoints = waypoints;
        this.setData('gm-waypoints', {
            type: 'FeatureCollection',
            features: waypoints.map((point, index) => ({
                type: 'Feature' as const,
                properties: {
                    label: String(index + 1),
                    kind: index === 0 ? 'start' : index === waypoints.length - 1 && waypoints.length > 1 ? 'end' : 'via'
                },
                geometry: { type: 'Point' as const, coordinates: [point.lon, point.lat] }
            }))
        } as any);
    }

    private redraw() {
        this.setData('gm-route', this.route ? (toGeoJson(this.route.points) as any) : EMPTY);
        this.setData('gm-maneuvers', this.maneuverFeatures());
        this.setDetour(this.detour);
        this.setWaypoints(this.waypoints);
        this.redrawProgress();
    }

    private redrawProgress() {
        if (!this.route || this.progress <= 0) {
            this.setData('gm-route-done', EMPTY);
            return;
        }
        this.setData('gm-route-done', toGeoJson(sliceRoute(this.route, 0, this.progress)) as any);
    }

    private maneuverFeatures(): any {
        if (!this.route?.maneuvers?.length) {
            return EMPTY;
        }
        return {
            type: 'FeatureCollection',
            features: this.route.maneuvers
                // the arrival marker sits on the end dot and only adds clutter
                .filter((maneuver) => maneuver.pointIndex > 0 && maneuver.pointIndex < this.route!.points.length - 1)
                .map((maneuver) => {
                    const point = this.route!.points[maneuver.pointIndex];
                    return {
                        type: 'Feature' as const,
                        properties: { instruction: maneuver.instruction },
                        geometry: { type: 'Point' as const, coordinates: [point.lon, point.lat] }
                    };
                })
        };
    }

    private setData(id: string, data: any) {
        if (!this.installed) {
            return;
        }
        const source = this.map.getSource(id) as any;
        source?.setData(data);
    }

    /** Frames the route, leaving room for the panels pinned to the edges. */
    fitRoute(padding = { top: 80, bottom: 210, left: 350, right: 80 }) {
        if (!this.route) {
            return;
        }
        let west = Infinity;
        let south = Infinity;
        let east = -Infinity;
        let north = -Infinity;
        for (const point of this.route.points) {
            west = Math.min(west, point.lon);
            east = Math.max(east, point.lon);
            south = Math.min(south, point.lat);
            north = Math.max(north, point.lat);
        }
        this.map.fitBounds(
            [
                [west, south],
                [east, north]
            ],
            { padding, duration: 600, maxZoom: 16 }
        );
    }

    destroy() {
        for (const id of LAYERS) {
            if (this.map.getLayer(id)) {
                this.map.removeLayer(id);
            }
        }
        for (const id of SOURCES) {
            if (this.map.getSource(id)) {
                this.map.removeSource(id);
            }
        }
        this.installed = false;
    }
}
