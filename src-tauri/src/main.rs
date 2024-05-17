// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

use execute::Execute;
use tauri::{path::BaseDirectory, Manager};

#[tauri::command]
fn execute_game(path: String)
{
    let mut program = Command::new(path);
    let _ = program.execute();
}

#[tauri::command]
fn read_data(app: tauri::AppHandle) -> String
{
    let resource_path = app.path().resolve("files/data.json", BaseDirectory::Resource).expect("failed to resolve resource");

    let file = std::fs::File::open(&resource_path).unwrap();
    let data: serde_json::Value = serde_json::from_reader(file).unwrap();
    return data.to_string();
}

#[tauri::command]
fn get_card_img(app: tauri::AppHandle, name: String) -> String
{
    let resource_path = app.path().resolve(&name, BaseDirectory::Public).expect("failed to resolve resource");

    return resource_path.display().to_string().replace("\\\\?\\", "");
}

#[tauri::command]
fn write_data(app: tauri::AppHandle, data: String)
{
    let resource_path = app.path().resolve("files/data.json", BaseDirectory::Resource).expect("failed to resolve resource");
    std::fs::write(&resource_path, data).expect("Unable to write file");
}

fn main() {
    tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![execute_game, read_data, write_data, get_card_img])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
