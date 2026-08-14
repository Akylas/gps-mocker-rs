import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
const ignoreWarnings = new Set(['a11y-no-onchange', 'a11y-label-has-associated-control', 'a11y-mouse-events-have-key-events', 'a11y-mouse-events-have-key-events']);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./package.json');
const host = process.env.TAURI_DEV_HOST;
export default defineConfig(({ command, mode }) => {
    const production = mode === 'production';
    return {
        root: './src',
        base: './', // use relative paths
        publicDir: '../public',
        clearScreen: false,
        // `tauri android dev` serves the dev bundle to a device over the LAN, so
        // it sets TAURI_DEV_HOST and vite has to bind to that address rather
        // than to localhost.
        server: {
            host: host || false,
            port: 3011,
            strictPort: true,
            hmr: host ? { protocol: 'ws', host, port: 3012 } : undefined
        },
        resolve: {
            alias: {
                'mapbox-gl': 'maplibre-gl'
            }
        },
        optimizeDeps: {
            // include: ['geo-three']
        },
        build: {
            outDir: '../build',
            emptyOutDir: true,
            minify: true,
            sourcemap: false,
            target: 'modules'
        },
        plugins: [
            svelte({
                onwarn(warning, defaultHandler) {
                    // don't warn on <marquee> elements, cos they're cool
                    if (ignoreWarnings.has(warning.code)) return;

                    // handle all other warnings normally
                    defaultHandler(warning);
                },
                preprocess: sveltePreprocess()
            })
        ],
        define: {
            REPO_URL: `"${config.homepage}"`,
            FORCE_MOBILE: false,
            EXTERNAL_APP: false,
            PRODUCTION: production
        }
    };
});
