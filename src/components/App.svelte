<script lang="ts">
  import { onMount } from 'svelte';
  import { invoke } from '@tauri-apps/api';
  import { Command } from '@tauri-apps/api/shell';
  import { listen } from '@tauri-apps/api/event';
  import { format } from '@fragaria/address-formatter';
  import Autocomplete from './Autocomplete.svelte';
  import Drawer, { AppContent, Content, Scrim } from '@smui/drawer';
  import { Group, Text } from '@smui/list';
  import { Label } from '@smui/common';
  import CircularProgress from '@smui/circular-progress';
  import 'svelte-material-ui/bare.css';
  import IconButton from '@smui/icon-button';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { Map, Marker, NavigationControl } from 'maplibre-gl';
  let webapp;

  let drawerOpened = false;

  let selectedAddress;
  let selectedAddressLabel;
  $: {
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
  let mapPositionMarker: Marker;
  function easing(t) {
    return t * (2 - t);
  }
  onMount(async () => {
    try {
      webapp = await import('../geo-three/webapp/app');
      webapp.setUpdateExternalPositionListener(sendPositionToEmulators);
      webapp.setOnSettingsChangedListener(onSettingsChanged);
      webapp.setUpdateExternalPositionThrottleTime(1000);
      webapp.setKeyboardMoveSpeed(0.3);
      webapp.callMethods(settings);
      const position = settings.setPosition;
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
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            },
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
            },
          ],
        },
        center: position,
        zoom: 14,
        interactive: false,
      });
      map.addControl(
        new NavigationControl({
          showCompass: false,
          showZoom: true,
        })
      );
      mapPositionMarker = new Marker().setLngLat(position).addTo(map);
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
    // command.on('close', (data) => {
    //   console.log(`command finished with code ${data.code} and signal ${data.signal}`);
    // });
    command.on('error', (error) => console.error(`command error: "${error}"`));
    // command.stdout.on('data', (line) => onMessage(`command stdout: "${line}"`));
    // command.stderr.on('data', (line) => onMessage(`command stderr: "${line}"`));

    return command.spawn();
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
      'adb shell appops set io.appium.settings android:mock_location allow',
    ];
    for (let index = 0; index < commands.length; index++) {
      const array = commands[index].split(' ');
      await spawn(array[0], array.slice(1));
    }
  }
  async function sendPositionToEmulators(position) {
    mapPositionMarker.setLngLat(position);
    map.setCenter(position);
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
    <div style="position:absolute; width:100%;height:100%;display:flex;pointer-events: none; ">
      <div
        class="map"
        id="map"
        bind:this={mapContainer}
        style="align-self:flex-end;margin: 20px;"
      />
    </div>

    <div
      style="pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    z-index: 100;
    justify-content: center;"
    >
      <Autocomplete
        textfield$variant="filled"
        search={queryAddress}
        clearOnBlur={true}
        class="autocomplete"
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
    </div>
    <IconButton class="material-icons" on:click={() => (drawerOpened = !drawerOpened)}
      >menu</IconButton
    >
    <Group style="display: flex; bottom: 10px;
    right: 10px;
    position: absolute; justify-content: center; align-items: center;">
      <Text
        id="elevationLabel"
        
      />
      <Text>&#160;m</Text>
    </Group>

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
