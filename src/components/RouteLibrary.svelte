<script lang="ts">
    import Download from 'carbon-icons-svelte/lib/Download.svelte';
    import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
    import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
    import { _ } from 'svelte-i18n';
    import type { RouteSummary } from '../lib/library';
    import IconButton from './ui/IconButton.svelte';
    import Overlay from './ui/Overlay.svelte';

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

<Overlay {open} title={$_('saved_routes')} {onClose}>
    {#if routes.length === 0}
        <p class="empty">{$_('no_saved_routes')}</p>
    {:else}
        <ul class="routes">
            {#each routes as summary (summary.id)}
                <li class="route" class:active={summary.id === activeId}>
                    <div class="route-main">
                        {#if renamingId === summary.id}
                            <!-- svelte-ignore a11y-autofocus -->
                            <input
                                class="rename"
                                type="text"
                                autofocus
                                aria-label={$_('route_name')}
                                bind:value={renameValue}
                                on:blur={commitRename}
                                on:keydown={(event) => {
                                    if (event.key === 'Enter') commitRename();
                                    if (event.key === 'Escape') renamingId = null;
                                    event.stopPropagation();
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
                        <IconButton icon={Edit} label={$_('rename')} size={16} on:click={() => startRename(summary)} />
                        <IconButton icon={Download} label={$_('export_gpx')} size={16} on:click={() => onExport(summary.id)} />
                        <IconButton icon={TrashCan} label={$_('delete')} size={16} on:click={() => onDelete(summary.id)} />
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</Overlay>

<style>
    .empty {
        padding: 32px 0;
        color: var(--text-faint);
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
        gap: 8px;
        padding: 8px 0;
        border-bottom: 1px solid var(--border);
    }
    .route.active {
        /* a full tint would fight the map behind a translucent sheet */
        box-shadow: inset 2px 0 0 var(--accent);
        padding-left: 10px;
    }
    .route-main {
        flex: 1;
        min-width: 0;
    }
    .route-name {
        display: block;
        max-width: 100%;
        min-height: 24px;
        overflow: hidden;
        padding: 0;
        border: none;
        background: none;
        color: var(--text);
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .route-name:hover {
        color: var(--accent);
    }
    .rename {
        width: 100%;
        min-height: var(--control-h);
        padding: 0 8px;
        border: 1px solid var(--accent);
        border-radius: var(--radius);
        background: var(--surface-sunken);
        font-size: 14px;
    }
    .route-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
        margin-top: 2px;
        color: var(--text-faint);
        font-size: 11px;
    }
    .tag {
        margin-right: 2px;
        padding: 1px 6px;
        border-radius: 4px;
        background: var(--accent-soft);
        color: var(--accent-text);
        font-size: 10px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
    }
    .tag.valhalla {
        background: var(--success-soft);
        color: var(--success-text);
    }

    .route-actions {
        display: flex;
        flex-shrink: 0;
        gap: 2px;
    }
</style>
