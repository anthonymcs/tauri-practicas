import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface Servicio {
  name: string;
  status: string;
  port: string;
}

function App() {
  const [services, setServices] = useState<Servicio[]>([
    { name: "Frontend Next.js", status: "Desconocido", port: "3000" },
    { name: "Backend Python API", status: "Desconocido", port: "8000" },
    { name: "Prometheus Monitoring", status: "Desconocido", port: "9090" },
  ]);

  const [estadoConexion, setEstadoConexion] = useState("Desconectado de Rust");
  const [mensajeRust, setMensajeRust] = useState("");

  // Verificar la conexión nativa con Rust apenas se abre la app
  async function pingTauri() {
    try {
      const respuesta = await invoke<string>("obtener_info_sistema");
      setEstadoConexion(respuesta);
    } catch (error) {
      setEstadoConexion("Error de conexión con Tauri");
    }
  }

  async function probarRust() {
    const respuesta = await invoke<string>("saludar_desde_rust", { nombre: "Anthony" });
    setMensajeRust(respuesta);
  }

  async function actualizarEstado(index: number, puerto: string) {
    const estadoObtenido = await invoke<string>("verificar_servicio", { puerto });
    
    setServices((serviciosPrevios) => {
      const copia = [...serviciosPrevios];
      copia[index].status = estadoObtenido;
      return copia;
    });
  }

  return (
    <main className="container">
      {/* Banner de conexión nativa con Tauri */}
      <div
        style={{
          backgroundColor: "#112211",
          border: "1px solid #4caf50",
          borderRadius: "8px",
          padding: "10px 20px",
          marginBottom: "20px",
          display: "inline-block",
        }}
      >
        <span style={{ color: "#4caf50", fontWeight: "bold" }}>
          ⚡ Estado del Motor Tauri:
        </span>{" "}
        <span style={{ color: "#fff" }}>{estadoConexion}</span>
        <button
          onClick={pingTauri}
          style={{
            marginLeft: "15px",
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#4caf50",
            color: "#000",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Probar Ping
        </button>
      </div>

      <h1>Dashboard de Prácticas - Anthony</h1>
      <p>Monitoreo de Servicios en Tiempo Real</p>

      {/* Tarjetas de servicios */}
      <div style={{ display: "flex", gap: "20px", marginTop: "30px", justifyContent: "center" }}>
        {services.map((service, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #444",
              borderRadius: "10px",
              padding: "20px",
              width: "220px",
              backgroundColor: "#1e1e1e",
              color: "#fff",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{service.name}</h3>
            <p style={{ color: "#aaa" }}>Puerto: {service.port}</p>
            <span
              style={{
                color:
                  service.status === "Online"
                    ? "#4caf50"
                    : service.status === "Offline"
                    ? "#f44336"
                    : "#ff9800",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              ● {service.status}
            </span>

            <button
              onClick={() => actualizarEstado(index, service.port)}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#333",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Verificar con Rust
            </button>
          </div>
        ))}
      </div>

      {/* Botón de saludo general */}
      <div style={{ marginTop: "40px" }}>
        <button
          onClick={probarRust}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007acc",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Probar Conexión General con Rust
        </button>

        {mensajeRust && (
          <p style={{ marginTop: "15px", color: "#61dafb", fontSize: "16px" }}>
            {mensajeRust}
          </p>
        )}
      </div>
    </main>
  );
}

export default App;