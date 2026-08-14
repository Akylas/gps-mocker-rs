//! Everything that only makes sense when a desktop drives a separate device:
//! the adb bridge and the native menu bar.
//!
//! On Android the app mocks its own location provider, so none of this is
//! compiled in.

use std::process::Command;
#[cfg(target_os = "macos")]
use tauri::menu::AboutMetadata;
use tauri::menu::{Menu, MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::Runtime;

// Returns adb's own output so the webview can show what actually happened,
// instead of a bare boolean. Runs off the main thread: `adb install` takes
// seconds and would otherwise freeze the UI that reports on it.
/// Installs the Android build of this app onto a device.
///
/// The APK is chosen by the user rather than bundled: it is this same project
/// built for Android, so shipping a copy inside the desktop binary would mean
/// committing a large artifact that goes stale on every release.
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
      Ok(stdout)
    } else if !stderr.is_empty() {
      Err(stderr)
    } else if !stdout.is_empty() {
      Err(stdout)
    } else {
      Err(format!("adb install failed ({})", output.status))
    }
  })
  .await
  .map_err(|e| format!("apk install task failed: {}", e))?
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
      &MenuItemBuilder::with_id("import_gpx", "Import GPX…")
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

  let simulator_menu = SubmenuBuilder::new(handle, "Simulator")
    .item(&MenuItemBuilder::with_id("setup", "Setup").build(handle)?)
    .item(&MenuItemBuilder::with_id("install_apk", "Install APK").build(handle)?)
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
    .item(&simulator_menu)
    .item(&help_menu)
    .build()
}
