import { readable } from 'svelte/store';
import { COMPACT_BREAKPOINT } from './platform';

/** How far the touch shell's bottom sheet is pulled up. */
export type Detent = 'peek' | 'half' | 'full';

/**
 * True when the window is narrow enough to want the touch shell.
 *
 * Deliberately a width query and not a platform check: a phone-sized desktop
 * window gets the same layout, which is the only practical way to work on it
 * without a device in hand.
 */
export const compact = readable(matches(), (set) => {
    if (typeof matchMedia !== 'function') {
        return;
    }
    const query = matchMedia(`(max-width: ${COMPACT_BREAKPOINT - 1}px)`);
    const update = () => set(query.matches);
    query.addEventListener('change', update);
    update();
    return () => query.removeEventListener('change', update);
});

function matches() {
    return typeof matchMedia === 'function' ? matchMedia(`(max-width: ${COMPACT_BREAKPOINT - 1}px)`).matches : false;
}
