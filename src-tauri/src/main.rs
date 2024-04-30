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
fn launch_exe(window: Window,handle: tauri::AppHandle, args: Vec<String>) -> Result<(), String> {
    let target_path = args[0].clone();
    let thread_count = args[1].clone();
    // Check if already executing, return early if true
    if *EXECUTING.lock().unwrap() {
        return Err("Another process is already executing".to_string());
    }

    // Set executing status to true
    *EXECUTING.lock().unwrap() = true;

    // Resolve the path to the bundled executable file
    let exe_path = handle.path_resolver().resolve_resource("src/assets/winpmem.exe").expect("failed to resolve resource");

    // Spawn a new thread to run the external executable
    std::thread::spawn(move || {
        // Read the file
        let asset = std::fs::read(&exe_path).unwrap();

        // Write the asset to a temporary file
        let mut temp_file = std::env::temp_dir();
        temp_file.push("winpmem.exe");
        std::fs::write(&temp_file, asset).unwrap();

        // Spawn the process with provided arguments
        let mut command = std::process::Command::new(&temp_file);
        command.arg(target_path).arg("--threads").arg(thread_count);
        // Add arguments to the command
        // NOTE: Add your arguments here if needed

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
