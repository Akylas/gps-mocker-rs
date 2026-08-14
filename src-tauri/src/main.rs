#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use byteorder::{BigEndian, ByteOrder};
use std::process::Command;
use tauri::menu::{AboutMetadata, MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::path::BaseDirectory;
use tauri::{Emitter, Manager, WebviewUrl, WebviewWindowBuilder};
use std::str;


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
fn send_location_to_simulators(lat: f32, lon: f32, devices: Vec<String>) {
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
fn send_location_to_devices(lat: f32, lon: f32) {
  #[cfg(target_os = "macos")]
  unsafe {
  let lat_str = lat.to_string();
  let lon_str = lon.to_string();
  let start_msg = 0 as i8;
  let lat_str_length = lat_str.chars().count() as i8;
  let lon_str_length = lon_str.chars().count() as i8;
  let devices = match idevice::get_devices() {
    Ok(devices) => devices,
    Err(e) => {
      // If the daemon is not running or does not behave as expected, this returns an error
      // println!("Error getting devices: {:?}", e);
      return;
    }
  };
  for device in devices {
    // Start an instproxy service on the device
    let mut lockdown_client = match device.new_lockdownd_client("idevicesetlocation".to_string()) {
      Ok(lockdown_client) => {
        println!("Successfully started lockdown_client");
        lockdown_client
      }
      Err(e) => {
        println!("Error starting lockdown_client: {:?}", e);
        return;
      }
    };
    let service =
      match lockdown_client.start_service("com.apple.dt.simulatelocation".to_string(), true) {
        Ok(service) => {
          println!("Successfully started service");
          service
        }
        Err(e) => {
          println!("Error starting service: {:?}", e);
          return;
        }
      };
    let service_client = match service::ServiceClient::new(&device, service) {
      Ok(service) => {
        println!("Successfully created service client");
        service
      }
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

// the payload type must implement `Serialize`.
#[derive(serde::Serialize)]
struct Payload {
  message: String,
}

#[tauri::command]
fn install_apk(handle: tauri::AppHandle) -> Result<bool, String> {
  let resource_path = handle.path()
      .resolve("settings_apk-debug.apk", BaseDirectory::Resource)
      .expect("failed to resolve resource settings_apk-debug.apk");
    let output = Command::new("adb")
    .args(&["install", &(resource_path.into_os_string().into_string().unwrap())])
    .output()
    .expect("Failed to install APK");

  if output.status.success() {
    Ok(true)
  } else {
    println!("error installing apk {:?}", str::from_utf8(&output.stderr) );
    Ok(false)
  }
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_os::init())
    .invoke_handler(tauri::generate_handler![
      install_apk,
      send_location_to_simulators,
      send_location_to_devices
    ])
    .menu(|handle| {
      let mut menu = MenuBuilder::new(handle);

      #[cfg(target_os = "macos")]
      {
        let app_menu = SubmenuBuilder::new(handle, handle.package_info().name.clone())
          .about(Some(AboutMetadata::default()))
          .separator()
          .services()
          .separator()
          .hide()
          .hide_others()
          .show_all()
          .separator()
          .quit()
          .build()?;
        menu = menu.item(&app_menu);
      }

      let file_menu = SubmenuBuilder::new(handle, "File").close_window().build()?;

      let view_menu = {
        let builder = SubmenuBuilder::new(handle, "View");
        #[cfg(target_os = "macos")]
        let builder = builder.fullscreen();
        builder.build()?
      };

      let window_menu = SubmenuBuilder::new(handle, "Window")
        .minimize()
        .maximize()
        .build()?;

      let simulator_menu = SubmenuBuilder::new(handle, "Simulator")
        .item(&MenuItemBuilder::with_id("setup", "Setup").build(handle)?)
        .item(&MenuItemBuilder::with_id("install_apk", "Install APK").build(handle)?)
        .build()?;

      // You should always have a Help menu on macOS because it will automatically
      // show a menu search field
      let help_menu = SubmenuBuilder::new(handle, "Help")
        .item(&MenuItemBuilder::with_id("learn_more", "Learn More").build(handle)?)
        .build()?;

      menu
        .item(&file_menu)
        .item(&view_menu)
        .item(&window_menu)
        .item(&simulator_menu)
        .item(&help_menu)
        .build()
    })
    // v2 no longer forwards menu clicks to the webview, so re-emit them ourselves
    .on_menu_event(|app, event| {
      let _ = app.emit("menu", event.id().0.clone());
    })
    .setup(|app| {
      WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
        .title("GPS Mocker")
        .resizable(true)
        .decorations(true)
        .always_on_top(false)
        .inner_size(800.0, 650.0)
        .min_inner_size(300.0, 300.0)
        .skip_taskbar(false)
        .fullscreen(false)
        .build()?;
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
