<script lang="ts">
    import format from '@fragaria/address-formatter';
    import { invoke } from '@tauri-apps/api';
    import { listen } from '@tauri-apps/api/event';
    import { Command, open } from '@tauri-apps/api/shell';
    import { Checkbox, Content, Header, HeaderAction, HeaderSearch, HeaderUtilities, SkipToContent, Slider, TextInput, HeaderPanelDivider } from 'carbon-components-svelte';
    import { diff } from 'deep-object-diff';
    import { Map, Marker, NavigationControl } from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { settings as defaultSettings } from '../geo-three/webapp/settings';
    import MapboxGLButtonControl from './MapboxGLButtonControl';
    let webapp;

    let drawerOpened = false;
    let fullMap = false;

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

    function getAddressLabel(obj) {
        if (!obj) {
            return '';
        }
        const { type, osm_id, osm_value, osm_key, osm_type, extent, ...toFormat } = obj.properties;
        toFormat.country_code=toFormat.countrycode;
        delete toFormat.countrycode;
        const res= (format.format(toFormat, { output: 'string', fallbackCountryCode: 'FR' } as any) as string).split('\n');
        return  {
            text:res[0],
            description:res.slice(1).join(' ')
        }
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
    let settings = {
        ...(localStorage.getItem('settings')
            ? JSON.parse(localStorage.getItem('settings'))
            : {
                  ...defaultSettings,
                  far: 50000,
                  near: 1,
                  dark: false,
                  shadows: false,
                  outline: false,
                  mapMap: true,
                  debug: false,
                  readFeatures: false,
                  maxZoomForPeaks: 0,
                  exageration: 1.3,
                  stickToGround: false,
                  setPosition: { lat: 45.19776, lon: 5.73178 },
                  elevation: 270
              }),
        rasterProviderZoomDelta: 0,
        flipRasterImages: false
    };
    const store = writable(JSON.parse(JSON.stringify(settings)));
    store.subscribe((v) => {
        const res = diff(settings, v);
        if (res.hasOwnProperty('local')) {
            res['heightMaxZoom'] = res['local'] ? 12 : 15;
            res['terrarium'] = !res['local'];
            res['heightMinZoom'] = 5;
        }
        webapp && webapp.callMethods(res);
    });
    function onSettingsChanged(key, value) {
        settings[key] = value;
        if ($store[key] !== value) {
            $store[key] = value;
        }
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    let map: Map;
    let mapContainer;
    let mapPositionMarker: Marker;

    function setFullMap(value) {
        fullMap = value;
        setTimeout(() => {
            map.resize();
        }, 10);
    }

    onMount(async () => {
        try {
            webapp = await import('../geo-three/webapp/app');
            webapp.callMethods(settings);

            webapp.setUpdateExternalPositionListener(sendPositionToEmulators);
            webapp.setOnSettingsChangedListener(onSettingsChanged);
            webapp.setUpdateExternalPositionThrottleTime(1000);
            webapp.setKeyboardMoveSpeed(0.3);
            const position = settings['setPosition'];
            map = new Map({
                container: mapContainer,
                style: {
                    version: 8,
                    sources: {
                        'raster-tiles': {
                            type: 'raster',
                            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                            tileSize: 256,
                            minzoom: 0,
                            maxzoom: 18,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    },
                    layers: [
                        {
                            id: 'simple-tiles',
                            type: 'raster',
                            source: 'raster-tiles'
                        }
                    ]
                },
                center: position,
                zoom: 14
            });
            const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            iconSvg.setAttribute('viewBox', '-4 -4 40 40');
            iconSvg.setAttribute('stroke', 'black');
            const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            iconPath.setAttribute('d', 'M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z');
            iconSvg.appendChild(iconPath);
            const myCustomControl = new MapboxGLButtonControl({
                title: 'Fullscreen mode',
                eventHandler: (event) => {
                    event.stopPropagation();
                    setFullMap(!fullMap);
                },
                icon: iconSvg
            });

            map.addControl(myCustomControl);
            map.addControl(
                new NavigationControl({
                    showCompass: false,
                    showZoom: true
                })
            );
            map.on('click', function (e) {
                // The event object (e) contains information like the
                // coordinates of the point on the map that was clicked.
                if (fullMap) {
                    webapp && webapp.setPosition({ lat: e.lngLat.lat, lon: e.lngLat.lng });
                }
            });
            mapPositionMarker = new Marker().setLngLat(position).addTo(map);
        } catch (error) {
            console.error(error);
        }
    });

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
    async function sendPositionToEmulators(position) {
        sendPositionToIOSSimulators(position);
        sendPositionToAndroidEmulators(position);
    }
    async function sendPositionToIOSSimulators(position) {
        let result = await exec('xcrun', ['simctl', 'list', '-j', 'devices']);
        const data = JSON.parse(result);
        const devices = Object.values<any[]>(data.devices)
            .flat()
            .filter((d) => d.state === 'Booted')
            .map((v) => v.udid);
        return invoke('send_location_to_simulators', { ...position, devices });
    }
    async function sendPositionToAndroidEmulators(position) {
        mapPositionMarker && mapPositionMarker.setLngLat(position);
        map && map.setCenter(position);
        const args = ['shell', 'am', 'startservice', '-e', 'longitude', position.lon + '', '-e', 'latitude', position.lat + '', 'io.appium.settings/.LocationService'];
        try {
            await spawn('adb', args);
        } catch (error) {
            console.error(error);
        }
    }
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
            ... getAddressLabel(r),
            data: r
        }));
    }
    const searchText = debounce(actualSearchText, 500);

    $: lowerCaseValue = value.toLowerCase();
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
            webapp?.setPosition({
                lat: geometry.coordinates[1],
                lon: geometry.coordinates[0]
            });
        }
    }

</script>

<div class="drawer-container">
    <Header company="GPS" platformName="Mocker" bind:isSideNavOpen={drawerOpened}>
        <svelte:fragment slot="skip-to-content">
            <SkipToContent />
        </svelte:fragment>
        <HeaderUtilities>
            <HeaderSearch id="search-btn" bind:active bind:value bind:selectedResultIndex placeholder="Search location" {results} />
            <HeaderAction bind:isOpen={drawerOpened}>
                <div class="drawer-content">
                    <h3>Settings</h3>
                    <Checkbox bind:checked={$store.local} labelText="Local data" disabled={!$store.localURL || $store.localURL.length === 0} />

                    <TextInput bind:value={$store.localURL} label="Local Host URL" autocomplete="off" spellcheck="false" autocorrect="off" helperText="Host URL for local data (tileserver-gl)" />
                    <HeaderPanelDivider />
                    <Checkbox bind:checked={$store.mapMap} labelText="Map Mode" />
                    <Checkbox bind:checked={$store.dark} labelText="Dark Mode" />
                    <Checkbox bind:checked={$store.outline} labelText="Map Outline" />
                    <HeaderPanelDivider />
                    <Slider bind:value={$store.far} min={0} max={400000} step={1} labelText="Viewing Distance" maxLabel="400km" hideTextInput />
                    <Slider bind:value={$store.exageration} min={0} max={4} step={0.01} labelText="Exageration" hideTextInput />
                    <Slider bind:value={$store.outlineStroke} min={0} max={10} step={0.01} labelText="Outline Stroke Width" hideTextInput />
                    <Slider bind:value={$store.elevation} min={0} max={9000} labelText="Elevation" maxLabel="9000m" hideTextInput />
                    <!-- <SliderComponent title="Time of Day" min="0" max="86400" step="1" bind:value={$store.secondsInDay} labelId="secondsInDayLabel" /> -->
                </div>
            </HeaderAction>
        </HeaderUtilities>
    </Header>

    <Content id="app-content">
        <video id="video" autoplay playsinline>
            <track kind="captions" />
        </video>
        <canvas id="canvas" style="background-color: transparent; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%" />
        <canvas id="canvas4" style="position: absolute; pointer-events: none; top: 0px; left: 0px; width: 100%; height: 100%" />

        <div
            style="width:100%;height:100%;display:flex; pointer-events:none;"
            on:click={() => {
                if (!fullMap) {
                    setFullMap(true);
                }
            }}
        >
            <div
                style:pointer-events="auto"
                class="map"
                id="map"
                bind:this={mapContainer}
                style:width={fullMap ? '100%' : '24%'}
                style:height={fullMap ? '100%' : '24%'}
                style="align-self:flex-end;margin: 0px;"
            />
        </div>

        <div id="compass" on:click={() => webapp?.setAzimuth(0)}>
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m192.265625 8.027344c-89.882813 23.144531-161.09375 94.351562-184.238281 184.234375l29.0625 7.472656c20.40625-79.292969 83.355468-142.242187 162.644531-162.644531zm0 0" />
                <path
                    d="m474.910156 199.734375 29.0625-7.472656c-23.144531-89.882813-94.355468-161.089844-184.238281-184.234375l-7.46875 29.0625c79.292969 20.402344 142.238281 83.351562 162.644531 162.644531zm0 0"
                />
                <path d="m319.734375 503.957031c89.882813-23.132812 161.09375-94.324219 184.238281-184.222656l-29.0625-7.472656c-20.40625 79.308593-83.355468 142.242187-162.648437 162.632812zm0 0" />
                <path
                    d="m37.089844 312.261719-29.0625 7.472656c23.144531 89.898437 94.355468 161.09375 184.238281 184.222656l7.46875-29.0625c-79.292969-20.390625-142.238281-83.324219-162.644531-162.632812zm0 0"
                />
                <path d="m256 210.996094c-24.8125 0-45 20.1875-45 45 0 24.816406 20.1875 45 45 45s45-20.183594 45-45c0-24.8125-20.1875-45-45-45zm15 60h-30v-30h30zm0 0" />
                <path
                    d="m256 0-57.613281 198.386719-198.386719 57.609375 198.386719 57.601562 57.613281 198.402344 57.613281-198.402344 198.386719-57.601562-198.386719-57.609375zm0 330.996094c-41.351562 0-75-33.644532-75-75 0-41.351563 33.648438-75 75-75s75 33.648437 75 75c0 41.355468-33.648438 75-75 75zm0 0"
                />
                <path d="m369.097656 183.339844 40.449219-80.886719-80.890625 40.4375 9.140625 31.3125zm0 0" />
                <path d="m337.796875 337.796875-9.136719 31.304687 80.886719 40.441407-40.449219-80.882813zm0 0" />
                <path d="m142.902344 328.660156-40.449219 80.882813 80.886719-40.445313-9.136719-31.300781zm0 0" />
                <path d="m174.203125 174.203125 9.140625-31.3125-80.890625-40.4375 40.449219 80.886719zm0 0" />
            </svg>
            <div id="compass_slice" />
        </div>
        <label id="compass_label" />
    </Content>
</div>
