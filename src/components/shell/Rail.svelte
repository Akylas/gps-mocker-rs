<script lang="ts">
    /**
     * The pointer shell's chrome: a narrow icon column pinned to the left edge.
     *
     * It replaces the old app header. A header costs a full band of vertical
     * space on a map that wants all of it, and its side panel could only ever
     * open over the whole screen.
     */
</script>

<nav class="rail" aria-label="Tools">
    <div class="group"><slot name="top" /></div>
    <div class="spacer" />
    <div class="group"><slot name="bottom" /></div>
</nav>

<style>
    .rail {
        position: absolute;
        top: 8px;
        bottom: 8px;
        left: 8px;
        z-index: 30;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 6px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow);
    }
    .group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .spacer {
        flex: 1;
    }
</style>
