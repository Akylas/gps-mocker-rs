<script lang="ts">
    import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
    import { _ } from 'svelte-i18n';
    import { formatDistance, formatDuration, type Position } from '../lib/geo';
    import type { PlayerSnapshot } from '../lib/player';
    import { routeStats, type Route } from '../lib/route';

    export let route: Route | undefined;
    export let snapshot: PlayerSnapshot;
    export let position: Position | undefined;
    export let offRoute: number | undefined = undefined;
    export let rejoining: number | undefined = undefined;
    export let collapsed = false;
    export let onToggle: () => void;

    $: stats = route ? routeStats(route) : undefined;
    $: remaining = Math.max(0, snapshot.total - snapshot.along);
    $: percent = snapshot.total > 0 ? (snapshot.along / snapshot.total) * 100 : 0;
    $: bearing = snapshot.state === 'stopped' ? undefined : snapshot.bearing;

    function compass(degrees: number) {
        const names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return names[Math.round(degrees / 45) % 8];
    }
</script>

<div class="stats" class:collapsed>
    <button class="stats-header" type="button" on:click={onToggle} aria-expanded={!collapsed}>
        <span class="stats-title">{$_('live_stats')}</span>
        <span class="stats-chevron" class:flipped={collapsed}><ChevronDown size={16} /></span>
    </button>

    {#if !collapsed}
        <div class="stats-body">
            {#if route}
                <div class="stats-progress">
                    <div class="stats-progress-bar"><span style:width={`${percent}%`} /></div>
                    <span class="stats-progress-label">{percent.toFixed(1)}%</span>
                </div>
            {/if}

            <dl class="grid">
                <div class="cell wide">
                    <dt>{$_('speed')}</dt>
                    <dd class="big">
                        {snapshot.speedKmh.toFixed(1)}<span class="unit">km/h</span>
                        {#if snapshot.slowdown < 0.995}
                            <span class="badge" title={$_('smart_slowdown_hint')}>{Math.round(snapshot.slowdown * 100)}%</span>
                        {/if}
                    </dd>
                </div>
                <div class="cell">
                    <dt>{$_('heading')}</dt>
                    <dd>{bearing === undefined ? '—' : `${Math.round(bearing)}° ${compass(bearing)}`}</dd>
                </div>
                <div class="cell">
                    <dt>{$_('elevation')}</dt>
                    <dd>{position?.ele !== undefined ? `${Math.round(position.ele)} m` : '—'}</dd>
                </div>

                {#if route}
                    <div class="cell">
                        <dt>{$_('travelled')}</dt>
                        <dd>{formatDistance(snapshot.along)}</dd>
                    </div>
                    <div class="cell">
                        <dt>{$_('remaining')}</dt>
                        <dd>{formatDistance(remaining)}</dd>
                    </div>
                    <div class="cell">
                        <dt>{$_('elapsed')}</dt>
                        <dd>{formatDuration(snapshot.elapsed)}</dd>
                    </div>
                    <div class="cell">
                        <dt>{$_('eta')}</dt>
                        <dd>{formatDuration(snapshot.eta)}</dd>
                    </div>
                    {#if stats?.ascent !== undefined}
                        <div class="cell">
                            <dt>{$_('ascent')}</dt>
                            <dd>↑ {Math.round(stats.ascent)} m</dd>
                        </div>
                        <div class="cell">
                            <dt>{$_('descent')}</dt>
                            <dd>↓ {Math.round(stats.descent ?? 0)} m</dd>
                        </div>
                    {/if}
                    {#if stats?.recordedDuration !== undefined}
                        <div class="cell wide">
                            <dt>{$_('recorded_duration')}</dt>
                            <dd>{formatDuration(stats.recordedDuration)}</dd>
                        </div>
                    {/if}
                {/if}

                <div class="cell wide">
                    <dt>{$_('coordinates')}</dt>
                    <dd class="mono">
                        {position ? `${position.lat.toFixed(6)}, ${position.lon.toFixed(6)}` : '—'}
                    </dd>
                </div>
            </dl>

            {#if snapshot.maneuver && isFinite(snapshot.maneuverDistance)}
                <div class="maneuver">
                    <span class="maneuver-distance">{formatDistance(Math.max(0, snapshot.maneuverDistance))}</span>
                    <span class="maneuver-instruction">{snapshot.maneuver.instruction || $_('next_maneuver')}</span>
                </div>
            {/if}

            {#if rejoining !== undefined}
                <div class="off-route rejoining">
                    {$_('rejoining_route')} · {formatDistance(rejoining)}
                </div>
            {:else if offRoute !== undefined}
                <div class="off-route">
                    {$_('off_route_by', { values: { distance: formatDistance(offRoute) } })}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    .stats {
        position: fixed;
        top: 60px;
        left: 16px;
        z-index: 8400;
        width: 300px;
        max-width: calc(100vw - 32px);
        background: rgba(38, 38, 38, 0.96);
        color: #f4f4f4;
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(6px);
    }

    .stats-header {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        border: none;
        background: none;
        color: inherit;
        cursor: pointer;
    }
    .stats-title {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
    }
    .stats-chevron {
        display: flex;
        transition: transform 0.15s ease;
    }
    .stats-chevron.flipped {
        transform: rotate(-90deg);
    }

    .stats-body {
        padding: 0 12px 12px;
    }

    .stats-progress {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
    }
    .stats-progress-bar {
        flex: 1;
        height: 4px;
        background: #525252;
    }
    .stats-progress-bar span {
        display: block;
        height: 100%;
        background: #78a9ff;
    }
    .stats-progress-label {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
    }

    .grid {
        display: grid;
        margin: 0;
        gap: 8px 12px;
        grid-template-columns: 1fr 1fr;
    }
    .cell {
        min-width: 0;
    }
    .cell.wide {
        grid-column: 1 / -1;
    }
    dt {
        color: #a8a8a8;
        font-size: 10px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
    }
    dd {
        margin: 2px 0 0;
        font-size: 13px;
    }
    dd.big {
        display: flex;
        align-items: baseline;
        gap: 4px;
        font-size: 24px;
        font-weight: 300;
        line-height: 1.1;
    }
    dd.mono {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12px;
    }
    .unit {
        color: #a8a8a8;
        font-size: 12px;
    }
    .badge {
        padding: 1px 5px;
        background: #f1c21b;
        color: #161616;
        font-size: 10px;
        font-weight: 600;
    }

    .maneuver {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-top: 12px;
        padding: 8px 10px;
        background: #393939;
        border-left: 3px solid #0f62fe;
    }
    .maneuver-distance {
        flex-shrink: 0;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 13px;
        font-weight: 600;
    }
    .maneuver-instruction {
        font-size: 12px;
        line-height: 1.35;
    }

    .off-route.rejoining {
        background: rgba(15, 98, 254, 0.18);
        border-left-color: #4589ff;
        color: #d0e2ff;
    }

    .off-route {
        margin-top: 10px;
        padding: 6px 10px;
        background: rgba(255, 131, 43, 0.15);
        border-left: 3px solid #ff832b;
        color: #ffd9be;
        font-size: 11px;
    }
</style>
