<script lang="ts">
    import Close from 'carbon-icons-svelte/lib/Close.svelte';
    import IconButton from '../ui/IconButton.svelte';

    export let title: string;
    export let open = false;
    export let onClose: () => void;
</script>

{#if open}
    <aside class="inspector" aria-label={title}>
        <header>
            <h2>{title}</h2>
            <IconButton icon={Close} label="Close" size={18} on:click={onClose} />
        </header>
        <div class="body gm-scroll"><slot /></div>
    </aside>
{/if}

<style>
    .inspector {
        position: absolute;
        top: 8px;
        bottom: 8px;
        /* clears the rail rather than overlapping it, so both stay usable */
        left: 68px;
        z-index: 29;
        width: 320px;
        display: flex;
        flex-direction: column;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow);
    }
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 8px 8px 16px;
        border-bottom: 1px solid var(--border);
    }
    h2 {
        margin: 0;
        font-size: 13px;
        font-weight: 500;
    }
    .body {
        flex: 1;
        min-height: 0;
        padding: 4px 16px 16px;
    }
</style>
