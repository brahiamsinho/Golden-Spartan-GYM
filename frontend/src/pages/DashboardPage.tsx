import { useState, useEffect } from "react";
import { Activity, Clock, User, Shield } from "lucide-react";
import apiService from "../services/api";
import styles from "./DashboardPage.module.css";

interface DashboardStats {
  usuarios_activos_hoy: number;
  diferencia_usuarios: number;
  intentos_fallidos: number;
  total_usuarios: number;
  total_roles: number;
  actividad_reciente: number;
  sistema_operativo: boolean;
}

interface BitacoraEntry {
  id: number;
  usuario_nombre: string;
  tipo_accion_display: string;
  accion: string;
  descripcion: string;
  nivel_display: string;
  fecha_formateada: string;
  ip_address: string;
  datos_adicionales: any;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<BitacoraEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRecentActivity(8),
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData.results || activitiesData);
    } catch (err) {
      setError("Error al cargar los datos del dashboard");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadDashboardData} className={styles.retryButton}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const systemStats = stats
    ? [
        {
          label: "Usuarios Activos Hoy",
          value: stats.usuarios_activos_hoy.toString(),
          icon: User,
          trend:
            stats.diferencia_usuarios >= 0
              ? `+${stats.diferencia_usuarios} desde ayer`
              : `${stats.diferencia_usuarios} desde ayer`,
          color: "#3b82f6",
        },
        {
          label: "Actividad Reciente",
          value: stats.actividad_reciente.toString(),
          icon: Activity,
          trend: "Últimas 24h",
          color: "#10b981",
        },
        {
          label: "Intentos Fallidos",
          value: stats.intentos_fallidos.toString(),
          icon: Shield,
          trend: "Últimas 24h",
          color: "#ef4444",
        },
        {
          label: "Total Usuarios",
          value: stats.total_usuarios.toString(),
          icon: Clock,
          trend: "En el sistema",
          color: "#8b5cf6",
        },
      ]
    : [];

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
                  style={{
                    backgroundColor: stats?.sistema_operativo
                      ? "#10b981"
                      : "#ef4444",
                  }}
                ></div>
                <span>
                  {stats?.sistema_operativo
                    ? "Sistema funcionando normalmente"
                    : "Sistema con problemas"}
                </span>
              </div>
              <p className={styles.statusDescription}>
                {stats?.sistema_operativo
                  ? "Todos los servicios están operativos y funcionando correctamente."
                  : "Se han detectado problemas en el sistema. Revisar logs."}
              </p>
            </div>

            <div className={styles.summaryCard}>
              <h3>Última Actividad</h3>
              <div className={styles.lastActivity}>
                {recentActivities.length > 0 ? (
                  <>
                    <p>
                      <strong>Usuario:</strong>{" "}
                      {recentActivities[0].usuario_nombre || "Sistema"}
                    </p>
                    <p>
                      <strong>Acción:</strong> {recentActivities[0].accion}
                    </p>
                    <p>
                      <strong>Hora:</strong>{" "}
                      {recentActivities[0].fecha_formateada}
                    </p>
                  </>
                ) : (
                  <p>No hay actividad reciente</p>
                )}
              </div>
            </div>

            <div className={styles.summaryCard}>
              <h3>Alertas Pendientes</h3>
              <div className={styles.alertsSummary}>
                {stats && stats.intentos_fallidos > 0 && (
                  <div className={styles.alertItem}>
                    <div
                      className={styles.alertDot}
                      style={{ backgroundColor: "#ef4444" }}
                    ></div>
                    <span>{stats.intentos_fallidos} intentos fallidos</span>
                  </div>
                )}
                {stats && stats.actividad_reciente === 0 && (
                  <div className={styles.alertItem}>
                    <div
                      className={styles.alertDot}
                      style={{ backgroundColor: "#f59e0b" }}
                    ></div>
                    <span>Sin actividad reciente</span>
                  </div>
                )}
                {stats &&
                  stats.intentos_fallidos === 0 &&
                  stats.actividad_reciente > 0 && (
                    <div className={styles.alertItem}>
                      <div
                        className={styles.alertDot}
                        style={{ backgroundColor: "#10b981" }}
                      ></div>
                      <span>Sistema funcionando correctamente</span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
