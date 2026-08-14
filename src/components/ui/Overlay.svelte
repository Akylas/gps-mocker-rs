<script lang="ts">
    import Close from 'carbon-icons-svelte/lib/Close.svelte';
    import { compact } from '../../lib/layout';
    import IconButton from './IconButton.svelte';

    /**
     * A dialog that is a centred card where there is room and a full-height
     * sheet where there is not, so a list like the route library is reachable
     * either way without a second component.
     */
    export let open = false;
    export let title: string;
    export let onClose: () => void;
</script>

{#if open}
    <div
        class="scrim"
        role="presentation"
        on:click={(event) => {
            if (event.target === event.currentTarget) onClose();
        }}
    >
        <div class="dialog" class:compact={$compact} role="dialog" aria-modal="true" aria-label={title}>
            <header>
                <h2>{title}</h2>
                <IconButton icon={Close} label="Close" size={18} on:click={onClose} />
            </header>
            <div class="body gm-scroll"><slot /></div>
        </div>
    </div>
{/if}

<svelte:window
    on:keydown={(event) => {
        if (open && event.key === 'Escape') onClose();
    }}
/>

<style>
    .scrim {
        position: absolute;
        inset: 0;
        z-index: 60;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--surface-scrim);
    }
    .dialog {
        display: flex;
        flex-direction: column;
        width: min(560px, calc(100% - 32px));
        max-height: min(70vh, 640px);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow);
    }
    .dialog.compact {
        width: 100%;
        max-height: none;
        height: calc(100% - var(--safe-top));
        margin-top: auto;
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 10px 10px 10px 16px;
        border-bottom: 1px solid var(--border);
    }
    h2 {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
    }
    .body {
        flex: 1;
        min-height: 0;
        padding: 8px 16px calc(16px + var(--safe-bottom));
    }
</style>
