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

/** Our own Android build. It is the helper now; nothing third-party is involved. */
export const HELPER_PACKAGE = 'com.akylas.gpsmocker';
const CONTROL_RECEIVER = `${HELPER_PACKAGE}/com.akylas.gpsmocker.mocklocation.MockControlReceiver`;
const ACTION_SET_LOCATION = 'com.akylas.gpsmocker.mocklocation.SET_LOCATION';
const ACTION_ACQUIRE = 'com.akylas.gpsmocker.mocklocation.ACQUIRE';
const ACTION_STOP = 'com.akylas.gpsmocker.mocklocation.STOP';

/**
 * FLAG_INCLUDE_STOPPED_PACKAGES.
 *
 * A package sits in Android's *stopped* state after a fresh install it has
 * never been launched from, and after any force-stop — including the ones an
 * OEM battery manager does on its own. A broadcast carrying this flag is
 * delivered anyway and clears the flag, which is why the control surface is a
 * receiver: recovering never means putting an activity on screen and
 * interrupting the app under test.
 */
const INCLUDE_STOPPED = '0x00000020';

/**
 * Result codes the receiver sets. `am broadcast` is ordered and prints the
 * code, so the device tells us why a fix did not land without a second adb
 * round trip. Mirrored from MockControlReceiver.
 */
const RESULT_OK = 1;
const RESULT_NOT_MOCK_APP = 2;
const RESULT_REFUSED = 3;

/** What a device still needs before it can be mocked. */
export type Readiness = { ready: true } | { ready: false; reason: 'not-installed' | 'not-mock-app' | 'refused' | 'unreachable'; detail: string };

/**
 * Asks the device where it stands, in one broadcast.
 *
 * The receiver answers even from a stopped package, so this doubles as the
 * install check: no answer at all means the app is not there.
 */
export async function checkReadiness(serial: string): Promise<Readiness> {
    const result = await broadcast(serial, ACTION_ACQUIRE);
    const code = resultCodeOf(result.stdout);

    if (code === RESULT_OK) {
        return { ready: true };
    }
    if (code === RESULT_NOT_MOCK_APP) {
        return { ready: false, reason: 'not-mock-app', detail: 'the app is installed but not selected as the mock location app' };
    }
    if (code === RESULT_REFUSED) {
        return { ready: false, reason: 'refused', detail: 'the app could not claim the test location providers' };
    }

    const installed = await isInstalled(serial);
    return installed
        ? { ready: false, reason: 'unreachable', detail: 'the app is installed but did not answer' }
        : { ready: false, reason: 'not-installed', detail: 'GPS Mocker is not installed on this device' };
}

export async function isInstalled(serial: string): Promise<boolean> {
    const result = await Command.create('adb', ['-s', serial, 'shell', 'pm', 'list', 'packages', HELPER_PACKAGE]).execute();
    return result.code === 0 && result.stdout.includes(HELPER_PACKAGE);
}

/** `am broadcast` prints `Broadcast completed: result=N`. */
function resultCodeOf(stdout: string): number | undefined {
    const match = /result=(-?\d+)/.exec(stdout);
    return match ? Number(match[1]) : undefined;
}

function broadcast(serial: string, action: string, extras: string[] = []) {
    return Command.create('adb', ['-s', serial, 'shell', 'am', 'broadcast', '-a', action, '-n', CONTROL_RECEIVER, '-f', INCLUDE_STOPPED, ...extras]).execute();
}

/**
 * Everything the app needs to mock, applied over adb with nothing shown on the
 * device — not even a notification: a fix sent from here is published by the
 * receiver that takes the broadcast, so no foreground service is ever started.
 *
 * The location permission is a runtime one, mock_location is an app op with no
 * runtime prompt at all, and the background grants are what keep the receiver
 * reachable once the OEM's battery manager has had its way with the app.
 */
export function setupCommands(serial: string): { labelKey: string; command: string }[] {
    const adb = `adb -s ${serial}`;
    return [
        { labelKey: 'task_grant_location', command: `${adb} shell pm grant ${HELPER_PACKAGE} android.permission.ACCESS_FINE_LOCATION` },
        { labelKey: 'task_grant_coarse_location', command: `${adb} shell pm grant ${HELPER_PACKAGE} android.permission.ACCESS_COARSE_LOCATION` },
        // the app is in the background for the whole of a desktop-driven
        // session, and it is also what the on-device foreground service needs
        // before it may start
        { labelKey: 'task_grant_background_location', command: `${adb} shell pm grant ${HELPER_PACKAGE} android.permission.ACCESS_BACKGROUND_LOCATION` },
        { labelKey: 'task_grant_notifications', command: `${adb} shell pm grant ${HELPER_PACKAGE} android.permission.POST_NOTIFICATIONS` },
        { labelKey: 'task_allow_mock_location', command: `${adb} shell appops set ${HELPER_PACKAGE} android:mock_location allow` },
        { labelKey: 'task_exempt_battery', command: `${adb} shell dumpsys deviceidle whitelist +${HELPER_PACKAGE}` },
        { labelKey: 'task_allow_background', command: `${adb} shell cmd appops set ${HELPER_PACKAGE} RUN_ANY_IN_BACKGROUND allow` },
        { labelKey: 'task_claim_providers', command: `${adb} shell am broadcast -a ${ACTION_ACQUIRE} -n ${CONTROL_RECEIVER} -f ${INCLUDE_STOPPED}` }
    ];
}

/**
 * The same setup, applied on its own the first time a device turns out to need
 * it — once per device per session.
 *
 * Every command in it is idempotent and none of it puts anything on the
 * device's screen, which is what makes it safe to run off a fix that came back
 * refused instead of making someone go and find "Prepare device" first. The one
 * thing it will not do is install the app: that is a download, and a download
 * is the user's call.
 *
 * The result is cached either way. A device that cannot be fixed must not have
 * eight adb commands thrown at it five times a second for the rest of the
 * session; "Prepare device" clears the cache, so the manual route always
 * retries.
 */
const preparing = new Map<string, Promise<Readiness>>();

export function ensureReady(serial: string): Promise<Readiness> {
    let pending = preparing.get(serial);
    if (!pending) {
        pending = prepareQuietly(serial);
        preparing.set(serial, pending);
    }
    return pending;
}

/** Drops the cache, so the next send re-runs the setup. */
export function forgetPrepared(serial?: string) {
    if (serial) {
        preparing.delete(serial);
    } else {
        preparing.clear();
    }
}

async function prepareQuietly(serial: string): Promise<Readiness> {
    if (!(await isInstalled(serial))) {
        return { ready: false, reason: 'not-installed', detail: 'GPS Mocker is not installed on this device' };
    }
    for (const { command } of setupCommands(serial)) {
        const [cmd, ...args] = command.split(' ');
        // a step that fails is not fatal on its own: the readiness check below
        // is the only thing that decides whether the device is usable
        await Command.create(cmd, args)
            .execute()
            .catch(() => undefined);
    }
    return checkReadiness(serial);
}

/** Releases the test providers and stops the service on the device. */
export async function stopMockingOnDevice(target: AdbTarget) {
    const serials = await resolveSerials(target);
    await Promise.all(serials.map((serial) => broadcast(serial, ACTION_STOP)));
}

/** What the fix was doing, when the caller knows. */
export interface Motion {
    /** degrees clockwise from north */
    bearing?: number;
    /** ground speed in km/h; Android wants metres per second */
    speedKmh?: number;
}

/**
 * Pushes one fix to every resolved target.
 *
 * Throws rather than logging: the caller decides how loudly to complain, which
 * matters because this runs on every playback tick.
 */
export async function sendLocation(position: Position, target: AdbTarget, motion: Motion = {}) {
    const serials = resolveTargets(target, await listDevices());

    await Promise.all(
        serials.map(async (serial) => {
            // Coordinates go as strings: `am` only offers `--ef`, and a float
            // holds about seven significant digits, which is not enough for a
            // degree with six decimals.
            const extras = ['--es', 'lat', String(position.lat), '--es', 'lon', String(position.lon)];
            if (position.ele !== undefined) {
                extras.push('--es', 'altitude', String(position.ele));
            }
            // A navigation app under test orients itself from the bearing, and
            // a Location that carries none reads as standing still facing
            // north. Both are left out rather than faked when the fix is a map
            // tap, so a consumer can tell the difference.
            if (motion.bearing !== undefined) {
                extras.push('--es', 'bearing', String(((motion.bearing % 360) + 360) % 360));
            }
            if (motion.speedKmh !== undefined) {
                extras.push('--es', 'speed', String(motion.speedKmh / 3.6));
            }

            const result = await broadcast(serial, ACTION_SET_LOCATION, extras);

            if (result.code !== 0) {
                throw new Error(`${serial}: ${result.stderr.trim() || `adb exited with ${result.code}`}`);
            }

            // `am` reports its own failures on stdout and still exits 0, so the
            // exit code alone would let a silently dropped fix look like success
            const line = `${result.stdout}\n${result.stderr}`.split(/\r?\n/).find((candidate) => /^\s*(Error|Exception)\b/i.test(candidate));
            if (line) {
                throw new Error(`${serial}: ${line.trim()}`);
            }

            // A broadcast nobody handled still "completes", so the result code
            // is the only honest signal. Anything but OK means the device is
            // not set up — so set it up and send again, rather than reporting a
            // failure whose fix is a button in a settings panel.
            if (resultCodeOf(result.stdout) !== RESULT_OK) {
                const readiness = await ensureReady(serial);
                if (!readiness.ready) {
                    const manual = readiness.reason === 'not-installed' ? ' — run “Prepare device”' : '';
                    throw new Error(`${serial}: ${readiness.detail}${manual}`);
                }
                const retry = await broadcast(serial, ACTION_SET_LOCATION, extras);
                if (resultCodeOf(retry.stdout) !== RESULT_OK) {
                    throw new Error(`${serial}: the fix was not accepted`);
                }
            }
        })
    );
}

function current(): AdbDevice[] {
    let value: AdbDevice[] = [];
    devices.subscribe((v) => (value = v))();
    return value;
}
