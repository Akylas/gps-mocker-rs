<script lang="ts">
    /**
     * The touch shell's one panel: a bottom sheet with three detents.
     *
     * Peek is the transport row and nothing else, so the controls that matter
     * during a drive sit in the thumb zone and the map keeps the rest of the
     * screen. Half adds the route detail, full is the settings.
     */
    import type { Detent } from '../../lib/layout';

    export let detent: Detent = 'peek';
    /** hidden entirely, e.g. while the reticle is placing a waypoint */
    export let hidden = false;

    let sheet: HTMLElement;
    let peekHeight = 0;
    let viewportHeight = 0;
    /** live height while a drag is in flight; null when settled */
    let dragHeight: number | null = null;

    let activePointer: number | null = null;
    let startY = 0;
    let startHeight = 0;
    let dragging = false;
    /** the scroll container the gesture started in, if any */
    let scroller: HTMLElement | null = null;
    /** set for the click that follows a drag, so it is not read as a tap too */
    let suppressTap = false;

    /** clear of the status bar and the search pill above it */
    const TOP_INSET = 76;
    /** the drag handle sits above the peek row and is part of every detent */
    const GRABBER_H = 22;
    /** slop before a press counts as a drag rather than a tap */
    const DRAG_SLOP = 6;

    /**
     * Controls that own a drag of their own, so the sheet must keep its hands
     * off: a slider tracks the finger, a text field sets a caret and selects.
     *
     * Buttons are deliberately absent. Most of the peek row is buttons, and
     * refusing to drag from them would mean "drag anywhere" was really "drag
     * from the few gaps in between". A press that turns into a drag is captured
     * by the sheet, which retargets the click away from the button, so the two
     * gestures do not collide.
     */
    const GESTURE_OWNERS = 'input[type="range"], input[type="text"], input[type="number"], input[type="url"], input[type="search"], select, textarea, [contenteditable="true"]';

    $: minHeight = peekHeight + GRABBER_H;
    $: heights = {
        peek: minHeight,
        half: Math.max(minHeight, viewportHeight * 0.5),
        full: Math.max(minHeight, viewportHeight - TOP_INSET)
    } as Record<Detent, number>;

    $: height = dragHeight ?? heights[detent];

    function nearestDetent(target: number): Detent {
        return (Object.keys(heights) as Detent[]).reduce((best, key) => (Math.abs(heights[key] - target) < Math.abs(heights[best] - target) ? key : best));
    }

    function onPointerDown(event: PointerEvent) {
        if (event.button > 0) {
            return;
        }
        // a fresh gesture: whatever the last one was, it is over
        suppressTap = false;

        const target = event.target as HTMLElement;
        // the handle is a drag affordance, not a control — its button role is
        // there for keyboard users and must not disqualify it here
        const onGrabber = !!target.closest?.('.grabber');
        if (!onGrabber && target.closest?.(GESTURE_OWNERS)) {
            return;
        }

        scroller = onGrabber ? null : target.closest?.('.gm-scroll') ?? null;
        activePointer = event.pointerId;
        startY = event.clientY;
        startHeight = heights[detent];
        dragging = false;
    }

    function onPointerMove(event: PointerEvent) {
        if (activePointer !== event.pointerId) {
            return;
        }
        const dy = event.clientY - startY;

        if (!dragging) {
            if (Math.abs(dy) < DRAG_SLOP) {
                return;
            }
            // Inside the scrolling body the content has first claim. The sheet
            // only takes the gesture when that content is already at its top
            // and the finger is heading down, which is the one case where
            // scrolling has nowhere left to go.
            if (scroller && !(dy > 0 && scroller.scrollTop <= 0)) {
                activePointer = null;
                return;
            }
            dragging = true;
            // capture keeps the moves coming once the finger leaves the sheet,
            // but a pointer that is already gone makes it throw
            try {
                sheet.setPointerCapture(event.pointerId);
            } catch {
                /* the drag still works, it just ends at the edge */
            }
        }

        // the sheet grows upwards, so a drag towards the top is a bigger sheet
        dragHeight = Math.min(heights.full, Math.max(heights.peek, startHeight - dy));
    }

    function onPointerUp(event: PointerEvent) {
        if (activePointer !== event.pointerId) {
            return;
        }
        const settled = dragHeight;
        const wasDragging = dragging;

        activePointer = null;
        dragging = false;
        dragHeight = null;
        scroller = null;

        if (wasDragging && settled !== null) {
            // Always the closest detent. Anything else strands a long drag
            // somewhere the user did not aim for.
            detent = nearestDetent(settled);
            suppressTap = true;
        }
    }

    function onGrabberClick() {
        if (suppressTap) {
            // the click the browser fires at the end of a drag; the drag has
            // already chosen a detent
            suppressTap = false;
            return;
        }
        // a tap rather than a drag: step up, and wrap round at the top
        detent = detent === 'peek' ? 'half' : detent === 'half' ? 'full' : 'peek';
    }
</script>

<svelte:window bind:innerHeight={viewportHeight} />

<div
    class="sheet"
    class:hidden
    class:dragging
    style:height="{height}px"
    bind:this={sheet}
    on:pointerdown={onPointerDown}
    on:pointermove={onPointerMove}
    on:pointerup={onPointerUp}
    on:pointercancel={onPointerUp}
>
    <div
        class="grabber"
        role="button"
        tabindex="0"
        aria-label="Resize panel"
        on:click={onGrabberClick}
        on:keydown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onGrabberClick();
            }
        }}
    >
        <span class="bar" />
    </div>

    <div class="peek" bind:clientHeight={peekHeight}>
        <slot name="peek" />
    </div>

    <div class="body gm-scroll" class:visible={detent !== 'peek' || dragging}>
        <slot />
    </div>
</div>

<style>
    .sheet {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 40;
        display: flex;
        flex-direction: column;
        background: var(--surface);
        border-top: 1px solid var(--border);
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        box-shadow: var(--shadow);
        /* the drag is ours anywhere the body is not scrolling */
        touch-action: none;
        /* only animate when the drag has let go, or the sheet lags the finger */
        transition: height 220ms cubic-bezier(0.2, 0, 0, 1), transform 220ms ease;
    }
    .sheet.dragging {
        transition: none;
    }
    .sheet.hidden {
        transform: translateY(110%);
    }

    .grabber {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 22px;
        flex: 0 0 auto;
        cursor: grab;
    }
    .bar {
        width: 36px;
        height: 4px;
        border-radius: 2px;
        background: var(--border-strong);
    }

    .peek {
        flex: 0 0 auto;
        padding: 0 12px calc(10px + var(--safe-bottom));
    }

    .body {
        flex: 1 1 auto;
        min-height: 0;
        display: none;
        padding: 0 16px calc(16px + var(--safe-bottom));
    }
    .body.visible {
        display: block;
    }
</style>
