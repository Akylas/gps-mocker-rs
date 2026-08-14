//! Location sinks that only exist on Apple hosts: the Simulator listens on a
//! distributed notification, physical devices over the lockdown service.
//!
//! The commands stay registered on every platform so the webview can call them
//! without a platform check; off Apple they are no-ops.

#[cfg(target_os = "macos")]
use rusty_libimobiledevice::{idevice, service};

#[cfg(target_os = "macos")]
use cocoa::{
  base::{nil, YES},
  foundation::{NSArray, NSDictionary, NSString},
};

#[cfg(target_os = "macos")]
use objc::{class, msg_send, runtime::Object, sel, sel_impl};

#[tauri::command]
#[cfg_attr(not(target_os = "macos"), allow(unused_variables))]
pub fn send_location_to_simulators(lat: f32, lon: f32, devices: Vec<String>) {
  #[cfg(target_os = "macos")]
  unsafe {
    let mkstr = |s: String| NSString::alloc(nil).init_str(s.as_str());
    let keys = vec![
      NSString::alloc(nil).init_str("simulateLocationLatitude"),
      NSString::alloc(nil).init_str("simulateLocationLongitude"),
      NSString::alloc(nil).init_str("simulateLocationDevices"),
    ];
    let devices_vec = devices.clone().into_iter().map(&mkstr).collect::<Vec<_>>();
    let objects = vec![
      msg_send![class!(NSNumber), numberWithFloat: lat],
      msg_send![class!(NSNumber), numberWithFloat: lon],
      NSArray::arrayWithObjects(nil, &devices_vec),
    ];
    let keys_array = NSArray::arrayWithObjects(nil, &keys);
    let objs_array = NSArray::arrayWithObjects(nil, &objects);
    let notification_center: &Object =
      msg_send![class!(NSDistributedNotificationCenter), defaultCenter];
    let _: () = msg_send![
        notification_center,
        postNotificationName: NSString::alloc(nil).init_str("com.apple.iphonesimulator.simulateLocation")
        object: nil
        userInfo: NSDictionary::dictionaryWithObjects_forKeys_(nil, objs_array, keys_array)
        deliverImmediately: YES
    ];
  }
}

#[tauri::command]
#[cfg_attr(not(target_os = "macos"), allow(unused_variables))]
pub fn send_location_to_devices(lat: f32, lon: f32) {
  #[cfg(target_os = "macos")]
  {
    let lat_str = lat.to_string();
    let lon_str = lon.to_string();
    let start_msg = 0 as i8;
    let lat_str_length = lat_str.chars().count() as i8;
    let lon_str_length = lon_str.chars().count() as i8;
    let devices = match idevice::get_devices() {
      Ok(devices) => devices,
      Err(_) => {
        // the daemon is not running, or does not behave as expected
        return;
      }
    };
    for device in devices {
      let mut lockdown_client = match device.new_lockdownd_client("idevicesetlocation".to_string())
      {
        Ok(lockdown_client) => lockdown_client,
        Err(e) => {
          println!("Error starting lockdown_client: {:?}", e);
          return;
        }
      };
      let service =
        match lockdown_client.start_service("com.apple.dt.simulatelocation".to_string(), true) {
          Ok(service) => service,
          Err(e) => {
            println!("Error starting service: {:?}", e);
            return;
          }
        };
      let service_client = match service::ServiceClient::new(&device, service) {
        Ok(service) => service,
        Err(e) => {
          println!("Error creating service client: {:?}", e);
          return;
        }
      };
      match service_client.send(u32::to_be_bytes(start_msg as u32).map(|x| x as i8).to_vec()) {
        Ok(_) => {}
        Err(e) => {
          println!("Error sending message: {:?}", e);
          return;
        }
      };

      let mut vector_data = u32::to_be_bytes(lat_str_length as u32)
        .map(|x| x as i8)
        .to_vec();
      vector_data.append(
        &mut lat_str
          .chars()
          .into_iter()
          .map(|x| x as i8)
          .collect::<Vec<i8>>()
          .to_vec(),
      );
      vector_data.append(
        &mut u32::to_be_bytes(lon_str_length as u32)
          .map(|x| x as i8)
          .to_vec(),
      );
      vector_data.append(
        &mut lon_str
          .chars()
          .into_iter()
          .map(|x| x as i8)
          .collect::<Vec<i8>>()
          .to_vec(),
      );
      match service_client.send(vector_data.clone()) {
        Ok(_) => {}
        Err(e) => {
          println!("Error sending message: {:?}", e);
          return;
        }
      };
    }
  }
}
