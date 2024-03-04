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
fn launch_exe(exe_path: String, args: Vec<String>) -> Result<String, String> {
    // Spawn the process with provided arguments
    let mut command = Command::new(exe_path);
    
    // Add arguments to the command
    for arg in args {
        command.arg(arg);
    }

    // Capture stdout and stderr
    command.stdout(Stdio::piped()).stderr(Stdio::piped());

    // Execute the command
    let mut child = command.spawn().map_err(|e| e.to_string())?;

    // Read stdout asynchronously
    let stdout = child.stdout.take().unwrap();
    let mut output = String::new();
    for line in std::io::BufReader::new(stdout).lines() {
        output.push_str(&line.map_err(|e| e.to_string())?);
        output.push('\n');
    }

    // Read stderr asynchronously
    let stderr = child.stderr.take().unwrap();
    for line in std::io::BufReader::new(stderr).lines() {
        output.push_str(&line.map_err(|e| e.to_string())?);
        output.push('\n');
    }

    // Wait for the process to finish
    let _ = child.wait();

    Ok(output)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, launch_exe])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
