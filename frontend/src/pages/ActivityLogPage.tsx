import { useState, useEffect } from "react";
import {
  Activity,
  Clock,
  User,
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";
import styles from "./ActivityLogPage.module.css";
import apiService from "../services/api";

interface BitacoraEntry {
  id: number;
  usuario: number | null;
  usuario_nombre: string;
  tipo_accion: string;
  tipo_accion_display: string;
  accion: string;
  descripcion: string | null;
  nivel: string;
  nivel_display: string;
  ip_address: string;
  user_agent: string | null;
  fecha_hora: string;
  fecha_formateada: string;
  datos_adicionales: any;
}

interface BitacoraStats {
  por_tipo: Array<{ tipo_accion: string; total: number }>;
  por_nivel: Array<{ nivel: string; total: number }>;
  actividades_recientes: number;
  usuarios_activos: Array<{ usuario__username: string; total: number }>;
  total_registros: number;
}

export default function ActivityLogPage() {
  const [bitacora, setBitacora] = useState<BitacoraEntry[]>([]);
  const [stats, setStats] = useState<BitacoraStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    usuario: "",
    tipo_accion: "",
    nivel: "",
    fecha_inicio: "",
    fecha_fin: "",
    accion: "",
    ip: "",
  });

  useEffect(() => {
    loadBitacora();
    loadStats();
  }, []);

  const loadBitacora = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBitacora(filters);
      setBitacora(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar la bitácora");
      console.error("Error loading bitacora:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await apiService.getBitacoraEstadisticas();
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadBitacora();
  };

  const clearFilters = () => {
    setFilters({
      usuario: "",
      tipo_accion: "",
      nivel: "",
      fecha_inicio: "",
      fecha_fin: "",
      accion: "",
      ip: "",
    });
  };

  const getStatusColor = (nivel: string) => {
    switch (nivel) {
      case "info":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      case "critical":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (nivel: string) => {
    switch (nivel) {
      case "info":
        return "Información";
      case "warning":
        return "Advertencia";
      case "error":
        return "Error";
      case "critical":
        return "Crítico";
      default:
        return nivel;
    }
  };

  const getStatusIcon = (nivel: string) => {
    switch (nivel) {
      case "info":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "error":
        return XCircle;
      case "critical":
        return XCircle;
      default:
        return Activity;
    }
  };

  const getActionIcon = (tipoAccion: string) => {
    switch (tipoAccion) {
      case "login":
      case "logout":
        return User;
      case "create_user":
      case "update_user":
      case "delete_user":
        return User;
      case "create_role":
      case "update_role":
      case "delete_role":
        return Shield;
      case "create_permission":
      case "update_permission":
      case "delete_permission":
        return Shield;
      case "system_start":
      case "system_stop":
        return Activity;
      case "error":
        return XCircle;
      default:
        return Activity;
    }
  };

  if (loading) {
    return (
      <div className={styles.activityLog}>
        <div className={styles.header}>
          <h1>Bitácora de Actividad del Sistema</h1>
          <p>Cargando registros de actividad...</p>
        </div>
        <div className={styles.loading}>
          <RefreshCw className={styles.spinner} size={32} />
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.activityLog}>
        <div className={styles.header}>
          <h1>Bitácora de Actividad del Sistema</h1>
          <p>Error al cargar los datos</p>
        </div>
        <div className={styles.error}>
          <XCircle size={32} />
          <p>{error}</p>
          <button onClick={loadBitacora} className={styles.retryButton}>
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.activityLog}>
      <div className={styles.header}>
        <h1>Bitácora de Actividad del Sistema</h1>
        <p>Registro completo de todas las actividades y eventos del sistema</p>
      </div>

      {/* Filtros */}
      <div className={styles.filtersSection}>
        <h3>Filtros</h3>
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label>Usuario:</label>
            <input
              type="text"
              value={filters.usuario}
              onChange={(e) => handleFilterChange("usuario", e.target.value)}
              placeholder="Buscar por usuario..."
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Tipo de Acción:</label>
            <select
              value={filters.tipo_accion}
              onChange={(e) =>
                handleFilterChange("tipo_accion", e.target.value)
              }
            >
              <option value="">Todos los tipos</option>
              <option value="login">Inicio de Sesión</option>
              <option value="logout">Cierre de Sesión</option>
              <option value="create_user">Crear Usuario</option>
              <option value="update_user">Actualizar Usuario</option>
              <option value="delete_user">Eliminar Usuario</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Nivel:</label>
            <select
              value={filters.nivel}
              onChange={(e) => handleFilterChange("nivel", e.target.value)}
            >
              <option value="">Todos los niveles</option>
              <option value="info">Información</option>
              <option value="warning">Advertencia</option>
              <option value="error">Error</option>
              <option value="critical">Crítico</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Fecha Inicio:</label>
            <input
              type="date"
              value={filters.fecha_inicio}
              onChange={(e) =>
                handleFilterChange("fecha_inicio", e.target.value)
              }
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Fecha Fin:</label>
            <input
              type="date"
              value={filters.fecha_fin}
              onChange={(e) => handleFilterChange("fecha_fin", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>IP:</label>
            <input
              type="text"
              value={filters.ip}
              onChange={(e) => handleFilterChange("ip", e.target.value)}
              placeholder="Buscar por IP..."
            />
          </div>
        </div>

        <div className={styles.filterActions}>
          <button onClick={applyFilters} className={styles.applyButton}>
            <Search size={16} />
            Aplicar Filtros
          </button>
          <button onClick={clearFilters} className={styles.clearButton}>
            <Filter size={16} />
            Limpiar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: "#3b82f6" }}
            >
              <Activity size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.total_registros}</h3>
              <p>Total Registros</p>
              <span className={styles.trend}>En la base de datos</span>
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
              <h3>{stats.actividades_recientes}</h3>
              <p>Últimos 7 días</p>
              <span className={styles.trend}>Actividades recientes</span>
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
              <h3>
                {stats.por_nivel.find((n) => n.nivel === "warning")?.total || 0}
              </h3>
              <p>Advertencias</p>
              <span className={styles.trend}>Nivel warning</span>
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
              <h3>
                {stats.por_nivel.find((n) => n.nivel === "error")?.total || 0}
              </h3>
              <p>Errores</p>
              <span className={styles.trend}>Nivel error</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Registro de Actividades ({bitacora.length} registros)</h2>
          <div className={styles.activityList}>
            {bitacora.length === 0 ? (
              <div className={styles.emptyState}>
                <Activity size={48} />
                <p>No se encontraron registros con los filtros aplicados</p>
              </div>
            ) : (
              bitacora.map((entry) => {
                const ActionIcon = getActionIcon(entry.tipo_accion);
                const StatusIcon = getStatusIcon(entry.nivel);
                return (
                  <div key={entry.id} className={styles.activityItem}>
                    <div className={styles.activityIconWrapper}>
                      <ActionIcon
                        size={20}
                        className={styles.activityActionIcon}
                      />
                    </div>

                    <div className={styles.activityContent}>
                      <div className={styles.activityHeader}>
                        <strong className={styles.username}>
                          {entry.usuario_nombre}
                        </strong>
                        <div className={styles.statusContainer}>
                          <StatusIcon size={14} className={styles.statusIcon} />
                          <span
                            className={styles.status}
                            style={{
                              backgroundColor: getStatusColor(entry.nivel),
                            }}
                          >
                            {getStatusText(entry.nivel)}
                          </span>
                        </div>
                      </div>

                      <p className={styles.activityAction}>{entry.accion}</p>
                      <p className={styles.activityType}>
                        {entry.tipo_accion_display}
                      </p>

                      {entry.descripcion && (
                        <p className={styles.activityDetails}>
                          {entry.descripcion}
                        </p>
                      )}

                      <div className={styles.activityMeta}>
                        <span className={styles.timestamp}>
                          <Clock size={14} />
                          {entry.fecha_formateada}
                        </span>
                        <span className={styles.ip}>
                          IP: {entry.ip_address}
                        </span>
                      </div>

                      {entry.datos_adicionales &&
                        Object.keys(entry.datos_adicionales).length > 0 && (
                          <div className={styles.additionalData}>
                            <details>
                              <summary>Datos adicionales</summary>
                              <pre>
                                {JSON.stringify(
                                  entry.datos_adicionales,
                                  null,
                                  2
                                )}
                              </pre>
                            </details>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
