<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { mockStatus, openDeveloperSettings, refreshStatus, startMocking, stopMocking, type MockStatus } from '../lib/mockProvider';
    import Button from './ui/Button.svelte';
    import Toggle from './ui/Toggle.svelte';

    /**
     * Android's own mocking, which needs no adb and no second device: the app
     * registers itself as a test location provider.
     *
     * The one thing it cannot do for the user is select itself under Developer
     * options — there is no runtime prompt for that op — so the onboarding
     * card is the whole point of this panel.
     */
    export let onError: (error: unknown) => void = () => undefined;

    let busy = false;

    $: status = $mockStatus as MockStatus;

    // the markup cannot carry a type cast, so the event is unpacked here
    function onToggleChange(event: Event) {
        toggle((event.currentTarget as HTMLInputElement).checked);
    }

    async function toggle(next: boolean) {
        busy = true;
        try {
            if (next) {
                await startMocking();
            } else {
                await stopMocking();
            }
        } catch (error) {
            onError(error);
            await refreshStatus();
        } finally {
            busy = false;
        }
    }
</script>

{#if !status.selectedAsMockApp}
    <div class="card">
        <p class="title">{$_('mock_provider_setup')}</p>
        <p class="body">{$_('mock_provider_setup_hint')}</p>
        <div class="actions">
            <Button kind="primary" size="small" on:click={() => openDeveloperSettings()}>{$_('open_developer_settings')}</Button>
            <Button kind="ghost" size="small" on:click={() => refreshStatus()}>{$_('recheck')}</Button>
        </div>
    </div>
{:else}
    <Toggle label={$_('mock_enabled')} description={status.mocking ? $_('mock_provider_running') : $_('mock_provider_idle')} checked={status.mocking} disabled={busy} on:change={onToggleChange} />
{/if}

<style>
    .card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        margin: 8px 0;
        border: 1px solid var(--border-strong);
        border-radius: var(--radius);
        background: var(--surface-raised);
    }
    .title {
        margin: 0;
        font-size: 13px;
        font-weight: 500;
    }
    .body {
        margin: 0;
        font-size: 12px;
        line-height: 1.5;
        color: var(--text-muted);
    }
    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
</style>
