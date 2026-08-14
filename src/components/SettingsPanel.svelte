<script lang="ts">
    import { _ } from 'svelte-i18n';
    import type { Writable } from 'svelte/store';
    import { describeDevice, isUsable, type AdbDevice } from '../lib/adb';
    import { isSelfMocking } from '../lib/platform';
    import { TERRAIN_PRESETS } from '../lib/terrain';
    import { DEFAULT_VALHALLA_URL } from '../lib/valhalla';
    import CostingOptions from './CostingOptions.svelte';
    import MockProviderPanel from './MockProviderPanel.svelte';
    import Button from './ui/Button.svelte';
    import Checkbox from './ui/Checkbox.svelte';
    import Section from './ui/Section.svelte';
    import SegmentedControl from './ui/SegmentedControl.svelte';
    import Select from './ui/Select.svelte';
    import Slider from './ui/Slider.svelte';
    import TextField from './ui/TextField.svelte';
    import Toggle from './ui/Toggle.svelte';

    /**
     * The settings, written once and rendered into whichever surface the shell
     * is using — the pointer shell's inspector or the touch shell's sheet.
     */
    export let store: Writable<any>;
    export let defaults: any;
    export let styleDraft: string;
    export let darkStyleDraft: string;
    export let terrainDraft: string;
    export let busy = false;

    export let selectTerrainPreset: (id: string) => void;
    export let setMapStyle: (url: string) => void;
    export let setDarkMapStyle: (url: string) => void;
    export let patchCostingValues: (patch: any) => void;
    export let resetCostingValues: () => void;
    export let installApk: () => void;
    export let setupAdb: () => void;
    export let onMockError: (error: unknown) => void;
    export let refreshAdbDevices: () => void;
    export let adbDevices: AdbDevice[] = [];

    $: usableCount = adbDevices.filter(isUsable).length;

    /**
     * A saved serial that is currently unplugged stays in the list rather than
     * silently resetting the choice; it comes back when the device does.
     */
    $: adbOptions = [
        { value: 'auto', label: $_('adb_target_auto') },
        { value: 'all', label: $_('adb_target_all') },
        ...adbDevices.map((device) => ({ value: device.serial, label: describeDevice(device) })),
        ...(typeof $store.adbTarget === 'string' && !['auto', 'all'].includes($store.adbTarget) && !adbDevices.some((device) => device.serial === $store.adbTarget)
            ? [{ value: $store.adbTarget, label: `${$store.adbTarget} (${$_('not_attached')})` }]
            : [])
    ];
</script>

<Section title={$_('appearance')}>
    <SegmentedControl
        bind:value={$store.theme}
        label={$_('theme')}
        options={[
            { value: 'auto', label: $_('theme_auto') },
            { value: 'light', label: $_('theme_light') },
            { value: 'dark', label: $_('theme_dark') }
        ]}
    />
</Section>

<Section title={$_('mocking')}>
    {#if isSelfMocking}
        <!-- the app is the provider here; there is no other device to talk to -->
        <MockProviderPanel onError={onMockError} />
    {:else}
        <Toggle label={$_('mock_enabled')} bind:checked={$store.mockEnabled} />
        <Checkbox label={$_('android_emulators')} bind:checked={$store.androidEmulators} />
        {#if $store.androidEmulators}
            <!-- adb refuses every command once two devices are attached, so the
                 target has to be pinned rather than left implicit -->
            <Select label={$_('adb_target')} bind:value={$store.adbTarget} options={adbOptions} />
            <div class="actions">
                <Button size="small" kind="ghost" on:click={() => refreshAdbDevices()}>{$_('refresh_devices')}</Button>
                <span class="hint">{$_('devices_attached', { values: { count: usableCount } })}</span>
            </div>
        {/if}
        <Checkbox label={$_('ios_devices')} bind:checked={$store.iosDevices} />
        {#if $store.iosSimulatorsSupported}
            <Checkbox label={$_('ios_simulators')} bind:checked={$store.iosSimulators} />
        {/if}
    {/if}
</Section>

<Section title={$_('playback')}>
    <Slider label={$_('playback_base_speed')} readout="{$store.playbackSpeed} km/h" bind:value={$store.playbackSpeed} min={1} max={300} step={1} />
    <Checkbox label={$_('use_recorded_speed')} bind:checked={$store.useRecordedSpeed} />
    <Checkbox label={$_('smart_slowdown')} bind:checked={$store.smartSlowdown} />
    {#if $store.smartSlowdown}
        <Slider label={$_('min_slowdown_factor')} readout="{Math.round($store.minSlowdownFactor * 100)}%" bind:value={$store.minSlowdownFactor} min={0.05} max={1} step={0.05} />
        <Slider label={$_('maneuver_lookahead')} readout="{$store.maneuverLookahead} m" bind:value={$store.maneuverLookahead} min={20} max={500} step={10} />
    {/if}
    <Checkbox label={$_('loop')} bind:checked={$store.loopPlayback} />
    <Checkbox label={$_('follow_vehicle')} bind:checked={$store.followVehicle} />
</Section>

<Section title={$_('routing')}>
    <TextField label={$_('valhalla_url')} placeholder={DEFAULT_VALHALLA_URL} bind:value={$store.valhallaUrl} />
    <!-- the same panel the route builder shows, so one set of options drives
         building, rerouting and map matching -->
    <CostingOptions
        costing={$store.costing}
        values={$store.costingOptions?.[$store.costing]}
        onCosting={(next) => ($store.costing = next)}
        onChange={patchCostingValues}
        onReset={resetCostingValues}
    />
    <Checkbox label={$_('auto_compute_maneuvers')} bind:checked={$store.autoComputeManeuvers} />
    <Checkbox label={$_('snap_to_roads')} bind:checked={$store.snapToRoads} />
    <Checkbox label={$_('auto_reroute')} bind:checked={$store.autoReroute} />
</Section>

<Section title={$_('manual_driving')}>
    <Slider label={$_('speed')} readout="{$store.speedInKm} km/h" bind:value={$store.speedInKm} min={1} max={600} step={1} />
    <Slider label={$_('keyRepeatSpeedMs')} readout="{$store.keyRepeatSpeedMs} ms" bind:value={$store.keyRepeatSpeedMs} min={10} max={5000} step={1} />
</Section>

<Section title={$_('map')} open={false}>
    <!-- one basemap per theme: the map is most of the screen, so it has to
         follow the shell rather than stay bright behind a dark one -->
    <TextField label={$_('mapstyle_url')} help={$_('mapstyle_url_help')} bind:value={styleDraft} on:blur={() => setMapStyle(styleDraft)} />
    <TextField label={$_('mapstyle_url_dark')} bind:value={darkStyleDraft} on:blur={() => setDarkMapStyle(darkStyleDraft)} />
    <div class="actions">
        <Button
            size="small"
            kind="ghost"
            on:click={() => {
                setMapStyle(defaults.mapStyle);
                setDarkMapStyle(defaults.mapStyleDark);
            }}>{$_('reset_to_default')}</Button
        >
    </div>
</Section>

<Section title={$_('terrain')} open={false}>
    <div class="presets">
        {#each TERRAIN_PRESETS as preset}
            <button type="button" class="preset" class:active={$store.terrainPreset === preset.id} on:click={() => selectTerrainPreset(preset.id)}>
                {preset.label}
            </button>
        {/each}
    </div>
    <TextField label={$_('terrain_data_url')} help={$_('terrain_data_url_help')} bind:value={terrainDraft} />
    <div class="row">
        <Select
            label={$_('terrain_encoding')}
            bind:value={$store.terrainEncoding}
            options={[
                { value: 'terrarium', label: 'terrarium' },
                { value: 'mapbox', label: 'mapbox' }
            ]}
        />
        <Select
            label={$_('terrain_tile_size')}
            bind:value={$store.terrainTileSize}
            options={[
                { value: 256, label: '256' },
                { value: 512, label: '512' }
            ]}
        />
        <TextField label={$_('terrain_max_zoom')} type="number" min={1} max={22} bind:value={$store.terrainMaxZoom} />
    </div>
    <Checkbox label={$_('terrain_3d')} bind:checked={$store.terrain3d} />
    <Checkbox label={$_('hillshade')} bind:checked={$store.hillshade} />
    {#if $store.terrain3d}
        <Slider label={$_('exageration')} readout="{$store.terrainExaggeration.toFixed(1)}×" bind:value={$store.terrainExaggeration} min={0.1} max={3} step={0.1} />
    {/if}
</Section>

{#if !isSelfMocking}
    <!-- driving a separate Android device needs the helper APK and adb; the
         Android build mocks itself and has neither -->
    <Section title={$_('android_setup')} open={false}>
        <div class="actions">
            <Button size="small" disabled={busy} on:click={installApk}>{$_('task_install_apk')}</Button>
            <Button size="small" disabled={busy} on:click={setupAdb}>{$_('task_setup_adb')}</Button>
        </div>
    </Section>
{/if}

<style>
    .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
    }
    .hint {
        font-size: 11px;
        color: var(--text-faint);
    }
    .row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
        gap: 8px;
    }
    .presets {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 4px 0;
    }
    .preset {
        min-height: calc(var(--control-h) - 6px);
        padding: 0 10px;
        border: 1px solid var(--border);
        border-radius: var(--radius-pill);
        background: var(--surface-raised);
        color: var(--text-muted);
        font-size: 12px;
        cursor: pointer;
    }
    .preset.active {
        border-color: var(--accent);
        color: var(--text);
    }
</style>
