<script lang="ts">
    import { Modal, TextInput } from 'carbon-components-svelte';
    import Download from 'carbon-icons-svelte/lib/Download.svelte';
    import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
    import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
    import { _ } from 'svelte-i18n';
    import type { RouteSummary } from '../lib/library';

    export let open = false;
    export let routes: RouteSummary[] = [];
    export let activeId: string | undefined = undefined;
    export let onClose: () => void;
    export let onLoad: (id: string) => void;
    export let onDelete: (id: string) => void;
    export let onRename: (id: string, name: string) => void;
    export let onExport: (id: string) => void;

    let renamingId: string | null = null;
    let renameValue = '';

    function startRename(summary: RouteSummary) {
        renamingId = summary.id;
        renameValue = summary.name;
    }

    function commitRename() {
        const id = renamingId;
        const name = renameValue.trim();
        renamingId = null;
        if (id && name) {
            onRename(id, name);
        }
    }

    function formatDate(value: number) {
        return new Date(value).toLocaleString();
    }
</script>

<Modal passiveModal bind:open modalHeading={$_('saved_routes')} on:close={onClose} on:click:button--secondary={onClose}>
    {#if routes.length === 0}
        <p class="empty">{$_('no_saved_routes')}</p>
    {:else}
        <ul class="routes">
            {#each routes as summary (summary.id)}
                <li class="route" class:active={summary.id === activeId}>
                    <div class="route-main">
                        {#if renamingId === summary.id}
                            <TextInput
                                size="sm"
                                bind:value={renameValue}
                                labelText={$_('route_name')}
                                hideLabel
                                on:blur={commitRename}
                                on:keydown={(event) => {
                                    if (event.key === 'Enter') commitRename();
                                    if (event.key === 'Escape') renamingId = null;
                                }}
                            />
                        {:else}
                            <button class="route-name" type="button" on:click={() => onLoad(summary.id)}>{summary.name}</button>
                            <div class="route-meta">
                                <span class="tag" class:valhalla={summary.source === 'valhalla'}>{summary.source}</span>
                                <span>{summary.pointCount.toLocaleString()} {$_('points')}</span>
                                {#if summary.hasManeuvers}
                                    <span>· {$_('has_maneuvers')}</span>
                                {/if}
                                <span>· {formatDate(summary.createdAt)}</span>
                            </div>
                        {/if}
                    </div>
                    <div class="route-actions">
                        <button type="button" aria-label={$_('rename')} title={$_('rename')} on:click={() => startRename(summary)}>
                            <Edit size={16} />
                        </button>
                        <button type="button" aria-label={$_('export_gpx')} title={$_('export_gpx')} on:click={() => onExport(summary.id)}>
                            <Download size={16} />
                        </button>
                        <button class="danger" type="button" aria-label={$_('delete')} title={$_('delete')} on:click={() => onDelete(summary.id)}>
                            <TrashCan size={16} />
                        </button>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</Modal>

<style lang="scss">
    .empty {
        padding: 24px 0;
        color: #6f6f6f;
        text-align: center;
    }

    .routes {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .route {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 8px;
        border-bottom: 1px solid #e0e0e0;
    }
    .route.active {
        background: #edf5ff;
    }
    .route-main {
        flex: 1;
        min-width: 0;
    }
    .route-name {
        display: block;
        max-width: 100%;
        overflow: hidden;
        padding: 0;
        border: none;
        background: none;
        color: #0f62fe;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .route-name:hover {
        text-decoration: underline;
    }
    .route-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
        margin-top: 2px;
        color: #6f6f6f;
        font-size: 11px;
    }
    .tag {
        margin-right: 2px;
        padding: 1px 6px;
        background: #d0e2ff;
        color: #0043ce;
        font-size: 10px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
    }
    .tag.valhalla {
        background: #d9fbfb;
        color: #005d5d;
    }

    .route-actions {
        display: flex;
        flex-shrink: 0;
        gap: 2px;
    }
    .route-actions button {
        display: flex;
        padding: 6px;
        border: none;
        background: none;
        color: #525252;
        cursor: pointer;
    }
    .route-actions button:hover {
        background: #e0e0e0;
    }
    .route-actions button.danger:hover {
        background: #fff1f1;
        color: #da1e28;
    }
</style>
