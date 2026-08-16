import { addPluginListener, invoke, type PluginListener } from '@tauri-apps/api/core';
import { writable, type Readable } from 'svelte/store';
import { isSelfMocking } from './platform';
import { trackPayload, type BakedTrack } from './track';

const PLUGIN = 'mock-location';

export interface MockStatus {
    /** false everywhere the platform has no test location provider */
    available: boolean;
    /** the user has picked this app in Developer options → mock location app */
    selectedAsMockApp: boolean;
    /** the app currently holds the test providers, service or not */
    mocking: boolean;
}

/**
 * When the Android build may put its ongoing notification in the shade.
 *
 * `always` — the default — is what tells the person holding the device that
 * every app on it is reading a mocked position, including when a desktop is the
 * one driving over adb. It also carries the only Stop button reachable from
 * outside the app.
 *
 * `never` costs more than the notification: the playback clock lives in a
 * foreground service, a foreground service must show one, so `never` means
 * on-device playback stops surviving the app going to the background.
 */
export type NotificationMode = 'always' | 'playing' | 'never';

export interface MockProgress {
    /** milliseconds into the baked track */
    positionMs: number;
    /** the track ran out and looping is off */
    ended: boolean;
    lat?: number;
    lon?: number;
    bearing?: number;
    speed?: number;
}

const OFFLINE: MockStatus = { available: false, selectedAsMockApp: false, mocking: false };

const state = writable<MockStatus>(OFFLINE);

/** Current provider status. Stays at `available: false` off Android. */
export const mockStatus: Readable<MockStatus> = { subscribe: state.subscribe };

async function call<T>(command: string, payload?: unknown): Promise<T> {
    return invoke<T>(`plugin:${PLUGIN}|${command}`, payload === undefined ? undefined : { payload });
}

export async function refreshStatus(): Promise<MockStatus> {
    if (!isSelfMocking) {
        state.set(OFFLINE);
        return OFFLINE;
    }
    const status = await call<MockStatus>('check_status');
    state.set(status);
    return status;
}

/**
 * Opens the developer settings screen, which is the only place the mock app can
 * be selected: there is no runtime prompt for it.
 */
export async function openDeveloperSettings() {
    if (isSelfMocking) {
        await call('open_developer_settings');
    }
}

/**
 * Claims the test providers.
 *
 * Rejects when the app is not the selected mock app, or when the location
 * permission is refused. Whether a foreground service comes with it is the
 * notification setting's business, not this one's.
 */
export async function startMocking(): Promise<MockStatus> {
    const status = await call<MockStatus>('start_mocking');
    state.set(status);
    return status;
}

export async function stopMocking(): Promise<MockStatus> {
    if (!isSelfMocking) {
        return OFFLINE;
    }
    const status = await call<MockStatus>('stop_mocking');
    state.set(status);
    return status;
}

export async function pushLocation(fix: { lat: number; lon: number; altitude?: number; bearing?: number; speed?: number; accuracy?: number }) {
    if (isSelfMocking) {
        await call('push_location', fix);
    }
}

export async function setTrack(track: BakedTrack) {
    if (isSelfMocking) {
        await call('set_route', trackPayload(track));
    }
}

/** Persisted natively: the service can outlive the webview that set it. */
export async function setNotificationMode(mode: NotificationMode) {
    if (isSelfMocking) {
        await call('set_notification_mode', { mode });
    }
}

export async function setPlayback(next: { playing?: boolean; positionMs?: number; speedMultiplier?: number; looping?: boolean }) {
    if (isSelfMocking) {
        await call('set_playback', next);
    }
}

/**
 * Position reports from the service's own clock.
 *
 * This is what keeps the map in step after the webview has been backgrounded:
 * its timers get throttled to a stop while the service keeps driving, so on the
 * way back the UI follows these rather than its own elapsed time.
 */
export async function onProgress(callback: (progress: MockProgress) => void): Promise<() => void> {
    if (!isSelfMocking) {
        return () => undefined;
    }
    const listener: PluginListener = await addPluginListener<MockProgress>(PLUGIN, 'progress', callback);
    return () => listener.unregister();
}

/** Fires when the service goes away, including from its own notification. */
export async function onStopped(callback: () => void): Promise<() => void> {
    if (!isSelfMocking) {
        return () => undefined;
    }
    const listener: PluginListener = await addPluginListener(PLUGIN, 'stopped', () => {
        state.update((s) => ({ ...s, mocking: false }));
        callback();
    });
    return () => listener.unregister();
}
