fn main() {
  if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("macos") {
    println!("cargo:rustc-env=MACOSX_DEPLOYMENT_TARGET=10.13");
  }
  tauri_build::build();
}
