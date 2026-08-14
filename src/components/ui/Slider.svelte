<script lang="ts">
    export let value = 0;
    export let min = 0;
    export let max = 100;
    export let step = 1;
    export let label: string;
    /** rendered to the right of the label, e.g. "90 km/h" */
    export let readout: string | undefined = undefined;
    export let disabled = false;
</script>

<div class="slider">
    <div class="head">
        <span class="label">{label}</span>
        {#if readout}<span class="readout">{readout}</span>{/if}
    </div>
    <input type="range" {min} {max} {step} {disabled} bind:value on:input on:change aria-label={label} />
</div>

<style>
    .slider {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 4px 0;
    }
    .head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
    }
    .label {
        font-size: 12px;
        color: var(--text-muted);
    }
    .readout {
        font-family: var(--mono);
        font-size: 12px;
        color: var(--text);
    }

    input[type='range'] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        /* the thumb is the target, so the row has to be tall enough for it */
        height: var(--tap);
        background: transparent;
        cursor: pointer;
        /* a horizontal drag here must not also scroll the sheet behind it */
        touch-action: none;
    }
    input[type='range']::-webkit-slider-runnable-track {
        height: 4px;
        border-radius: 2px;
        background: var(--border-strong);
    }
    input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        margin-top: -7px;
        border: none;
        border-radius: 50%;
        background: var(--accent);
    }
    input[type='range']:disabled {
        opacity: 0.4;
        cursor: default;
    }
    input[type='range']::-moz-range-track {
        height: 4px;
        border-radius: 2px;
        background: var(--border-strong);
    }
    input[type='range']::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border: none;
        border-radius: 50%;
        background: var(--accent);
    }
</style>
