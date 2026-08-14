const COMMANDS: &[&str] = &[
  "check_status",
  "open_developer_settings",
  "start_mocking",
  "stop_mocking",
  "push_location",
  "set_route",
  "set_playback",
  "set_system_bars",
  // the mobile bridge's own command, invoked by addPluginListener; without a
  // permission for it the plugin can never emit an event to the webview
  "registerListener",
];

fn main() {
  tauri_plugin::Builder::new(COMMANDS)
    .android_path("android")
    .build();
}
