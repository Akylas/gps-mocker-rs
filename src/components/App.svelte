<script lang="ts">
    import addressFormatter from '@fragaria/address-formatter';
    import { invoke } from '@tauri-apps/api/core';
    import { listen } from '@tauri-apps/api/event';
    import { open as openDialog, save as saveDialog } from '@tauri-apps/plugin-dialog';
    import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
    import { Command, open } from '@tauri-apps/plugin-shell';
    import DocumentImport from 'carbon-icons-svelte/lib/DocumentImport.svelte';
    import LocationFilled from 'carbon-icons-svelte/lib/LocationFilled.svelte';
    import DirectionFork from 'carbon-icons-svelte/lib/DirectionFork.svelte';
    import Save from 'carbon-icons-svelte/lib/Save.svelte';
    import Search from 'carbon-icons-svelte/lib/Search.svelte';
    import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
    import Chart_3D from 'carbon-icons-svelte/lib/Chart_3D.svelte';
    import Location from 'carbon-icons-svelte/lib/Location.svelte';
    import MapCenter from 'carbon-icons-svelte/lib/MapCenter.svelte';
    import GameConsole from 'carbon-icons-svelte/lib/GameConsole.svelte';
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
    import { looksLikeJson, parseGeoJson } from '../lib/geojson';
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
    import RouteControls from './RouteControls.svelte';
    import RouteLibrary from './RouteLibrary.svelte';
    import StatsPanel from './StatsPanel.svelte';
    import TaskPanel from './TaskPanel.svelte';
    import UserLocationControl from './UserLocationControl';
    import { compact, type Detent } from '../lib/layout';
    import { host, isDesktop, isSelfMocking } from '../lib/platform';
    import { mockStatus, onProgress, onStopped, refreshStatus, setNotificationMode, stopMocking, type NotificationMode } from '../lib/mockProvider';
    import { alongAtPosition, clearTrack, isDriving, pushFix, syncPlayback, syncRoute } from '../lib/nativePlayback';
    import DrivePad from './DrivePad.svelte';
    import Reticle from './Reticle.svelte';
    import SearchBar from './SearchBar.svelte';
    import SettingsPanel from './SettingsPanel.svelte';
    import Inspector from './shell/Inspector.svelte';
    import Rail from './shell/Rail.svelte';
    import Sheet from './shell/Sheet.svelte';
    import IconButton from './ui/IconButton.svelte';
    import Button from './ui/Button.svelte';
    import { resolvedTheme, setThemePreference, type ThemePreference } from '../lib/theme';
    import { followSystemBars } from '../lib/systemBars';
    import { adbDevices, checkReadiness, refreshDevices, resolveSerials, sendLocation, setupCommands, type AdbDevice } from '../lib/adb';

    /* ---------------------------------------------------------------- *
     * platform + settings                                              *
     * ---------------------------------------------------------------- */

    /** which surface the settings are showing in: the rail's inspector, or the sheet */
    let settingsOpen = false;
    /** how far the touch shell's sheet is pulled up */
    let detent: Detent = 'peek';
    let searchOpen = false;
    /** the touch shell's stand-in for the W/A/S/D driving keys */
    let padOpen = false;
    /** reticle up, waiting to drop the vehicle wherever the map is aimed */
    let placeMode = false;

    /**
     * Reaching for the map is a clear signal the sheet is in the way, so any
     * touch on it drops the sheet back to peek rather than making the user
     * dismiss it first.
     */
    function collapseSheet() {
        if (detent !== 'peek') {
            detent = 'peek';
        }
    }

    const DEFAULT_SETTINGS = {
        position: { lat: 45.1811, lon: 5.8141 },
        androidEmulators: true,
        /** 'auto', 'all', or an adb serial; see lib/adb.ts for how it resolves */
        adbTarget: 'auto',
        iosSimulators: true,
        iosDevices: true,
        speedInKm: 90,
        keyRepeatSpeedMs: 16.6,
        theme: 'auto' as ThemePreference,
        mapStyle: 'https://api.maptiler.com/maps/streets/style.json?key=tEP4ZtWVB93CfqyCnbR0',
        // the map is most of the screen, so a dark shell over a bright basemap
        // would not read as a dark theme at all
        mapStyleDark: 'https://api.maptiler.com/maps/streets-v2-dark/style.json?key=tEP4ZtWVB93CfqyCnbR0',
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
        /** Android only: when the app may show its own notification. */
        androidNotification: 'playing' as NotificationMode,
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
    $store.iosSimulatorsSupported = host === 'macos';

    // the pre-paint script in index.html already read this out of localStorage;
    // this is what keeps it following the setting once someone changes it
    $: setThemePreference($store.theme);

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

    /**
     * The last adb complaint that was surfaced.
     *
     * This runs on every playback tick, so the same "no device attached" would
     * otherwise reopen the task panel five times a second. Only a *different*
     * message gets through, and a success clears the latch so the next real
     * failure is heard again.
     */
    let lastAdbError: string | undefined;

    const sendPositionToAndroidEmulators = throttle(async (position, motion) => {
        try {
            await sendLocation(position, $store.adbTarget, motion);
            lastAdbError = undefined;
        } catch (error) {
            const message = errorMessage(error);
            if (message === lastAdbError) {
                return;
            }
            lastAdbError = message;
            startTask($_('android_emulators'), [{ label: message }]);
            updateStep(0, 'error', message);
            finish();
        }
    }, 200);

    const saveCurrentMockPosition = throttle((position) => {
        $store.position = { lat: position.lat, lon: position.lon };
    }, 3000);

    /**
     * Heading and ground speed to send with a fix, when they mean anything.
     *
     * A hand-placed pin has neither, and inventing a bearing of 0 would point
     * every navigation app under test due north. `heading` is passed by the
     * moves that know their own direction — the keyboard and the drive pad.
     */
    function motionOf(heading?: number) {
        if (heading !== undefined) {
            // one step of manual driving: a direction, but no speed to speak of
            return { bearing: heading };
        }
        if (snapshot?.position) {
            return { bearing: snapshot.bearing, speedKmh: snapshot.speedKmh };
        }
        return {};
    }

    /** Pushes a fix to every enabled target. Only this talks to the devices. */
    function pushToDevices(position: Position, heading?: number) {
        const motion = motionOf(heading);

        if (isSelfMocking) {
            // the service is already publishing at its own rate while it
            // replays a track; a one-shot in between would read as a jump
            if (!isDriving() || snapshot?.state !== 'playing') {
                pushFix(position, motion.bearing, motion.speedKmh);
            }
            return;
        }
        if (!settings.mockEnabled) {
            return;
        }
        // the Simulator's location notification carries a coordinate and
        // nothing else, so course and speed stop here
        if (settings.iosSimulatorsSupported && settings.iosSimulators) {
            sendPositionToIOSSimulators(position);
        }
        if (settings.iosDevices) {
            sendPositionToIOSDevices(position);
        }
        if (settings.androidEmulators) {
            sendPositionToAndroidEmulators(position, motion);
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
    function applyPosition(position: Position, { center = false, follow = false, heading = undefined as number | undefined } = {}) {
        currentPosition = position;
        userLocationControl?.updatePosition(position, center || (follow && settings.followVehicle));
        pushToDevices(position, heading);
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

    $: playerOptions = {
        ...DEFAULT_PLAYER_OPTIONS,
        baseSpeedKmh: $store.playbackSpeed,
        speedMultiplier: $store.speedMultiplier,
        useRecordedSpeed: $store.useRecordedSpeed,
        smartSlowdown: $store.smartSlowdown,
        minSlowdownFactor: $store.minSlowdownFactor,
        maneuverLookahead: $store.maneuverLookahead,
        loop: $store.loopPlayback
    };
    $: player.setOptions(playerOptions);

    /* ---------------------------------------------------------------- *
     * native playback (android)                                        *
     * ---------------------------------------------------------------- */

    /**
     * The speed profile the service replays is baked from these, so any of them
     * changing means a rebake. `speedMultiplier` and `loop` are absent on
     * purpose: the service applies both to its own clock, so changing them
     * costs one small call instead of re-sending the whole track.
     */
    $: profileKey = `${$store.playbackSpeed}|${$store.useRecordedSpeed}|${$store.smartSlowdown}|${$store.minSlowdownFactor}|${$store.maneuverLookahead}`;
    $: if (isSelfMocking) rebakeTrack(activeRoute, profileKey);
    $: if (isSelfMocking) syncPlayback({ speedMultiplier: $store.speedMultiplier, loop: $store.loopPlayback });
    // the service is started and stopped to match this, so it is applied on
    // every launch and not only when someone changes it
    $: if (isSelfMocking) setNotificationMode($store.androidNotification).catch((error) => console.warn('cannot set the notification mode', error));

    const rebakeTrack = debounce((route: Route | undefined) => syncRoute(route, playerOptions), 250);

    /**
     * Playback control that keeps both clocks together.
     *
     * Every path that starts, stops or moves the playhead goes through here, so
     * the service never ends up driving from a position the UI has left behind.
     */
    const transport = {
        toggle() {
            player.toggle();
            syncPlayback({ playing: snapshot?.state === 'playing', along: snapshot?.along });
        },
        play() {
            player.play();
            syncPlayback({ playing: true, along: snapshot?.along });
        },
        pause() {
            player.pause();
            syncPlayback({ playing: false });
        },
        stop() {
            player.stop();
            syncPlayback({ playing: false, along: 0 });
        },
        restart() {
            player.seek(0);
            player.play();
            syncPlayback({ playing: true, along: 0 });
        },
        seekFraction(fraction: number) {
            player.seekFraction(fraction);
            syncPlayback({ along: snapshot?.along });
        }
    };

    function setActiveRoute(route: Route | undefined, { fit = true } = {}) {
        activeRoute = route;
        detourRoute = undefined;
        offRouteDistance = undefined;
        player.setRoute(route);
        layers?.setRoute(route);
        layers?.setDetour(undefined);
        if (!route) {
            clearTrack();
        }
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
    function onManualMove(position: Position, heading?: number) {
        applyPosition(position, { heading });
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
            appliedStyleUrl = $resolvedTheme === 'dark' ? $store.mapStyleDark : $store.mapStyle;
            map = new Map({
                container: mapContainer,
                style: appliedStyleUrl,
                center: settings.position,
                zoom: 14,
                maxPitch: 85,
                // One world, not a repeating strip of them. A route is a single
                // place, so the copies were only ever drawing it twice — and
                // they are what makes a pitched terrain view throw: maplibre
                // moves a marker into whichever copy is nearest its last screen
                // position, and at a high pitch a copy a whole world away still
                // lands on screen, so it stays there. The elevation lookup then
                // builds a tile id from that out-of-range longitude and throws
                // `x=… outside of bounds` from inside a `move` listener, which
                // aborts the marker update for good: the next one starts from
                // the same stale position and throws again.
                renderWorldCopies: false
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
                    importRouteContent
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
                // touch has no click that is not also the start of a pan, so the
                // compact shell places points with the reticle instead
                if ($compact) {
                    return;
                }
                const position = { lat: event.lngLat.lat, lon: event.lngLat.lng };
                if (routeBuilderMode) {
                    addWaypoint(position);
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

            // bottom-right, not the default top-right: that corner belongs to
            // the live stats card, and whichever sits on top eats the clicks
            map.addControl(new NavigationControl({ visualizePitch: true, showZoom: true, showCompass: true }), 'bottom-right');
            map.addControl(
                new MapboxGLButtonControl({
                    className: 'maplibregl-ctrl-geolocate',
                    title: $_('center_on_position'),
                    eventHandler: (event) => {
                        event.stopPropagation();
                        userLocationControl.centerOnLocation();
                    }
                }),
                'bottom-right'
            );
            map.addControl(new RulerControl({}), 'bottom-right');
            map.on('ruler.on', () => (shouldMoveOnClick = false));
            map.on('ruler.off', () => (shouldMoveOnClick = true));

            applyPosition(settings.position, { center: true });
            refreshLibrary();
            if (isTauri && !isSelfMocking) {
                // so the device picker in the settings is populated before it
                // is ever opened
                refreshDevices().catch((error) => console.warn('cannot list adb devices', error));
            }
        } catch (error) {
            console.error(error);
        }

        if (isSelfMocking) {
            await refreshStatus();
            unlistenProgress = await onProgress((progress) => {
                if (!isDriving()) {
                    return;
                }
                const along = alongAtPosition(progress.positionMs);
                // Only correct real drift. The webview keeps its own clock for
                // a smooth marker, but a backgrounded webview gets throttled
                // while the service keeps driving, so on the way back the
                // service is the one that is right.
                if (Math.abs((snapshot?.along ?? 0) - along) > DRIFT_TOLERANCE_M) {
                    player.syncAlong(along);
                    if (progress.lat !== undefined && progress.lon !== undefined) {
                        applyPosition({ lat: progress.lat, lon: progress.lon }, { follow: true });
                    }
                }
                if (progress.ended && snapshot?.state === 'playing') {
                    player.pause();
                }
            });
            // the notification's stop button kills the service from outside
            unlistenStopped = await onStopped(() => player.pause());
        }
    });

    /** How far the webview's clock may run from the service's before a resync. */
    const DRIFT_TOLERANCE_M = 15;
    let unlistenProgress: () => void = () => undefined;
    let unlistenStopped: () => void = () => undefined;
    const unfollowSystemBars = followSystemBars();

    onDestroy(() => {
        unsubscribePlayer();
        player.destroy();
        unlistenProgress();
        unlistenStopped();
        unfollowSystemBars();
    });

    // Both of these used to re-run on any settings write. `setStyle` drops every
    // user source and layer, and the playback loop persists the current position
    // to settings every few seconds, so the route kept being wiped off the map.
    let appliedStyleUrl: string | undefined;
    let appliedTerrain: string | undefined;

    // the theme picks which of the two style URLs is live; both stay editable
    $: activeMapStyle = $resolvedTheme === 'dark' ? $store.mapStyleDark : $store.mapStyle;
    $: applyMapStyle(activeMapStyle);
    $: syncTerrain(`${$store.terrainDataUrl}|${$store.terrainEncoding}|${$store.terrainTileSize}|${$store.terrainMaxZoom}|${$store.terrainExaggeration}|${$store.terrain3d}|${$store.hillshade}`);

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
    let darkStyleDraft = settings.mapStyleDark;
    let terrainDraft = settings.terrainDataUrl;

    const commitStyleDraft = debounce((value: string) => setMapStyle(value), 700);
    const commitDarkStyleDraft = debounce((value: string) => setDarkMapStyle(value), 700);
    const commitTerrainDraft = debounce((value: string) => setTerrainUrl(value), 700);

    $: commitStyleDraft(styleDraft);
    $: commitDarkStyleDraft(darkStyleDraft);
    $: commitTerrainDraft(terrainDraft);

    function setMapStyle(url: string) {
        const trimmed = (url || '').trim();
        styleDraft = trimmed;
        if (trimmed && trimmed !== settings.mapStyle) {
            $store.mapStyle = trimmed;
        }
    }

    function setDarkMapStyle(url: string) {
        const trimmed = (url || '').trim();
        darkStyleDraft = trimmed;
        if (trimmed && trimmed !== settings.mapStyleDark) {
            $store.mapStyleDark = trimmed;
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

    function addWaypoint(position: Position) {
        waypoints = [...waypoints, position];
        layers?.setWaypoints(waypoints);
        if (waypoints.length >= 2) {
            scheduleWaypointRoute();
        }
    }

    /** What the reticle drops: a waypoint while building, otherwise the vehicle. */
    function placeAtMapCentre() {
        if (!map) {
            return;
        }
        const centre = map.getCenter();
        const position = { lat: centre.lat, lon: centre.lng };
        if (routeBuilderMode) {
            addWaypoint(position);
        } else {
            onManualMove(position);
        }
    }

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

    async function importRouteFromPath(path: string) {
        const name =
            path
                .split(/[\\/]/)
                .pop()
                ?.replace(/\.(gpx|xml|geojson|json)$/i, '') || 'Route';
        const text = await readTextFile(path);
        await importRouteContent(text, name);
    }

    function buildGpxRoutes(xml: string, name: string): Route[] {
        const document = parseGpx(xml, name);
        return document.tracks.map((track) =>
            buildRoute({
                name: document.tracks.length > 1 ? `${name} — ${track.name}` : document.name || name,
                source: 'gpx' as const,
                points: track.points
            })
        );
    }

    /**
     * A GeoJSON export from a routing app carries the turn-by-turn data next to
     * the shape, so the manoeuvres come along instead of being asked of
     * Valhalla afterwards.
     */
    function buildGeoJsonRoutes(text: string, name: string): Route[] {
        return parseGeoJson(text, name).map((line) =>
            withManeuverDistances(
                buildRoute({
                    name: line.name,
                    source: 'geojson' as const,
                    points: line.points,
                    maneuvers: line.maneuvers,
                    waypoints: line.waypoints,
                    costing: line.costing
                })
            )
        );
    }

    async function importRouteContent(text: string, name: string) {
        // the extension is only a hint — a dropped file may not have a useful
        // one — so the content decides which reader gets it
        const built = (looksLikeJson(text) ? buildGeoJsonRoutes(text, name) : buildGpxRoutes(text, name)).sort((a, b) => routeLength(b) - routeLength(a));

        const chosen = built[0];
        setActiveRoute(chosen);
        for (const route of built) {
            await persist(route);
        }

        const imported =
            built.length > 1
                ? $_('gpx_imported_multi', { values: { count: built.length, length: formatDistance(routeLength(chosen)) } })
                : $_('gpx_imported', { values: { points: chosen.points.length, length: formatDistance(routeLength(chosen)) } });
        updateStep(0, 'done', chosen.maneuvers?.length ? `${imported} · ${$_('maneuvers_found', { values: { count: chosen.maneuvers.length } })}` : imported);

        // map matching would replace instructions the file already gave us with
        // its own guesses, so it only runs when there are none
        if (settings.autoComputeManeuvers && !chosen.maneuvers?.length) {
            finish();
            await computeManeuvers();
            return;
        }
        finish();
    }

    async function importGpx() {
        startTask($_('import_route'), [{ label: $_('reading_route') }]);
        updateStep(0, 'running');
        try {
            const selected = await openDialog({
                multiple: false,
                filters: [
                    { name: 'GPX / GeoJSON', extensions: ['gpx', 'xml', 'geojson', 'json'] },
                    { name: 'GPX', extensions: ['gpx', 'xml'] },
                    { name: 'GeoJSON', extensions: ['geojson', 'json'] }
                ]
            });
            if (!selected) {
                dismissTask();
                return;
            }
            await importRouteFromPath(selected as string);
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

    /** What the target device still needs, shown next to the Prepare button. */
    let deviceReadiness: string | undefined;

    async function refreshReadiness() {
        deviceReadiness = undefined;
        try {
            const serials = await resolveSerials($store.adbTarget);
            const results = await Promise.all(serials.map(async (serial) => ({ serial, readiness: await checkReadiness(serial) })));
            const blocked = results.filter((entry) => !entry.readiness.ready);
            deviceReadiness = blocked.length === 0 ? $_('device_ready') : blocked.map(({ serial, readiness }) => (serials.length > 1 ? `${serial}: ` : '') + (readiness as any).detail).join(' · ');
        } catch (error) {
            deviceReadiness = errorMessage(error);
        }
    }

    /**
     * One action instead of two buttons: look at what the device is missing and
     * fix exactly that.
     *
     * Installing is only offered when the app is genuinely absent, so the usual
     * case — an app that is there but was never granted anything — never asks
     * for an APK at all.
     */
    async function prepareDevice() {
        let serials: string[];
        try {
            serials = await resolveSerials($store.adbTarget);
        } catch (error) {
            startTask($_('task_prepare_device'), [{ label: errorMessage(error) }]);
            updateStep(0, 'error', errorMessage(error));
            finish();
            return;
        }

        for (const serial of serials) {
            const on = serials.length > 1 ? ` (${serial})` : '';
            const readiness = await checkReadiness(serial);

            if (readiness.ready) {
                startTask($_('task_prepare_device'), [{ label: $_('device_ready') + on }]);
                updateStep(0, 'done');
                finish();
                continue;
            }

            const needsInstall = readiness.reason === 'not-installed';
            const steps = [
                ...(needsInstall ? [{ label: $_('task_fetch_apk_step') + on }, { label: $_('task_install_apk_step') + on }] : []),
                ...setupCommands(serial).map(({ labelKey, command }) => ({ label: $_(labelKey) + on, command })),
                { label: $_('task_verify_device') + on }
            ];
            startTask($_('task_prepare_device'), steps);

            let index = 0;
            if (needsInstall) {
                // The Android build is published alongside this desktop one, so
                // there is nothing for the user to find. It is only fetched the
                // first time; after that the copy on disk is used and preparing
                // a device works with no network at all.
                updateStep(index, 'running');
                let apkPath: string;
                let fromCache = false;
                try {
                    const apk = await invoke<{ path: string; tag: string; downloaded: boolean }>('ensure_helper_apk', { force: false });
                    apkPath = apk.path;
                    fromCache = !apk.downloaded;
                    updateStep(index, 'done', $_(apk.downloaded ? 'apk_downloaded' : 'apk_cached', { values: { tag: apk.tag } }));
                } catch (error) {
                    // a development build has no release to fetch from, so fall
                    // back to an APK the user built themselves
                    const picked = await openDialog({ multiple: false, filters: [{ name: 'APK', extensions: ['apk'] }] });
                    if (!picked) {
                        updateStep(index, 'error', errorMessage(error));
                        finish();
                        return;
                    }
                    apkPath = picked as string;
                    updateStep(index, 'done', $_('apk_from_file', { values: { error: errorMessage(error) } }));
                }
                index += 1;

                updateStep(index, 'running');
                try {
                    updateStep(index, 'done', await invoke<string>('install_apk', { serial, apkPath }));
                } catch (error) {
                    // A cached APK that will not install is worth fetching once
                    // more: the release it came from may have been replaced.
                    let recovered = false;
                    if (fromCache) {
                        try {
                            const fresh = await invoke<{ path: string }>('ensure_helper_apk', { force: true });
                            updateStep(index, 'done', await invoke<string>('install_apk', { serial, apkPath: fresh.path }));
                            recovered = true;
                        } catch {
                            // report the first failure, which is the useful one
                        }
                    }
                    if (!recovered) {
                        updateStep(index, 'error', errorMessage(error));
                        finish();
                        return;
                    }
                }
                index += 1;
            }

            // nothing below opens anything on the device
            for (const { command } of setupCommands(serial)) {
                updateStep(index, 'running');
                const [cmd, ...args] = command.split(' ');
                try {
                    const result = await run(cmd, args);
                    const output = (result.stderr || result.stdout || '').trim();
                    updateStep(index, result.code === 0 ? 'done' : 'error', output || $_('task_exit_code', { values: { code: result.code } }));
                } catch (error) {
                    updateStep(index, 'error', errorMessage(error));
                }
                index += 1;
            }

            updateStep(index, 'running');
            const after = await checkReadiness(serial);
            updateStep(index, after.ready ? 'done' : 'error', after.ready ? $_('device_ready') : after.detail);
            finish();
        }

        await refreshReadiness();
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

    /** One driving step, shared by the keyboard keys and the touch drive pad. */
    function driveStep(bearingDelta: number, fast: boolean) {
        if (!map) {
            return;
        }
        const heading = map.getBearing() + bearingDelta;
        // the step already knows which way it went, and nothing downstream can
        // work that out from one position
        onManualMove(destination(currentPosition, fast ? fastDecaleMeters : slowDecaleMeters, heading), heading);
    }

    function handleHolding(bearingDelta) {
        return function (event) {
            driveStep(bearingDelta, !!event.originalEvent.shiftKey);
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
            transport.toggle();
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

    // there is no menu bar off desktop, and no tauri backend at all under
    // `dev:web`, where subscribing would reject before anything renders
    if (isTauri && isDesktop) {
        listenToMenu();
    }

    function listenToMenu() {
        listen<string>('menu', ({ payload }) => {
            switch (payload) {
                case 'prepare_device':
                    prepareDevice();
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
                    transport.toggle();
                    break;
                case 'stop_playback':
                    transport.stop();
                    break;
                case 'restart_playback':
                    transport.restart();
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
    }

    let dragging = false;
    if (isTauri) {
        listen<{ paths?: string[] }>('tauri://drag-drop', async ({ payload }) => {
            dragging = false;
            const path = payload?.paths?.find((candidate) => /\.(gpx|xml|geojson|json)$/i.test(candidate));
            if (!path) {
                return;
            }
            startTask($_('import_route'), [{ label: path }]);
            updateStep(0, 'running');
            try {
                await importRouteFromPath(path);
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

    let value = '';
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
            addWaypoint(position);
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

    /**
     * "Mocking is on" means two different things: on Android the app itself
     * holds the test providers, everywhere else it is a switch that decides
     * whether fixes get forwarded to an attached device.
     */
    $: mockActive = isSelfMocking ? $mockStatus.mocking : $store.mockEnabled;

    function disableMocking() {
        if (isSelfMocking) {
            stopMocking().catch(reportMockError);
        } else {
            $store.mockEnabled = false;
        }
    }

    function reportMockError(error: unknown) {
        startTask($_('mock_enabled'), [{ label: $_('mock_provider_setup') }]);
        updateStep(0, 'error', errorMessage(error));
        finish();
    }

    function undoWaypoint() {
        waypoints = waypoints.slice(0, -1);
        layers?.setWaypoints(waypoints);
        if (waypoints.length >= 2) {
            scheduleWaypointRoute();
        } else {
            builderPreview = undefined;
            layers?.setRoute(activeRoute);
        }
    }
</script>

<div class="app" class:dragging class:touch={$compact}>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="map" id="map" bind:this={mapContainer} on:pointerdown={collapseSheet} />

    <!-- ---------------------------------------------------------------- *
         pointer shell: icon rail, sliding inspector, docked transport
         ---------------------------------------------------------------- -->
    {#if !$compact}
        <Rail>
            <svelte:fragment slot="top">
                <IconButton icon={Search} label={$_('search_location')} active={searchOpen} on:click={() => (searchOpen = !searchOpen)} />
                <IconButton icon={DocumentImport} label={$_('import_route')} on:click={importGpx} />
                <IconButton icon={Save} label={$_('saved_routes')} on:click={() => refreshLibrary().then(() => (libraryOpen = true))} />
                <IconButton icon={DirectionFork} label={$_('build_route')} active={routeBuilderMode} on:click={() => toggleRouteBuilder()} />
            </svelte:fragment>
            <svelte:fragment slot="bottom">
                {#if mockActive}
                    <IconButton icon={LocationFilled} label={$_('mock_enabled')} active on:click={disableMocking} />
                {/if}
                <IconButton icon={Settings} label={$_('settings')} active={settingsOpen} on:click={() => (settingsOpen = !settingsOpen)} />
            </svelte:fragment>
        </Rail>

        {#if searchOpen}
            <div class="rail-search">
                <SearchBar bind:value {results} placeholder={$_('search_location')} onSelect={onSelectedAddress} />
            </div>
        {/if}

        <Inspector title={$_('settings')} open={settingsOpen} onClose={() => (settingsOpen = false)}>
            <SettingsPanel
                {store}
                defaults={DEFAULT_SETTINGS}
                bind:styleDraft
                bind:darkStyleDraft
                bind:terrainDraft
                busy={$task?.running}
                {selectTerrainPreset}
                {setMapStyle}
                {setDarkMapStyle}
                {patchCostingValues}
                {resetCostingValues}
                {prepareDevice}
                {deviceReadiness}
                onMockError={reportMockError}
                adbDevices={$adbDevices}
                refreshAdbDevices={refreshDevices}
            />
        </Inspector>

        <StatsPanel
            route={activeRoute}
            {snapshot}
            position={currentPosition}
            offRoute={drivingBack ? undefined : offRouteDistance}
            rejoining={drivingBack ? snapshot.detourRemaining : undefined}
            collapsed={$store.statsCollapsed}
            onToggle={() => ($store.statsCollapsed = !$store.statsCollapsed)}
        />
    {/if}

    <!-- ---------------------------------------------------------------- *
         touch shell: floating search pill, map buttons, bottom sheet
         ---------------------------------------------------------------- -->
    {#if $compact}
        <div class="top-bar">
            <SearchBar floating bind:value {results} placeholder={$_('search_location')} onSelect={onSelectedAddress} />
        </div>

        <div class="map-buttons">
            <IconButton icon={MapCenter} label={$_('center_on_position')} on:click={() => userLocationControl?.centerOnLocation()} />
            <IconButton icon={Chart_3D} label={$_('terrain_3d')} active={$store.terrain3d} on:click={() => ($store.terrain3d = !$store.terrain3d)} />
            <IconButton icon={GameConsole} label={$_('manual_driving')} active={padOpen} on:click={() => (padOpen = !padOpen)} />
            <IconButton icon={DirectionFork} label={$_('build_route')} active={routeBuilderMode} on:click={() => toggleRouteBuilder()} />
            <IconButton icon={Location} label={$_('drop_pin')} active={placeMode} on:click={() => (placeMode = !placeMode)} />
        </div>

        {#if padOpen}
            <div class="pad-dock">
                <DrivePad repeatMs={$store.keyRepeatSpeedMs} onStep={driveStep} />
            </div>
        {/if}

        <!-- only up while something is actually being placed: a permanent
             crosshair over the map reads as clutter, not as a tool -->
        {#if placeMode || routeBuilderMode}
            <Reticle label={routeBuilderMode ? $_('add_waypoint') : $_('move_here')} onConfirm={placeAtMapCentre} />
        {/if}
    {/if}

    <!-- ---------------------------------------------------------------- *
         shared: the task log, the route builder bar, the transport
         ---------------------------------------------------------------- -->
    {#if $compact}
        <Sheet bind:detent>
            <svelte:fragment slot="peek">
                {#if $task}
                    <TaskPanel task={$task} onDismiss={dismissTask} />
                {/if}
                {#if routeBuilderMode}
                    <div class="builder-compact">
                        <span class="builder-status">
                            {#if buildingRoute}
                                {$_('computing')}…
                            {:else if builderPreview}
                                {formatDistance(builderLength)} · {builderPreview.maneuvers?.length ?? 0} {$_('maneuvers')}
                            {:else}
                                <!-- the pointer wording talks about clicking and
                                     right-clicking, neither of which exists here -->
                                {$_('build_route_hint_touch')}
                            {/if}
                        </span>
                        <div class="builder-actions">
                            <Button size="small" kind="ghost" disabled={waypoints.length === 0} on:click={undoWaypoint}>{$_('undo')}</Button>
                            <Button size="small" kind="ghost" on:click={() => toggleRouteBuilder(false)}>{$_('cancel')}</Button>
                            <Button size="small" kind="primary" disabled={!builderPreview} on:click={acceptBuiltRoute}>{$_('use_route')}</Button>
                        </div>
                    </div>
                {:else if activeRoute}
                    <PlaybackBar
                        compact
                        route={activeRoute}
                        {snapshot}
                        loop={$store.loopPlayback}
                        onPlayPause={transport.toggle}
                        onStop={transport.stop}
                        onRestart={transport.restart}
                        onSeek={transport.seekFraction}
                        onLoop={(v) => ($store.loopPlayback = v)}
                        onClear={clearRoute}
                    />
                {:else}
                    <div class="empty-peek">
                        <Button size="small" on:click={importGpx}>{$_('import_route')}</Button>
                        <Button size="small" on:click={() => refreshLibrary().then(() => (libraryOpen = true))}>{$_('saved_routes')}</Button>
                        <Button size="small" on:click={() => toggleRouteBuilder(true)}>{$_('build_route')}</Button>
                    </div>
                {/if}
            </svelte:fragment>

            {#if activeRoute}
                <RouteControls
                    compact
                    route={activeRoute}
                    {snapshot}
                    speedMultiplier={$store.speedMultiplier}
                    loop={$store.loopPlayback}
                    computing={computingManeuvers}
                    onSpeedMultiplier={(v) => ($store.speedMultiplier = v)}
                    onLoop={(v) => ($store.loopPlayback = v)}
                    onStop={transport.stop}
                    onRestart={transport.restart}
                    onClear={clearRoute}
                    onFit={() => layers?.fitRoute()}
                    onSave={saveActiveRoute}
                    onComputeManeuvers={computeManeuvers}
                />
                <StatsPanel
                    floating={false}
                    route={activeRoute}
                    {snapshot}
                    position={currentPosition}
                    offRoute={drivingBack ? undefined : offRouteDistance}
                    rejoining={drivingBack ? snapshot.detourRemaining : undefined}
                    collapsed={$store.statsCollapsed}
                    onToggle={() => ($store.statsCollapsed = !$store.statsCollapsed)}
                />
            {/if}

            {#if routeBuilderMode}
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
            {/if}

            <SettingsPanel
                {store}
                defaults={DEFAULT_SETTINGS}
                bind:styleDraft
                bind:darkStyleDraft
                bind:terrainDraft
                busy={$task?.running}
                {selectTerrainPreset}
                {setMapStyle}
                {setDarkMapStyle}
                {patchCostingValues}
                {resetCostingValues}
                {prepareDevice}
                {deviceReadiness}
                onMockError={reportMockError}
                adbDevices={$adbDevices}
                refreshAdbDevices={refreshDevices}
            />
        </Sheet>
    {:else}
        <!-- one dock so the builder and the transport bar stack against the
             bottom edge instead of each guessing the other's height -->
        <div class="bottom-dock">
            {#if $task}
                <TaskPanel task={$task} onDismiss={dismissTask} />
            {/if}

            {#if routeBuilderMode}
                {#if $store.builderOptionsOpen}
                    <div class="panel">
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
                <div class="panel builder">
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
                        <Button size="small" kind="ghost" disabled={waypoints.length === 0} on:click={undoWaypoint}>{$_('undo')}</Button>
                        <Button size="small" kind="ghost" on:click={() => toggleRouteBuilder(false)}>{$_('cancel')}</Button>
                        <Button size="small" kind="primary" disabled={!builderPreview} on:click={acceptBuiltRoute}>{$_('use_route')}</Button>
                    </div>
                </div>
            {/if}

            {#if activeRoute}
                <div class="panel">
                    <RouteControls
                        route={activeRoute}
                        {snapshot}
                        speedMultiplier={$store.speedMultiplier}
                        loop={$store.loopPlayback}
                        computing={computingManeuvers}
                        onSpeedMultiplier={(v) => ($store.speedMultiplier = v)}
                        onLoop={(v) => ($store.loopPlayback = v)}
                        onStop={transport.stop}
                        onRestart={transport.restart}
                        onClear={clearRoute}
                        onFit={() => layers?.fitRoute()}
                        onSave={saveActiveRoute}
                        onComputeManeuvers={computeManeuvers}
                    />
                    <PlaybackBar
                        route={activeRoute}
                        {snapshot}
                        loop={$store.loopPlayback}
                        onPlayPause={transport.toggle}
                        onStop={transport.stop}
                        onRestart={transport.restart}
                        onSeek={transport.seekFraction}
                        onLoop={(v) => ($store.loopPlayback = v)}
                        onClear={clearRoute}
                    />
                </div>
            {/if}
        </div>
    {/if}

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

<style>
    /* The map is the page. Everything else floats over it, which is what lets
       the same panels be a rail and an inspector on one shell and a sheet on
       the other without either owning a band of layout. */
    .app {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .map {
        position: absolute;
        inset: 0;
    }

    /* ---- pointer shell ------------------------------------------------ */

    .rail-search {
        position: absolute;
        top: 8px;
        left: 68px;
        z-index: 31;
        width: 320px;
    }

    /* Everything pinned to the bottom lives in one column, so panels stack
       against the edge instead of each hard-coding the other's height. */
    .bottom-dock {
        position: absolute;
        left: 50%;
        bottom: 12px;
        z-index: 27;
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
    .panel {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px 14px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow);
    }

    /* ---- touch shell -------------------------------------------------- */

    .top-bar {
        position: absolute;
        top: calc(8px + var(--safe-top));
        left: calc(8px + var(--safe-left));
        right: calc(8px + var(--safe-right));
        z-index: 31;
    }

    .map-buttons {
        position: absolute;
        /* clear of the search pill above and the sheet below */
        top: calc(60px + var(--safe-top));
        right: calc(8px + var(--safe-right));
        z-index: 30;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 4px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow);
    }

    .pad-dock {
        position: absolute;
        left: calc(8px + var(--safe-left));
        /* above the sheet's peek detent */
        bottom: calc(150px + var(--safe-bottom));
        z-index: 30;
    }

    .empty-peek {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 4px 0;
    }

    .builder-compact {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 4px 0;
    }

    /* ---- route builder ------------------------------------------------ */

    .builder {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        border-color: var(--accent);
    }
    .builder-text {
        display: flex;
        min-width: 0;
        flex-direction: column;
        font-size: 12px;
    }
    .builder-status {
        color: var(--text-muted);
        font-size: 11px;
    }
    .builder-actions {
        display: flex;
        flex-shrink: 0;
        flex-wrap: wrap;
        gap: 4px;
    }
    .builder-options-toggle {
        display: flex;
        align-items: center;
        gap: 5px;
        min-height: calc(var(--control-h) - 6px);
        padding: 0 8px;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        background: transparent;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 11px;
    }
    .builder-options-toggle:hover,
    .builder-options-toggle.open {
        border-color: var(--accent);
        color: var(--text);
    }

    .drop-overlay {
        position: absolute;
        inset: 0;
        z-index: 70;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--accent-soft);
        border: 3px dashed var(--accent);
        color: var(--text);
        font-size: 20px;
        font-weight: 500;
        pointer-events: none;
    }
</style>
