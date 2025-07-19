// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

// Custom commands for Chronicle Builder
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've got this!", name)
}

#[tauri::command]
async fn save_story_data(data: String) -> Result<String, String> {
    // This will be handled by the frontend localStorage for now
    // In the future, we can add native file operations here
    Ok("Data saved successfully".to_string())
}

#[tauri::command]
async fn load_story_data() -> Result<String, String> {
    // This will be handled by the frontend localStorage for now
    // In the future, we can add native file operations here
    Ok("Data loaded successfully".to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, save_story_data, load_story_data])
        .setup(|app| {
            // Get the main window
            let window = app.get_window("main").unwrap();
            
            // Set window title
            window.set_title("Chronicle Builder - Your Story Workspace").unwrap();
            
            // Configure window
            #[cfg(debug_assertions)]
            {
                window.open_devtools();
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Chronicle Builder");
}
