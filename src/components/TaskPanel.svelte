<script lang="ts">
    import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';
    import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';
    import Close from 'carbon-icons-svelte/lib/Close.svelte';
    import ErrorFilled from 'carbon-icons-svelte/lib/ErrorFilled.svelte';
    import { _ } from 'svelte-i18n';
    import type { Task } from '../lib/tasks';

    export let task: Task = null;
    export let onDismiss: () => void;

    $: doneCount = task ? task.steps.filter((s) => s.status === 'done' || s.status === 'error').length : 0;
</script>

{#if task}
    <div class="task-panel" class:failed={task.failed}>
        <div class="task-header">
            <span class="task-title">{task.title}</span>
            <button class="task-close" type="button" aria-label={$_('task_dismiss')} on:click={onDismiss}>
                <Close size={16} />
            </button>
        </div>
        <div class="task-progress" role="progressbar" aria-valuenow={doneCount} aria-valuemin="0" aria-valuemax={task.steps.length}>
            <span style:width="{task.steps.length ? (doneCount / task.steps.length) * 100 : 0}%" />
        </div>
        {#if task.steps.length > 1}
            <div class="task-count">{doneCount} / {task.steps.length}</div>
        {/if}
        <ul class="task-steps">
            {#each task.steps as step}
                <li class="task-step" class:is-error={step.status === 'error'}>
                    <span class="task-step-icon">
                        {#if step.status === 'done'}
                            <CheckmarkFilled size={16} class="icon-done" />
                        {:else if step.status === 'error'}
                            <ErrorFilled size={16} class="icon-error" />
                        {:else if step.status === 'running'}
                            <span class="task-spinner" />
                        {:else}
                            <CircleDash size={16} class="icon-pending" />
                        {/if}
                    </span>
                    <span class="task-step-body">
                        <span class="task-step-label" title={step.command}>{step.label}</span>
                        {#if step.detail}
                            <span class="task-step-detail">{step.detail}</span>
                        {/if}
                    </span>
                </li>
            {/each}
        </ul>
        {#if task.summary}
            <div class="task-summary">{task.summary}</div>
        {/if}
    </div>
{/if}

<style lang="scss">
    .task-panel {
        width: 100%;
        padding: 12px 16px 14px;
        background: var(--surface-raised);
        color: var(--text);
        border: 1px solid var(--border);
        border-left: 3px solid var(--accent);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        font-size: 12px;
    }
    .task-panel.failed {
        border-left-color: var(--danger);
    }

    .task-progress {
        height: 4px;
        border-radius: 2px;
        background: var(--border-strong);
        overflow: hidden;
    }
    .task-progress span {
        display: block;
        height: 100%;
        background: var(--accent);
        transition: width 160ms ease;
    }
    .task-panel.failed .task-progress span {
        background: var(--danger);
    }
    .task-count {
        margin-top: 4px;
        color: var(--text-faint);
        font-size: 11px;
    }

    .task-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
    }
    .task-title {
        font-size: 14px;
        font-weight: 600;
    }
    .task-close {
        display: flex;
        padding: 2px;
        border: none;
        background: none;
        color: inherit;
        cursor: pointer;
    }

    .task-steps {
        max-height: 240px;
        margin: 10px 0 0;
        padding: 0;
        overflow-y: auto;
        list-style: none;
    }
    .task-step {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 3px 0;
    }
    .task-step-icon {
        display: flex;
        flex: 0 0 16px;
        align-items: center;
        height: 16px;
    }
    .task-step-body {
        display: flex;
        min-width: 0;
        flex-direction: column;
    }
    .task-step-label {
        word-break: break-word;
    }
    .task-step-detail {
        color: var(--text-muted);
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        white-space: pre-wrap;
        word-break: break-word;
    }
    .task-step.is-error .task-step-detail {
        color: var(--danger);
    }

    .task-summary {
        margin-top: 10px;
        font-weight: 600;
    }
    .task-panel.failed .task-summary {
        color: var(--danger);
    }

    .task-spinner {
        width: 12px;
        height: 12px;
        margin: 2px;
        border: 2px solid var(--border-strong);
        border-top-color: var(--text);
        border-radius: 50%;
        animation: task-spin 0.8s linear infinite;
    }
    @keyframes task-spin {
        to {
            transform: rotate(360deg);
        }
    }

    :global(.task-step .icon-done) {
        fill: var(--success);
    }
    :global(.task-step .icon-error) {
        fill: var(--danger);
    }
    :global(.task-step .icon-pending) {
        fill: var(--text-faint);
    }
</style>
