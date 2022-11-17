<script lang="ts">
    import addressFormatter from '@fragaria/address-formatter';
    import MapLibreGlDirections, { LoadingIndicatorControl } from '@maplibre/maplibre-gl-directions';
    import { invoke, os } from '@tauri-apps/api';
    import { listen } from '@tauri-apps/api/event';
    import { Command, open } from '@tauri-apps/api/shell';
    import { Checkbox, Content, Header, HeaderAction, HeaderGlobalAction, HeaderPanelDivider, HeaderSearch, HeaderUtilities, SkipToContent, Slider, TextInput } from 'carbon-components-svelte';
    import { KeyboardKeyHold } from 'hold-event';
    import { RulerControl } from 'mapbox-gl-controls';
    import { Map, NavigationControl, TerrainControl } from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { writable } from 'svelte/store';
    import MapboxGLButtonControl from './MapboxGLButtonControl';
    import UserLocationControl from './UserLocationControl';
    import LocationFilled from 'carbon-icons-svelte/lib/LocationFilled.svelte';
    let userLocationControl: UserLocationControl;
    let osType;
    async function getOs() {
        if (!osType) {
            const value = await os.type();
            switch (value) {
                case 'Linux':
                    osType = 'linux';
                    break;
                case 'Windows_NT':
                    osType = 'windows';
                    break;
                case 'Darwin':
                    osType = 'darwin';
                    break;
                default:
                    osType = 'unknown';
                    break;
            }
        }
        return osType;
    }

    let drawerOpened = false;
    // let fullMap = false;

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate = false) {
        var timeout;
        return function (...args) {
            var later = function () {
                timeout = null;
                if (!immediate) func(...args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    function throttle(fn, delay) {
        let lastCalled = 0;
        return (...args) => {
            const now = new Date().getTime();
            if (now - lastCalled < delay) {
                return;
            }
            lastCalled = now;
            return fn(...args);
        };
    }

    function getAddressLabel(obj) {
        if (!obj) {
            return '';
        }
        const { type, osm_id, osm_value, osm_key, osm_type, extent, ...toFormat } = obj.properties;
        toFormat.country_code = toFormat.countrycode;
        delete toFormat.countrycode;
        const res = (addressFormatter.format(toFormat, { output: 'string', fallbackCountryCode: 'FR' } as any) as string).split('\n');
        return {
            text: res[0],
            description: res.slice(1).join(' ')
        };
    }
    async function queryAddress(query: string) {
        if (!query || query.length === 0) {
            return null;
        }
        return fetch(`https://photon.komoot.io/api?q=${query}`)
            .then((data) => data.json())
            .then((data) => data.features.filter((r) => r.properties.osm_type !== 'R'))
            .catch((e) => console.error(e));
    }
    // localStorage.clear();
    const DEFAULT_SETTINGS = {
        position: { lat: 45.1811, lon: 5.8141 },
        androidEmulators: true,
        iosSimulators: true,
        iosDevices: true,
        speedInKm: 90,
        keyRepeatSpeedMs: 16.6,
        mapStyle: 'https://api.maptiler.com/maps/streets/style.json?key=tEP4ZtWVB93CfqyCnbR0',
        terrainDataUrl: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
        terrainDataTerrarium: true,
        mockEnabled: false
    };
    let settings = {
        ...(localStorage.getItem('settings') ? {...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('settings'))} : DEFAULT_SETTINGS),
        iosSimulatorsSupported: false
    };
    console.log('settings', settings)
    if (!settings.hasOwnProperty('position')) {
        settings = DEFAULT_SETTINGS;
    }
    const store = writable(settings);
    function onSettingsChanged() {
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    store.subscribe(onSettingsChanged);
    getOs().then((r) => {
        $store.iosSimulatorsSupported = r === 'darwin';
    });
    let map: Map;
    let mapContainer;
    let terrainControlAdded = false;
    async function setTerrainSource(url, terrarium: boolean) {
        console.log('setTerrainSource', url, new Error().stack);
        if (!map || !url) {
            return;
        }
        let maxzoom;
        if (url.endsWith('.json')) {
            const jsonData = await fetch(url).then((data) => data.json());
            url = jsonData.tiles[0];
            maxzoom = jsonData.maxzoom;
            console.log('jsonData', maxzoom, url, jsonData);
        }
        if (!map.loaded) {
            map.once('load', () => setTerrainSource(url, terrarium));
            return;
        }
        console.log('setTerrainSource', url, terrarium);
        try {
            map.removeSource('terrainSource');
        } catch (err) {}
        try {
            map.addSource('terrainSource', {
                type: 'raster-dem',
                encoding: terrarium ? 'terrarium' : 'mapbox',
                tiles: [url],
                maxzoom,
                tileSize: 256
            });
            // try {
            //     map.removeLayer('hills');
            // } catch (err) {}
            // map.addLayer({
            //     id: 'hills',
            //     type: 'hillshade',
            //     source: 'terrainSource',
            //     layout: { visibility: 'visible' },
            //     paint: {
            //         'hillshade-accent-color': '#473B24',
            //         'hillshade-exaggeration': 0.2,
            //     }
            // });
            if (!terrainControlAdded) {
                terrainControlAdded = true;
                map.addControl(
                    new TerrainControl({
                        source: 'terrainSource',
                        exaggeration: 1
                    })
                );
            }
        } catch (err) {
            console.error(err);
        }
    }
    let shouldMoveOnClick = true;
    let directions;
    onMount(async () => {
        try {
            function easing(t) {
                return t * (2 - t);
            }
            const position = settings['position'];
            map = new Map({
                container: mapContainer,

                style: $store.customMapStyleUrl && $store.customMapStyle ? $store.customMapStyleUrl : $store.mapStyle,
                center: position,
                zoom: 14,
                maxPitch: 85
            });
            map.on('load', () => {
                // map.addSource('raster-tiles', {
                //     type: 'raster',
                //     tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                //     tileSize: 256
                // });
                // map.addLayer({
                //     id: 'simple-tiles',
                //     type: 'raster',
                //     source: 'raster-tiles',
                //     layout: {
                //         visibility: 'visible'
                //     }
                // });
                directions = new MapLibreGlDirections(map, {
                    requestOptions: {
                        alternatives: 'true'
                    }
                });
                // Optionally add the standard loading-indicator control
                map.addControl(new LoadingIndicatorControl(directions));
                if ($store.customTerrainDataUrl && $store.customTerrainData) {
                    setTerrainSource($store.customTerrainDataUrl, $store.terrainDataTerrarium);
                } else {
                    setTerrainSource($store.terrainDataUrl, $store.terrainDataTerrarium);
                }
            });
            // const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            // iconSvg.setAttribute('viewBox', '-4 -4 40 40');
            // iconSvg.setAttribute('stroke', 'black');
            // const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            // iconPath.setAttribute('d', 'M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z');
            // iconSvg.appendChild(iconPath);
            const myCustomControl = new MapboxGLButtonControl({
                className: 'maplibregl-ctrl-geolocate',
                title: 'Fullscreen mode',
                eventHandler: (event) => {
                    event.stopPropagation();
                    userLocationControl.centerOnLocation();
                }
                // icon: iconSvg
            });

            userLocationControl = new UserLocationControl({ trackUserLocation: true });
            map.addControl(userLocationControl);
            map.on('click', function (e) {
                if (shouldMoveOnClick && !directionsMode) {
                    setPosition({ lat: e.lngLat.lat, lon: e.lngLat.lng });
                }
            });

            setPosition(position);

            map.addControl(
                new NavigationControl({
                    visualizePitch: true,
                    showZoom: true,
                    showCompass: true
                })
            );

            map.addControl(myCustomControl);

            map.addControl(new RulerControl({}), 'top-right');

            map.on('ruler.on', () => (shouldMoveOnClick = false));
            map.on('ruler.off', () => (shouldMoveOnClick = true));
        } catch (error) {
            console.error(error);
        }
    });

    $: {
        if ($store.customTerrainDataUrl && $store.customTerrainData) {
            setTerrainSource($store.customTerrainDataUrl, $store.terrainDataTerrarium);
        } else {
            setTerrainSource($store.terrainDataUrl, $store.terrainDataTerrarium);
        }
    }
    $: {
        if (map) {
            if ($store.customMapStyleUrl && $store.customMapStyle) {
                map.setStyle($store.customMapStyleUrl);
            } else {
                map.setStyle($store.mapStyle);
            }
        }
    }
    function bearingDistance({ lat, lon }, radius, bearing) {
        const lat1Rads = toRad(lat);
        const lon1Rads = toRad(lon);
        const R_M = 6371000; // radius in M
        const d = radius / R_M; //angular distance on earth's surface

        const bearingRads = toRad(bearing);
        const lat2Rads = Math.asin(Math.sin(lat1Rads) * Math.cos(d) + Math.cos(lat1Rads) * Math.sin(d) * Math.cos(bearingRads));

        const lon2Rads = lon1Rads + Math.atan2(Math.sin(bearingRads) * Math.sin(d) * Math.cos(lat1Rads), Math.cos(d) - Math.sin(lat1Rads) * Math.sin(lat2Rads));

        return {
            lat: toDeg(lat2Rads),
            lon: toDeg(lon2Rads)
        };
    }

    function toRad(degrees) {
        return (degrees * Math.PI) / 180;
    }

    function toDeg(radians) {
        return (radians * 180) / Math.PI;
    }

    const KEYCODE = {
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        Q: 81,
        E: 69,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };
    const wKey = new KeyboardKeyHold(KEYCODE.W, $store.keyRepeatSpeedMs);
    const aKey = new KeyboardKeyHold(KEYCODE.A, $store.keyRepeatSpeedMs);
    const sKey = new KeyboardKeyHold(KEYCODE.S, $store.keyRepeatSpeedMs);
    const dKey = new KeyboardKeyHold(KEYCODE.D, $store.keyRepeatSpeedMs);

    let slowDecaleMeters = 1;
    let fastDecaleMeters = 10;

    function setSpeed(_speedInKmh, _keyRepeatSpeedMs) {
        slowDecaleMeters = (_speedInKmh / 3600) * _keyRepeatSpeedMs;
        fastDecaleMeters = slowDecaleMeters * 10;
    }
    $: setSpeed($store.speedInKm, $store.keyRepeatSpeedMs);
    $: {
        wKey.holdIntervalDelay = $store.keyRepeatSpeedMs;
        aKey.holdIntervalDelay = $store.keyRepeatSpeedMs;
        sKey.holdIntervalDelay = $store.keyRepeatSpeedMs;
        dKey.holdIntervalDelay = $store.keyRepeatSpeedMs;
    }

    function handleHolding(bearingDelta) {
        return function (event) {
            console.log('handleHolding', bearingDelta, slowDecaleMeters, fastDecaleMeters, $store.keyRepeatSpeedMs);
            let bearing = map.getBearing() + bearingDelta;
            const delta = event.originalEvent.shiftKey ? fastDecaleMeters : slowDecaleMeters;
            setPosition(bearingDistance(userLocationControl.currentPosition, delta, bearing));
        };
    }
    aKey.addEventListener('holding', handleHolding(270));
    dKey.addEventListener('holding', handleHolding(90));
    wKey.addEventListener('holding', handleHolding(0));
    sKey.addEventListener('holding', handleHolding(180));

    let directionsMode = false;
    addEventListener(
        'keydown',
        (event) => {
            console.log('keydown', event);
            if (event.key !== 'Tab') {
                const ele = event.composedPath()[0];
                const isInput = ele instanceof HTMLInputElement || ele instanceof HTMLTextAreaElement;
                if (!ele || !isInput || event.key === 'Escape') {
                    event.preventDefault();
                }
            }
            if (event.key === 'Control') {
                directionsMode = directions.interactive = true;
            }
        }
        //     { capture: true }
    );
    addEventListener(
        'keyup',
        (event) => {
            if (event.key === 'Control') {
                directionsMode = directions.interactive = false;
            }
        }
        //     { capture: true }
    );
    async function spawn(cmd, args, cwd?) {
        const command = new Command(cmd, args, { cwd: cwd });
        command.on('error', (error) => console.error(`command error: "${error}"`));
        return command.spawn();
    }
    async function exec(cmd, args, cwd?) {
        return new Promise<string>((resolve, reject) => {
            const command = new Command(cmd, args, { cwd: cwd });
            let result = '';
            command.on('error', reject);
            command.stdout.on('data', (line) => (result += line));
            command.on('close', () => {
                resolve(result);
            });
            return command.spawn();
        });
    }

    async function installApk() {
        let result = false;
        try {
            result = await invoke('install_apk');
        } catch (error) {
            console.error(error);
        }
        return result;
    }
    async function setupAdb() {
        const commands = [
            'adb shell pm grant io.appium.settings android.permission.READ_PHONE_STATE',
            'adb shell pm grant io.appium.settings android.permission.WRITE_SETTINGS',
            'adb shell pm grant io.appium.settings android.permission.ACCESS_FINE_LOCATION',
            'adb shell pm grant io.appium.settings android.permission.ACCESS_FINE_LOCATION',
            'adb shell pm grant io.appium.settings android.permission.ACCESS_COARSE_LOCATION',
            'adb shell pm grant io.appium.settings android.permission.ACCESS_MOCK_LOCATION',
            'adb shell pm grant io.appium.settings android.permission.SET_ANIMATION_SCALE',
            'adb shell pm grant io.appium.settings android.permission.CHANGE_CONFIGURATION',
            'adb shell am start -W -n io.appium.settings/.Settings -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -f 0x10200000',
            'adb shell appops set io.appium.settings android:mock_location allow'
        ];
        for (let index = 0; index < commands.length; index++) {
            const array = commands[index].split(' ');
            await spawn(array[0], array.slice(1));
        }
    }

    const saveCurrentMockPosition = throttle((position) => {
        $store.osition = position;
    }, 3000);
    async function setPosition(position, forceCenter = false) {
        if (!position) {
            return;
        }
        if (!$store.mockEnabled) {
            if (forceCenter) {
                map.flyTo({
                    center: [position.lon, position.lat],
                    zoom: 18,
                    maxDuration: 500,
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                });
            }
            return;
        }
        userLocationControl.updatePosition(position, forceCenter);
        if (settings.iosSimulatorsSupported && settings.iosSimulators) {
            sendPositionToIOSSimulators(position);
        }
        if (settings.iosDevices) {
            sendPositionToIOSDevices(position);
        }
        if (settings.androidEmulators) {
            sendPositionToAndroidEmulators(position);
        }
        saveCurrentMockPosition(position);
    }

    let simDevices = [];
    let lastSimDevicesCall;
    async function detectSimDevices() {
        let now = Date.now();
        if (!lastSimDevicesCall || now - lastSimDevicesCall >= 5000) {
            lastSimDevicesCall = now;
            let result = await exec('xcrun', ['simctl', 'list', '-j', 'devices']);
            const data = JSON.parse(result);
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
            await invoke('send_location_to_simulators', { ...position, devices });
        } catch (error) {
            console.error(error);
        }
    }, 300);
    const sendPositionToIOSDevices = throttle(async (position) => {
        try {
            await invoke('send_location_to_devices', { ...position });
        } catch (error) {
            console.error(error);
        }
    }, 300);
    const sendPositionToAndroidEmulators = throttle(async (position) => {
        userLocationControl.updatePosition(position);
        const args = ['shell', 'am', 'startservice', '-e', 'longitude', position.lon + '', '-e', 'latitude', position.lat + '', 'io.appium.settings/.LocationService'];
        try {
            await spawn('adb', args);
        } catch (error) {
            console.error(error);
        }
    }, 200);
    listen<string>('tauri://menu', ({ payload }) => {
        // console.log('on menu', payload);
        switch (payload) {
            case 'setup':
                setupAdb();
                break;
            case 'install_apk':
                installApk();
                break;
            case 'learn_more':
                open(REPO_URL);
                break;
        }
    });

    let ref = null;
    let active = false;
    let value = '';
    let selectedResultIndex = -1;
    // let events = [];
    let results = [];

    async function actualSearchText(query: string) {
        if (!query || query.length === 0) {
            results = [];
            return;
        }
        const osmRes = await queryAddress(query);
        results = osmRes.map((r) => ({
            ...getAddressLabel(r),
            data: r
        }));
    }
    const searchText = debounce(actualSearchText, 500);

    $: searchText(value);

    $: onSelectedAddress(selectedResultIndex);

    $: if (results.length === 0) selectedResultIndex = -1;

    function onSelectedAddress(index) {
        if (index < 0 || results.length < index + 1) {
            return;
        }
        const selectedAddress = results[index].data;
        const geometry = selectedAddress.geometry;
        if (geometry.type === 'Point') {
            setPosition(
                {
                    lat: geometry.coordinates[1],
                    lon: geometry.coordinates[0]
                },
                true
            );
        }
    }
</script>

<div class="drawer-container">
    <Header company="GPS" platformName="Mocker" bind:isSideNavOpen={drawerOpened}>
        <svelte:fragment slot="skip-to-content">
            <SkipToContent />
        </svelte:fragment>
        <HeaderUtilities>
            <HeaderSearch id="search-btn" bind:active bind:value bind:selectedResultIndex placeholder={$_('search_location')} {results} />
            {#if $store.mockEnabled}
                <HeaderGlobalAction aria-label="Mock" icon={LocationFilled} on:click={() => ($store.mockEnabled = false)} />
            {/if}
            <HeaderAction bind:isOpen={drawerOpened}>
                <div class="drawer-content">
                    <h3>Settings</h3>

                    <Checkbox bind:checked={$store.customMapStyle} labelText={$_('local_data')} disabled={!$store.customMapStyleUrl || $store.customMapStyleUrl.length === 0} />
                    <TextInput
                        bind:value={$store.customMapStyleUrl}
                        label={$_('mapstyle_url')}
                        autocomplete="off"
                        spellcheck="false"
                        autocorrect="off"
                        helperText="Host URL for local data (tileserver-gl)"
                    />

                    <Checkbox bind:checked={$store.terrainDataTerrarium} labelText={$_('terrain_terrarium')} />
                    <Checkbox bind:checked={$store.customTerrainData} labelText={$_('local_data')} disabled={!$store.customTerrainDataUrl || $store.customTerrainDataUrl.length === 0} />
                    <TextInput
                        bind:value={$store.customTerrainDataUrl}
                        label={$_('terrain_data_url')}
                        autocomplete="off"
                        spellcheck="false"
                        autocorrect="off"
                        helperText="Host URL for custom terrain data (tileserver-gl)"
                    />
                    <HeaderPanelDivider />
                    <Checkbox bind:checked={$store.mockEnabled} labelText={$_('mock_enabled')} />
                    <Checkbox bind:checked={$store.androidEmulators} labelText={$_('android_emulators')} />
                    <Checkbox bind:checked={$store.iosDevices} labelText={$_('ios_devices')} />
                    {#if $store.iosSimulatorsSupported}
                        <Checkbox bind:checked={$store.iosSimulators} labelText={$_('ios_simulators')} />
                    {/if}
                    <HeaderPanelDivider />
                    <Slider hideTextInput bind:value={$store.speedInKm} min={1} max={600} step={1} labelText={`${$_('speed')}:${$store.speedInKm} km/h`} />
                    <Slider hideTextInput bind:value={$store.keyRepeatSpeedMs} min={10} max={5000} step={1} labelText={`${$_('keyRepeatSpeedMs')}:${$store.keyRepeatSpeedMs} ms`} />
                </div>
            </HeaderAction>
        </HeaderUtilities>
    </Header>

    <Content id="app-content">
        <div style:pointer-events="auto" class="mapfull" id="map" bind:this={mapContainer} style="align-self:flex-end;margin: 0px;" />
    </Content>
</div>
