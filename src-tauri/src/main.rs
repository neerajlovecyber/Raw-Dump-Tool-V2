use lazy_static::lazy_static;
use std::sync::{Arc, Mutex};
use tauri::Window;
use std::process::{Command, Stdio};
use std::io::{self, BufReader, BufRead};

// Define the global variable
lazy_static! {
    static ref EXECUTING: Arc<Mutex<bool>> = Arc::new(Mutex::new(false));
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn launch_exe(window: Window, handle: tauri::AppHandle, args: Vec<String>) -> Result<(), String> {
    let target_path = args.get(0).cloned().ok_or("Target path is required")?;
    let thread_count = args.get(1).cloned().ok_or("Thread count is required")?;

    let mut lock = EXECUTING.lock().unwrap();
    if *lock {
        return Err("Another process is already executing".to_string());
    }
    *lock = true; // Set executing status to true

    let exe_path = handle.path_resolver().resolve_resource("src/assets/winpmem.exe")
        .expect("Failed to resolve resource");

    std::thread::spawn(move || {
        let asset = std::fs::read(&exe_path).unwrap();
        let mut temp_file = std::env::temp_dir();
        temp_file.push("winpmem.exe");
        std::fs::write(&temp_file, asset).unwrap();

        let temp_file_str = temp_file.to_str().expect("Failed to convert temp file path to string");
        let mut command = Command::new("cmd.exe");
        command.args([
            "/C", 
            "cmd.exe", 
            "/C", 
            &temp_file_str, 
            &target_path, 
            "--threads", 
            &thread_count
        ])
        .stdout(Stdio::piped())  // Capture standard output
        .stderr(Stdio::piped());  // Capture standard error

        let output = command.output().expect("Failed to execute command");

        // Emit signal when execution is finished
        window.emit::<()>("executionFinished", ()).unwrap();

        // Convert output to String and emit it
        let stdout_str = String::from_utf8_lossy(&output.stdout);
        let stderr_str = String::from_utf8_lossy(&output.stderr);
        
        if !stdout_str.is_empty() {
            window.emit("stdout", stdout_str.into_owned()).unwrap();
        }
        if !stderr_str.is_empty() {
            window.emit("stderr", stderr_str.into_owned()).unwrap();
        }

        // Set executing status to false
        *EXECUTING.lock().unwrap() = false;
    });

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, launch_exe])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
