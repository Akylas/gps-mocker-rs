<script lang="ts">
    import Erase from 'carbon-icons-svelte/lib/Erase.svelte';
    import PauseFilled from 'carbon-icons-svelte/lib/PauseFilled.svelte';
    import PlayFilledAlt from 'carbon-icons-svelte/lib/PlayFilledAlt.svelte';
    import Renew from 'carbon-icons-svelte/lib/Renew.svelte';
    import Restart from 'carbon-icons-svelte/lib/Restart.svelte';
    import StopFilledAlt from 'carbon-icons-svelte/lib/StopFilledAlt.svelte';
    import { _ } from 'svelte-i18n';
    import { formatDistance, formatDuration } from '../lib/geo';
    import type { PlayerSnapshot } from '../lib/player';
    import type { Route } from '../lib/route';
    import IconButton from './ui/IconButton.svelte';

    /**
     * The transport row, and only the transport row.
     *
     * It is the one thing that has to be reachable at a glance mid-drive, so it
     * is what the touch shell's peek detent shows; everything else about the
     * route lives in RouteControls, which the sheet only reveals when pulled up.
     */
    export let route: Route | undefined;
    export let snapshot: PlayerSnapshot;
    export let loop: boolean;
    export let compact = false;

    export let onPlayPause: () => void;
    export let onStop: () => void;
    export let onRestart: () => void;
    export let onSeek: (fraction: number) => void;
    export let onLoop: (value: boolean) => void;
    export let onClear: () => void;

    $: fraction = snapshot.total > 0 ? snapshot.along / snapshot.total : 0;
    $: playing = snapshot.state === 'playing';
    // manoeuvre ticks on the scrubber, so you can see the shape of the drive
    $: ticks = route?.maneuvers && snapshot.total > 0 ? route.maneuvers.map((m) => (m.distance / snapshot.total) * 100).filter((p) => p > 0.5 && p < 99.5) : [];
</script>

{#if route}
    <div class="transport" class:compact>
        <IconButton icon={playing ? PauseFilled : PlayFilledAlt} label={playing ? $_('pause') : $_('play')} size={compact ? 22 : 20} filled on:click={onPlayPause} />

        {#if !compact}
            <IconButton icon={StopFilledAlt} label={$_('stop')} size={16} disabled={snapshot.state === 'stopped'} on:click={onStop} />
            <IconButton icon={Restart} label={$_('restart')} size={16} on:click={onRestart} />
            <IconButton icon={Renew} label={$_('loop')} size={16} active={loop} on:click={() => onLoop(!loop)} />
        {/if}

        <div class="middle">
            <div class="scrubber">
                <div class="track">
                    <div class="fill" style:width={`${fraction * 100}%`} />
                    {#each ticks as tick}
                        <span class="tick" style:left={`${tick}%`} />
                    {/each}
                </div>
                <input type="range" min="0" max="1" step="0.0005" aria-label={$_('route_progress')} value={fraction} on:input={(event) => onSeek(parseFloat(event.currentTarget.value))} />
            </div>
            {#if compact}
                <!-- the wide layout keeps the readout in its own column; here it
                     has to tuck under the scrubber to stay on one row -->
                <div class="readout inline">
                    <span>{formatDistance(snapshot.along)} / {formatDistance(snapshot.total)}</span>
                    <span class="secondary">
                        {#if snapshot.onDetour}
                            {$_('rejoining_route')}
                        {:else if snapshot.finished}
                            {$_('route_finished')}
                        {:else}
                            {$_('eta')}
                            {formatDuration(snapshot.eta)}
                        {/if}
                    </span>
                </div>
            {/if}
        </div>

        {#if !compact}
            <div class="readout">
                <span>{formatDistance(snapshot.along)} / {formatDistance(snapshot.total)}</span>
                <span class="secondary">
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
            <IconButton icon={Erase} label={$_('clear_route')} size={16} on:click={onClear} />
        {/if}
    </div>
{/if}

<style>
    .transport {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    }

    .middle {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .scrubber {
        position: relative;
        width: 100%;
        height: var(--tap);
    }
    .track {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background: var(--border-strong);
        transform: translateY(-50%);
        overflow: hidden;
    }
    .fill {
        height: 100%;
        background: var(--accent);
    }
    .tick {
        position: absolute;
        top: -3px;
        width: 2px;
        height: 10px;
        background: var(--warning);
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
        /* dragging the scrubber must never scroll the sheet it sits in */
        touch-action: none;
    }

    .readout {
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        min-width: 150px;
        text-align: right;
        font-family: var(--mono);
        font-size: 12px;
    }
    .readout.inline {
        flex-direction: row;
        justify-content: space-between;
        min-width: 0;
        margin-top: -6px;
        text-align: left;
        font-size: 11px;
    }
    .secondary {
        color: var(--text-faint);
        font-size: 11px;
    }
</style>
