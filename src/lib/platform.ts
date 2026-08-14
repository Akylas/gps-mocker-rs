import { type as osType } from '@tauri-apps/plugin-os';

export type Host = 'macos' | 'windows' | 'linux' | 'android' | 'ios' | 'unknown';

function detect(): Host {
    try {
        switch (osType()) {
            case 'macos':
                return 'macos';
            case 'windows':
                return 'windows';
            case 'linux':
                return 'linux';
            case 'android':
                return 'android';
            case 'ios':
                return 'ios';
            default:
                return 'unknown';
        }
    } catch (error) {
        // `npm run dev:web` runs the frontend in a plain browser, with no tauri
        // backend behind it
        return 'unknown';
    }
}

export const host: Host = detect();

// lets the stylesheet key platform quirks off the document rather than making
// every component ask what it is running on
if (typeof document !== 'undefined') {
    document.documentElement.dataset.host = host;
}

/** True where the app mocks its own location instead of driving another device. */
export const isSelfMocking = host === 'android';

export const isDesktop = host === 'macos' || host === 'windows' || host === 'linux' || host === 'unknown';

/**
 * Layout, not hardware: a narrow desktop window gets the touch shell too, which
 * is also how the phone layout stays testable without a device.
 */
export const COMPACT_BREAKPOINT = 840;
