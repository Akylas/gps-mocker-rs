#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::process::Command;
// use tauri::api::shell::{
//   open
// };
use tauri::{CustomMenuItem, Menu, MenuEntry, MenuItem, Submenu, WindowBuilder, WindowUrl};
// use cocoa::foundation::{NSUserDefaults};

#[cfg(target_os = "macos")]
use cocoa::{
  base::{nil, YES},
  foundation::{NSArray, NSDictionary, NSString},
};
#[cfg(target_os = "macos")]
use objc::{class, msg_send, runtime::Object, sel, sel_impl};


#[tauri::command]
fn send_location_to_simulators(lat: f32, lon: f32, devices: Vec<String>) {
  if cfg!(target_os = "macos") {
    unsafe {
      let mkstr = |s: String| { NSString::alloc(nil).init_str(s.as_str()) };
      let keys = vec![
        NSString::alloc(nil).init_str("simulateLocationLatitude"),
        NSString::alloc(nil).init_str("simulateLocationLongitude"),
        NSString::alloc(nil).init_str("simulateLocationDevices"),
      ];
      let devices_vec = devices.clone().into_iter().map(&mkstr).collect::<Vec<_>>();
      let objects = vec![
        msg_send![class!(NSNumber), numberWithFloat: lat],
        msg_send![class!(NSNumber), numberWithFloat: lon],
        NSArray::arrayWithObjects(nil, &devices_vec)
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
}

// the payload type must implement `Serialize`.
#[derive(serde::Serialize)]
struct Payload {
  message: String,
}

#[tauri::command]
fn install_apk() -> Result<bool, String> {
  let output = Command::new("adb")
    .args(&["install", "../resources/settings_apk-debug.apk"])
    .output()
    .expect("Failed to install APK");

  if output.status.success() {
    Ok(true)
  } else {
    Ok(false)
  }
}

fn main() {
  let ctx = tauri::generate_context!();

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      install_apk,
      send_location_to_simulators
    ])
    .menu(Menu::with_items([
      #[cfg(target_os = "macos")]
      MenuEntry::Submenu(Submenu::new(
        &ctx.package_info().name,
        Menu::with_items([
          MenuItem::About(ctx.package_info().name.clone()).into(),
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
    .on_menu_event(|event| {
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
    })
    .create_window("main", WindowUrl::default(), |win, webview| {
      let win = win
        .title("GPS Mocker")
        .resizable(true)
        .decorations(true)
        .always_on_top(false)
        .inner_size(1000.0, 650.0)
        .min_inner_size(400.0, 200.0)
        .skip_taskbar(false)
        .fullscreen(false);
      return (win, webview);
    })
    .unwrap() // safe to unwrap: window label is valid
    .run(ctx)
    .expect("error while running tauri application");
}
