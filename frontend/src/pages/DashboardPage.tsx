import { Activity, Clock, User, Shield, Eye } from "lucide-react";
import styles from "./DashboardPage.module.css";

interface UserActivity {
  id: number;
  username: string;
  action: string;
  timestamp: string;
  ip: string;
  status: "success" | "warning" | "error";
  details?: string;
}

export default function DashboardPage() {
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
  ];

  const systemStats = [
    {
      label: "Usuarios Activos Hoy",
      value: "12",
      icon: User,
      trend: "+3 desde ayer",
      color: "#3b82f6",
    },
    {
      label: "Sesiones Activas",
      value: "8",
      icon: Activity,
      trend: "En línea ahora",
      color: "#10b981",
    },
    {
      label: "Intentos Fallidos",
      value: "3",
      icon: Shield,
      trend: "Últimas 24h",
      color: "#ef4444",
    },
    {
      label: "Tiempo Promedio",
      value: "45min",
      icon: Clock,
      trend: "Por sesión",
      color: "#8b5cf6",
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

  const getActionIcon = (action: string) => {
    if (action.includes("sesión") || action.includes("acceso")) return User;
    if (action.includes("registro") || action.includes("Registró")) return User;
    if (action.includes("horario") || action.includes("Modificó")) return Clock;
    if (action.includes("reporte") || action.includes("Consulta")) return Eye;
    if (action.includes("contraseña")) return Shield;
    return Activity;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Panel de Actividad del Sistema</h1>
        <p>Monitoreo en tiempo real de la actividad de usuarios</p>
      </div>

      <div className={styles.statsGrid}>
        {systemStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={styles.statCard}>
              <div
                className={styles.statIcon}
                style={{ backgroundColor: stat.color }}
              >
                <Icon size={24} />
              </div>
              <div className={styles.statContent}>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
                <span className={styles.trend}>{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Resumen del Sistema</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <h3>Estado del Sistema</h3>
              <div className={styles.statusIndicator}>
                <div
                  className={styles.statusDot}
                  style={{ backgroundColor: "#10b981" }}
                ></div>
                <span>Sistema funcionando normalmente</span>
              </div>
              <p className={styles.statusDescription}>
                Todos los servicios están operativos y funcionando
                correctamente.
              </p>
            </div>

            <div className={styles.summaryCard}>
              <h3>Última Actividad</h3>
              <div className={styles.lastActivity}>
                <p>
                  <strong>Usuario:</strong> admin
                </p>
                <p>
                  <strong>Acción:</strong> Inicio de sesión
                </p>
                <p>
                  <strong>Hora:</strong> 09:15:23
                </p>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <h3>Alertas Pendientes</h3>
              <div className={styles.alertsSummary}>
                <div className={styles.alertItem}>
                  <div
                    className={styles.alertDot}
                    style={{ backgroundColor: "#ef4444" }}
                  ></div>
                  <span>3 intentos fallidos</span>
                </div>
                <div className={styles.alertItem}>
                  <div
                    className={styles.alertDot}
                    style={{ backgroundColor: "#f59e0b" }}
                  ></div>
                  <span>2 sesiones expiradas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Accesos Rápidos</h2>
          <div className={styles.quickActions}>
            <div className={styles.actionCard}>
              <h3>Gestión de Usuarios</h3>
              <p>Administra usuarios del sistema</p>
              <div className={styles.actionStats}>
                <span>12 usuarios activos</span>
              </div>
            </div>

            <div className={styles.actionCard}>
              <h3>Roles y Permisos</h3>
              <p>Configura roles y permisos</p>
              <div className={styles.actionStats}>
                <span>4 roles configurados</span>
              </div>
            </div>

            <div className={styles.actionCard}>
              <h3>Bitácora de Actividad</h3>
              <p>Revisa el registro de actividades</p>
              <div className={styles.actionStats}>
                <span>Ver registro completo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
