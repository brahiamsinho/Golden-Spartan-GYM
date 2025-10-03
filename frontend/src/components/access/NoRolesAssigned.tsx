import { ShieldX, ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./NoRolesAssigned.module.css";

export default function NoRolesAssigned() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleGoBack = () => {
    // Cerrar sesión y redirigir al login
    logout();
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <ShieldX size={80} className={styles.icon} />
        </div>

        <h1 className={styles.title}>Sin Roles Asignados</h1>

        <div className={styles.warningBox}>
          <AlertTriangle size={24} className={styles.warningIcon} />
          <p className={styles.warningText}>
            Tu cuenta no tiene roles asignados en el sistema.
          </p>
        </div>

        <p className={styles.message}>
          No tienes acceso a ninguna funcionalidad del sistema porque no se te
          han asignado roles.
        </p>

        <p className={styles.submessage}>
          Contacta con tu administrador para que te asigne los roles y permisos
          necesarios.
        </p>

        <button onClick={handleGoBack} className={styles.backButton}>
          <ArrowLeft size={20} />
          Volver al Login
        </button>
      </div>
    </div>
  );
}
