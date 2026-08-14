<script lang="ts">
    export let value = '';
    export let label: string | undefined = undefined;
    export let help: string | undefined = undefined;
    export let placeholder = '';
    export let type: 'text' | 'number' | 'url' = 'text';
    export let min: number | undefined = undefined;
    export let max: number | undefined = undefined;
    export let disabled = false;
</script>

<label class="field">
    {#if label}<span class="label">{label}</span>{/if}
    <!-- one input per branch so `type` stays static: svelte cannot bind a value
         through a dynamic type attribute -->
    {#if type === 'number'}
        <input type="number" {min} {max} {placeholder} {disabled} bind:value on:blur on:change on:input />
    {:else}
        <input type="text" {placeholder} {disabled} autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" bind:value on:blur on:change on:input />
    {/if}
    {#if help}<span class="help">{help}</span>{/if}
</label>

<style>
    .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 4px 0;
    }
    .label {
        font-size: 12px;
        color: var(--text-muted);
    }
    .help {
        font-size: 11px;
        color: var(--text-faint);
    }
    input {
        width: 100%;
        min-height: var(--control-h);
        padding: 0 10px;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        background: var(--surface-sunken);
        color: var(--text);
        font-size: 13px;
        /* a tap has to land in the text, not be swallowed as a pan */
        touch-action: manipulation;
    }
    input:hover:not(:disabled) {
        border-color: var(--border-strong);
    }
    input:focus {
        border-color: var(--accent);
    }
    input:disabled {
        opacity: 0.45;
    }
</style>
