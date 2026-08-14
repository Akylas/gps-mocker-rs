<script lang="ts">
    export let checked = false;
    export let label: string;
    export let description: string | undefined = undefined;
    export let disabled = false;
</script>

<label class="toggle" class:disabled>
    <span class="text">
        <span class="label">{label}</span>
        {#if description}<span class="description">{description}</span>{/if}
    </span>
    <input type="checkbox" bind:checked {disabled} on:change />
    <span class="track" aria-hidden="true"><span class="knob" /></span>
</label>

<style>
    .toggle {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: var(--tap);
        cursor: pointer;
        user-select: none;
    }
    .toggle.disabled {
        opacity: 0.45;
        cursor: default;
    }
    .text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .label {
        font-size: 13px;
    }
    .description {
        font-size: 11px;
        color: var(--text-faint);
    }
    input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    .track {
        flex: 0 0 auto;
        width: 40px;
        height: 24px;
        padding: 3px;
        border-radius: var(--radius-pill);
        background: var(--surface-raised);
        border: 1px solid var(--border);
        transition: background 140ms ease, border-color 140ms ease;
    }
    .knob {
        display: block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--text-muted);
        transition: transform 140ms ease, background 140ms ease;
    }
    input:checked ~ .track {
        background: var(--accent);
        border-color: var(--accent);
    }
    input:checked ~ .track .knob {
        background: var(--on-accent);
        transform: translateX(16px);
    }
    input:focus-visible ~ .track {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
</style>
