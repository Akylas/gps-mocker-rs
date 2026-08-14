//! Drives Android's `LocationManager` test providers so the app itself is the
//! mock location source — no adb, no helper APK, no desktop attached.
//!
//! Everything runs in a foreground service: the whole point is to keep feeding
//! locations while some *other* app is in front, and a backgrounded webview
//! gets throttled to a stop.

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
