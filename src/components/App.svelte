<script lang="ts">
    import addressFormatter from '@fragaria/address-formatter';
    import { invoke } from '@tauri-apps/api/core';
    import { listen } from '@tauri-apps/api/event';
    import { open as openDialog, save as saveDialog } from '@tauri-apps/plugin-dialog';
    import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
    import { type as osType_ } from '@tauri-apps/plugin-os';
    import { Command, open } from '@tauri-apps/plugin-shell';
    import { Button, Checkbox, Content, Header, HeaderAction, HeaderGlobalAction, HeaderPanelDivider, HeaderSearch, HeaderUtilities, SkipToContent, Slider, TextInput, Toggle } from 'carbon-components-svelte';
    import DocumentImport from 'carbon-icons-svelte/lib/DocumentImport.svelte';
    import LocationFilled from 'carbon-icons-svelte/lib/LocationFilled.svelte';
    import DirectionFork from 'carbon-icons-svelte/lib/DirectionFork.svelte';
    import Save from 'carbon-icons-svelte/lib/Save.svelte';
    import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
    import { KeyboardKeyHold } from 'hold-event';
    import { RulerControl } from 'mapbox-gl-controls';
    import { Map, NavigationControl } from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import { onDestroy, onMount } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { writable } from 'svelte/store';
    import { destination, distance as distanceBetween, formatDistance, type Position } from '../lib/geo';
    import { defaultsFor, withDefaults, type CostingValues } from '../lib/costing';
    import { buildGpx, parseGpx } from '../lib/gpx';
    import { deleteRoute as deleteStoredRoute, isTauri, listRoutes, loadRoute, renameRoute as renameStoredRoute, saveRoute, type RouteSummary } from '../lib/library';
    import RouteLayers from '../lib/mapLayers';
    import TerrainLayer, { presetById, SOURCE_ID as TERRAIN_SOURCE_ID, TERRAIN_PRESETS, type TerrainEncoding } from '../lib/terrain';
    import { createPlayer, DEFAULT_PLAYER_OPTIONS, type PlayerSnapshot } from '../lib/player';
    import { buildRoute, positionAt, routeLength, snapToRoute, type Maneuver, type Route } from '../lib/route';
    import { dismissTask, errorMessage, finishTask, startTask, task, updateStep } from '../lib/tasks';
    import { DEFAULT_VALHALLA_URL, route as valhallaRoute, traceRoute, type Costing } from '../lib/valhalla';
    import MapboxGLButtonControl from './MapboxGLButtonControl';
    import CostingOptions from './CostingOptions.svelte';
    import PlaybackBar from './PlaybackBar.svelte';
    import RouteLibrary from './RouteLibrary.svelte';
    import StatsPanel from './StatsPanel.svelte';
    import TaskPanel from './TaskPanel.svelte';
    import UserLocationControl from './UserLocationControl';

    /* ---------------------------------------------------------------- *
     * platform + settings                                              *
     * ---------------------------------------------------------------- */

    let drawerOpened = false;
    let osType;
    async function getOs() {
        if (!osType) {
            switch (osType_()) {
                case 'linux':
                    osType = 'linux';
                    break;
                case 'windows':
                    osType = 'windows';
                    break;
                case 'macos':
                    osType = 'darwin';
                    break;
                default:
                    osType = 'unknown';
                    break;
            }
        }
        return osType;
    }

    const DEFAULT_SETTINGS = {
        position: { lat: 45.1811, lon: 5.8141 },
        androidEmulators: true,
        iosSimulators: true,
        iosDevices: true,
        speedInKm: 90,
        keyRepeatSpeedMs: 16.6,
        mapStyle: 'https://api.maptiler.com/maps/streets/style.json?key=tEP4ZtWVB93CfqyCnbR0',
        // terrain
        terrainPreset: 'mapterhorn',
        terrainDataUrl: TERRAIN_PRESETS[0].url,
        terrainEncoding: TERRAIN_PRESETS[0].encoding as TerrainEncoding,
        terrainTileSize: TERRAIN_PRESETS[0].tileSize,
        terrainMaxZoom: TERRAIN_PRESETS[0].maxzoom,
        terrainExaggeration: 1,
        terrain3d: false,
        hillshade: false,
        mockEnabled: false,
        // playback
        playbackSpeed: 50,
        speedMultiplier: 1,
        useRecordedSpeed: true,
        smartSlowdown: true,
        minSlowdownFactor: DEFAULT_PLAYER_OPTIONS.minSlowdownFactor,
        maneuverLookahead: DEFAULT_PLAYER_OPTIONS.maneuverLookahead,
        loopPlayback: false,
        followVehicle: true,
        // routing
        valhallaUrl: DEFAULT_VALHALLA_URL,
        costing: 'auto' as Costing,
        /** per-profile valhalla costing options, keyed by costing model */
        costingOptions: {} as Record<string, CostingValues>,
        builderOptionsOpen: true,
        autoComputeManeuvers: false,
        snapToRoads: true,
        autoReroute: true,
        statsCollapsed: false
    };

    let settings = {
        ...DEFAULT_SETTINGS,
        ...(localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : {}),
        iosSimulatorsSupported: false
    };
    if (!settings.position) {
        settings = { ...DEFAULT_SETTINGS, iosSimulatorsSupported: false };
    }

    const store = writable(settings);
    store.subscribe((value) => {
        settings = value;
        localStorage.setItem('settings', JSON.stringify(value));
    });
    getOs().then((r) => ($store.iosSimulatorsSupported = r === 'darwin'));

    const taskLabels = {
        succeeded: () => $_('task_succeeded'),
        failed: (count: number, total: number) => $_('task_failed', { values: { count, total } })
    };
    const finish = () => finishTask({ succeeded: taskLabels.succeeded(), failed: taskLabels.failed });

    /* ---------------------------------------------------------------- *
     * helpers                                                          *
     * ---------------------------------------------------------------- */

    function debounce(func, wait, immediate = false) {
        let timeout;
        return function (...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    function throttle(fn, delay) {
        let lastCalled = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCalled < delay) {
                return;
            }
            lastCalled = now;
            return fn(...args);
        };
    }

    /* ---------------------------------------------------------------- *
     * device plumbing                                                  *
     * ---------------------------------------------------------------- */

    async function spawn(cmd, args, cwd?) {
        const command = Command.create(cmd, args, { cwd });
        command.on('error', (error) => console.error(`command error: "${error}"`));
        return command.spawn();
    }

    async function exec(cmd, args, cwd?) {
        const result = await Command.create(cmd, args, { cwd }).execute();
        if (result.code !== 0) {
            throw new Error(result.stderr || `exited with code ${result.code}`);
        }
        return result.stdout;
    }

    async function run(cmd, args, cwd?) {
        return Command.create(cmd, args, { cwd }).execute();
    }

    let simDevices = [];
    let lastSimDevicesCall;
    async function detectSimDevices() {
        const now = Date.now();
        if (!lastSimDevicesCall || now - lastSimDevicesCall >= 5000) {
            lastSimDevicesCall = now;
            const data = JSON.parse(await exec('xcrun', ['simctl', 'list', '-j', 'devices']));
            simDevices = Object.values<any[]>(data.devices)
                .flat()
                .filter((d) => d.state === 'Booted')
                .map((v) => v.udid);
        }
        return simDevices;
    }

    const sendPositionToIOSSimulators = throttle(async (position) => {
        try {
            const devices = await detectSimDevices();
            await invoke('send_location_to_simulators', { lat: position.lat, lon: position.lon, devices });
        } catch (error) {
            console.error(error);
        }
    }, 300);

    const sendPositionToIOSDevices = throttle(async (position) => {
        try {
            await invoke('send_location_to_devices', { lat: position.lat, lon: position.lon });
        } catch (error) {
            console.error(error);
        }
    }, 300);

    const sendPositionToAndroidEmulators = throttle(async (position) => {
        const args = ['shell', 'am', 'startservice', '-e', 'longitude', position.lon + '', '-e', 'latitude', position.lat + '', 'io.appium.settings/.LocationService'];
        try {
            await spawn('adb', args);
        } catch (error) {
            console.error(error);
        }
    }, 200);

    const saveCurrentMockPosition = throttle((position) => {
        $store.position = { lat: position.lat, lon: position.lon };
    }, 3000);

    /** Pushes a fix to every enabled target. Only this talks to the devices. */
    function pushToDevices(position: Position) {
        if (!settings.mockEnabled) {
            return;
        }
        if (settings.iosSimulatorsSupported && settings.iosSimulators) {
            sendPositionToIOSSimulators(position);
        }
        if (settings.iosDevices) {
            sendPositionToIOSDevices(position);
        }
        if (settings.androidEmulators) {
            sendPositionToAndroidEmulators(position);
        }
    }

    /* ---------------------------------------------------------------- *
     * position                                                         *
     * ---------------------------------------------------------------- */

    // declared up here because the player subscription below runs synchronously
    // and touches them on its very first emission
    let map: Map;
    let mapContainer;
    let layers: RouteLayers;
    let userLocationControl: UserLocationControl;
    let currentPosition: Position = settings.position;

    /**
     * Single funnel for every position change. The marker and the map always
     * follow; the devices only hear about it when mocking is on, so you can lay
     * out a route with mocking disabled and see exactly what will be replayed.
     */
    function applyPosition(position: Position, { center = false, follow = false } = {}) {
        currentPosition = position;
        userLocationControl?.updatePosition(position, center || (follow && settings.followVehicle));
        pushToDevices(position);
        saveCurrentMockPosition(position);
    }

    /* ---------------------------------------------------------------- *
     * player                                                           *
     * ---------------------------------------------------------------- */

    let activeRoute: Route | undefined;
    let detourRoute: Route | undefined;
    let offRouteDistance: number | undefined;

    const player = createPlayer(
        {
            onPosition(position) {
                applyPosition(position, { follow: true });
            },
            onFinished() {
                startTask($_('playback'), [{ label: $_('route_finished') }]);
                updateStep(0, 'done');
                finish();
            }
        },
        {
            ...DEFAULT_PLAYER_OPTIONS,
            baseSpeedKmh: settings.playbackSpeed,
            speedMultiplier: settings.speedMultiplier,
            useRecordedSpeed: settings.useRecordedSpeed,
            smartSlowdown: settings.smartSlowdown,
            minSlowdownFactor: settings.minSlowdownFactor,
            maneuverLookahead: settings.maneuverLookahead,
            loop: settings.loopPlayback
        }
    );

    let snapshot: PlayerSnapshot;
    const unsubscribePlayer = player.subscribe((value) => {
        const wasOnDetour = snapshot?.onDetour;
        snapshot = value;
        layers?.setProgress(value.along);
        // the player drops the detour itself once it rejoins; clear the drawing
        if (wasOnDetour && !value.onDetour) {
            detourRoute = undefined;
            offRouteDistance = undefined;
            layers?.setDetour(undefined);
        }
    });

    $: player.setOptions({
        baseSpeedKmh: $store.playbackSpeed,
        speedMultiplier: $store.speedMultiplier,
        useRecordedSpeed: $store.useRecordedSpeed,
        smartSlowdown: $store.smartSlowdown,
        minSlowdownFactor: $store.minSlowdownFactor,
        maneuverLookahead: $store.maneuverLookahead,
        loop: $store.loopPlayback
    });

    function setActiveRoute(route: Route | undefined, { fit = true } = {}) {
        activeRoute = route;
        detourRoute = undefined;
        offRouteDistance = undefined;
        player.setRoute(route);
        layers?.setRoute(route);
        layers?.setDetour(undefined);
        if (route) {
            applyPosition(route.points[0], { center: fit });
            if (fit) {
                layers?.fitRoute();
            }
        }
    }

    function clearRoute() {
        setActiveRoute(undefined);
    }

    /* ---------------------------------------------------------------- *
     * off-route handling and rerouting                                 *
     * ---------------------------------------------------------------- */

    /** Under this, a manual nudge counts as "still on the line". */
    const REJOIN_THRESHOLD_M = 25;
    let lastRerouteAt = 0;

    /**
     * A manual move (keyboard, map click, search) while a route is loaded pauses
     * playback and, once you stop moving, asks Valhalla for a way back to the
     * point on the route you had reached.
     */
    function onManualMove(position: Position) {
        applyPosition(position);
        if (!activeRoute) {
            return;
        }
        player.pause();

        const snap = snapToRoute(activeRoute, position, snapshot?.along);
        if (snap.offset <= REJOIN_THRESHOLD_M) {
            // close enough to just continue from here
            player.clearDetour();
            player.syncAlong(snap.along);
            detourRoute = undefined;
            offRouteDistance = undefined;
            layers?.setDetour(undefined);
            return;
        }

        offRouteDistance = snap.offset;
        if (settings.autoReroute) {
            scheduleReroute();
        }
    }

    const scheduleReroute = debounce(() => computeReroute(), 1200);

    async function computeReroute() {
        if (!activeRoute || !offRouteDistance) {
            return;
        }
        // never hammer the routing server while someone holds a key down
        const now = Date.now();
        if (now - lastRerouteAt < 4000) {
            scheduleReroute();
            return;
        }
        lastRerouteAt = now;

        const from = currentPosition;
        const snap = snapToRoute(activeRoute, from, snapshot?.along);
        const rejoinAlong = Math.max(snapshot?.along ?? 0, snap.along);
        const to = positionAt(activeRoute, rejoinAlong).position;

        let points: Position[] | undefined;
        try {
            const trip = await valhallaRoute({
                baseUrl: settings.valhallaUrl,
                locations: [from, to],
                costing: settings.costing,
                costingOptions: costingOptionsBlock()
            });
            points = trip.points;
        } catch (error) {
            // offline or no endpoint: a straight line still gets you back, and
            // is far better than silently refusing to resume
            console.warn('reroute failed, falling back to a direct line', error);
            points = [from, to];
        }

        if (!activeRoute || points.length < 2) {
            return;
        }
        try {
            detourRoute = buildRoute({ name: $_('rejoining_route'), source: 'valhalla', points });
        } catch {
            return;
        }
        layers?.setDetour(detourRoute);
        player.setDetour(detourRoute, rejoinAlong);
    }

    /* ---------------------------------------------------------------- *
     * map                                                              *
     * ---------------------------------------------------------------- */

    let shouldMoveOnClick = true;
    let terrain: TerrainLayer;

    async function applyTerrain() {
        if (!terrain) {
            return;
        }
        try {
            await terrain.apply({
                url: settings.terrainDataUrl,
                encoding: settings.terrainEncoding,
                tileSize: settings.terrainTileSize,
                maxzoom: settings.terrainMaxZoom,
                exaggeration: settings.terrainExaggeration,
                terrain3d: settings.terrain3d,
                hillshade: settings.hillshade
            });
        } catch (error) {
            startTask($_('terrain'), [{ label: settings.terrainDataUrl }]);
            updateStep(0, 'error', errorMessage(error));
            finish();
        }
    }

    /** Switching preset pulls its url, encoding, tile size and zoom cap along. */
    function selectTerrainPreset(id: string) {
        const preset = presetById(id);
        if (!preset) {
            return;
        }
        if (preset.url) {
            terrainDraft = preset.url;
        }
        $store = {
            ...settings,
            terrainPreset: id,
            ...(preset.url ? { terrainDataUrl: preset.url } : {}),
            terrainEncoding: preset.encoding,
            terrainTileSize: preset.tileSize,
            terrainMaxZoom: preset.maxzoom
        };
    }

    onMount(async () => {
        try {
            appliedStyleUrl = $store.mapStyle;
            map = new Map({
                container: mapContainer,
                style: appliedStyleUrl,
                center: settings.position,
                zoom: 14,
                maxPitch: 85
            });

            layers = new RouteLayers(map);
            terrain = new TerrainLayer(map);
            if (import.meta.env.DEV) {
                // handle for poking at sources and layers from the dev console
                (window as any).__gm = {
                    get map() {
                        return map;
                    },
                    get layers() {
                        return layers;
                    },
                    get route() {
                        return activeRoute;
                    },
                    player,
                    importGpxContent
                };
            }

            // a style swap drops every user source and layer; put ours back.
            // `load` is unreliable here: it waits on every source, and the DEM
            // source can keep tiles outstanding indefinitely.
            map.on('styledata', () => {
                layers?.install();
                syncTerrain(terrainKey());
            });

            userLocationControl = new UserLocationControl({ trackUserLocation: true });
            map.addControl(userLocationControl);

            map.on('click', (event) => {
                const position = { lat: event.lngLat.lat, lon: event.lngLat.lng };
                if (routeBuilderMode) {
                    waypoints = [...waypoints, position];
                    layers?.setWaypoints(waypoints);
                    if (waypoints.length >= 2) {
                        scheduleWaypointRoute();
                    }
                    return;
                }
                if (shouldMoveOnClick) {
                    onManualMove(position);
                }
            });
            map.on('contextmenu', (event) => {
                if (!routeBuilderMode || waypoints.length === 0) {
                    return;
                }
                // right-click removes the waypoint you are pointing at
                const target = { lat: event.lngLat.lat, lon: event.lngLat.lng };
                let nearest = 0;
                let best = Infinity;
                waypoints.forEach((point, index) => {
                    const d = distanceBetween(point, target);
                    if (d < best) {
                        best = d;
                        nearest = index;
                    }
                });
                waypoints = waypoints.filter((_, index) => index !== nearest);
                layers?.setWaypoints(waypoints);
                if (waypoints.length >= 2) {
                    scheduleWaypointRoute();
                }
            });

            map.addControl(new NavigationControl({ visualizePitch: true, showZoom: true, showCompass: true }));
            map.addControl(
                new MapboxGLButtonControl({
                    className: 'maplibregl-ctrl-geolocate',
                    title: $_('center_on_position'),
                    eventHandler: (event) => {
                        event.stopPropagation();
                        userLocationControl.centerOnLocation();
                    }
                })
            );
            map.addControl(new RulerControl({}), 'top-right');
            map.on('ruler.on', () => (shouldMoveOnClick = false));
            map.on('ruler.off', () => (shouldMoveOnClick = true));

            applyPosition(settings.position, { center: true });
            refreshLibrary();
        } catch (error) {
            console.error(error);
        }
    });

    onDestroy(() => {
        unsubscribePlayer();
        player.destroy();
    });

    // Both of these used to re-run on any settings write. `setStyle` drops every
    // user source and layer, and the playback loop persists the current position
    // to settings every few seconds, so the route kept being wiped off the map.
    let appliedStyleUrl: string | undefined;
    let appliedTerrain: string | undefined;

    $: applyMapStyle($store.mapStyle);
    $: syncTerrain(
        `${$store.terrainDataUrl}|${$store.terrainEncoding}|${$store.terrainTileSize}|${$store.terrainMaxZoom}|${$store.terrainExaggeration}|${$store.terrain3d}|${$store.hillshade}`
    );

    /**
     * The URL fields edit a local draft and commit on a pause, so a half-typed
     * URL never reaches setStyle or a TileJSON fetch.
     *
     * The drafts are deliberately never mirrored back from the store. A
     * `$: draft = $store.x` alongside `bind:value={draft}` fights the input:
     * the binding writes the draft, the statement writes it straight back, and
     * the field cannot be edited at all. Anything that changes these values
     * from elsewhere goes through the setters below and updates both.
     */
    let styleDraft = settings.mapStyle;
    let terrainDraft = settings.terrainDataUrl;

    const commitStyleDraft = debounce((value: string) => setMapStyle(value), 700);
    const commitTerrainDraft = debounce((value: string) => setTerrainUrl(value), 700);

    $: commitStyleDraft(styleDraft);
    $: commitTerrainDraft(terrainDraft);

    function setMapStyle(url: string) {
        const trimmed = (url || '').trim();
        styleDraft = trimmed;
        if (trimmed && trimmed !== settings.mapStyle) {
            $store.mapStyle = trimmed;
        }
    }

    function setTerrainUrl(url: string) {
        const trimmed = (url || '').trim();
        terrainDraft = trimmed;
        if (trimmed && trimmed !== settings.terrainDataUrl) {
            $store = { ...settings, terrainDataUrl: trimmed, terrainPreset: 'custom' };
        }
    }

    /**
     * Loads the style document ourselves instead of handing maplibre the URL.
     *
     * `setStyle(url)` swallows the outcome: it blanks the map first and, if the
     * fetch never lands, leaves it blank with no error anywhere — which is what
     * a mistyped or unreachable style URL looked like. Fetching first means a
     * bad URL is reported and the current style is kept.
     */
    async function applyMapStyle(url: string) {
        if (!map || !url || url === appliedStyleUrl) {
            return;
        }
        const previous = appliedStyleUrl;
        appliedStyleUrl = url;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const style = await response.json();
            if (!style || typeof style !== 'object' || !style.layers || !style.sources) {
                throw new Error($_('not_a_map_style'));
            }
            if (appliedStyleUrl !== url) {
                return; // superseded while we were fetching
            }
            map.setStyle(style);
        } catch (error) {
            appliedStyleUrl = previous;
            startTask($_('mapstyle_url'), [{ label: url }]);
            updateStep(0, 'error', errorMessage(error));
            finish();
        }
    }

    /**
     * Applies the terrain settings when they change, and again whenever the
     * source has gone missing — a style swap drops it.
     *
     * Both conditions matter. Keying alone missed the very first apply, because
     * the settings are read before the map exists and `load` never fires while
     * a source still has tiles outstanding. Re-applying unconditionally is not
     * an option either: this runs from `styledata`, and every add mutates the
     * style, which fires `styledata` again.
     */
    function syncTerrain(key: string) {
        if (!terrain || !map) {
            return;
        }
        if (key === appliedTerrain && map.getSource(TERRAIN_SOURCE_ID)) {
            return;
        }
        appliedTerrain = key;
        applyTerrain();
    }

    function terrainKey() {
        return `${settings.terrainDataUrl}|${settings.terrainEncoding}|${settings.terrainTileSize}|${settings.terrainMaxZoom}|${settings.terrainExaggeration}|${settings.terrain3d}|${settings.hillshade}`;
    }

    /* ---------------------------------------------------------------- *
     * route builder (replaces the old ctrl-click directions overlay)    *
     * ---------------------------------------------------------------- */

    let routeBuilderMode = false;
    let waypoints: Position[] = [];
    let buildingRoute = false;
    let builderPreview: Route | undefined;

    function toggleRouteBuilder(next = !routeBuilderMode) {
        routeBuilderMode = next;
        if (!routeBuilderMode) {
            waypoints = [];
            builderPreview = undefined;
            layers?.setWaypoints([]);
            // the preview replaced whatever was drawn; put the real route back
            layers?.setRoute(activeRoute);
            layers?.setProgress(snapshot?.along ?? 0);
        }
    }

    /** The `costing_options` block for whichever profile is selected. */
    function costingOptionsBlock() {
        return { [settings.costing]: withDefaults(settings.costing, settings.costingOptions?.[settings.costing]) };
    }

    /** Merges against the store rather than a component-local copy. */
    function patchCostingValues(patch: CostingValues) {
        const costing = settings.costing;
        const merged = { ...withDefaults(costing, settings.costingOptions?.[costing]), ...patch };
        $store.costingOptions = { ...(settings.costingOptions || {}), [costing]: merged };
        recomputeBuilderRoute();
    }

    function resetCostingValues() {
        $store.costingOptions = { ...(settings.costingOptions || {}), [settings.costing]: defaultsFor(settings.costing) };
        recomputeBuilderRoute();
    }

    function recomputeBuilderRoute() {
        if (routeBuilderMode && waypoints.length >= 2) {
            scheduleWaypointRoute();
        }
    }

    const scheduleWaypointRoute = debounce(() => computeWaypointRoute(), 400);

    async function computeWaypointRoute() {
        if (waypoints.length < 2) {
            return;
        }
        buildingRoute = true;
        try {
            const trip = await valhallaRoute({
                baseUrl: settings.valhallaUrl,
                locations: waypoints,
                costing: settings.costing,
                costingOptions: costingOptionsBlock()
            });
            builderPreview = withManeuverDistances(
                buildRoute({
                    name: defaultRouteName(),
                    source: 'valhalla',
                    points: trip.points,
                    maneuvers: trip.maneuvers,
                    waypoints: waypoints.slice(),
                    costing: settings.costing
                })
            );
            layers?.setRoute(builderPreview);
            layers?.setProgress(0);
        } catch (error) {
            builderPreview = undefined;
            startTask($_('build_route'), [{ label: $_('valhalla_route') }]);
            updateStep(0, 'error', errorMessage(error));
            finish();
        } finally {
            buildingRoute = false;
        }
    }

    function acceptBuiltRoute() {
        if (!builderPreview) {
            return;
        }
        const route = builderPreview;
        toggleRouteBuilder(false);
        setActiveRoute(route);
        persist(route);
    }

    function defaultRouteName() {
        return `${$_('route')} ${new Date().toLocaleString()}`;
    }

    /* ---------------------------------------------------------------- *
     * valhalla maneuvers on an existing route                          *
     * ---------------------------------------------------------------- */

    /** Valhalla hands back shape indices; turn those into distances-along. */
    function withManeuverDistances(route: Route): Route {
        if (!route.maneuvers?.length) {
            return route;
        }
        const maneuvers = route.maneuvers
            .map((maneuver) => ({
                ...maneuver,
                distance: route.cumulative[Math.min(maneuver.pointIndex, route.cumulative.length - 1)]
            }))
            .sort((a, b) => a.distance - b.distance);
        return { ...route, maneuvers };
    }

    let computingManeuvers = false;

    async function computeManeuvers() {
        if (!activeRoute || computingManeuvers) {
            return;
        }
        computingManeuvers = true;
        const source = activeRoute;
        startTask($_('compute_maneuvers'), [{ label: $_('valhalla_map_matching'), command: settings.valhallaUrl }]);
        updateStep(0, 'running');
        try {
            const trip = await traceRoute({
                baseUrl: settings.valhallaUrl,
                points: source.points,
                costing: settings.costing,
                costingOptions: costingOptionsBlock()
            });

            // Map matching gives up on anything the road graph does not know:
            // off-road tracks, ferries, private land. It answers with a stub
            // rather than an error, so compare lengths before letting it
            // replace a route the user imported.
            const sourceLength = routeLength(source);
            const matchedLength = trip.points.length > 1 ? routeLength(buildRoute({ name: 'probe', source: 'valhalla', points: trip.points })) : 0;
            if (matchedLength < sourceLength * 0.75 || matchedLength > sourceLength * 1.25) {
                throw new Error(
                    $_('match_too_different', {
                        values: { matched: formatDistance(matchedLength), original: formatDistance(sourceLength) }
                    })
                );
            }

            let next: Route;
            if (settings.snapToRoads) {
                next = withManeuverDistances(
                    buildRoute({
                        id: source.id,
                        name: source.name,
                        source: source.source,
                        createdAt: source.createdAt,
                        points: trip.points,
                        maneuvers: trip.maneuvers,
                        costing: settings.costing
                    })
                );
            } else {
                // keep the recorded geometry, but move each manoeuvre onto it
                const maneuvers: Maneuver[] = trip.maneuvers
                    .map((maneuver) => {
                        const snap = snapToRoute(source, trip.points[Math.min(maneuver.pointIndex, trip.points.length - 1)]);
                        return { ...maneuver, pointIndex: snap.index, distance: snap.along };
                    })
                    .sort((a, b) => a.distance - b.distance);
                next = { ...source, maneuvers, costing: settings.costing };
            }

            const keepAlong = snapshot?.along ?? 0;
            setActiveRoute(next, { fit: false });
            player.seek(Math.min(keepAlong, routeLength(next)));
            await persist(next);
            updateStep(0, 'done', $_('maneuvers_found', { values: { count: trip.maneuvers.length } }));
        } catch (error) {
            updateStep(0, 'error', errorMessage(error));
        } finally {
            computingManeuvers = false;
        }
        finish();
    }

    /* ---------------------------------------------------------------- *
     * gpx import / export and the saved-route library                  *
     * ---------------------------------------------------------------- */

    let savedRoutes: RouteSummary[] = [];
    let libraryOpen = false;

    async function refreshLibrary() {
        try {
            savedRoutes = await listRoutes();
        } catch (error) {
            console.error('cannot list saved routes', error);
        }
    }

    async function persist(route: Route) {
        try {
            await saveRoute(route);
            await refreshLibrary();
        } catch (error) {
            console.error('cannot save route', error);
        }
    }

    async function importGpxFromPath(path: string) {
        const name = path.split(/[\\/]/).pop()?.replace(/\.gpx$/i, '') || 'GPX';
        const xml = await readTextFile(path);
        await importGpxContent(xml, name);
    }

    async function importGpxContent(xml: string, name: string) {
        const document = parseGpx(xml, name);

        // one file can hold several tracks; replay the longest and say so
        const built = document.tracks
            .map((track) =>
                buildRoute({
                    name: document.tracks.length > 1 ? `${name} — ${track.name}` : document.name || name,
                    source: 'gpx' as const,
                    points: track.points
                })
            )
            .sort((a, b) => routeLength(b) - routeLength(a));

        const chosen = built[0];
        setActiveRoute(chosen);
        for (const route of built) {
            await persist(route);
        }

        updateStep(
            0,
            'done',
            built.length > 1
                ? $_('gpx_imported_multi', { values: { count: built.length, length: formatDistance(routeLength(chosen)) } })
                : $_('gpx_imported', { values: { points: chosen.points.length, length: formatDistance(routeLength(chosen)) } })
        );

        if (settings.autoComputeManeuvers) {
            finish();
            await computeManeuvers();
            return;
        }
        finish();
    }

    async function importGpx() {
        startTask($_('import_gpx'), [{ label: $_('reading_gpx') }]);
        updateStep(0, 'running');
        try {
            const selected = await openDialog({ multiple: false, filters: [{ name: 'GPX', extensions: ['gpx', 'xml'] }] });
            if (!selected) {
                dismissTask();
                return;
            }
            await importGpxFromPath(selected as string);
        } catch (error) {
            updateStep(0, 'error', errorMessage(error));
            finish();
        }
    }

    async function exportGpx(route: Route) {
        startTask($_('export_gpx'), [{ label: route.name }]);
        updateStep(0, 'running');
        try {
            const target = await saveDialog({ defaultPath: `${route.name.replace(/[\\/:*?"<>|]/g, '_')}.gpx`, filters: [{ name: 'GPX', extensions: ['gpx'] }] });
            if (!target) {
                dismissTask();
                return;
            }
            await writeTextFile(target, buildGpx(route.name, route.points));
            updateStep(0, 'done', target);
        } catch (error) {
            updateStep(0, 'error', errorMessage(error));
        }
        finish();
    }

    async function loadSavedRoute(id: string) {
        libraryOpen = false;
        try {
            setActiveRoute(await loadRoute(id));
        } catch (error) {
            startTask($_('saved_routes'), [{ label: id }]);
            updateStep(0, 'error', errorMessage(error));
            finish();
        }
    }

    async function removeSavedRoute(id: string) {
        await deleteStoredRoute(id);
        if (activeRoute?.id === id) {
            clearRoute();
        }
        await refreshLibrary();
    }

    async function renameSavedRoute(id: string, name: string) {
        await renameStoredRoute(id, name);
        if (activeRoute?.id === id) {
            activeRoute = { ...activeRoute, name };
        }
        await refreshLibrary();
    }

    async function exportSavedRoute(id: string) {
        await exportGpx(activeRoute?.id === id ? activeRoute : await loadRoute(id));
    }

    async function saveActiveRoute() {
        if (!activeRoute) {
            return;
        }
        startTask($_('save_route'), [{ label: activeRoute.name }]);
        updateStep(0, 'running');
        try {
            await persist(activeRoute);
            updateStep(0, 'done');
        } catch (error) {
            updateStep(0, 'error', errorMessage(error));
        }
        finish();
    }

    /* ---------------------------------------------------------------- *
     * adb tasks                                                        *
     * ---------------------------------------------------------------- */

    async function runTask(title: string, steps: { label: string; command: string }[]) {
        startTask(title, steps);
        for (let index = 0; index < steps.length; index++) {
            updateStep(index, 'running');
            const [cmd, ...args] = steps[index].command.split(' ');
            try {
                const result = await run(cmd, args);
                const output = (result.stderr || result.stdout || '').trim();
                if (result.code === 0) {
                    updateStep(index, 'done', output);
                } else {
                    updateStep(index, 'error', output || $_('task_exit_code', { values: { code: result.code } }));
                }
            } catch (error) {
                updateStep(index, 'error', errorMessage(error));
            }
        }
        finish();
    }

    async function installApk() {
        startTask($_('task_install_apk'), [{ label: $_('task_install_apk_step'), command: 'adb install <bundled apk>' }]);
        updateStep(0, 'running');
        try {
            updateStep(0, 'done', await invoke<string>('install_apk'));
        } catch (error) {
            updateStep(0, 'error', errorMessage(error));
        }
        finish();
    }

    async function setupAdb() {
        const permissions = ['READ_PHONE_STATE', 'WRITE_SETTINGS', 'ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION', 'ACCESS_MOCK_LOCATION', 'SET_ANIMATION_SCALE', 'CHANGE_CONFIGURATION'];
        return runTask($_('task_setup_adb'), [
            ...permissions.map((permission) => ({
                label: $_('task_grant', { values: { permission } }),
                command: `adb shell pm grant io.appium.settings android.permission.${permission}`
            })),
            {
                label: $_('task_start_settings_app'),
                command: 'adb shell am start -W -n io.appium.settings/.Settings -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -f 0x10200000'
            },
            { label: $_('task_allow_mock_location'), command: 'adb shell appops set io.appium.settings android:mock_location allow' }
        ]);
    }

    /* ---------------------------------------------------------------- *
     * keyboard driving                                                 *
     * ---------------------------------------------------------------- */

    const KEYCODE = { W: 87, A: 65, S: 83, D: 68 };
    const wKey = new KeyboardKeyHold(KEYCODE.W, $store.keyRepeatSpeedMs);
    const aKey = new KeyboardKeyHold(KEYCODE.A, $store.keyRepeatSpeedMs);
    const sKey = new KeyboardKeyHold(KEYCODE.S, $store.keyRepeatSpeedMs);
    const dKey = new KeyboardKeyHold(KEYCODE.D, $store.keyRepeatSpeedMs);

    let slowDecaleMeters = 1;
    let fastDecaleMeters = 10;
    $: {
        slowDecaleMeters = ($store.speedInKm / 3600) * $store.keyRepeatSpeedMs;
        fastDecaleMeters = slowDecaleMeters * 10;
        wKey.holdIntervalDelay = $store.keyRepeatSpeedMs;
        aKey.holdIntervalDelay = $store.keyRepeatSpeedMs;
        sKey.holdIntervalDelay = $store.keyRepeatSpeedMs;
        dKey.holdIntervalDelay = $store.keyRepeatSpeedMs;
    }

    function handleHolding(bearingDelta) {
        return function (event) {
            const heading = map.getBearing() + bearingDelta;
            const delta = event.originalEvent.shiftKey ? fastDecaleMeters : slowDecaleMeters;
            onManualMove(destination(currentPosition, delta, heading));
        };
    }
    aKey.addEventListener('holding', handleHolding(270));
    dKey.addEventListener('holding', handleHolding(90));
    wKey.addEventListener('holding', handleHolding(0));
    sKey.addEventListener('holding', handleHolding(180));

    function isTypingTarget(event: KeyboardEvent) {
        const element = event.composedPath()[0] as HTMLElement;
        return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element?.isContentEditable;
    }

    addEventListener('keydown', (event) => {
        if (isTypingTarget(event)) {
            return;
        }
        if (event.key === ' ') {
            event.preventDefault();
            player.toggle();
            return;
        }
        if (event.key === 'Escape' && routeBuilderMode) {
            toggleRouteBuilder(false);
            return;
        }
        if (event.key !== 'Tab') {
            event.preventDefault();
        }
    });

    /* ---------------------------------------------------------------- *
     * menu + drag and drop                                             *
     * ---------------------------------------------------------------- */

    listen<string>('menu', ({ payload }) => {
        switch (payload) {
            case 'setup':
                setupAdb();
                break;
            case 'install_apk':
                installApk();
                break;
            case 'import_gpx':
                importGpx();
                break;
            case 'save_route':
                saveActiveRoute();
                break;
            case 'saved_routes':
                refreshLibrary().then(() => (libraryOpen = true));
                break;
            case 'export_gpx':
                if (activeRoute) exportGpx(activeRoute);
                break;
            case 'play_pause':
                player.toggle();
                break;
            case 'stop_playback':
                player.stop();
                break;
            case 'restart_playback':
                player.seek(0);
                player.play();
                break;
            case 'build_route':
                toggleRouteBuilder();
                break;
            case 'compute_maneuvers':
                computeManeuvers();
                break;
            case 'fit_route':
                layers?.fitRoute();
                break;
            case 'clear_route':
                clearRoute();
                break;
            case 'learn_more':
                startTask($_('task_learn_more'), [{ label: REPO_URL, command: REPO_URL }]);
                updateStep(0, 'running');
                open(REPO_URL).then(
                    () => {
                        updateStep(0, 'done');
                        finish();
                    },
                    (error) => {
                        updateStep(0, 'error', errorMessage(error));
                        finish();
                    }
                );
                break;
            default:
                console.warn('unhandled menu event', payload);
                break;
        }
    });

    let dragging = false;
    if (isTauri) {
        listen<{ paths?: string[] }>('tauri://drag-drop', async ({ payload }) => {
            dragging = false;
            const path = payload?.paths?.find((candidate) => /\.(gpx|xml)$/i.test(candidate));
            if (!path) {
                return;
            }
            startTask($_('import_gpx'), [{ label: path }]);
            updateStep(0, 'running');
            try {
                await importGpxFromPath(path);
            } catch (error) {
                updateStep(0, 'error', errorMessage(error));
                finish();
            }
        });
        listen('tauri://drag-enter', () => (dragging = true));
        listen('tauri://drag-leave', () => (dragging = false));
    }

    /* ---------------------------------------------------------------- *
     * address search                                                   *
     * ---------------------------------------------------------------- */

    let active = false;
    let value = '';
    let selectedResultIndex = -1;
    let results = [];

    function getAddressLabel(obj) {
        if (!obj) {
            return '';
        }
        const { type, osm_id, osm_value, osm_key, osm_type, extent, ...toFormat } = obj.properties;
        toFormat.country_code = toFormat.countrycode;
        delete toFormat.countrycode;
        const res = (addressFormatter.format(toFormat, { output: 'string', fallbackCountryCode: 'FR' } as any) as string).split('\n');
        return { text: res[0], description: res.slice(1).join(' ') };
    }

    async function queryAddress(query: string) {
        if (!query || query.length === 0) {
            return null;
        }
        return fetch(`https://photon.komoot.io/api?q=${encodeURIComponent(query)}`)
            .then((data) => data.json())
            .then((data) => data.features.filter((r) => r.properties.osm_type !== 'R'))
            .catch((e) => console.error(e));
    }

    const searchText = debounce(async (query: string) => {
        if (!query || query.length === 0) {
            results = [];
            return;
        }
        const osmRes = await queryAddress(query);
        results = (osmRes || []).map((r) => ({ ...getAddressLabel(r), data: r }));
    }, 500);

    $: searchText(value);
    $: onSelectedAddress(selectedResultIndex);
    $: if (results.length === 0) selectedResultIndex = -1;

    function onSelectedAddress(index) {
        if (index < 0 || results.length < index + 1) {
            return;
        }
        const geometry = results[index].data.geometry;
        if (geometry.type !== 'Point') {
            return;
        }
        const position = { lat: geometry.coordinates[1], lon: geometry.coordinates[0] };
        if (routeBuilderMode) {
            waypoints = [...waypoints, position];
            layers?.setWaypoints(waypoints);
            if (waypoints.length >= 2) {
                scheduleWaypointRoute();
            }
            map?.flyTo({ center: [position.lon, position.lat], zoom: 15 });
            return;
        }
        onManualMove(position);
        map?.flyTo({ center: [position.lon, position.lat], zoom: 16, maxDuration: 800, essential: true });
    }

    /* ---------------------------------------------------------------- *
     * derived view state                                               *
     * ---------------------------------------------------------------- */

    $: builderLength = builderPreview ? routeLength(builderPreview) : 0;
    // a detour that is only queued still reads as "off route": you have to press
    // play before anything drives back
    $: drivingBack = snapshot?.onDetour && snapshot.state === 'playing';
</script>

<div class="drawer-container" class:dragging>
    <Header company="GPS" platformName="Mocker" bind:isSideNavOpen={drawerOpened}>
        <svelte:fragment slot="skip-to-content">
            <SkipToContent />
        </svelte:fragment>
        <HeaderUtilities>
            <HeaderSearch id="search-btn" bind:active bind:value bind:selectedResultIndex placeholder={$_('search_location')} {results} />
            <HeaderGlobalAction aria-label={$_('import_gpx')} title={$_('import_gpx')} icon={DocumentImport} on:click={importGpx} />
            <HeaderGlobalAction aria-label={$_('saved_routes')} title={$_('saved_routes')} icon={Save} on:click={() => refreshLibrary().then(() => (libraryOpen = true))} />
            <HeaderGlobalAction
                aria-label={$_('build_route')}
                title={$_('build_route')}
                icon={DirectionFork}
                class={routeBuilderMode ? 'gm-action-active' : ''}
                on:click={() => toggleRouteBuilder()}
            />
            {#if $store.mockEnabled}
                <HeaderGlobalAction aria-label={$_('mock_enabled')} title={$_('mock_enabled')} icon={LocationFilled} on:click={() => ($store.mockEnabled = false)} />
            {/if}
            <HeaderAction bind:isOpen={drawerOpened}>
                <div class="drawer-content">
                    <h3>{$_('settings')}</h3>

                    <h4>{$_('mocking')}</h4>
                    <Toggle bind:toggled={$store.mockEnabled} labelText={$_('mock_enabled')} labelA={$_('off')} labelB={$_('on')} />
                    <Checkbox bind:checked={$store.androidEmulators} labelText={$_('android_emulators')} />
                    <Checkbox bind:checked={$store.iosDevices} labelText={$_('ios_devices')} />
                    {#if $store.iosSimulatorsSupported}
                        <Checkbox bind:checked={$store.iosSimulators} labelText={$_('ios_simulators')} />
                    {/if}

                    <HeaderPanelDivider />
                    <h4>{$_('playback')}</h4>
                    <Slider hideTextInput bind:value={$store.playbackSpeed} min={1} max={300} step={1} labelText={`${$_('playback_base_speed')}: ${$store.playbackSpeed} km/h`} />
                    <Checkbox bind:checked={$store.useRecordedSpeed} labelText={$_('use_recorded_speed')} />
                    <Checkbox bind:checked={$store.smartSlowdown} labelText={$_('smart_slowdown')} />
                    {#if $store.smartSlowdown}
                        <Slider
                            hideTextInput
                            bind:value={$store.minSlowdownFactor}
                            min={0.05}
                            max={1}
                            step={0.05}
                            labelText={`${$_('min_slowdown_factor')}: ${Math.round($store.minSlowdownFactor * 100)}%`}
                        />
                        <Slider hideTextInput bind:value={$store.maneuverLookahead} min={20} max={500} step={10} labelText={`${$_('maneuver_lookahead')}: ${$store.maneuverLookahead} m`} />
                    {/if}
                    <Checkbox bind:checked={$store.loopPlayback} labelText={$_('loop')} />
                    <Checkbox bind:checked={$store.followVehicle} labelText={$_('follow_vehicle')} />

                    <HeaderPanelDivider />
                    <h4>{$_('routing')}</h4>
                    <TextInput bind:value={$store.valhallaUrl} labelText={$_('valhalla_url')} placeholder={DEFAULT_VALHALLA_URL} autocomplete="off" spellcheck="false" autocorrect="off" />
                    <!-- the same panel the route builder shows, so one set of
                         options drives building, rerouting and map matching -->
                    <div class="drawer-costing">
                        <CostingOptions
                            costing={$store.costing}
                            values={$store.costingOptions?.[$store.costing]}
                            onCosting={(next) => ($store.costing = next)}
                            onChange={patchCostingValues}
                            onReset={resetCostingValues}
                        />
                    </div>
                    <Checkbox bind:checked={$store.autoComputeManeuvers} labelText={$_('auto_compute_maneuvers')} />
                    <Checkbox bind:checked={$store.snapToRoads} labelText={$_('snap_to_roads')} />
                    <Checkbox bind:checked={$store.autoReroute} labelText={$_('auto_reroute')} />

                    <HeaderPanelDivider />
                    <h4>{$_('manual_driving')}</h4>
                    <Slider hideTextInput bind:value={$store.speedInKm} min={1} max={600} step={1} labelText={`${$_('speed')}: ${$store.speedInKm} km/h`} />
                    <Slider hideTextInput bind:value={$store.keyRepeatSpeedMs} min={10} max={5000} step={1} labelText={`${$_('keyRepeatSpeedMs')}: ${$store.keyRepeatSpeedMs} ms`} />

                    <HeaderPanelDivider />
                    <h4>{$_('map')}</h4>
                    <TextInput
                        bind:value={styleDraft}
                        labelText={$_('mapstyle_url')}
                        helperText={$_('mapstyle_url_help')}
                        autocomplete="off"
                        spellcheck="false"
                        autocorrect="off"
                        on:blur={() => setMapStyle(styleDraft)}
                    />
                    <div class="drawer-actions">
                        <Button size="small" kind="ghost" on:click={() => setMapStyle(DEFAULT_SETTINGS.mapStyle)}>{$_('reset_to_default')}</Button>
                    </div>

                    <HeaderPanelDivider />
                    <h4>{$_('terrain')}</h4>
                    <div class="preset-row">
                        {#each TERRAIN_PRESETS as preset}
                            <button
                                type="button"
                                class="preset"
                                class:active={$store.terrainPreset === preset.id}
                                on:click={() => selectTerrainPreset(preset.id)}
                            >
                                {preset.label}
                            </button>
                        {/each}
                    </div>
                    <TextInput
                        bind:value={terrainDraft}
                        labelText={$_('terrain_data_url')}
                        helperText={$_('terrain_data_url_help')}
                        autocomplete="off"
                        spellcheck="false"
                        autocorrect="off"
                        on:blur={() => setTerrainUrl(terrainDraft)}
                    />
                    <div class="field-row">
                        <label class="field">
                            <span>{$_('terrain_encoding')}</span>
                            <select bind:value={$store.terrainEncoding}>
                                <option value="terrarium">terrarium</option>
                                <option value="mapbox">mapbox</option>
                            </select>
                        </label>
                        <label class="field">
                            <span>{$_('terrain_tile_size')}</span>
                            <select bind:value={$store.terrainTileSize}>
                                <option value={256}>256</option>
                                <option value={512}>512</option>
                            </select>
                        </label>
                        <label class="field">
                            <span>{$_('terrain_max_zoom')}</span>
                            <input type="number" min="1" max="22" bind:value={$store.terrainMaxZoom} />
                        </label>
                    </div>
                    <Checkbox bind:checked={$store.terrain3d} labelText={$_('terrain_3d')} />
                    <Checkbox bind:checked={$store.hillshade} labelText={$_('hillshade')} />
                    {#if $store.terrain3d}
                        <Slider
                            hideTextInput
                            bind:value={$store.terrainExaggeration}
                            min={0.1}
                            max={3}
                            step={0.1}
                            labelText={`${$_('exageration')}: ${$store.terrainExaggeration.toFixed(1)}×`}
                        />
                    {/if}

                    <HeaderPanelDivider />
                    <h4>{$_('android_setup')}</h4>
                    <div class="drawer-actions">
                        <Button size="small" kind="tertiary" disabled={$task?.running} on:click={installApk}>{$_('task_install_apk')}</Button>
                        <Button size="small" kind="tertiary" disabled={$task?.running} on:click={setupAdb}>{$_('task_setup_adb')}</Button>
                    </div>
                </div>
            </HeaderAction>
        </HeaderUtilities>
    </Header>

    <Content id="app-content">
        <div style:pointer-events="auto" class="mapfull" id="map" bind:this={mapContainer} style="align-self:flex-end;margin: 0px;" />
    </Content>

    <StatsPanel
        route={activeRoute}
        {snapshot}
        position={currentPosition}
        offRoute={drivingBack ? undefined : offRouteDistance}
        rejoining={drivingBack ? snapshot.detourRemaining : undefined}
        collapsed={$store.statsCollapsed}
        onToggle={() => ($store.statsCollapsed = !$store.statsCollapsed)}
    />

    <!-- one dock so the builder and the transport bar stack against the bottom
         edge instead of each guessing the other's height -->
    <div class="bottom-dock">
        <TaskPanel task={$task} onDismiss={dismissTask} />

        {#if routeBuilderMode}
            {#if $store.builderOptionsOpen}
                <div class="builder-options">
                    <CostingOptions
                        compact
                        costing={$store.costing}
                        values={$store.costingOptions?.[$store.costing]}
                        onCosting={(next) => {
                            $store.costing = next;
                            if (waypoints.length >= 2) scheduleWaypointRoute();
                        }}
                        onChange={patchCostingValues}
                        onReset={resetCostingValues}
                    />
                </div>
            {/if}
            <div class="builder">
                <div class="builder-text">
                    <strong>{$_('build_route')}</strong>
                    <span>{$_('build_route_hint')}</span>
                    {#if buildingRoute}
                        <span class="builder-status">{$_('computing')}…</span>
                    {:else if builderPreview}
                        <span class="builder-status">{formatDistance(builderLength)} · {builderPreview.maneuvers?.length ?? 0} {$_('maneuvers')}</span>
                    {/if}
                </div>
                <div class="builder-actions">
                    <button
                        type="button"
                        class="builder-options-toggle"
                        class:open={$store.builderOptionsOpen}
                        aria-expanded={$store.builderOptionsOpen}
                        on:click={() => ($store.builderOptionsOpen = !$store.builderOptionsOpen)}
                    >
                        <Settings size={16} />
                        <span>{$_(`costing_${$store.costing}`)}</span>
                    </button>
                    <Button
                        size="small"
                        kind="ghost"
                        disabled={waypoints.length === 0}
                        on:click={() => {
                            waypoints = waypoints.slice(0, -1);
                            layers?.setWaypoints(waypoints);
                            if (waypoints.length >= 2) scheduleWaypointRoute();
                            else {
                                builderPreview = undefined;
                                layers?.setRoute(activeRoute);
                            }
                        }}>{$_('undo')}</Button
                    >
                    <Button size="small" kind="ghost" on:click={() => toggleRouteBuilder(false)}>{$_('cancel')}</Button>
                    <Button size="small" disabled={!builderPreview} on:click={acceptBuiltRoute}>{$_('use_route')}</Button>
                </div>
            </div>
        {/if}

        <PlaybackBar
        route={activeRoute}
        {snapshot}
        speedMultiplier={$store.speedMultiplier}
        loop={$store.loopPlayback}
        onPlayPause={() => player.toggle()}
        onStop={() => player.stop()}
        onRestart={() => {
            player.seek(0);
            player.play();
        }}
        onSeek={(fraction) => player.seekFraction(fraction)}
        onSpeedMultiplier={(v) => ($store.speedMultiplier = v)}
        onLoop={(v) => ($store.loopPlayback = v)}
        onClear={clearRoute}
        onFit={() => layers?.fitRoute()}
        onSave={saveActiveRoute}
            onComputeManeuvers={computeManeuvers}
            computing={computingManeuvers}
        />
    </div>

    <RouteLibrary
        bind:open={libraryOpen}
        routes={savedRoutes}
        activeId={activeRoute?.id}
        onClose={() => (libraryOpen = false)}
        onLoad={loadSavedRoute}
        onDelete={removeSavedRoute}
        onRename={renameSavedRoute}
        onExport={exportSavedRoute}
    />

    {#if dragging}
        <div class="drop-overlay">{$_('drop_gpx_here')}</div>
    {/if}
</div>

<style lang="scss">
    .drawer-content h4 {
        margin: 4px 0 8px;
        color: #6f6f6f;
        font-size: 11px;
        letter-spacing: 0.03em;
        text-transform: uppercase;
    }

    .drawer-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
    }

    /* Everything pinned to the bottom lives in one column, so panels stack
       against the edge instead of each hard-coding the other's height. */
    .bottom-dock {
        position: fixed;
        left: 50%;
        bottom: 16px;
        /* below the header panel (8000): the settings drawer overlaps the right
           end of this bar, and whichever sits on top eats the clicks */
        z-index: 7500;
        display: flex;
        width: min(880px, calc(100vw - 32px));
        flex-direction: column;
        gap: 8px;
        transform: translateX(-50%);
        pointer-events: none;
    }
    .bottom-dock > :global(*) {
        pointer-events: auto;
    }

    .builder-options {
        padding: 10px 14px;
        background: rgba(38, 38, 38, 0.97);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(6px);
    }

    .builder {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 14px;
        background: rgba(15, 98, 254, 0.95);
        color: #fff;
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
    }
    .builder-options-toggle {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 4px 8px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        background: none;
        color: #fff;
        cursor: pointer;
        font-size: 11px;
    }
    .builder-options-toggle:hover,
    .builder-options-toggle.open {
        background: rgba(0, 0, 0, 0.3);
    }

    .preset-row {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 10px;
    }
    .preset {
        padding: 3px 8px;
        border: 1px solid #6f6f6f;
        background: none;
        color: #c6c6c6;
        cursor: pointer;
        font-size: 11px;
    }
    .preset:hover {
        border-color: #a8a8a8;
        color: #f4f4f4;
    }
    .preset.active {
        border-color: #0f62fe;
        background: #0f62fe;
        color: #fff;
    }

    .field-row {
        display: flex;
        gap: 8px;
        margin: 10px 0;
    }
    .field {
        display: flex;
        min-width: 0;
        flex: 1;
        flex-direction: column;
        gap: 3px;
        color: #a8a8a8;
        font-size: 11px;
    }
    .field select,
    .field input {
        width: 100%;
        padding: 3px 4px;
        border: 1px solid #6f6f6f;
        background: #262626;
        color: #f4f4f4;
        font-family: inherit;
        font-size: 12px;
    }

    .drawer-costing {
        margin: 8px 0 4px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.35);
    }
    .builder-text {
        display: flex;
        min-width: 0;
        flex-direction: column;
        font-size: 12px;
    }
    .builder-status {
        color: #d0e2ff;
        font-size: 11px;
    }
    .builder-actions {
        display: flex;
        flex-shrink: 0;
        gap: 4px;
    }

    .drop-overlay {
        position: fixed;
        inset: 0;
        z-index: 9500;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(15, 98, 254, 0.25);
        border: 3px dashed #0f62fe;
        color: #fff;
        font-size: 20px;
        font-weight: 600;
        pointer-events: none;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    }

    :global(.gm-action-active) {
        background: #0f62fe !important;
    }
</style>
