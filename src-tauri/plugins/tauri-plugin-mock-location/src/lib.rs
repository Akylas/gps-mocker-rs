//! Drives Android's `LocationManager` test providers so the app itself is the
//! mock location source — no adb, no helper APK, no desktop attached.
//!
//! A session is the registration itself, which lives in the system and outlives
//! the process that made it. A foreground service is only added on top of that
//! when a route is being replayed on the device: a backgrounded webview gets
//! its timers throttled to a stop, and that clock has to keep running. Nothing
//! else earns a notification — a desktop driving the device over adb brings its
//! own clock and never starts one.

use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

mod commands;
mod error;
mod models;

pub use error::{Error, Result};
pub use models::*;

#[cfg(target_os = "android")]
mod mobile;
#[cfg(not(target_os = "android"))]
mod stub;

#[cfg(target_os = "android")]
use mobile::MockLocation;
#[cfg(not(target_os = "android"))]
use stub::MockLocation;

/// Access to the mock-location APIs.
pub trait MockLocationExt<R: Runtime> {
  fn mock_location(&self) -> &MockLocation<R>;
}

impl<R: Runtime, T: Manager<R>> MockLocationExt<R> for T {
  fn mock_location(&self) -> &MockLocation<R> {
    self.state::<MockLocation<R>>().inner()
  }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("mock-location")
    .invoke_handler(tauri::generate_handler![
      commands::check_status,
      commands::open_developer_settings,
      commands::start_mocking,
      commands::stop_mocking,
      commands::push_location,
      commands::set_route,
      commands::set_playback,
      commands::set_notification_mode,
      commands::set_system_bars
    ])
    .setup(|app, api| {
      #[cfg(target_os = "android")]
      let handle = mobile::init(app, api)?;
      #[cfg(not(target_os = "android"))]
      let handle = stub::init(app, api)?;
      app.manage(handle);
      Ok(())
    })
    .build()
}
