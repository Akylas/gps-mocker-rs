<script lang="ts">
  import { onMount } from 'svelte';
  import { invoke } from '@tauri-apps/api';
  import { Command } from '@tauri-apps/api/shell';
  import { listen } from '@tauri-apps/api/event';
  import { format } from '@fragaria/address-formatter';
  import Autocomplete from './components/Autocomplete.svelte';
  import Drawer, { AppContent, Content, Header, Title, Subtitle, Scrim } from '@smui/drawer';
  import { Text } from '@smui/list';
  import Slider from '@smui/slider';
  import CircularProgress from '@smui/circular-progress';
  import 'svelte-material-ui/bare.css';
  import { Map } from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  let webapp;

  let drawerOpened = false;

  let selectedAddress;
  let selectedAddressLabel;
  $: {
    console.log('selectedAddress', selectedAddress);
    if (selectedAddress) {
      selectedAddressLabel = getAddressLabel(selectedAddress);
      const geometry = selectedAddress.geometry;
      if (geometry.type === 'Point') {
        webapp?.setPosition({
          lat: geometry.coordinates[1],
          lon: geometry.coordinates[0],
        });
      }
    }
    selectedAddressLabel = null;
  }

  function getAddressLabel(obj) {
    if (!obj) {
      return '';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, osm_id, osm_value, osm_key, osm_type, extent, ...toFormat } = obj.properties;
    return (
      format(toFormat, { output: 'array', fallbackCountryCode: 'FR' } as any) as string[]
    ).join(' ');
    // return obj.name;
  }
  async function queryAddress(query: string) {
    console.log('queryAddress', query);
    if (!query || query === selectedAddressLabel) {
      return null;
    }
    return fetch(`https://photon.komoot.io/api?q=${query}`)
      .then((data) => data.json())
      .then((data) => {
        return data.features.filter((r) => r.properties.osm_type !== 'R');
        // .map((d) => {
        //   const { properties } = d;
        //   // const name = formatAddress(properties);
        //   return { name, value: d };
        // });
      })
      .catch((e) => console.error(e));
  }

  let settings = localStorage.getItem('settings')
    ? JSON.parse(localStorage.getItem('settings'))
    : {
        far: 50000,
        near: 1,
        outline: false,
        mapMap: true,
        readFeatures: false,
        maxZoomForPeaks: 0,
        exageration: 0.2,
        setAzimuth: 0,
        flipRasterImages: false,
        stickToGround: false,
        rasterProviderZoomDelta: 0,
        setPosition: { lat: 45.19776, lon: 5.73178, altitude: 270 },
      };

  function onSettingsChanged(key, value) {
    settings[key] = value;
    localStorage.setItem('settings', JSON.stringify(settings));
  }
  let map: Map;
  let mapContainer;
  function easing(t) {
    return t * (2 - t);
  }
  onMount(async () => {
    try {
      webapp = await import('./geo-three/webapp/app');
      webapp.setUpdateExternalPositionListener(sendPositionToEmulators);
      webapp.setOnSettingsChangedListener(onSettingsChanged);
      webapp.setUpdateExternalPositionThrottleTime(1000);
      webapp.setKeyboardMoveSpeed(0.3);
      webapp.callMethods(settings);

      // map = new Map({
      //   container: mapContainer,
      //   style: {
      //     version: 8,
      //     sources: {
      //       'raster-tiles': {
      //         type: 'raster',
      //         tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      //         tileSize: 256,
      //         attribution:
      //           '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      //       },
      //     },
      //     layers: [
      //       {
      //         id: 'simple-tiles',
      //         type: 'raster',
      //         source: 'raster-tiles',
      //         minzoom: 0,
      //         maxNativeZoom: 18,
      //       },
      //     ],
      //   },
      //   center: [settings.setPosition.lon, settings.setPosition.lat],
      //   zoom: 20,
      //   maxPitch: 80,
      //   pitch: 80,
      //   interactive: true,
      // });
      // // pixels the map pans when the up or down arrow is clicked
      // var deltaDistance = 2;
      // const KEYCODE = {
      //   W: 87,
      //   A: 65,
      //   S: 83,
      //   D: 68,
      //   Q: 81,
      //   E: 69,
      //   ARROW_LEFT: 37,
      //   ARROW_UP: 38,
      //   ARROW_RIGHT: 39,
      //   ARROW_DOWN: 40,
      // };

      // map.dragPan.disable();
      // map.dragRotate.disable();
      // map.doubleClickZoom.disable();
      // map.keyboard.enable();
      // map.on('load', function () {
      //   map.getCanvas().focus();

      //   var isMoving = false;
      //   var offset;
      //   // map.getCanvas().addEventListener('contextmenu', (e) => {});
      //   map.on('mousedown', (e) => {
      //     console.log('mousedown', e);
      //     if (e.originalEvent.button === 0) {
      //       isMoving = true;
      //       offset = e.originalEvent;
      //     }
      //   });
      //   map.on('mousemove', (e) => {
      //     console.log('mousemove', e, isMoving);
      //     if (isMoving) {
      //       let degreesPerPixelMoved = 0.8;
      //       const bearingDelta = (e.originalEvent.x - offset.x) * degreesPerPixelMoved;
      //       if (bearingDelta) {
      //         map.setBearing(map.getBearing() + bearingDelta);
      //       }
      //       degreesPerPixelMoved = -0.5;
      //       const pitchDelta = (e.originalEvent.y - offset.y) * degreesPerPixelMoved;
      //       if (pitchDelta) {
      //         map.setPitch(map.getPitch() + pitchDelta);
      //       }
      //       offset = e.originalEvent;
      //     }
      //   });
      //   map.on('mouseup', (e) => {
      //     isMoving = false;
      //   });
      //   map.getCanvas().addEventListener(
      //     'keydown',
      //     function (e) {
      //       e.preventDefault();
      //       if (e.which === KEYCODE.W) {
      //         // up
      //         map.panBy([0, -deltaDistance], {
      //           easing: easing,
      //         });
      //       } else if (e.which === KEYCODE.S) {
      //         // down
      //         map.panBy([0, deltaDistance], {
      //           easing: easing,
      //         });
      //       } else if (e.which === KEYCODE.A) {
      //         // left
      //         map.panBy([-deltaDistance, 0], {
      //           easing: easing,
      //         });
      //       } else if (e.which === KEYCODE.D) {
      //         // right
      //         map.panBy([deltaDistance, 0], {
      //           easing: easing,
      //         });
      //       }
      //     },
      //     true
      //   );
      // });
    } catch (error) {
      console.error(error);
    }
  });

  async function spawn(cmd, args, cwd?) {
    const command = new Command(cmd, args, { cwd: cwd });
    console.log('spawn', cmd, args.join(' '), cwd);
    command.on('close', (data) => {
      console.log(`command finished with code ${data.code} and signal ${data.signal}`);
    });
    command.on('error', (error) => console.error(`command error: "${error}"`));
    // command.stdout.on('data', (line) => onMessage(`command stdout: "${line}"`));
    // command.stderr.on('data', (line) => onMessage(`command stderr: "${line}"`));

    return command.spawn();
  }

  async function installApk() {
    console.log('installApk');
    let result = false;
    try {
      result = await invoke('install_apk');
    } catch (error) {
      console.error(error);
    }
    console.log('installApk done', result);
    return result;
  }
  async function setupAdb() {
    console.log('setupAdb');
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
      'adb shell appops set io.appium.settings android:mock_location allow',
    ];
    for (let index = 0; index < commands.length; index++) {
      const array = commands[index].split(' ');
      console.log('setupAdb', array);
      await spawn(array[0], array.slice(1));
    }
  }
  async function sendPositionToEmulators(position) {
    const args = [
      'shell',
      'am',
      'startservice',
      '-e',
      'longitude',
      position.lon + '',
      '-e',
      'latitude',
      position.lat + '',
      'io.appium.settings/.LocationService',
    ];
    try {
      console.log('sendPositionToEmulators', args);
      await spawn('adb', args);
    } catch (error) {
      console.error(error);
    }
  }
  listen<string>('tauri://menu', ({ payload }) => {
    switch (payload) {
      case 'setup':
        setupAdb();
        break;
      case 'install_apk':
        installApk();
        break;
    }
  });
</script>

<div class="drawer-container">
  <Drawer class="drawer" variant="modal" bind:open={drawerOpened}>
    <Content class="drawer-content">
      <input type="checkbox" id="mapMap" name="mapMap" />
      <label for="mapMap"> map Map</label><br />
      <input type="checkbox" id="generateColor" name="generateColor" />
      <label for="generateColor"> Generate Colors</label><br />
      <input type="checkbox" id="debug" name="debug" />
      <label for="debug"> Debug Map</label><br />
      <input type="checkbox" id="computeNormals" name="computeNormals" />
      <label for="computeNormals"> compute normals</label><br />
      <input type="checkbox" id="drawNormals" name="drawNormals" />
      <label for="drawNormals"> draw normals</label><br />
      <input type="checkbox" id="dayNightCycle" name="dayNightCycle" />
      <label for="dayNightCycle"> dayNight Cycle</label><br />
      <input type="checkbox" id="shadows" name="shadows" />
      <label for="shadows">Shadows</label><br />
      <input type="checkbox" id="debugGPUPicking" name="debugGPUPicking" />
      <label for="debugGPUPicking"> Debug GPU Picking</label><br />
      <input type="checkbox" id="readFeatures" name="readFeatures" />
      <label for="drawFeatures"> Enable read features</label><br />
      <input type="checkbox" id="debugFeaturePoints" name="debugFeaturePoints" />
      <label for="debugFeaturePoints"> Debug Draw Features</label><br />
      <input type="checkbox" id="dark" name="dark" />
      <label for="dark"> Dark Mode</label><br />
      <input type="checkbox" id="drawElevations" name="drawElevations" />
      <label for="drawElevations"> peaks elevation</label><br />
      <input type="checkbox" id="wireframe" />
      <label for="wireframe"> wireframe</label><br />
      <input type="checkbox" id="outline" />
      <label for="outline"> map outline</label><br />
      <input type="checkbox" id="stats" />
      <label for="stats"> show stats</label><br />
      <input id="exageration" type="range" min="0" max="4" step="0.01" />
      <label for="exageration" id="exagerationLabel"> exageration</label><br />
      <input id="depthMultiplier" type="range" min="0" max="200" step="1" />
      <label for="depthMultiplier" id="depthMultiplierLabel"> depthMultiplier</label><br />
      <input id="depthBiais" type="range" min="0" max="10" step="0.01" />
      <label for="depthBiais" id="depthBiaisLabel"> depthBiais</label><br />
      <input id="outlineStroke" type="range" min="0" max="10" step="0.01" />
      <label for="outlineStroke" id="outlineStrokeLabel"> outlineStroke</label><br />
      <input id="secondsInDay" type="range" min="0" max="86400" step="0.01" />
      <label for="secondsInDay" id="secondsInDayLabel" /><br />
      <input id="far" type="range" min="0" max="400000" step="1" />
      <label for="far" id="farLabel" /><br />
    </Content>
  </Drawer>
  <Scrim fixed={false} />
  <AppContent id="app-content">
    <video id="video" autoplay playsinline>
      <track kind="captions" />
    </video>
    <canvas
      id="canvas"
      style="background-color: transparent; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
    />
    <canvas
      id="canvas4"
      style="position: absolute; pointer-events: none; top: 0px; left: 0px; width: 100%; height: 100%"
    />
    <div class="map" id="map" bind:this={mapContainer} />
    <Autocomplete
      textfield$variant="filled"
      search={queryAddress}
      clearOnBlur={true}
      getOptionLabel={getAddressLabel}
      bind:value={selectedAddress}
      showMenuWithNoInput={false}
      label="Enter address here..."
    >
      <Text
        slot="loading"
        style="display: flex; width: 100%; justify-content: center; align-items: center;"
      >
        <CircularProgress style="height: 24px; width: 24px;" indeterminate />
      </Text>
    </Autocomplete>

    <label id="elevationLabel" for="elevation" />
    <input id="elevation" type="range" min="0" max="9000" />
    <div id="compass" on:click={() => webapp?.setAzimuth(0)}>
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m192.265625 8.027344c-89.882813 23.144531-161.09375 94.351562-184.238281 184.234375l29.0625 7.472656c20.40625-79.292969 83.355468-142.242187 162.644531-162.644531zm0 0"
        />
        <path
          d="m474.910156 199.734375 29.0625-7.472656c-23.144531-89.882813-94.355468-161.089844-184.238281-184.234375l-7.46875 29.0625c79.292969 20.402344 142.238281 83.351562 162.644531 162.644531zm0 0"
        />
        <path
          d="m319.734375 503.957031c89.882813-23.132812 161.09375-94.324219 184.238281-184.222656l-29.0625-7.472656c-20.40625 79.308593-83.355468 142.242187-162.648437 162.632812zm0 0"
        />
        <path
          d="m37.089844 312.261719-29.0625 7.472656c23.144531 89.898437 94.355468 161.09375 184.238281 184.222656l7.46875-29.0625c-79.292969-20.390625-142.238281-83.324219-162.644531-162.632812zm0 0"
        />
        <path
          d="m256 210.996094c-24.8125 0-45 20.1875-45 45 0 24.816406 20.1875 45 45 45s45-20.183594 45-45c0-24.8125-20.1875-45-45-45zm15 60h-30v-30h30zm0 0"
        />
        <path
          d="m256 0-57.613281 198.386719-198.386719 57.609375 198.386719 57.601562 57.613281 198.402344 57.613281-198.402344 198.386719-57.601562-198.386719-57.609375zm0 330.996094c-41.351562 0-75-33.644532-75-75 0-41.351563 33.648438-75 75-75s75 33.648437 75 75c0 41.355468-33.648438 75-75 75zm0 0"
        />
        <path
          d="m369.097656 183.339844 40.449219-80.886719-80.890625 40.4375 9.140625 31.3125zm0 0"
        />
        <path
          d="m337.796875 337.796875-9.136719 31.304687 80.886719 40.441407-40.449219-80.882813zm0 0"
        />
        <path
          d="m142.902344 328.660156-40.449219 80.882813 80.886719-40.445313-9.136719-31.300781zm0 0"
        />
        <path
          d="m174.203125 174.203125 9.140625-31.3125-80.890625-40.4375 40.449219 80.886719zm0 0"
        />
      </svg>
      <div id="compass_slice" />
    </div>
    <label id="compass_label" />

    <button id="camera_button" on:click={() => webapp?.toggleCamera()} style="visibility: hidden">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"
        />
      </svg>
    </button>
    <button id="settings_button" on:click={() => (drawerOpened = !drawerOpened)}>
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
        />
      </svg>
    </button>

    <button id="map_button" on:click={() => webapp?.toggleSetting('mapMap')}>
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z"
        />
      </svg>
    </button>
    <div id="selectedPeakHolder">
      <div id="selectedPeak">
        <label id="selectedPeakLabel" on:click={() => webapp?.focusSelectedItem()} />
        <button id="gotopeak_button" on:click={() => webapp?.goToSelectedItem()}>
          <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
            <path
              fill="#ffffff"
              d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </AppContent>
</div>
