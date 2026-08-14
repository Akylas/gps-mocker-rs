#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

// The real entrypoint lives in lib.rs: on mobile the app is loaded as a cdylib
// by the platform's own launcher, which never calls main().
fn main() {
  gps_mocker_lib::run()
}
