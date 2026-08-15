# GPS Mocker

Feed a fake GPS position to a phone, an emulator or a simulator — either a single
point, or a whole route replayed at a believable speed.

It runs as a desktop app that drives an attached device over `adb`, and as an
Android app that mocks its own location with nothing attached at all. Both are
the same project, built for two targets.

---

## What it does

-   **Replay a route** with a speed model that eases into corners, follows the
    recorded speed of a GPX when it has timestamps, and can loop.
-   **Import GPX or GeoJSON.** A GeoJSON export from a routing app brings its
    turn-by-turn instructions along; a GPX can be map-matched against Valhalla to
    get some.
-   **Build a route** from waypoints through a Valhalla instance, with the full
    costing-options set exposed.
-   **Drive manually** with WASD or an on-screen pad, and be routed back to the
    line when you wander off it.
-   **Save routes** to a local library, and export them again as GPX.
-   Map with terrain, hillshade and 3D, light/dark following the system, English
    and French.

### Where the position goes

| target                       | how                                             | host needed |
| ---------------------------- | ----------------------------------------------- | ----------- |
| Android phone or emulator    | `adb` broadcast to this app's own Android build | any desktop |
| Android, on the phone itself | the Android build mocks its own location        | none        |
| iOS Simulator                | `simctl` + a distributed notification           | macOS       |
| iOS device                   | lockdown service over `libimobiledevice`        | macOS       |

The Android path sends latitude, longitude, altitude, bearing and speed. The iOS
Simulator's notification carries a coordinate and nothing else.

---

## Using it

### Mocking an Android device from the desktop

1. Attach the device (or start an emulator) and check `adb devices` lists it.
2. **Device → Prepare Device…**

That is the whole setup. Prepare asks the device what it is missing and fixes
exactly that: it installs the Android build if it is absent, then grants the
permissions, selects the app as the mock location provider, and exempts it from
battery optimisation. Nothing appears on the device's screen while it runs, so
whatever app you are testing is never interrupted.

The APK is downloaded once from this project's GitHub release and reused from
then on, so preparing a second device works with no network at all. If there is
no release to fetch from — a development build, an unpublished fork — Prepare
falls back to asking you for an APK.

With several devices attached, pick one under **Settings → Send to device**, or
`All connected` to fan out.

### Mocking on the phone itself

Install the Android build, then on the device: **Settings → Developer options →
Select mock location app → GPS Mocker**. The app says so on screen and offers a
shortcut to that screen. From there it publishes to the platform's test
providers, and a route being replayed runs from a foreground service so it keeps
going after you leave the app.

That service is the only thing that ever puts a notification in the shade, and
**Settings → Notification** decides when: while a route is playing (the default),
for the whole session, or never — never meaning playback no longer survives
leaving the app. A device driven from a desktop over adb has nothing to keep
alive between fixes, so it never starts the service and never shows anything.

### Routing

Route building and map matching need a [Valhalla](https://valhalla.github.io/valhalla/)
endpoint. The default is the public OSM instance; point **Settings → Valhalla
endpoint** at your own if you are doing anything heavy with it.

The basemap uses a MapTiler style with a key baked into the defaults. Replace
both style URLs under **Settings → Map** to use your own.

---

## Building from source

### Prerequisites

-   **Node.js 18 or 20.** The frontend toolchain is Vite 3 / Svelte 3 era; on Node
    26 the app still builds and runs, but `eslint` and `svelte-check` both crash.
-   **Rust**, stable.
-   Whatever [Tauri v2 asks for on your platform](https://v2.tauri.app/start/prerequisites/) —
    Xcode command line tools on macOS, WebView2 and MSVC on Windows,
    `libwebkit2gtk-4.1-dev` and friends on Linux.

```bash
npm install
npm run dev      # desktop app, hot reloading
npm run build    # bundle for the current platform
```

Any of npm, yarn or pnpm works. CI uses pnpm.

| script                  | what it does                               |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | desktop app in dev mode                    |
| `npm run dev:web`       | just the frontend, in a browser on `:3011` |
| `npm run build`         | packaged desktop build                     |
| `npm run android:dev`   | Android build on a device, hot reloading   |
| `npm run android:build` | Android release build                      |
| `npm run test`          | Rust tests                                 |
| `npm run check`         | `cargo check`, ESLint and `svelte-check`   |
| `npm run format`        | Prettier and ESLint `--fix`                |

### Building the Android APK

You need a JDK, the Android SDK and NDK, and the Rust Android targets.

```bash
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

Install **NDK 27** and a **JDK 17** through Android Studio or `sdkmanager`, then
point the build at them:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export NDK_HOME="$ANDROID_HOME/ndk/27.3.13750724"
```

Build it:

```bash
npm run android:build -- --apk
```

The result is one universal APK covering every ABI:

```
src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk
```

A single-ABI build is much faster while developing — `-- --apk --target aarch64`
for a modern phone or an Apple-silicon emulator.

`src-tauri/gen/android` is committed, so there is no `tauri android init` step.
The three files Tauri generates inside it are gitignored and rebuilt on every
build; the rest, including the manifest and the launcher icons, are ours to edit.

#### Signing

Without a signing key the release build falls back to the debug key, which is
fine for installing on your own devices and useless for distributing: the key is
generated per machine, so nobody can update an APK signed on a different one.

For a real build, create `src-tauri/gen/android/keystore.properties`:

```properties
storeFile=/absolute/path/to/release.keystore
storePassword=…
keyAlias=gps-mocker
keyPassword=…
```

It is gitignored, as is any `*.keystore` in that directory. To make the key:

```bash
keytool -genkeypair -v -keystore release.keystore -alias gps-mocker -keyalg RSA -keysize 2048 -validity 10000
```

Keep it. Losing it means no one can ever update an installed copy.

#### Launcher icons

The Android icons are generated from `src-tauri/icons/icon.png` by
`tools/android-icons.py` — run it after changing that file. They are generated
separately from the desktop ones because `tauri icon` would rebuild the
hand-made `.icns` from a smaller source.

```bash
python3 tools/android-icons.py
```

### iOS

There is no iOS app. The iOS code paths are the _host_ side: a macOS build talks
to Simulators and to attached devices. They compile only on macOS and pull in a
vendored `libimobiledevice`, which builds its own OpenSSL the first time and
takes a while.

---

## How the desktop drives the phone

Worth knowing if you are changing this part.

The desktop sends an **ordered broadcast** over `adb` to a receiver in the
Android build. Not a service: a broadcast is the only thing that reaches a
package in Android's _stopped_ state — where it sits after a fresh install it
has never been launched from, and after any force-stop, including the ones an
OEM battery manager does on its own. Recovering therefore never means throwing
an activity onto the screen.

The receiver is guarded by `WRITE_SECURE_SETTINGS`, which an ordinary app cannot
hold but the adb shell can, so the surface is open to a developer's own machine
and to nothing else on the device.

`am broadcast` prints the receiver's result code, which is a free channel back:

| result    | meaning                                                   |
| --------- | --------------------------------------------------------- |
| `1`       | ready, the fix was taken                                  |
| `2`       | installed, but not selected as the mock location app      |
| `3`       | not allowed to run its location service in the background |
| no answer | not installed                                             |

That is what **Prepare Device** reads, and what a failed position push reports
instead of a raw adb line.

Coordinates travel as string extras rather than `--ef` floats: a float carries
about seven significant digits, which is not enough for a degree with six
decimals.

---

## Layout

```
src/                        Svelte frontend
  lib/adb.ts                the desktop → device bridge, and readiness
  lib/player.ts             playback clock and the speed model
  lib/route.ts              route model, snapping, manoeuvres
  lib/geojson.ts, gpx.ts    importers
  lib/valhalla.ts           routing and map matching
src-tauri/                  Rust
  src/desktop.rs            adb commands, APK fetch, native menu
  src/apple.rs              Simulator and iOS device sinks (macOS only)
  plugins/tauri-plugin-mock-location/
                            the Android side: Kotlin service, provider, receiver
  gen/android/              the committed Android project
tools/android-icons.py      regenerates the Android launcher icons
```

---

## Releasing

Tagging `v#.#.#` runs [`.github/workflows/release.yml`](.github/workflows/release.yml),
which creates a draft release from the `CHANGELOG.md` entry, builds the desktop
bundles for macOS, Linux and Windows, attaches the Android APK as
`gps-mocker-android.apk`, and then publishes it. `npm run release` bumps the
version and writes the changelog through `standard-version`.

The Android job is skipped unless the repository has these secrets, because an
APK signed with a throwaway key is worse than none:

| secret                      | value                                        |
| --------------------------- | -------------------------------------------- |
| `ANDROID_KEYSTORE`          | the keystore, base64 encoded                 |
| `ANDROID_KEYSTORE_PASSWORD` | store password                               |
| `ANDROID_KEY_ALIAS`         | key alias                                    |
| `ANDROID_KEY_PASSWORD`      | key password, if it differs from the store's |

That asset name is not cosmetic: the desktop app looks it up by name to install
the helper onto a device.

---

## Troubleshooting

**`INSTALL_FAILED_UPDATE_INCOMPATIBLE`** — a copy signed with a different key is
already there, usually a local build meeting a release one. Removing it takes
that device's saved routes with it:

```bash
adb uninstall com.akylas.gpsmocker
```

**Positions stop arriving mid-route** — check the device still has the app
selected under _Select mock location app_. An OEM battery manager that
force-stops the app clears nothing, but a factory reset of developer options
does. Prepare Device will say which of the two it is.

**`_EVP_PKEY_Q_keygen` undefined when linking the desktop release build** — a
stale vendored OpenSSL in the target directory, not a real dependency problem:

```bash
cargo clean -p openssl-sys -p rusty_libimobiledevice --release --manifest-path src-tauri/Cargo.toml
```

---

## Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) —
`commitlint` enforces it and the changelog is generated from them. Run
`npm run format` and `npm run check` before opening a pull request.

---

## License

[MIT](LICENSE).
