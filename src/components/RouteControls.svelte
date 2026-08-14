<script lang="ts">
    import CenterToFit from 'carbon-icons-svelte/lib/CenterToFit.svelte';
    import DirectionCurve from 'carbon-icons-svelte/lib/DirectionCurve.svelte';
    import Erase from 'carbon-icons-svelte/lib/Erase.svelte';
    import Renew from 'carbon-icons-svelte/lib/Renew.svelte';
    import Restart from 'carbon-icons-svelte/lib/Restart.svelte';
    import Save from 'carbon-icons-svelte/lib/Save.svelte';
    import StopFilledAlt from 'carbon-icons-svelte/lib/StopFilledAlt.svelte';
    import { _ } from 'svelte-i18n';
    import { formatDistance } from '../lib/geo';
    import type { PlayerSnapshot } from '../lib/player';
    import type { Route } from '../lib/route';
    import IconButton from './ui/IconButton.svelte';

    /**
     * Everything about the loaded route that is not the transport row: what it
     * is, what can be done to it, and how fast to replay it.
     *
     * The pointer shell stacks this above the transport bar; the touch shell
     * puts it inside the sheet, where it only appears once the sheet is pulled
     * past its peek detent.
     */
    export let route: Route | undefined;
    export let snapshot: PlayerSnapshot;
    export let speedMultiplier: number;
    export let loop: boolean;
    export let computing = false;
    export let compact = false;

    export let onSpeedMultiplier: (value: number) => void;
    export let onLoop: (value: boolean) => void;
    export let onStop: () => void;
    export let onRestart: () => void;
    export let onClear: () => void;
    export let onFit: () => void;
    export let onSave: () => void;
    export let onComputeManeuvers: () => void;

    const PRESETS = [0.25, 0.5, 1, 2, 5, 10];
</script>

{#if route}
    <div class="controls" class:compact>
        <div class="identity">
            <span class="name" title={route.name}>{route.name}</span>
            <span class="meta">
                {formatDistance(snapshot.total)}
                · {route.points.length.toLocaleString()}
                {$_('points')}
                {#if route.maneuvers?.length}
                    · {route.maneuvers.length}
                    {$_('maneuvers')}
                {/if}
            </span>
        </div>

        <div class="actions">
            {#if compact}
                <!-- the peek row drops these to stay on one line, so they have
                     to come back somewhere -->
                <IconButton icon={StopFilledAlt} label={$_('stop')} size={16} disabled={snapshot.state === 'stopped'} on:click={onStop} />
                <IconButton icon={Restart} label={$_('restart')} size={16} on:click={onRestart} />
                <IconButton icon={Renew} label={$_('loop')} size={16} active={loop} on:click={() => onLoop(!loop)} />
            {/if}
            <IconButton icon={CenterToFit} label={$_('fit_route')} size={16} on:click={onFit} />
            <IconButton icon={DirectionCurve} label={$_('compute_maneuvers')} size={16} disabled={computing} on:click={onComputeManeuvers} />
            <IconButton icon={Save} label={$_('save_route')} size={16} on:click={onSave} />
            {#if compact}
                <IconButton icon={Erase} label={$_('clear_route')} size={16} on:click={onClear} />
            {/if}
        </div>

        <div class="speed">
            <span class="label">{$_('playback_speed')}</span>
            <div class="chips">
                {#each PRESETS as preset}
                    <button type="button" class="chip" class:active={speedMultiplier === preset} on:click={() => onSpeedMultiplier(preset)}>{preset}×</button>
                {/each}
            </div>
            <input
                class="range"
                type="range"
                min="0.1"
                max="20"
                step="0.1"
                aria-label={$_('playback_speed')}
                value={speedMultiplier}
                on:input={(event) => onSpeedMultiplier(parseFloat(event.currentTarget.value))}
            />
            <span class="value">{speedMultiplier.toFixed(speedMultiplier < 1 ? 2 : 1)}×</span>
        </div>
    </div>
{/if}

<style>
    .controls {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-width: 0;
    }
    .controls.compact {
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 8px;
    }

    .identity {
        display: flex;
        min-width: 0;
        flex-direction: column;
    }
    .compact .identity {
        flex: 1 1 100%;
    }
    .name {
        overflow: hidden;
        font-size: 13px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .meta {
        color: var(--text-faint);
        font-size: 11px;
    }

    .actions {
        display: flex;
        flex-shrink: 0;
        gap: 2px;
        margin-right: auto;
    }

    .speed {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        gap: 6px;
    }
    .compact .speed {
        flex: 1 1 100%;
        flex-wrap: wrap;
    }
    .label {
        color: var(--text-faint);
        font-size: 11px;
    }
    .chips {
        display: flex;
        gap: 4px;
    }
    .chip {
        min-height: calc(var(--control-h) - 8px);
        padding: 0 8px;
        border: 1px solid var(--border);
        border-radius: var(--radius-pill);
        background: transparent;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 11px;
    }
    .chip:hover {
        border-color: var(--border-strong);
    }
    .chip.active {
        border-color: var(--accent);
        background: var(--accent);
        color: var(--on-accent);
    }
    .range {
        width: 90px;
        touch-action: none;
    }
    .compact .range {
        flex: 1;
        width: auto;
    }
    .value {
        width: 42px;
        font-family: var(--mono);
        font-size: 11px;
        text-align: right;
    }
</style>
