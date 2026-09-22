#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::{SystemTime, UNIX_EPOCH};

#[tauri::command]
fn saludar_desde_rust(nombre: String) -> String {
    format!("¡Hola {}, respuesta enviada desde el motor Rust!", nombre)
}

#[tauri::command]
fn verificar_servicio(puerto: String) -> String {
    match puerto.as_str() {
        "3000" => "Online".to_string(),
        "8000" => "Online".to_string(),
        "9090" => "Offline".to_string(),
        _ => "Desconocido".to_string(),
    }
}

// Nuevo comando para demostrar la conexión interna con el sistema de Windows
#[tauri::command]
fn obtener_info_sistema() -> String {
    let inicio = SystemTime::now();
    let desde_epoca = inicio
        .duration_since(UNIX_EPOCH)
        .expect("Error al obtener tiempo");
    let segundos = desde_epoca.as_secs();

    format!(
        "Conexión Nativa Activa | ID de Ejecución: {} | Sistema: Windows MSVC",
        segundos
    )
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            saludar_desde_rust,
            verificar_servicio,
            obtener_info_sistema
        ])
        .run(tauri::generate_context!())
        .expect("error al ejecutar la aplicación de tauri");
}