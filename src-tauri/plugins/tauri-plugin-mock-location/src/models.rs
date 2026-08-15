use serde::{Deserialize, Serialize};

/// One point of a pre-baked, time-parameterised track.
///
/// The webview keeps every rule about how fast the vehicle should be going —
/// recorded speeds, smart slowdown before maneuvers, the speed slider — and
/// bakes the result into these samples. The service only has to interpolate
/// between them by wall clock, which is why none of that logic is duplicated
/// in Kotlin.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Sample {
  /// milliseconds from the start of the track, strictly increasing
  pub t: f64,
  pub lat: f64,
  pub lon: f64,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub altitude: Option<f64>,
  /// degrees clockwise from true north
  #[serde(skip_serializing_if = "Option::is_none")]
  pub bearing: Option<f64>,
  /// metres per second
  #[serde(skip_serializing_if = "Option::is_none")]
  pub speed: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetRouteRequest {
  pub samples: Vec<Sample>,
  /// total track duration in milliseconds at 1× playback
  pub duration_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetPlaybackRequest {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub playing: Option<bool>,
  /// seek target, in track milliseconds
  #[serde(skip_serializing_if = "Option::is_none")]
  pub position_ms: Option<f64>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub speed_multiplier: Option<f64>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub looping: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PushLocationRequest {
  pub lat: f64,
  pub lon: f64,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub altitude: Option<f64>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub bearing: Option<f64>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub speed: Option<f64>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub accuracy: Option<f64>,
}

/// When the Android build is allowed to show its foreground-service
/// notification. The service only exists to keep the playback clock running
/// while another app is in front, so it is the notification that decides
/// whether there is a service at all.
#[derive(Debug, Clone, Copy, Default, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum NotificationMode {
  /// for as long as the app holds the test providers
  Always,
  /// only while a route is being replayed on the device itself
  #[default]
  Playing,
  /// never; playback then stops surviving the app going to the background
  Never,
}

#[derive(Debug, Clone, Copy, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NotificationRequest {
  pub mode: NotificationMode,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Status {
  /// false on every platform that has no test location provider
  pub available: bool,
  /// true once the user has picked this app in Developer options →
  /// "Select mock location app"
  pub selected_as_mock_app: bool,
  /// true while the app holds the test providers, with or without a service
  pub mocking: bool,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Empty {}

/// Which way to paint the system bars' icons. See the Kotlin command for why
/// the webview has to drive this rather than the night resource qualifier.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemBarsRequest {
  pub dark: bool,
}
