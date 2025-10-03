import { useState, useEffect } from "react";
import styles from "./ApiStatus.module.css";
import { checkApiStatus } from "../../utils/api";

interface ApiStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

export default function ApiStatus({ onStatusChange }: ApiStatusProps) {
  const [status, setStatus] = useState<"checking" | "connected" | "error">(
    "checking"
  );
  const [message, setMessage] = useState(
    "Comprobando conexión con el servidor..."
  );
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const isConnected = await checkApiStatus();

        if (isConnected) {
          setStatus("connected");
          setMessage("Conectado al servidor");
          if (onStatusChange) onStatusChange(true);

          // Ocultar después de 3 segundos si está conectado
          setTimeout(() => {
            setVisible(false);
          }, 3000);
        } else {
          setStatus("error");
          setMessage("Error en el servidor");
          if (onStatusChange) onStatusChange(false);
        }
      } catch (error) {
        setStatus("error");
        setMessage("No se pudo conectar con el servidor");
        console.error("Error al comprobar estado de API:", error);
        if (onStatusChange) onStatusChange(false);
      }
    };

    checkStatus();

    // Comprobar cada 30 segundos
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, [onStatusChange]);

  // Mostrar al pasar el cursor
  const handleMouseEnter = () => {
    if (status === "connected") {
      setVisible(true);
    }
  };

  // Ocultar después de quitar el cursor con un retraso
  const handleMouseLeave = () => {
    if (status === "connected") {
      setTimeout(() => {
        setVisible(false);
      }, 1000);
    }
  };

  if (!visible && status === "connected") {
    return (
      <div
        className={`${styles.apiStatus} ${styles.connected}`}
        style={{ opacity: 0.4, padding: "4px", transform: "scale(0.8)" }}
        onMouseEnter={handleMouseEnter}
      >
        <span className={styles.icon}>●</span>
      </div>
    );
  }

  return (
    <div
      className={`${styles.apiStatus} ${styles[status]}`}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.icon}>
        {status === "checking" ? "◯" : status === "connected" ? "●" : "✕"}
      </span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}
