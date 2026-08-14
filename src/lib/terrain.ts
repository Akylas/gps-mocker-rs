import type { Map } from 'maplibre-gl';

export const SOURCE_ID = 'gm-terrain';
export const HILLSHADE_LAYER_ID = 'gm-hillshade';

export type TerrainEncoding = 'terrarium' | 'mapbox';

export interface TerrainConfig {
    /** tile template, or a TileJSON document ending in .json */
    url: string;
    encoding: TerrainEncoding;
    tileSize: number;
    maxzoom?: number;
    exaggeration: number;
    /** raise the surface in 3D */
    terrain3d: boolean;
    hillshade: boolean;
}

interface ResolvedSource {
    tiles: string[];
    encoding: TerrainEncoding;
    tileSize: number;
    maxzoom?: number;
}

export interface TerrainPreset {
    id: string;
    label: string;
    url: string;
    encoding: TerrainEncoding;
    tileSize: number;
    maxzoom: number;
}

/**
 * Mapterhorn is terrarium-encoded webp at 512 px; the AWS/Joerd set is
 * terrarium png at 256 px and stops around z13. Getting either of those wrong
 * is the difference between a rendered relief and a blank source, so they are
 * pinned per preset rather than guessed.
 */
export const TERRAIN_PRESETS: TerrainPreset[] = [
    {
        id: 'mapterhorn',
        label: 'Mapterhorn',
        url: 'https://tiles.mapterhorn.com/{z}/{x}/{y}.webp',
        encoding: 'terrarium',
        tileSize: 512,
        maxzoom: 12
    },
    {
        id: 'aws-terrarium',
        label: 'AWS Terrarium',
        url: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 13
    },
    {
        id: 'mapbox-terrain-rgb',
        label: 'Terrain-RGB',
        url: '',
        encoding: 'mapbox',
        tileSize: 512,
        maxzoom: 14
    }
];

export function presetById(id: string) {
    return TERRAIN_PRESETS.find((preset) => preset.id === id);
}

/**
 * Owns the elevation source, the hillshade layer and the 3D terrain setting.
 *
 * The previous inline version could not switch sources: `removeSource` refuses
 * while the source is in use as terrain, so the removal threw, the subsequent
 * `addSource` threw "already exists", both were swallowed, and the map silently
 * kept the old elevation data. Order matters here — terrain off, layer out,
 * source out, then rebuild.
 */
export default class TerrainLayer {
    private map: Map;
    private config?: TerrainConfig;
    /** guards against a stale TileJSON fetch landing after a newer one */
    private generation = 0;

    constructor(map: Map) {
        this.map = map;
    }

    async apply(config: TerrainConfig) {
        this.config = config;
        const generation = ++this.generation;

        if (!config.url) {
            this.tryBuild(generation, null);
            return;
        }

        let resolved: ResolvedSource = {
            tiles: [config.url],
            encoding: config.encoding,
            tileSize: config.tileSize,
            maxzoom: config.maxzoom
        };

        if (/\.json($|\?)/.test(config.url)) {
            let tilejson: any;
            try {
                tilejson = await fetch(config.url).then((response) => response.json());
            } catch (error) {
                throw new Error(`cannot read the TileJSON at ${config.url}: ${(error as Error)?.message || error}`);
            }
            if (generation !== this.generation) {
                return;
            }
            if (Array.isArray(tilejson.tiles) && tilejson.tiles.length) {
                resolved.tiles = tilejson.tiles;
            }
            if (typeof tilejson.maxzoom === 'number') {
                resolved.maxzoom = tilejson.maxzoom;
            }
            if (typeof tilejson.tileSize === 'number') {
                resolved.tileSize = tilejson.tileSize;
            }
            // some servers advertise the encoding; trust it over the setting
            if (tilejson.encoding === 'terrarium' || tilejson.encoding === 'mapbox') {
                resolved.encoding = tilejson.encoding;
            }
        }

        this.tryBuild(generation, resolved);
    }

    /**
     * maplibre refuses source, layer and terrain changes until the style itself
     * is parsed, and answers with a throw rather than a queue. Retry on the next
     * style event instead of dropping the settings on the floor.
     */
    private tryBuild(generation: number, resolved: ResolvedSource | null) {
        if (generation !== this.generation) {
            return;
        }
        try {
            this.build(resolved);
        } catch (error) {
            if (!/not done loading/i.test((error as Error)?.message || '')) {
                throw error;
            }
            this.map.once('styledata', () => this.tryBuild(generation, resolved));
        }
    }

    private build(resolved: ResolvedSource | null) {
        this.teardown();
        if (!resolved || !this.config) {
            return;
        }

        this.map.addSource(SOURCE_ID, {
            type: 'raster-dem',
            tiles: resolved.tiles,
            encoding: resolved.encoding,
            tileSize: resolved.tileSize,
            ...(resolved.maxzoom !== undefined ? { maxzoom: resolved.maxzoom } : {})
        } as any);

        if (this.config.hillshade) {
            this.map.addLayer({
                id: HILLSHADE_LAYER_ID,
                type: 'hillshade',
                source: SOURCE_ID,
                paint: { 'hillshade-exaggeration': 0.3, 'hillshade-shadow-color': '#4a4a4a' }
            } as any);
        }

        if (this.config.terrain3d) {
            this.map.setTerrain({ source: SOURCE_ID, exaggeration: this.config.exaggeration } as any);
        }
    }

    /** Re-runs the last config; a style swap drops the source and the layer. */
    reapply() {
        if (this.config) {
            return this.apply(this.config);
        }
    }

    private teardown() {
        // terrain first: a source in use as terrain cannot be removed
        this.map.setTerrain(null as any);
        if (this.map.getLayer(HILLSHADE_LAYER_ID)) {
            this.map.removeLayer(HILLSHADE_LAYER_ID);
        }
        if (this.map.getSource(SOURCE_ID)) {
            this.map.removeSource(SOURCE_ID);
        }
    }

    destroy() {
        this.generation++;
        try {
            this.teardown();
        } catch {
            /* the map is going away anyway */
        }
    }
}
