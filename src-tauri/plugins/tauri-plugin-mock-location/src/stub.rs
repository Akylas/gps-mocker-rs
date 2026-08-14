//! Desktop and iOS have no test location provider. The commands stay callable
//! so the webview does not need a platform check around every import; they just
//! report the feature as unavailable.

use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;
use crate::{Error, Result};

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<MockLocation<R>> {
  Ok(MockLocation(app.clone()))
}

pub struct MockLocation<R: Runtime>(#[allow(dead_code)] AppHandle<R>);

impl<R: Runtime> MockLocation<R> {
  pub fn check_status(&self) -> Result<Status> {
    Ok(Status::default())
  }

  pub fn open_developer_settings(&self) -> Result<()> {
    Err(Error::Unsupported)
  }

  pub fn start_mocking(&self) -> Result<Status> {
    Err(Error::Unsupported)
  }

  pub fn stop_mocking(&self) -> Result<Status> {
    Ok(Status::default())
  }

  pub fn push_location(&self, _payload: PushLocationRequest) -> Result<()> {
    Err(Error::Unsupported)
  }

  pub fn set_route(&self, _payload: SetRouteRequest) -> Result<()> {
    Err(Error::Unsupported)
  }

  pub fn set_playback(&self, _payload: SetPlaybackRequest) -> Result<()> {
    Err(Error::Unsupported)
  }

  pub fn set_system_bars(&self, _payload: SystemBarsRequest) -> Result<()> {
    // desktop window chrome is the platform's business, not ours
    Ok(())
  }
}
