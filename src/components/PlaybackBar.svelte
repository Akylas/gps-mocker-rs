<script lang="ts">
    import CenterToFit from 'carbon-icons-svelte/lib/CenterToFit.svelte';
    import Erase from 'carbon-icons-svelte/lib/Erase.svelte';
    import Save from 'carbon-icons-svelte/lib/Save.svelte';
    import PauseFilled from 'carbon-icons-svelte/lib/PauseFilled.svelte';
    import PlayFilledAlt from 'carbon-icons-svelte/lib/PlayFilledAlt.svelte';
    import Renew from 'carbon-icons-svelte/lib/Renew.svelte';
    import Restart from 'carbon-icons-svelte/lib/Restart.svelte';
    import StopFilledAlt from 'carbon-icons-svelte/lib/StopFilledAlt.svelte';
    import DirectionCurve from 'carbon-icons-svelte/lib/DirectionCurve.svelte';
    import { _ } from 'svelte-i18n';
    import { formatDistance, formatDuration } from '../lib/geo';
    import type { PlayerSnapshot } from '../lib/player';
    import type { Route } from '../lib/route';

    export let route: Route | undefined;
    export let snapshot: PlayerSnapshot;
    export let speedMultiplier: number;
    export let loop: boolean;

    export let onPlayPause: () => void;
    export let onStop: () => void;
    export let onRestart: () => void;
    export let onSeek: (fraction: number) => void;
    export let onSpeedMultiplier: (value: number) => void;
    export let onLoop: (value: boolean) => void;
    export let onClear: () => void;
    export let onFit: () => void;
    export let onSave: () => void;
    export let onComputeManeuvers: () => void;
    export let computing = false;

    const PRESETS = [0.25, 0.5, 1, 2, 5, 10];

    $: fraction = snapshot.total > 0 ? snapshot.along / snapshot.total : 0;
    $: playing = snapshot.state === 'playing';
    // manoeuvre ticks on the scrubber, so you can see the shape of the drive
    $: ticks = route?.maneuvers && snapshot.total > 0 ? route.maneuvers.map((m) => (m.distance / snapshot.total) * 100).filter((p) => p > 0.5 && p < 99.5) : [];
</script>

{#if route}
    <div class="playback">
        <div class="playback-top">
            <div class="playback-identity">
                <span class="playback-name" title={route.name}>{route.name}</span>
                <span class="playback-meta">
                    {formatDistance(snapshot.total)}
                    · {route.points.length.toLocaleString()}
                    {$_('points')}
                    {#if route.maneuvers?.length}
                        · {route.maneuvers.length}
                        {$_('maneuvers')}
                    {/if}
                </span>
            </div>
            <div class="playback-route-actions">
                <button type="button" class="icon" aria-label={$_('fit_route')} title={$_('fit_route')} on:click={onFit}>
                    <CenterToFit size={16} />
                </button>
                <button type="button" class="icon" aria-label={$_('compute_maneuvers')} title={$_('compute_maneuvers')} disabled={computing} on:click={onComputeManeuvers}>
                    <DirectionCurve size={16} />
                </button>
                <button type="button" class="icon" aria-label={$_('save_route')} title={$_('save_route')} on:click={onSave}>
                    <Save size={16} />
                </button>
            </div>
            <div class="playback-multiplier">
                <span class="playback-multiplier-label">{$_('playback_speed')}</span>
                {#each PRESETS as preset}
                    <button type="button" class="chip" class:active={speedMultiplier === preset} on:click={() => onSpeedMultiplier(preset)}>
                        {preset}×
                    </button>
                {/each}
                <input
                    class="multiplier-range"
                    type="range"
                    min="0.1"
                    max="20"
                    step="0.1"
                    aria-label={$_('playback_speed')}
                    value={speedMultiplier}
                    on:input={(event) => onSpeedMultiplier(parseFloat(event.currentTarget.value))}
                />
                <span class="multiplier-value">{speedMultiplier.toFixed(speedMultiplier < 1 ? 2 : 1)}×</span>
            </div>
        </div>

        <div class="playback-controls">
            <button type="button" class="transport primary" aria-label={playing ? $_('pause') : $_('play')} on:click={onPlayPause}>
                {#if playing}
                    <PauseFilled size={20} />
                {:else}
                    <PlayFilledAlt size={20} />
                {/if}
            </button>
            <button type="button" class="transport" aria-label={$_('stop')} disabled={snapshot.state === 'stopped'} on:click={onStop}>
                <StopFilledAlt size={16} />
            </button>
            <button type="button" class="transport" aria-label={$_('restart')} on:click={onRestart}>
                <Restart size={16} />
            </button>
            <button type="button" class="transport" class:active={loop} aria-label={$_('loop')} aria-pressed={loop} on:click={() => onLoop(!loop)}>
                <Renew size={16} />
            </button>

            <div class="scrubber">
                <div class="scrubber-track">
                    <div class="scrubber-fill" style:width={`${fraction * 100}%`} />
                    {#each ticks as tick}
                        <span class="scrubber-tick" style:left={`${tick}%`} />
                    {/each}
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.0005"
                    aria-label={$_('route_progress')}
                    value={fraction}
                    on:input={(event) => onSeek(parseFloat(event.currentTarget.value))}
                />
            </div>

            <div class="playback-readout">
                <span class="readout-primary">{formatDistance(snapshot.along)} / {formatDistance(snapshot.total)}</span>
                <span class="readout-secondary">
                    {#if snapshot.onDetour}
                        {$_('rejoining_route')} · {formatDistance(snapshot.detourRemaining)}
                    {:else if snapshot.finished}
                        {$_('route_finished')}
                    {:else}
                        {$_('eta')}
                        {formatDuration(snapshot.eta)}
                    {/if}
                </span>
            </div>

            <button type="button" class="transport" aria-label={$_('clear_route')} on:click={onClear}>
                <Erase size={16} />
            </button>
        </div>
    </div>
{/if}

<style lang="scss">
    .playback {
        position: fixed;
        left: 50%;
        bottom: 16px;
        z-index: 8500;
        width: min(820px, calc(100vw - 32px));
        padding: 10px 14px 12px;
        transform: translateX(-50%);
        background: rgba(38, 38, 38, 0.96);
        color: #f4f4f4;
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(6px);
    }

    .playback-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 8px;
    }
    .playback-identity {
        display: flex;
        min-width: 0;
        flex-direction: column;
    }
    .playback-name {
        overflow: hidden;
        font-size: 13px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .playback-meta {
        color: #a8a8a8;
        font-size: 11px;
    }

    .playback-route-actions {
        display: flex;
        flex-shrink: 0;
        gap: 2px;
        margin-right: auto;
        margin-left: 10px;
    }
    .icon {
        display: flex;
        padding: 5px;
        border: none;
        background: none;
        color: #c6c6c6;
        cursor: pointer;
    }
    .icon:hover:not(:disabled) {
        background: #393939;
        color: #fff;
    }
    .icon:disabled {
        color: #6f6f6f;
        cursor: default;
    }

    .playback-multiplier {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        gap: 4px;
    }
    .playback-multiplier-label {
        margin-right: 2px;
        color: #a8a8a8;
        font-size: 11px;
    }
    .chip {
        padding: 2px 7px;
        border: 1px solid #525252;
        background: none;
        color: #c6c6c6;
        cursor: pointer;
        font-size: 11px;
    }
    .chip:hover {
        border-color: #8d8d8d;
    }
    .chip.active {
        border-color: #0f62fe;
        background: #0f62fe;
        color: #fff;
    }
    .multiplier-range {
        width: 90px;
        margin-left: 6px;
    }
    .multiplier-value {
        width: 42px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        text-align: right;
    }

    .playback-controls {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .transport {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: 1px solid #525252;
        background: none;
        color: #f4f4f4;
        cursor: pointer;
    }
    .transport:hover:not(:disabled) {
        background: #393939;
    }
    .transport:disabled {
        color: #6f6f6f;
        cursor: default;
    }
    .transport.primary {
        width: 40px;
        height: 40px;
        border-color: #0f62fe;
        background: #0f62fe;
    }
    .transport.primary:hover {
        background: #0353e9;
    }
    .transport.active {
        border-color: #0f62fe;
        color: #78a9ff;
    }

    .scrubber {
        position: relative;
        flex: 1;
        min-width: 0;
        height: 32px;
    }
    .scrubber-track {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 4px;
        background: #525252;
        transform: translateY(-50%);
    }
    .scrubber-fill {
        height: 100%;
        background: #78a9ff;
    }
    .scrubber-tick {
        position: absolute;
        top: -3px;
        width: 2px;
        height: 10px;
        background: #f1c21b;
    }
    .scrubber input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        cursor: pointer;
    }

    .playback-readout {
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        min-width: 150px;
        text-align: right;
    }
    .readout-primary {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12px;
    }
    .readout-secondary {
        color: #a8a8a8;
        font-size: 11px;
    }
</style>
