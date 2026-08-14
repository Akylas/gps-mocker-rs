<script lang="ts">
    /** the carbon icon component to render */
    export let icon: any;
    export let label: string;
    export let active = false;
    export let disabled = false;
    export let size = 20;
    /** the primary transport control gets a filled circle */
    export let filled = false;
</script>

<button type="button" class="icon-btn" class:active class:filled {disabled} aria-label={label} title={label} aria-pressed={active} on:click>
    <svelte:component this={icon} {size} />
</button>

<style>
    .icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--tap);
        height: var(--tap);
        flex: 0 0 auto;
        border: none;
        border-radius: var(--radius);
        background: transparent;
        color: var(--text-muted);
        cursor: pointer;
        transition: background 120ms ease, color 120ms ease;
    }
    .icon-btn:not(:disabled):hover {
        background: var(--surface-raised);
        color: var(--text);
    }
    .icon-btn.active {
        color: var(--accent);
        background: var(--accent-soft);
    }
    .icon-btn.filled {
        background: var(--accent);
        color: var(--on-accent);
        border-radius: var(--radius-pill);
    }
    .icon-btn.filled:not(:disabled):hover {
        background: var(--accent-strong);
        color: var(--on-accent);
    }
    .icon-btn:disabled {
        opacity: 0.35;
        cursor: default;
    }
</style>
