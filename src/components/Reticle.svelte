<script lang="ts">
    /**
     * Touch replacement for clicking the map.
     *
     * A tap cannot both add a waypoint and pan, and a long-press is invisible
     * until you already know about it. Aiming the map under a fixed crosshair
     * and confirming keeps both gestures and shows the target the whole time.
     */
    export let label: string;
    export let onConfirm: () => void;
</script>

<div class="reticle" aria-hidden="true">
    <span class="ring" />
    <span class="dot" />
</div>

<button type="button" class="confirm" on:click={onConfirm}>{label}</button>

<style>
    .reticle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;
        pointer-events: none;
        display: grid;
        place-items: center;
    }
    .ring {
        grid-area: 1 / 1;
        width: 42px;
        height: 42px;
        border: 2px solid var(--accent);
        border-radius: 50%;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35);
    }
    .dot {
        grid-area: 1 / 1;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent);
    }

    .confirm {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        /* sits above the sheet's peek detent, which is the transport row */
        bottom: calc(96px + var(--safe-bottom));
        z-index: 41;
        min-height: var(--tap);
        padding: 0 20px;
        border: none;
        border-radius: var(--radius-pill);
        background: var(--accent);
        color: var(--on-accent);
        font-size: 13px;
        font-weight: 500;
        box-shadow: var(--shadow);
        cursor: pointer;
    }
</style>
