<script lang="ts">
    import Close from 'carbon-icons-svelte/lib/Close.svelte';
    import Search from 'carbon-icons-svelte/lib/Search.svelte';

    export let value = '';
    export let results: { text: string; description: string }[] = [];
    export let placeholder = '';
    export let onSelect: (index: number) => void;
    /** the touch shell floats this over the map, the pointer shell docks it */
    export let floating = false;

    let open = false;
    let input: HTMLInputElement;

    function pick(index: number) {
        open = false;
        input?.blur();
        onSelect(index);
    }

    function onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            open = false;
            input?.blur();
        }
        if (event.key === 'Enter' && results.length) {
            event.preventDefault();
            pick(0);
        }
        // the map binds W/A/S/D and space; typing must never reach it
        event.stopPropagation();
    }
</script>

<div class="search" class:floating>
    <div class="box">
        <span class="icon"><Search size={16} /></span>
        <input
            bind:this={input}
            bind:value
            {placeholder}
            type="text"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            aria-label={placeholder}
            on:focus={() => (open = true)}
            on:keydown={onKeydown}
        />
        {#if value}
            <button
                type="button"
                class="clear"
                aria-label="Clear"
                on:click={() => {
                    value = '';
                    results = [];
                }}><Close size={16} /></button
            >
        {/if}
    </div>

    {#if open && results.length}
        <ul class="results gm-scroll">
            {#each results as result, index}
                <li>
                    <button type="button" on:click={() => pick(index)}>
                        <span class="text">{result.text}</span>
                        {#if result.description}<span class="description">{result.description}</span>{/if}
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .search {
        position: relative;
        width: 100%;
    }
    .box {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: var(--control-h);
        padding: 0 10px;
        background: var(--surface-sunken);
        border: 1px solid var(--border);
        border-radius: var(--radius);
    }
    .floating .box {
        background: var(--surface);
        border-radius: var(--radius-pill);
        box-shadow: var(--shadow);
        padding: 0 14px;
    }
    .box:focus-within {
        border-color: var(--accent);
    }
    .icon {
        display: inline-flex;
        color: var(--text-faint);
    }
    input {
        flex: 1;
        min-width: 0;
        border: none;
        background: transparent;
        font-size: 13px;
        touch-action: manipulation;
    }
    .clear {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--text-faint);
        cursor: pointer;
    }

    .results {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        max-height: 40vh;
        margin: 0;
        padding: 4px;
        list-style: none;
        background: var(--surface-raised);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        z-index: 5;
    }
    .results button {
        display: flex;
        flex-direction: column;
        gap: 2px;
        width: 100%;
        min-height: var(--tap);
        padding: 6px 10px;
        border: none;
        border-radius: 6px;
        background: transparent;
        text-align: left;
        cursor: pointer;
    }
    .results button:hover {
        background: var(--surface);
    }
    .text {
        font-size: 13px;
    }
    .description {
        font-size: 11px;
        color: var(--text-faint);
    }
</style>
