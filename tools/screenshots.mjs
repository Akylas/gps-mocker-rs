#!/usr/bin/env node
/**
 * Regenerates the screenshots the README and the website use.
 *
 * They are captured from `npm run dev:web` — the same Svelte frontend the
 * desktop and Android builds render, running in a plain browser. That is what
 * makes them reproducible: no device, no simulator, no window manager, just a
 * headless Chromium driven over the DevTools protocol.
 *
 *   node tools/screenshots.mjs                 # every shot
 *   node tools/screenshots.mjs desktop-dark    # one, by name
 *
 * The dev server has to be up on :3011 (`npm run dev:web`), and the routes are
 * built through the public Valhalla instance, so this needs network.
 *
 * `window.__gm` — the dev-only handle App.svelte installs on mount — is what
 * lets a shot put the map exactly where it wants it. Everything else goes
 * through real mouse events, so the app cannot tell it apart from a person.
 *
 * A phone shot builds its route at desktop metrics and only then narrows the
 * viewport: the compact shell deliberately ignores map clicks, because on a
 * touchscreen there is no tap that is not also the start of a pan.
 */

import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'docs', 'screenshots');
/** F-Droid and IzzyOnDroid read the store listing out of this tree. */
const FASTLANE = path.join(ROOT, 'fastlane', 'metadata', 'android');
const APP_URL = process.env.GM_URL ?? 'http://localhost:3011';
const PORT = Number(process.env.GM_CDP_PORT ?? 9333);

/** Grenoble: a city grid to route across, with the Alps right behind it. */
const HOME = { lat: 45.1885, lon: 5.7245 };
const HOME_ZOOM = 13.2;

const CHROMIUM_CANDIDATES = [
    process.env.CHROMIUM,
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome'
].filter(Boolean);

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false };
const PHONE = { width: 400, height: 860, deviceScaleFactor: 2, mobile: false };

/** Waypoints as viewport fractions, dropped at desktop metrics. */
const ROUTE_POINTS = [
    [0.26, 0.26],
    [0.6, 0.54],
    [0.82, 0.3]
];

/* ------------------------------------------------------------------ *
 * the shots                                                          *
 * ------------------------------------------------------------------ */

/**
 * Room for the chrome that floats over the map, so framing the route does not
 * tuck half of it under a panel.
 */
const DESKTOP_PADDING = { top: 90, right: 420, bottom: 200, left: 120 };
const PHONE_PADDING = { top: 130, right: 40, bottom: 520, left: 40 };

/** Playback keeps the camera on the vehicle; a still wants the whole route. */
const FREE_CAMERA = { followVehicle: false };

const SHOTS = [
    {
        name: 'desktop-route-builder',
        metrics: DESKTOP,
        async run(page) {
            await page.boot();
            await page.clickLabel('Build route');
            await page.plotRoute();
        }
    },
    {
        name: 'desktop-playback',
        metrics: DESKTOP,
        settings: FREE_CAMERA,
        async run(page) {
            await page.boot();
            await page.buildAndPlay();
            await page.frameRoute(DESKTOP_PADDING);
        }
    },
    {
        name: 'desktop-settings',
        metrics: DESKTOP,
        settings: FREE_CAMERA,
        async run(page) {
            await page.boot();
            await page.buildAndPlay();
            await page.frameRoute({ ...DESKTOP_PADDING, left: 520 });
            await page.clickLabel('Settings');
            await page.settle(1000);
        }
    },
    {
        name: 'desktop-dark',
        metrics: DESKTOP,
        colorScheme: 'dark',
        settings: FREE_CAMERA,
        async run(page) {
            await page.boot();
            await page.buildAndPlay();
            await page.frameRoute(DESKTOP_PADDING);
        }
    },
    {
        name: 'desktop-terrain',
        metrics: DESKTOP,
        // the camera is placed by hand here, so nothing may pull it back
        settings: { terrain3d: true, hillshade: true, terrainExaggeration: 1.4, followVehicle: false },
        async run(page) {
            await page.boot();
            await page.buildAndPlay({ seconds: 10, leaveRunning: false });
            // the Belledonne range is east of the city, so look that way from low down
            await page.eval(`void window.__gm.map.jumpTo({ center: [5.79, 45.175], zoom: 12.2, pitch: 76, bearing: 92 })`);
            // the DEM decides where the ground — and the marker standing on it —
            // ends up, and it arrives well after the camera does
            await page.settle(10000);
        }
    },
    {
        name: 'phone-playback',
        metrics: PHONE,
        buildMetrics: DESKTOP,
        settings: FREE_CAMERA,
        // the store listing wants PNG, and wants it phone-shaped
        png: ['en-US/images/phoneScreenshots/1.png', 'fr-FR/images/phoneScreenshots/1.png'],
        async run(page) {
            await page.boot();
            await page.buildAndPlay();
            await page.narrow();
            await page.openSheet();
            await page.frameRoute(PHONE_PADDING);
        }
    },
    {
        name: 'phone-dark',
        metrics: PHONE,
        buildMetrics: DESKTOP,
        colorScheme: 'dark',
        settings: FREE_CAMERA,
        png: ['en-US/images/phoneScreenshots/2.png', 'fr-FR/images/phoneScreenshots/2.png'],
        async run(page) {
            await page.boot();
            await page.buildAndPlay();
            await page.narrow();
            await page.openSheet();
            await page.frameRoute(PHONE_PADDING);
        }
    },
    {
        // Not the app: the banner every store listing wants, drawn as a page so
        // it is edited with a text editor rather than a design tool.
        name: 'feature-graphic',
        metrics: { width: 1024, height: 500, deviceScaleFactor: 1, mobile: false },
        url: `file://${path.join(ROOT, 'tools', 'feature-graphic.html')}`,
        png: ['en-US/images/featureGraphic.png', 'fr-FR/images/featureGraphic.png'],
        async run(page) {
            await page.open();
            await page.settle(1200);
        }
    }
];

/* ------------------------------------------------------------------ *
 * a very small DevTools protocol client                              *
 * ------------------------------------------------------------------ */

class Cdp {
    #socket;
    #next = 1;
    #pending = new Map();

    static async attach(url) {
        const client = new Cdp();
        client.#socket = new WebSocket(url);
        await new Promise((resolve, reject) => {
            client.#socket.addEventListener('open', resolve, { once: true });
            client.#socket.addEventListener('error', () => reject(new Error(`cannot reach ${url}`)), { once: true });
        });
        client.#socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            const waiting = client.#pending.get(message.id);
            if (!waiting) {
                return;
            }
            client.#pending.delete(message.id);
            message.error ? waiting.reject(new Error(message.error.message)) : waiting.resolve(message.result);
        });
        return client;
    }

    send(method, params = {}) {
        const id = this.#next++;
        this.#socket.send(JSON.stringify({ id, method, params }));
        return new Promise((resolve, reject) => this.#pending.set(id, { resolve, reject }));
    }

    close() {
        this.#socket.close();
    }
}

/* ------------------------------------------------------------------ *
 * the page, in the terms a shot wants to talk in                     *
 * ------------------------------------------------------------------ */

class Page {
    constructor(cdp, shot) {
        this.cdp = cdp;
        this.shot = shot;
        this.metrics = shot.buildMetrics ?? shot.metrics;
    }

    settle(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async setMetrics(metrics) {
        this.metrics = metrics;
        await this.cdp.send('Emulation.setDeviceMetricsOverride', metrics);
    }

    async eval(expression) {
        const { result, exceptionDetails } = await this.cdp.send('Runtime.evaluate', {
            expression,
            awaitPromise: true,
            returnByValue: true
        });
        if (exceptionDetails) {
            throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
        }
        return result.value;
    }

    /** Loads a plain page — used by the shots that are not the app. */
    async open() {
        await this.cdp.send('Page.navigate', { url: this.shot.url });
        await this.until(`document.readyState === 'complete'`);
    }

    /** Polls rather than listening for a load event: a navigation swaps the
     *  execution context out from under an in-flight evaluate. */
    async until(expression, { timeout = 45_000, every = 250 } = {}) {
        const deadline = Date.now() + timeout;
        for (;;) {
            try {
                if (await this.eval(`Boolean(${expression})`)) {
                    return;
                }
            } catch {
                /* mid-navigation, or the handle is not installed yet */
            }
            if (Date.now() > deadline) {
                throw new Error(`timed out waiting for ${expression}`);
            }
            await this.settle(every);
        }
    }

    /**
     * A fresh profile every run would mean a cold tile cache every run, so the
     * state that decides what a shot looks like is written rather than reset.
     */
    async boot() {
        const settings = JSON.stringify({ position: HOME, ...(this.shot.settings ?? {}) });
        await this.cdp.send('Page.navigate', { url: APP_URL });
        await this.until('window.__gm');
        await this.eval(`localStorage.setItem('settings', ${JSON.stringify(settings)})`);
        await this.cdp.send('Page.reload');
        await this.until('window.__gm?.map?.isStyleLoaded()');
        // the map opens at whatever zoom the app picks; the shots want one that
        // fits a route worth looking at
        await this.eval(`void window.__gm.map.jumpTo({ zoom: ${this.shot.zoom ?? HOME_ZOOM} })`);
        // tiles, glyphs and labels all arrive after the style does
        await this.settle(4000);
    }

    async clickAt(x, y) {
        const common = { x: Math.round(x), y: Math.round(y), button: 'left', clickCount: 1 };
        await this.cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...common });
        await this.cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...common });
        await this.cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...common });
        await this.settle(200);
    }

    async #centreOf(finder) {
        const box = await this.eval(`(() => {
            const node = ${finder};
            if (!node) throw new Error('nothing to click');
            const r = node.getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        })()`);
        return box;
    }

    /** Clicks the control the screen reader would call `label`. */
    async clickLabel(label) {
        const { x, y } = await this.#centreOf(`document.querySelector('[aria-label=${JSON.stringify(label)}]')`);
        await this.clickAt(x, y);
    }

    /** Clicks the button whose visible text is `text`. */
    async clickText(text) {
        const { x, y } = await this.#centreOf(
            `[...document.querySelectorAll('button')].find((b) => b.textContent.trim().toLowerCase() === ${JSON.stringify(text.toLowerCase())})`
        );
        await this.clickAt(x, y);
    }

    /** Drops the waypoints and waits for Valhalla to answer the last one. */
    async plotRoute() {
        for (const [fx, fy] of ROUTE_POINTS) {
            await this.clickAt(this.metrics.width * fx, this.metrics.height * fy);
            await this.settle(1500);
        }
        await this.until(`document.body.innerText.includes('Use this route')`, { timeout: 20_000 });
        await this.settle(1200);
    }

    async buildAndPlay({ seconds = 9, leaveRunning = true } = {}) {
        await this.clickLabel('Build route');
        await this.plotRoute();
        await this.clickText('Use this route');
        await this.settle(1800);
        await this.eval(`void window.__gm.player.play()`);
        // far enough in that every readout has a real number in it
        await this.settle(seconds * 1000);
        if (!leaveRunning) {
            await this.eval(`void window.__gm.player.pause()`);
            await this.settle(500);
        }
    }

    /**
     * Pulls the camera back until the whole route is on screen. Playback keeps
     * the map on the vehicle, which is right in the app and useless in a still.
     */
    async frameRoute(padding) {
        await this.eval(`(() => {
            const points = window.__gm.route.points;
            const lons = points.map((p) => p.lon);
            const lats = points.map((p) => p.lat);
            window.__gm.map.fitBounds(
                [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]],
                { padding: ${JSON.stringify(padding)}, animate: false }
            );
            return null;
        })()`);
        await this.settle(4000);
    }

    /**
     * Steps the compact shell's bottom sheet up one detent, from the transport
     * row alone to the transport row plus the route detail.
     */
    async openSheet() {
        await this.clickLabel('Resize panel');
        await this.settle(800);
    }

    /** Hands the running app a phone-sized viewport and lets it re-lay out. */
    async narrow() {
        await this.setMetrics(this.shot.metrics);
        await this.eval(`void window.__gm.map.resize()`);
        await this.settle(4000);
    }

    /**
     * WebP rather than PNG: these are retina-sized shots of a map, and a
     * lossless one runs to three megabytes. Chromium encodes it itself, so
     * nothing outside this file has to be installed to regenerate them.
     */
    async capture(file) {
        const { data } = await this.cdp.send('Page.captureScreenshot', {
            format: 'webp',
            quality: 78,
            captureBeyondViewport: false
        });
        await writeFile(file, Buffer.from(data, 'base64'));
    }

    /** F-Droid's metadata format takes PNG and JPEG, and nothing else. */
    async capturePng(files) {
        if (!files?.length) {
            return;
        }
        const { data } = await this.cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        const bytes = Buffer.from(data, 'base64');
        for (const file of files) {
            await mkdir(path.dirname(file), { recursive: true });
            await writeFile(file, bytes);
        }
    }
}

/* ------------------------------------------------------------------ *
 * driver                                                             *
 * ------------------------------------------------------------------ */

function findChromium() {
    const found = CHROMIUM_CANDIDATES.find((candidate) => existsSync(candidate));
    if (!found) {
        throw new Error(`no Chromium found. Set CHROMIUM to one, or install it.\ntried:\n  ${CHROMIUM_CANDIDATES.join('\n  ')}`);
    }
    return found;
}

async function waitForDevTools() {
    for (let attempt = 0; attempt < 150; attempt++) {
        try {
            const response = await fetch(`http://127.0.0.1:${PORT}/json/version`);
            if (response.ok) {
                return (await response.json()).webSocketDebuggerUrl;
            }
        } catch {
            /* not up yet */
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
    throw new Error('Chromium never opened its debugging port');
}

async function main() {
    const wanted = process.argv.slice(2);
    const shots = wanted.length ? SHOTS.filter((shot) => wanted.includes(shot.name)) : SHOTS;
    if (!shots.length) {
        throw new Error(`no shot named ${wanted.join(', ')}. Known: ${SHOTS.map((s) => s.name).join(', ')}`);
    }

    // the banner is drawn from a local file, so it does not need the app
    if (shots.some((shot) => !shot.url)) {
        try {
            const probe = await fetch(APP_URL);
            if (!probe.ok) {
                throw new Error(String(probe.status));
            }
        } catch (error) {
            throw new Error(`${APP_URL} is not answering — start it with \`npm run dev:web\` (${error.message})`);
        }
    }

    await mkdir(OUT_DIR, { recursive: true });
    const profile = await mkdtemp(path.join(tmpdir(), 'gps-mocker-shots-'));
    const chromium = spawn(
        findChromium(),
        [
            '--headless=new',
            `--remote-debugging-port=${PORT}`,
            `--user-data-dir=${profile}`,
            '--hide-scrollbars',
            '--force-color-profile=srgb',
            '--font-render-hinting=none',
            '--no-first-run',
            '--no-default-browser-check',
            'about:blank'
        ],
        { stdio: 'ignore' }
    );

    const failures = [];
    try {
        const browser = await Cdp.attach(await waitForDevTools());

        for (const shot of shots) {
            process.stdout.write(`${shot.name} … `);
            const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
            const cdp = await Cdp.attach(`ws://127.0.0.1:${PORT}/devtools/page/${targetId}`);
            try {
                await cdp.send('Page.enable');
                await cdp.send('Runtime.enable');
                await cdp.send('Emulation.setEmulatedMedia', {
                    features: [{ name: 'prefers-color-scheme', value: shot.colorScheme ?? 'light' }]
                });
                const page = new Page(cdp, shot);
                await page.setMetrics(page.metrics);
                await shot.run(page);
                await page.capture(path.join(OUT_DIR, `${shot.name}.webp`));
                await page.capturePng(shot.png?.map((relative) => path.join(FASTLANE, relative)));
                console.log('ok');
            } catch (error) {
                failures.push(shot.name);
                console.log(`failed — ${error.message}`);
            } finally {
                cdp.close();
                await browser.send('Target.closeTarget', { targetId });
            }
        }

        browser.close();
    } finally {
        chromium.kill();
        // it is still flushing its profile as it goes down, and removing the
        // tree out from under it races into ENOTEMPTY
        await new Promise((resolve) => setTimeout(resolve, 500));
        await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
    }

    console.log(`\nwritten to ${path.relative(ROOT, OUT_DIR)}`);
    if (failures.length) {
        throw new Error(`${failures.length} shot(s) failed: ${failures.join(', ')}`);
    }
}

main().catch((error) => {
    console.error(`\n${error.message}`);
    process.exit(1);
});
