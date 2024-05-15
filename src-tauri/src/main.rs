// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
/*
use std::process::Command;
use execute::Execute;
*/
/*
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


#[tauri::command]
fn execute_game(path: &str) {
    let mut program = Command::new(path);
    program.execute();
}
*/
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        //.invoke_handler(tauri::generate_handler![execute_game])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
