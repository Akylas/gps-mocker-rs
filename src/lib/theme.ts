import { derived, writable, type Readable } from 'svelte/store';

export type ThemePreference = 'auto' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * What the OS is asking for right now.
 *
 * Live rather than read-once: macOS, Windows and Android all flip this while
 * the app is open — on a schedule, or with the system-wide toggle — and an
 * app on Auto is expected to follow without a restart.
 */
const systemPrefersDark: Readable<boolean> = writable(matches(), (set) => {
    if (typeof matchMedia !== 'function') {
        return;
    }
    const query = matchMedia(DARK_QUERY);
    const update = () => set(query.matches);
    query.addEventListener('change', update);
    update();
    return () => query.removeEventListener('change', update);
});

const preference = writable<ThemePreference>(read());

export const themePreference: Readable<ThemePreference> = { subscribe: preference.subscribe };

export const resolvedTheme: Readable<ResolvedTheme> = derived([preference, systemPrefersDark], ([$preference, $dark]) => ($preference === 'auto' ? ($dark ? 'dark' : 'light') : $preference));

export function setThemePreference(next: ThemePreference) {
    preference.set(next ?? 'auto');
}

// A live subscription rather than a call from a component: `derived` only
// recomputes while something is listening, and the whole point of Auto is that
// it keeps tracking the system with no screen mounted to watch it.
resolvedTheme.subscribe((theme) => {
    if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme;
    }
});

function matches() {
    return typeof matchMedia === 'function' ? matchMedia(DARK_QUERY).matches : false;
}

/**
 * The preference the pre-paint script in index.html already read. Reusing what
 * it stashed keeps the two from disagreeing on the first frame.
 */
function read(): ThemePreference {
    const stashed = typeof document !== 'undefined' ? document.documentElement.dataset.themePreference : undefined;
    return stashed === 'light' || stashed === 'dark' ? stashed : 'auto';
}
