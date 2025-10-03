import { ShieldX, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import styles from "./AccessDenied.module.css";

export default function AccessDenied() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <ShieldX size={80} className={styles.icon} />
        </div>

        <h1 className={styles.title}>Acceso Denegado</h1>

        <p className={styles.message}>
          No tienes permisos para acceder a esta sección del sistema.
        </p>

        <p className={styles.submessage}>
          Contacta con tu administrador si crees que esto es un error.
        </p>

        <button onClick={handleGoBack} className={styles.backButton}>
          <ArrowLeft size={20} />
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}
