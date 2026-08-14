<script lang="ts">
    import Reset from 'carbon-icons-svelte/lib/Reset.svelte';
    import { _ } from 'svelte-i18n';
    import { COSTING_SPECS, withDefaults, type CostingValues } from '../lib/costing';
    import { COSTING_MODELS, type Costing } from '../lib/valhalla';

    export let costing: Costing;
    export let values: CostingValues;
    export let onCosting: (costing: Costing) => void;
    /** patch, not a whole object: `current` is a reactive derivation and lags a
        change by a flush, so merging in here would drop a neighbouring edit */
    export let onChange: (patch: CostingValues) => void;
    export let onReset: () => void;
    /** true inside the route builder, where the panel sits on a coloured bar */
    export let compact = false;

    $: specs = COSTING_SPECS[costing] || [];
    $: current = withDefaults(costing, values);
    $: changed = specs.filter((spec) => current[spec.key] !== spec.default).length;

    function set(key: string, value: number | string | boolean) {
        onChange({ [key]: value });
    }

    // markup expressions are not preprocessed as TypeScript, so the cast has to
    // live in here rather than inline on the handler
    function pickCosting(value: string) {
        onCosting(value as Costing);
    }
</script>

<div class="costing" class:compact>
    <div class="costing-head">
        <label class="profile">
            <span>{$_('costing')}</span>
            <select value={costing} on:change={(event) => pickCosting(event.currentTarget.value)}>
                {#each COSTING_MODELS as model}
                    <option value={model}>{$_(`costing_${model}`)}</option>
                {/each}
            </select>
        </label>
        <button type="button" class="reset" disabled={changed === 0} title={$_('reset_costing_options')} on:click={onReset}>
            <Reset size={16} />
            <span>{changed > 0 ? $_('changed_count', { values: { count: changed } }) : $_('defaults')}</span>
        </button>
    </div>

    <div class="options">
        {#each specs as spec (spec.key)}
            <div class="option" class:modified={current[spec.key] !== spec.default}>
                <div class="option-label">
                    <span class="key" title={spec.help}>{spec.label}</span>
                    {#if spec.fork}
                        <span class="fork" title={$_('fork_only_hint')}>fork</span>
                    {/if}
                </div>

                {#if spec.kind === 'ratio'}
                    <div class="control">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            aria-label={spec.label}
                            value={current[spec.key]}
                            on:input={(event) => set(spec.key, parseFloat(event.currentTarget.value))}
                        />
                        <span class="value">{Number(current[spec.key]).toFixed(2)}</span>
                    </div>
                {:else if spec.kind === 'number'}
                    <div class="control">
                        <input
                            type="range"
                            min={spec.min}
                            max={spec.max}
                            step={spec.step}
                            aria-label={spec.label}
                            value={current[spec.key]}
                            on:input={(event) => set(spec.key, parseFloat(event.currentTarget.value))}
                        />
                        <span class="value">{current[spec.key]}{spec.unit ? ` ${spec.unit}` : ''}</span>
                    </div>
                {:else if spec.kind === 'select'}
                    <div class="control">
                        <select aria-label={spec.label} value={current[spec.key]} on:change={(event) => set(spec.key, event.currentTarget.value)}>
                            {#each spec.options as option}
                                <option value={option}>{option}</option>
                            {/each}
                        </select>
                    </div>
                {:else}
                    <div class="control">
                        <label class="switch">
                            <input type="checkbox" aria-label={spec.label} checked={!!current[spec.key]} on:change={(event) => set(spec.key, event.currentTarget.checked)} />
                            <span>{current[spec.key] ? $_('on') : $_('off')}</span>
                        </label>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .costing {
        color: #f4f4f4;
        font-size: 11px;
    }

    .costing-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
    }
    .profile {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .profile > span {
        color: #a8a8a8;
        letter-spacing: 0.02em;
        text-transform: uppercase;
    }

    select {
        padding: 3px 6px;
        border: 1px solid #6f6f6f;
        background: #262626;
        color: #f4f4f4;
        font-family: inherit;
        font-size: 11px;
    }
    .compact select {
        border-color: rgba(255, 255, 255, 0.5);
        background: rgba(0, 0, 0, 0.35);
    }

    .reset {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 6px;
        border: 1px solid transparent;
        background: none;
        color: #a8a8a8;
        cursor: pointer;
        font-size: 11px;
    }
    .reset:hover:not(:disabled) {
        border-color: #8d8d8d;
        color: #f4f4f4;
    }
    .reset:disabled {
        cursor: default;
    }

    .options {
        display: grid;
        max-height: 190px;
        gap: 4px 16px;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        overflow-y: auto;
    }
    .option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-width: 0;
    }
    .option-label {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
    }
    .key {
        overflow: hidden;
        color: #c6c6c6;
        font-family: 'IBM Plex Mono', monospace;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .option.modified .key {
        color: #f4f4f4;
        font-weight: 600;
    }
    .fork {
        flex-shrink: 0;
        padding: 0 4px;
        background: #8a3ffc;
        color: #fff;
        font-size: 9px;
        letter-spacing: 0.03em;
        text-transform: uppercase;
    }

    .control {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        gap: 6px;
    }
    .control input[type='range'] {
        width: 84px;
    }
    .value {
        width: 58px;
        font-family: 'IBM Plex Mono', monospace;
        text-align: right;
    }

    .switch {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
    }
</style>
