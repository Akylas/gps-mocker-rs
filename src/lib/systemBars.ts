import { invoke } from '@tauri-apps/api/core';
import { isSelfMocking } from './platform';
import { resolvedTheme } from './theme';

/**
 * Keeps Android's status and navigation bar icons legible against the shell.
 *
 * The app draws edge to edge, so those bars sit over the map, and their icon
 * colour is the one piece of chrome CSS cannot reach. The night resource
 * qualifier gets it right at launch and never again: uiMode is in the
 * activity's configChanges so the window is not recreated, and an in-app
 * Appearance override is invisible to the qualifier anyway.
 *
 * No-op off Android, where the window chrome belongs to the platform.
 */
export function followSystemBars() {
    if (!isSelfMocking) {
        return () => undefined;
    }
    return resolvedTheme.subscribe((theme) => {
        invoke('plugin:mock-location|set_system_bars', { payload: { dark: theme === 'dark' } }).catch((error) => console.warn('could not restyle the system bars', error));
    });
}
