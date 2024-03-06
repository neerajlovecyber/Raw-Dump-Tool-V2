// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::{BufRead};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
use std::process::{Command, Stdio};

#[tauri::command]
fn launch_exe(window: tauri::Window, exe_path: String, args: Vec<String>) -> Result<(), String> {
  // Spawn a new thread to run the external executable
  std::thread::spawn(move || {
    // Spawn the process with provided arguments
    let mut command = Command::new(exe_path);
    
    // Add arguments to the command
    for arg in args {
      command.arg(arg);
    }

    // Capture stdout and stderr
    command.stdout(Stdio::piped()).stderr(Stdio::piped());

    // Execute the command
    let mut child = command.spawn().map_err(|e| e.to_string()).unwrap();

    // Read stdout asynchronously
    let stdout = child.stdout.take().unwrap();
    for line in std::io::BufReader::new(stdout).lines() {
      let output = line.unwrap();
      window.emit("stdout", Some(output)).unwrap();
    }


    // Wait for the process to finish
    let _ = child.wait();
  });

  Ok(())
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, launch_exe])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
