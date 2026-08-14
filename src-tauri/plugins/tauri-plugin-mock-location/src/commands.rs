use tauri::{command, AppHandle, Runtime};

use crate::models::*;
use crate::MockLocationExt;
use crate::Result;

#[command]
pub(crate) async fn check_status<R: Runtime>(app: AppHandle<R>) -> Result<Status> {
  app.mock_location().check_status()
}

#[command]
pub(crate) async fn open_developer_settings<R: Runtime>(app: AppHandle<R>) -> Result<()> {
  app.mock_location().open_developer_settings()
}

#[command]
pub(crate) async fn start_mocking<R: Runtime>(app: AppHandle<R>) -> Result<Status> {
  app.mock_location().start_mocking()
}

#[command]
pub(crate) async fn stop_mocking<R: Runtime>(app: AppHandle<R>) -> Result<Status> {
  app.mock_location().stop_mocking()
}

#[command]
pub(crate) async fn push_location<R: Runtime>(
  app: AppHandle<R>,
  payload: PushLocationRequest,
) -> Result<()> {
  app.mock_location().push_location(payload)
}

#[command]
pub(crate) async fn set_route<R: Runtime>(
  app: AppHandle<R>,
  payload: SetRouteRequest,
) -> Result<()> {
  app.mock_location().set_route(payload)
}

#[command]
pub(crate) async fn set_playback<R: Runtime>(
  app: AppHandle<R>,
  payload: SetPlaybackRequest,
) -> Result<()> {
  app.mock_location().set_playback(payload)
}

#[command]
pub(crate) async fn set_system_bars<R: Runtime>(
  app: AppHandle<R>,
  payload: SystemBarsRequest,
) -> Result<()> {
  app.mock_location().set_system_bars(payload)
}
