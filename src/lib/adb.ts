import { Command } from '@tauri-apps/plugin-shell';
import { writable, type Readable } from 'svelte/store';
import type { Position } from './geo';

/**
 * Talking to Android devices over adb, from the desktop build.
 *
 * `adb` refuses every command with "more than one device/emulator" as soon as a
 * phone and an emulator are both attached, which is the normal state of a
 * developer's machine. Every call here is therefore pinned to a serial.
 */

export interface AdbDevice {
    serial: string;
    /** `device`, or `unauthorized` / `offline` for one that cannot be driven */
    state: string;
    model?: string;
}

/** `auto` picks the only connected device; `all` fans out; anything else is a serial. */
export type AdbTarget = 'auto' | 'all' | string;

const devices = writable<AdbDevice[]>([]);

/** Everything adb currently reports, refreshed by `refreshDevices`. */
export const adbDevices: Readable<AdbDevice[]> = { subscribe: devices.subscribe };

/** How long a device listing is reused before adb is asked again. */
const CACHE_MS = 5000;
let lastListedAt = 0;
let inFlight: Promise<AdbDevice[]> | undefined;

export async function refreshDevices(): Promise<AdbDevice[]> {
    lastListedAt = 0;
    return listDevices();
}

export async function listDevices(): Promise<AdbDevice[]> {
    const now = Date.now();
    if (inFlight) {
        return inFlight;
    }
    if (now - lastListedAt < CACHE_MS) {
        return current();
    }

    inFlight = (async () => {
        try {
            const result = await Command.create('adb', ['devices', '-l']).execute();
            if (result.code !== 0) {
                throw new Error(result.stderr.trim() || `adb exited with ${result.code}`);
            }
            const parsed = parseDevices(result.stdout);
            devices.set(parsed);
            return parsed;
        } finally {
            lastListedAt = Date.now();
            inFlight = undefined;
        }
    })();

    return inFlight;
}

/** `adb devices -l` output: a header line, then one whitespace-separated row each. */
export function parseDevices(stdout: string): AdbDevice[] {
    return stdout
        .split(/\r?\n/)
        .slice(1)
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith('*'))
        .map((line) => {
            const [serial, state, ...rest] = line.split(/\s+/);
            const model = rest.find((token) => token.startsWith('model:'))?.slice('model:'.length);
            return { serial, state, model: model ? model.replace(/_/g, ' ') : undefined };
        })
        .filter((device) => !!device.serial && !!device.state);
}

export function isUsable(device: AdbDevice) {
    return device.state === 'device';
}

export function describeDevice(device: AdbDevice) {
    const name = device.model ? `${device.model} — ${device.serial}` : device.serial;
    return isUsable(device) ? name : `${name} (${device.state})`;
}

export class AdbTargetError extends Error {}

/**
 * Which serials a push should go to.
 *
 * A saved selection that is simply unplugged should not stop the app dead, so
 * a single connected device is used instead. It is only genuinely ambiguous —
 * several attached, none of them the chosen one — that is an error worth
 * showing.
 */
export function resolveTargets(target: AdbTarget, all: AdbDevice[]): string[] {
    const usable = all.filter(isUsable);

    if (usable.length === 0) {
        const blocked = all.find((device) => !isUsable(device));
        throw new AdbTargetError(blocked ? `the only attached device is ${blocked.state} (${blocked.serial})` : 'no Android device is attached');
    }

    if (target === 'all') {
        return usable.map((device) => device.serial);
    }

    if (target !== 'auto') {
        const chosen = usable.find((device) => device.serial === target);
        if (chosen) {
            return [chosen.serial];
        }
        if (usable.length === 1) {
            // the saved device is gone, but there is no ambiguity about which
            // one was meant
            return [usable[0].serial];
        }
        throw new AdbTargetError(`the selected device ${target} is not attached, and ${usable.length} others are — pick one in the settings`);
    }

    if (usable.length === 1) {
        return [usable[0].serial];
    }
    throw new AdbTargetError(`${usable.length} Android devices are attached — pick one in the settings`);
}

/** The serials a target resolves to right now. */
export async function resolveSerials(target: AdbTarget): Promise<string[]> {
    return resolveTargets(target, await listDevices());
}

/**
 * The helper app's notification channel, which is IMPORTANCE_DEFAULT with a
 * sound attached. Its LocationService promotes itself to the foreground on
 * every start, so the chime cannot be avoided from this side — only the user
 * can quieten the channel, and there is no adb command that sets its
 * importance. This deep-links to the exact page where they can.
 */
export async function openHelperNotificationSettings(target: AdbTarget) {
    const serials = await resolveSerials(target);
    await Promise.all(
        serials.map((serial) =>
            Command.create('adb', [
                '-s',
                serial,
                'shell',
                'am',
                'start',
                '-a',
                'android.settings.CHANNEL_NOTIFICATION_SETTINGS',
                '-e',
                'android.provider.extra.APP_PACKAGE',
                HELPER_PACKAGE,
                '-e',
                'android.provider.extra.CHANNEL_ID',
                HELPER_CHANNEL
            ]).execute()
        )
    );
}

export const HELPER_PACKAGE = 'io.appium.settings';
const HELPER_CHANNEL = 'main_channel';

/**
 * What `am` says when the target package is in Android's *stopped* state.
 *
 * A package is stopped after a fresh install it has never been launched from,
 * and after any force-stop. Nothing is delivered to it in that state, so an
 * explicit service start cannot resolve the component — and
 * FLAG_INCLUDE_STOPPED_PACKAGES does not lift it for a service.
 */
const STOPPED_PACKAGE = /Not found; no service started/i;

/**
 * Clears the stopped state the only way that works.
 *
 * Nothing quieter revives a force-stopped app: `pm unstop` clears the flag but
 * the service still will not resolve, and no service of the helper's own can
 * start its process either. Only launching its activity does, and that takes
 * over the screen.
 *
 * Which is why this is never called from the push path. It interrupts whatever
 * app is being tested, and restarting the helper re-registers the test provider
 * — which silently drops any location listener that app had running, so it
 * stops receiving updates until it re-subscribes. Waking mid-drive costs the
 * user the very restart it was trying to save them.
 */
export async function wakeHelper(serial: string) {
    await Command.create('adb', [
        '-s',
        serial,
        'shell',
        'am',
        'start',
        '-W',
        '-n',
        `${HELPER_PACKAGE}/.Settings`,
        '-a',
        'android.intent.action.MAIN',
        '-c',
        'android.intent.category.LAUNCHER',
        '-f',
        '0x10200000'
    ]).execute();
}

/**
 * Pushes one fix to every resolved target.
 *
 * Throws rather than logging: the caller decides how loudly to complain, which
 * matters because this runs on every playback tick.
 */
export async function sendLocation(position: Position, target: AdbTarget) {
    const serials = resolveTargets(target, await listDevices());

    await Promise.all(
        serials.map(async (serial) => {
            const reported = await pushOnce(serial, position);
            if (!reported) {
                return;
            }
            // Say what to do rather than doing it: reviving the helper means
            // pulling it onto the screen and restarting its provider, which is
            // the user's call to make between runs, not ours to make mid-drive.
            if (STOPPED_PACKAGE.test(reported)) {
                throw new Error(`${serial}: the helper app has been stopped — run “Setup Android device” to restart it`);
            }
            throw new Error(`${serial}: ${reported}`);
        })
    );
}

/** Returns the failure `am` reported, or undefined when the fix landed. */
async function pushOnce(serial: string, position: Position): Promise<string | undefined> {
    const result = await Command.create('adb', [
        '-s',
        serial,
        'shell',
        'am',
        // not `startservice`: since API 26 that is refused for a backgrounded
        // app with "app is in background uid null", which is exactly the state
        // the helper is in while another app is in front
        'start-foreground-service',
        '-e',
        'longitude',
        String(position.lon),
        '-e',
        'latitude',
        String(position.lat),
        `${HELPER_PACKAGE}/.LocationService`
    ]).execute();

    if (result.code !== 0) {
        return result.stderr.trim() || `adb exited with ${result.code}`;
    }

    // `am` reports its own failures on stdout and still exits 0, so the exit
    // code alone would let a silently dropped fix look like success
    const line = `${result.stdout}\n${result.stderr}`.split(/\r?\n/).find((candidate) => /^\s*(Error|Exception)\b/i.test(candidate));
    return line?.trim();
}

function current(): AdbDevice[] {
    let value: AdbDevice[] = [];
    devices.subscribe((v) => (value = v))();
    return value;
}
