<script lang="ts">
    import { onDestroy } from 'svelte';

    /**
     * Touch equivalent of the W/A/S/D driving keys.
     *
     * Holding repeats at the same interval the keyboard path uses, so the
     * distance covered per second matches whichever input you drove with.
     */
    export let repeatMs = 16.6;
    /** heading offset in degrees, relative to the map's own bearing */
    export let onStep: (bearingDelta: number, fast: boolean) => void;
    export let fast = false;

    let timer: any;
    let held: number | undefined;

    function start(bearingDelta: number) {
        stop();
        held = bearingDelta;
        onStep(bearingDelta, fast);
        timer = setInterval(() => onStep(bearingDelta, fast), repeatMs);
    }

    function stop() {
        clearInterval(timer);
        timer = undefined;
        held = undefined;
    }

    onDestroy(stop);

    const DIRECTIONS = [
        { delta: 0, label: 'Forward', area: 'up', arrow: 'M12 5 L19 14 H5 Z' },
        { delta: 270, label: 'Left', area: 'left', arrow: 'M5 12 L14 5 V19 Z' },
        { delta: 90, label: 'Right', area: 'right', arrow: 'M19 12 L10 19 V5 Z' },
        { delta: 180, label: 'Back', area: 'down', arrow: 'M12 19 L5 10 H19 Z' }
    ];
</script>

<div class="pad">
    {#each DIRECTIONS as direction}
        <button
            type="button"
            class="key {direction.area}"
            class:held={held === direction.delta}
            aria-label={direction.label}
            on:pointerdown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                start(direction.delta);
            }}
            on:pointerup={stop}
            on:pointercancel={stop}
            on:pointerleave={stop}
        >
            <svg viewBox="0 0 24 24" width="18" height="18"><path d={direction.arrow} fill="currentColor" /></svg>
        </button>
    {/each}
    <button type="button" class="key boost" class:held={fast} aria-pressed={fast} on:click={() => (fast = !fast)}>×10</button>
</div>

<style>
    .pad {
        display: grid;
        grid-template-areas:
            '. up .'
            'left boost right'
            '. down .';
        gap: 4px;
        padding: 6px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow);
        /* every press here is a hold, never a scroll */
        touch-action: none;
    }
    .key {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--tap);
        height: var(--tap);
        border: none;
        border-radius: var(--radius);
        background: var(--surface-raised);
        color: var(--text-muted);
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
    }
    .key.held {
        background: var(--accent);
        color: var(--on-accent);
    }
    .up {
        grid-area: up;
    }
    .down {
        grid-area: down;
    }
    .left {
        grid-area: left;
    }
    .right {
        grid-area: right;
    }
    .boost {
        grid-area: boost;
        background: transparent;
        color: var(--text-faint);
    }
</style>
