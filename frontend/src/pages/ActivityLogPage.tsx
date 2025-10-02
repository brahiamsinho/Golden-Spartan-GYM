import {
  Activity,
  Clock,
  User,
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import styles from "./ActivityLogPage.module.css";

interface UserActivity {
  id: number;
  username: string;
  action: string;
  timestamp: string;
  ip: string;
  status: "success" | "warning" | "error";
  details?: string;
}

export default function ActivityLogPage() {
  const recentActivities: UserActivity[] = [
    {
      id: 1,
      username: "admin",
      action: "Inicio de sesión",
      timestamp: "2024-10-02 09:15:23",
      ip: "192.168.1.100",
      status: "success",
      details: "Acceso al dashboard principal",
    },
    {
      id: 2,
      username: "maria_garcia",
      action: "Registro de nuevo miembro",
      timestamp: "2024-10-02 09:10:45",
      ip: "192.168.1.105",
      status: "success",
      details: "Registró a Juan Pérez como nuevo miembro",
    },
    {
      id: 3,
      username: "carlos_lopez",
      action: "Intento de acceso fallido",
      timestamp: "2024-10-02 08:55:12",
      ip: "192.168.1.110",
      status: "error",
      details: "Contraseña incorrecta (3 intentos)",
    },
    {
      id: 4,
      username: "admin",
      action: "Modificó horario de clase",
      timestamp: "2024-10-02 08:45:30",
      ip: "192.168.1.100",
      status: "success",
      details: "Cambió horario de Yoga de 9:00 a 9:30",
    },
    {
      id: 5,
      username: "ana_martin",
      action: "Consulta de reportes",
      timestamp: "2024-10-02 08:30:15",
      ip: "192.168.1.115",
      status: "success",
      details: "Generó reporte mensual de asistencia",
    },
    {
      id: 6,
      username: "luis_torres",
      action: "Sesión expirada",
      timestamp: "2024-10-02 08:20:00",
      ip: "192.168.1.120",
      status: "warning",
      details: "Sesión cerrada por inactividad",
    },
    {
      id: 7,
      username: "pedro_silva",
      action: "Cambio de contraseña",
      timestamp: "2024-10-02 08:15:45",
      ip: "192.168.1.125",
      status: "success",
      details: "Contraseña actualizada exitosamente",
    },
    {
      id: 8,
      username: "system",
      action: "Backup automático",
      timestamp: "2024-10-02 03:00:00",
      ip: "localhost",
      status: "success",
      details: "Respaldo de base de datos completado",
    },
    {
      id: 9,
      username: "admin",
      action: "Eliminó usuario",
      timestamp: "2024-10-02 07:30:22",
      ip: "192.168.1.100",
      status: "success",
      details: "Eliminó usuario inactivo: jose_rodriguez",
    },
    {
      id: 10,
      username: "maria_garcia",
      action: "Actualizó membresía",
      timestamp: "2024-10-02 07:15:18",
      ip: "192.168.1.105",
      status: "success",
      details: "Renovó membresía Premium de Ana Martín",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Exitoso";
      case "warning":
        return "Advertencia";
      case "error":
        return "Error";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "error":
        return XCircle;
      default:
        return Activity;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("sesión") || action.includes("acceso")) return User;
    if (action.includes("registro") || action.includes("Registró")) return User;
    if (action.includes("horario") || action.includes("Modificó")) return Clock;
    if (action.includes("reporte") || action.includes("Consulta")) return Eye;
    if (action.includes("contraseña")) return Shield;
    if (action.includes("Eliminó") || action.includes("eliminó"))
      return XCircle;
    if (action.includes("membresía") || action.includes("Actualizó"))
      return Shield;
    return Activity;
  };

  const getActivityStats = () => {
    const total = recentActivities.length;
    const success = recentActivities.filter(
      (a) => a.status === "success"
    ).length;
    const warnings = recentActivities.filter(
      (a) => a.status === "warning"
    ).length;
    const errors = recentActivities.filter((a) => a.status === "error").length;

    return { total, success, warnings, errors };
  };

  const stats = getActivityStats();

  return (
    <div className={styles.activityLog}>
      <div className={styles.header}>
        <h1>Bitácora de Actividad del Sistema</h1>
        <p>Registro completo de todas las actividades y eventos del sistema</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "#3b82f6" }}
          >
            <Activity size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.total}</h3>
            <p>Total Actividades</p>
            <span className={styles.trend}>Últimas 24h</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "#10b981" }}
          >
            <CheckCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.success}</h3>
            <p>Exitosas</p>
            <span className={styles.trend}>
              {Math.round((stats.success / stats.total) * 100)}% del total
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "#f59e0b" }}
          >
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.warnings}</h3>
            <p>Advertencias</p>
            <span className={styles.trend}>
              {Math.round((stats.warnings / stats.total) * 100)}% del total
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "#ef4444" }}
          >
            <XCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.errors}</h3>
            <p>Errores</p>
            <span className={styles.trend}>
              {Math.round((stats.errors / stats.total) * 100)}% del total
            </span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Registro de Actividades</h2>
          <div className={styles.activityList}>
            {recentActivities.map((activity) => {
              const ActionIcon = getActionIcon(activity.action);
              const StatusIcon = getStatusIcon(activity.status);
              return (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIconWrapper}>
                    <ActionIcon
                      size={20}
                      className={styles.activityActionIcon}
                    />
                  </div>

                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <strong className={styles.username}>
                        {activity.username}
                      </strong>
                      <div className={styles.statusContainer}>
                        <StatusIcon size={14} className={styles.statusIcon} />
                        <span
                          className={styles.status}
                          style={{
                            backgroundColor: getStatusColor(activity.status),
                          }}
                        >
                          {getStatusText(activity.status)}
                        </span>
                      </div>
                    </div>

                    <p className={styles.activityAction}>{activity.action}</p>

                    {activity.details && (
                      <p className={styles.activityDetails}>
                        {activity.details}
                      </p>
                    )}

                    <div className={styles.activityMeta}>
                      <span className={styles.timestamp}>
                        <Clock size={14} />
                        {activity.timestamp}
                      </span>
                      <span className={styles.ip}>IP: {activity.ip}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
