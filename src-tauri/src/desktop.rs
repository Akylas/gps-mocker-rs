//! Everything that only makes sense when a desktop drives a separate device:
//! the adb bridge and the native menu bar.
//!
//! On Android the app mocks its own location provider, so none of this is
//! compiled in.

use std::path::{Path, PathBuf};
use std::process::Command;
#[cfg(target_os = "macos")]
use tauri::menu::AboutMetadata;
use tauri::menu::{Menu, MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::{Manager, Runtime};

/// Where CI publishes the Android build of this same app.
const HELPER_REPO: &str = "Akylas/gps-mocker-rs";
/// The release asset the Android job uploads; see .github/workflows/release.yml.
const HELPER_ASSET: &str = "gps-mocker-android.apk";

/// A cached copy of the Android build, ready to hand to `adb install`.
#[derive(serde::Serialize)]
pub struct HelperApk {
  path: String,
  /// The release it came from, so the UI can say which build it installed.
  tag: String,
  /// False when the file was already on disk and nothing was fetched.
  downloaded: bool,
}

/// Downloads the Android build of this app once, then reuses it forever.
///
/// The APK is not bundled with the desktop binary: it is this same project
/// built for Android, so shipping a copy inside every desktop release would
/// mean committing a large artifact that goes stale. Fetching it from the
/// release instead keeps one build per version and costs the user nothing —
/// after the first time there is no network call at all, which also means
/// preparing a device works offline.
///
/// `force` re-fetches even when a cached copy exists, which is how a failed
/// install recovers from a truncated or stale file.
#[tauri::command]
pub async fn ensure_helper_apk<R: Runtime>(
  app: tauri::AppHandle<R>,
  force: bool,
) -> Result<HelperApk, String> {
  let dir = app
    .path()
    .app_cache_dir()
    .map_err(|e| format!("no cache directory: {}", e))?
    .join("android-helper");
  std::fs::create_dir_all(&dir).map_err(|e| format!("could not create {}: {}", dir.display(), e))?;

  // The cheap path, and the reason this is "download once": any APK already
  // here answers the question without asking GitHub anything.
  if !force {
    if let Some((path, tag)) = newest_cached_apk(&dir) {
      return Ok(HelperApk {
        path: path.to_string_lossy().into_owned(),
        tag,
        downloaded: false,
      });
    }
  }

  let version = app.package_info().version.to_string();
  let (tag, url) = resolve_release_asset(&version).await?;

  let target = dir.join(format!("{}.apk", sanitize(&tag)));
  if target.is_file() && !force {
    return Ok(HelperApk {
      path: target.to_string_lossy().into_owned(),
      tag,
      downloaded: false,
    });
  }

  download_apk(&url, &target).await?;

  Ok(HelperApk {
    path: target.to_string_lossy().into_owned(),
    tag,
    downloaded: true,
  })
}

/// The most recently fetched APK in the cache, with the release tag it is named
/// after.
fn newest_cached_apk(dir: &Path) -> Option<(PathBuf, String)> {
  std::fs::read_dir(dir)
    .ok()?
    .flatten()
    .filter(|entry| entry.path().extension().is_some_and(|ext| ext == "apk"))
    .filter_map(|entry| {
      let modified = entry.metadata().ok()?.modified().ok()?;
      Some((entry.path(), modified))
    })
    .max_by_key(|(_, modified)| *modified)
    .map(|(path, _)| {
      let tag = path
        .file_stem()
        .map(|stem| stem.to_string_lossy().into_owned())
        .unwrap_or_default();
      (path, tag)
    })
}

/// A tag goes into a file name, and GitHub allows slashes in one.
fn sanitize(tag: &str) -> String {
  tag
    .chars()
    .map(|c| if c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_' { c } else { '_' })
    .collect()
}

fn http() -> Result<reqwest::Client, String> {
  reqwest::Client::builder()
    // GitHub rejects an API request with no User-Agent outright
    .user_agent(concat!("gps-mocker/", env!("CARGO_PKG_VERSION")))
    .build()
    .map_err(|e| format!("could not create an HTTP client: {}", e))
}

/// Finds the APK asset, preferring the release that matches this desktop build.
///
/// Falling back to the latest release matters for anyone running a development
/// build whose version was never tagged: they still get a working helper rather
/// than a 404.
async fn resolve_release_asset(version: &str) -> Result<(String, String), String> {
  let client = http()?;
  let candidates = [
    format!("https://api.github.com/repos/{}/releases/tags/v{}", HELPER_REPO, version),
    format!("https://api.github.com/repos/{}/releases/latest", HELPER_REPO),
  ];

  let mut last_error = String::new();
  for url in candidates {
    match fetch_release(&client, &url, HELPER_ASSET).await {
      Ok(found) => return Ok(found),
      Err(e) => last_error = e,
    }
  }
  Err(last_error)
}

/// Returns the release's tag and the download URL of `asset_name`.
async fn fetch_release(
  client: &reqwest::Client,
  url: &str,
  asset_name: &str,
) -> Result<(String, String), String> {
  let response = client
    .get(url)
    .header("Accept", "application/vnd.github+json")
    .send()
    .await
    .map_err(|e| format!("could not reach GitHub: {}", e))?;

  if !response.status().is_success() {
    return Err(format!("GitHub answered {} for {}", response.status(), url));
  }

  let release: serde_json::Value = response
    .json()
    .await
    .map_err(|e| format!("could not read the release: {}", e))?;

  let tag = release
    .get("tag_name")
    .and_then(|v| v.as_str())
    .unwrap_or("unknown")
    .to_string();

  let asset = release
    .get("assets")
    .and_then(|v| v.as_array())
    .and_then(|assets| {
      assets
        .iter()
        .find(|asset| asset.get("name").and_then(|v| v.as_str()) == Some(asset_name))
    })
    .and_then(|asset| asset.get("browser_download_url"))
    .and_then(|v| v.as_str())
    .ok_or_else(|| format!("release {} has no {}", tag, asset_name))?;

  Ok((tag, asset.to_string()))
}

/// Downloads to a temporary name and renames on success.
///
/// A half-written file left behind by a dropped connection would otherwise be
/// found by the cache lookup above and reused forever.
async fn download_apk(url: &str, target: &Path) -> Result<(), String> {
  let bytes = http()?
    .get(url)
    .send()
    .await
    .map_err(|e| format!("could not download the APK: {}", e))?
    .error_for_status()
    .map_err(|e| format!("could not download the APK: {}", e))?
    .bytes()
    .await
    .map_err(|e| format!("the APK download was cut short: {}", e))?;

  // an APK is a zip; anything else here is an error page that answered 200
  if !bytes.starts_with(b"PK\x03\x04") {
    return Err(format!("what {} returned is not an APK", url));
  }

  let partial = target.with_extension("apk.part");
  std::fs::write(&partial, &bytes).map_err(|e| format!("could not write {}: {}", partial.display(), e))?;
  std::fs::rename(&partial, target).map_err(|e| format!("could not save {}: {}", target.display(), e))?;
  Ok(())
}

// Returns adb's own output so the webview can show what actually happened,
// instead of a bare boolean. Runs off the main thread: `adb install` takes
// seconds and would otherwise freeze the UI that reports on it.
/// Installs the Android build of this app onto a device.
///
/// The APK comes from [`ensure_helper_apk`], or from a file the user picked
/// when there is no release to fetch one from.
#[tauri::command]
pub async fn install_apk(serial: Option<String>, apk_path: String) -> Result<String, String> {
  let resource_path = std::path::PathBuf::from(apk_path);
  if !resource_path.is_file() {
    return Err(format!("no APK at {}", resource_path.display()));
  }

  tauri::async_runtime::spawn_blocking(move || {
    let mut command = Command::new("adb");
    // without a serial adb refuses outright once two devices are attached
    if let Some(serial) = serial {
      command.arg("-s").arg(serial);
    }
    let output = command
      .arg("install")
      .arg("-r")
      .arg(&resource_path)
      .output()
      .map_err(|e| format!("failed to run adb: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();

    if output.status.success() {
      return Ok(stdout);
    }

    let reported = if !stderr.is_empty() {
      stderr
    } else if !stdout.is_empty() {
      stdout
    } else {
      format!("adb install failed ({})", output.status)
    };

    // A locally built copy is signed with the developer's own debug key, and
    // Android refuses to replace it with the release-signed one. Nothing but
    // uninstalling clears that, and that is the user's call because it takes
    // the routes saved on the device with it.
    if reported.contains("INSTALL_FAILED_UPDATE_INCOMPATIBLE")
      || reported.contains("signatures do not match")
    {
      return Err(format!(
        "{}\n\nA differently signed copy is already installed. Remove it first: adb uninstall com.akylas.gpsmocker",
        reported
      ));
    }

    Err(reported)
  })
  .await
  .map_err(|e| format!("apk install task failed: {}", e))?
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn a_tag_with_a_slash_still_makes_one_file_name() {
    assert_eq!(sanitize("release/v2.1.0"), "release_v2.1.0");
    assert_eq!(sanitize("v2.1.0-beta_1"), "v2.1.0-beta_1");
  }

  #[test]
  fn the_newest_apk_wins_and_nothing_else_counts() {
    let dir = std::env::temp_dir().join(format!("gps-mocker-cache-{}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();

    // a half-finished download must never be picked up as the cached copy
    std::fs::write(dir.join("v2.0.0.apk.part"), b"PK\x03\x04").unwrap();
    std::fs::write(dir.join("v1.0.0.apk"), b"PK\x03\x04").unwrap();
    std::thread::sleep(std::time::Duration::from_millis(20));
    std::fs::write(dir.join("v2.0.0.apk"), b"PK\x03\x04").unwrap();

    let (path, tag) = newest_cached_apk(&dir).unwrap();
    assert_eq!(tag, "v2.0.0");
    assert_eq!(path, dir.join("v2.0.0.apk"));

    std::fs::remove_dir_all(&dir).unwrap();
  }

  #[test]
  fn an_empty_cache_has_nothing_to_offer() {
    let dir = std::env::temp_dir().join(format!("gps-mocker-empty-{}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    assert!(newest_cached_apk(&dir).is_none());
    std::fs::remove_dir_all(&dir).unwrap();
  }

  /// Ignored by default: it talks to github.com. Run with
  /// `cargo test -- --ignored` when the release plumbing changes.
  #[tokio::test]
  #[ignore]
  async fn the_release_asset_is_found_by_name() {
    let client = http().unwrap();
    let url = format!("https://api.github.com/repos/{}/releases/latest", HELPER_REPO);
    let (tag, download) = fetch_release(&client, &url, "gps-mocker_1.2.0_amd64.deb")
      .await
      .unwrap();
    assert_eq!(tag, "v1.2.0");
    assert!(download.contains("gps-mocker_1.2.0_amd64.deb"), "{}", download);

    let missing = fetch_release(&client, &url, "nothing-here.apk").await.unwrap_err();
    assert!(missing.contains("nothing-here.apk"), "{}", missing);
  }

  /// Ignored by default: it downloads a few megabytes from github.com.
  #[tokio::test]
  #[ignore]
  async fn a_download_lands_atomically_and_has_to_be_a_zip() {
    let dir = std::env::temp_dir().join(format!("gps-mocker-dl-{}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let target = dir.join("v1.2.0.apk");

    let zip = format!("https://github.com/{}/archive/refs/tags/v1.2.0.zip", HELPER_REPO);
    download_apk(&zip, &target).await.unwrap();
    assert!(target.is_file());
    assert!(!target.with_extension("apk.part").exists());

    // an HTML error page that answered 200 must not be cached as an APK
    let not_a_zip = format!("https://github.com/{}", HELPER_REPO);
    let rejected = download_apk(&not_a_zip, &dir.join("bad.apk")).await.unwrap_err();
    assert!(rejected.contains("is not an APK"), "{}", rejected);
    assert!(!dir.join("bad.apk").exists());

    std::fs::remove_dir_all(&dir).unwrap();
  }
}

pub fn build_menu<R: Runtime>(handle: &tauri::AppHandle<R>) -> tauri::Result<Menu<R>> {
  let mut menu = MenuBuilder::new(handle);

  #[cfg(target_os = "macos")]
  {
    let app_menu = SubmenuBuilder::new(handle, handle.package_info().name.clone())
      .about(Some(AboutMetadata::default()))
      .separator()
      .services()
      .separator()
      .hide()
      .hide_others()
      .show_all()
      .separator()
      .quit()
      .build()?;
    menu = menu.item(&app_menu);
  }

  let file_menu = SubmenuBuilder::new(handle, "File")
    .item(
      // the id stays: the webview still routes it to the one importer
      &MenuItemBuilder::with_id("import_gpx", "Import Route…")
        .accelerator("CmdOrCtrl+O")
        .build(handle)?,
    )
    .item(
      &MenuItemBuilder::with_id("save_route", "Save Route")
        .accelerator("CmdOrCtrl+S")
        .build(handle)?,
    )
    .item(
      &MenuItemBuilder::with_id("saved_routes", "Saved Routes…")
        .accelerator("CmdOrCtrl+L")
        .build(handle)?,
    )
    .item(
      &MenuItemBuilder::with_id("export_gpx", "Export Route as GPX…")
        .accelerator("CmdOrCtrl+Shift+S")
        .build(handle)?,
    )
    .separator()
    .close_window()
    .build()?;

  // macOS routes Cmd+X/C/V/A and Cmd+Z through the Edit menu: without these
  // items the webview gets no editing shortcuts at all, so text fields
  // cannot be copied into or pasted from.
  let edit_menu = SubmenuBuilder::new(handle, "Edit")
    .undo()
    .redo()
    .separator()
    .cut()
    .copy()
    .paste()
    .select_all()
    .build()?;

  let route_menu = SubmenuBuilder::new(handle, "Route")
    // no accelerator: the webview binds Space, which as a menu accelerator
    // would fire even while typing in the search field
    .item(&MenuItemBuilder::with_id("play_pause", "Play / Pause").build(handle)?)
    .item(
      &MenuItemBuilder::with_id("stop_playback", "Stop")
        .accelerator("CmdOrCtrl+.")
        .build(handle)?,
    )
    .item(
      &MenuItemBuilder::with_id("restart_playback", "Restart")
        .accelerator("CmdOrCtrl+R")
        .build(handle)?,
    )
    .separator()
    .item(
      &MenuItemBuilder::with_id("build_route", "Build Route from Waypoints")
        .accelerator("CmdOrCtrl+B")
        .build(handle)?,
    )
    .item(
      &MenuItemBuilder::with_id("compute_maneuvers", "Compute Maneuvers (Valhalla)")
        .accelerator("CmdOrCtrl+M")
        .build(handle)?,
    )
    .item(&MenuItemBuilder::with_id("fit_route", "Zoom to Route").build(handle)?)
    .separator()
    .item(&MenuItemBuilder::with_id("clear_route", "Clear Route").build(handle)?)
    .build()?;

  let view_menu = {
    let builder = SubmenuBuilder::new(handle, "View");
    #[cfg(target_os = "macos")]
    let builder = builder.fullscreen();
    builder.build()?
  };

  let window_menu = SubmenuBuilder::new(handle, "Window")
    .minimize()
    .maximize()
    .build()?;

  // one item: the app works out what the device is missing and fixes it
  let device_menu = SubmenuBuilder::new(handle, "Device")
    .item(&MenuItemBuilder::with_id("prepare_device", "Prepare Device…").build(handle)?)
    .build()?;

  // You should always have a Help menu on macOS because it will automatically
  // show a menu search field
  let help_menu = SubmenuBuilder::new(handle, "Help")
    .item(&MenuItemBuilder::with_id("learn_more", "Learn More").build(handle)?)
    .build()?;

  menu
    .item(&file_menu)
    .item(&edit_menu)
    .item(&route_menu)
    .item(&view_menu)
    .item(&window_menu)
    .item(&device_menu)
    .item(&help_menu)
    .build()
}
