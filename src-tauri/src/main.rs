#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use byteorder::{BigEndian, ByteOrder};
use std::process::Command;
use tauri::{
  AboutMetadata, CustomMenuItem, Menu, MenuEntry, MenuItem, Submenu, WindowBuilder, WindowUrl,
};
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
  let resource_path = handle.path_resolver()
      .resolve_resource("../resources/settings_apk-debug.apk")
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
  let ctx = tauri::generate_context!();

  tauri::Builder::default()
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .invoke_handler(tauri::generate_handler![
      install_apk,
      send_location_to_simulators,
      send_location_to_devices
    ])
    .menu(Menu::with_items([
      #[cfg(target_os = "macos")]
      MenuEntry::Submenu(Submenu::new(
        &ctx.package_info().name,
        Menu::with_items([
          MenuItem::About(ctx.package_info().name.clone(), AboutMetadata::new()).into(),
          MenuItem::Separator.into(),
          MenuItem::Services.into(),
          MenuItem::Separator.into(),
          MenuItem::Hide.into(),
          MenuItem::HideOthers.into(),
          MenuItem::ShowAll.into(),
          MenuItem::Separator.into(),
          MenuItem::Quit.into(),
        ]),
      )),
      MenuEntry::Submenu(Submenu::new(
        "File",
        Menu::with_items([MenuItem::CloseWindow.into()]),
      )),
      // MenuEntry::Submenu(Submenu::new(
      //   "Edit",
      //   Menu::with_items([
      //     MenuItem::Undo.into(),
      //     MenuItem::Redo.into(),
      //     MenuItem::Separator.into(),
      //     MenuItem::Cut.into(),
      //     MenuItem::Copy.into(),
      //     MenuItem::Paste.into(),
      //     #[cfg(not(target_os = "macos"))]
      //     MenuItem::Separator.into(),
      //     MenuItem::SelectAll.into(),
      //   ]),
      // )),
      MenuEntry::Submenu(Submenu::new(
        "View",
        Menu::with_items([MenuItem::EnterFullScreen.into()]),
      )),
      MenuEntry::Submenu(Submenu::new(
        "Window",
        Menu::with_items([MenuItem::Minimize.into(), MenuItem::Zoom.into()]),
      )),
      MenuEntry::Submenu(Submenu::new(
        "Simulator",
        Menu::new()
          .add_item(CustomMenuItem::new("setup", "Setup"))
          .add_item(CustomMenuItem::new("install_apk", "Install APK")),
      )),
      // You should always have a Help menu on macOS because it will automatically
      // show a menu search field
      MenuEntry::Submenu(Submenu::new(
        "Help",
        Menu::with_items([CustomMenuItem::new("learn_more", "Learn More").into()]),
      )),
    ]))
    // .on_menu_event(|event| {
    // let event_name = event.menu_item_id();
    // println!("on_menu_event {:?}", event_name);
    // match event_name {
    //   "Learn More" => {
    //     shell::open(
    //       "https://github.com/probablykasper/tauri-template".to_string(),
    //       None,
    //     )
    //     .unwrap();
    //   }
    //   _ => {}
    // }
    // })
    .setup(|app| {
      WindowBuilder::new(app, "main", WindowUrl::default())
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
    .run(ctx)
    .expect("error while running tauri application");
}
