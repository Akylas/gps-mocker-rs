mod apple;

#[cfg(desktop)]
mod desktop;

#[cfg(desktop)]
use tauri::Emitter;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let builder = tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init());

  // window geometry is restored from disk, which only exists on desktop
  #[cfg(desktop)]
  let builder = builder.plugin(tauri_plugin_window_state::Builder::default().build());

  // on Android the app is the mock provider, so there is no adb bridge and no
  // menu bar to hang it off
  #[cfg(target_os = "android")]
  let builder = builder.plugin(tauri_plugin_mock_location::init());

  #[cfg(desktop)]
  let builder = builder
    .invoke_handler(tauri::generate_handler![
      desktop::install_apk,
      desktop::ensure_helper_apk,
      apple::send_location_to_simulators,
      apple::send_location_to_devices
    ])
    .menu(desktop::build_menu)
    // v2 no longer forwards menu clicks to the webview, so re-emit them ourselves
    .on_menu_event(|app, event| {
      let _ = app.emit("menu", event.id().0.clone());
    });

  #[cfg(target_os = "macos")]
  let builder = builder.setup(|_app| {
    // NSApplication exists by now, which it does not when the builder is
    // still being assembled
    apple::set_dock_icon();
    Ok(())
  });

  builder
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
