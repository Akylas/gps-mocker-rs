use serde::de::DeserializeOwned;
use tauri::{
  plugin::{PluginApi, PluginHandle},
  AppHandle, Runtime,
};

use crate::models::*;
use crate::Result;

const PLUGIN_IDENTIFIER: &str = "com.akylas.gpsmocker.mocklocation";

pub fn init<R: Runtime, C: DeserializeOwned>(
  _app: &AppHandle<R>,
  api: PluginApi<R, C>,
) -> crate::Result<MockLocation<R>> {
  let handle = api.register_android_plugin(PLUGIN_IDENTIFIER, "MockLocationPlugin")?;
  Ok(MockLocation(handle))
}

pub struct MockLocation<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> MockLocation<R> {
  pub fn check_status(&self) -> Result<Status> {
    self
      .0
      .run_mobile_plugin("checkStatus", Empty {})
      .map_err(Into::into)
  }

  pub fn open_developer_settings(&self) -> Result<()> {
    self
      .0
      .run_mobile_plugin::<Empty>("openDeveloperSettings", Empty {})
      .map(|_| ())
      .map_err(Into::into)
  }

  pub fn start_mocking(&self) -> Result<Status> {
    self
      .0
      .run_mobile_plugin("startMocking", Empty {})
      .map_err(Into::into)
  }

  pub fn stop_mocking(&self) -> Result<Status> {
    self
      .0
      .run_mobile_plugin("stopMocking", Empty {})
      .map_err(Into::into)
  }

  pub fn push_location(&self, payload: PushLocationRequest) -> Result<()> {
    self
      .0
      .run_mobile_plugin::<Empty>("pushLocation", payload)
      .map(|_| ())
      .map_err(Into::into)
  }

  pub fn set_route(&self, payload: SetRouteRequest) -> Result<()> {
    self
      .0
      .run_mobile_plugin::<Empty>("setRoute", payload)
      .map(|_| ())
      .map_err(Into::into)
  }

  pub fn set_system_bars(&self, payload: SystemBarsRequest) -> Result<()> {
    self
      .0
      .run_mobile_plugin::<Empty>("setSystemBarsAppearance", payload)
      .map(|_| ())
      .map_err(Into::into)
  }

  pub fn set_playback(&self, payload: SetPlaybackRequest) -> Result<()> {
    self
      .0
      .run_mobile_plugin::<Empty>("setPlayback", payload)
      .map(|_| ())
      .map_err(Into::into)
  }
}
