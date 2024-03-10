use lazy_static::lazy_static;
use std::sync::{Arc, Mutex};
use tauri::Window;
use std::io::BufRead;

// Define the global variable
lazy_static! {
    static ref EXECUTING: Arc<Mutex<bool>> = Arc::new(Mutex::new(false));
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn launch_exe(window: Window, exe_path: String, args: Vec<String>) -> Result<(), String> {
    // Check if already executing, return early if true
    if *EXECUTING.lock().unwrap() {
        return Err("Another process is already executing".to_string());
    }

    // Set executing status to true
    *EXECUTING.lock().unwrap() = true;

    // Spawn a new thread to run the external executable
    std::thread::spawn(move || {
        // Spawn the process with provided arguments
        let mut command = std::process::Command::new(exe_path);
        
        // Add arguments to the command
        for arg in args {
            command.arg(arg);
        }

        // Capture stdout and stderr
        command.stdout(std::process::Stdio::piped()).stderr(std::process::Stdio::piped());

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

        // Emit signal when execution is finished
        window.emit::<()>("executionFinished", ()).unwrap(); // Pass `()` as payload

        // Set executing status to false
        *EXECUTING.lock().unwrap() = false;
    });

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, launch_exe])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

}
