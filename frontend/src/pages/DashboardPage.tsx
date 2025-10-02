import { Activity, Clock, User, Shield, Eye } from "lucide-react"
import styles from "./DashboardPage.module.css"

interface UserActivity {
  id: number
  username: string
  action: string
  timestamp: string
  ip: string
  status: 'success' | 'warning' | 'error'
  details?: string
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
      details: "Acceso al dashboard principal"
    },
    {
      id: 2,
      username: "maria_garcia",
      action: "Registro de nuevo miembro",
      timestamp: "2024-10-02 09:10:45",
      ip: "192.168.1.105",
      status: "success",
      details: "Registró a Juan Pérez como nuevo miembro"
    },
    {
      id: 3,
      username: "carlos_lopez",
      action: "Intento de acceso fallido",
      timestamp: "2024-10-02 08:55:12",
      ip: "192.168.1.110",
      status: "error",
      details: "Contraseña incorrecta (3 intentos)"
    },
    {
      id: 4,
      username: "admin",
      action: "Modificó horario de clase",
      timestamp: "2024-10-02 08:45:30",
      ip: "192.168.1.100",
      status: "success",
      details: "Cambió horario de Yoga de 9:00 a 9:30"
    },
    {
      id: 5,
      username: "ana_martin",
      action: "Consulta de reportes",
      timestamp: "2024-10-02 08:30:15",
      ip: "192.168.1.115",
      status: "success",
      details: "Generó reporte mensual de asistencia"
    },
    {
      id: 6,
      username: "luis_torres",
      action: "Sesión expirada",
      timestamp: "2024-10-02 08:20:00",
      ip: "192.168.1.120",
      status: "warning",
      details: "Sesión cerrada por inactividad"
    },
    {
      id: 7,
      username: "pedro_silva",
      action: "Cambio de contraseña",
      timestamp: "2024-10-02 08:15:45",
      ip: "192.168.1.125",
      status: "success",
      details: "Contraseña actualizada exitosamente"
    },
    {
      id: 8,
      username: "system",
      action: "Backup automático",
      timestamp: "2024-10-02 03:00:00",
      ip: "localhost",
      status: "success",
      details: "Respaldo de base de datos completado"
    }
  ]

  const systemStats = [
    { 
      label: "Usuarios Activos Hoy", 
      value: "12", 
      icon: User, 
      trend: "+3 desde ayer", 
      color: "#3b82f6" 
    },
    { 
      label: "Sesiones Activas", 
      value: "8", 
      icon: Activity, 
      trend: "En línea ahora", 
      color: "#10b981" 
    },
    { 
      label: "Intentos Fallidos", 
      value: "3", 
      icon: Shield, 
      trend: "Últimas 24h", 
      color: "#ef4444" 
    },
    { 
      label: "Tiempo Promedio", 
      value: "45min", 
      icon: Clock, 
      trend: "Por sesión", 
      color: "#8b5cf6" 
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "#10b981"
      case "warning": return "#f59e0b"
      case "error": return "#ef4444"
      default: return "#6b7280"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "success": return "Exitoso"
      case "warning": return "Advertencia"
      case "error": return "Error"
      default: return status
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("sesión") || action.includes("acceso")) return User
    if (action.includes("registro") || action.includes("Registró")) return User
    if (action.includes("horario") || action.includes("Modificó")) return Clock
    if (action.includes("reporte") || action.includes("Consulta")) return Eye
    if (action.includes("contraseña")) return Shield
    return Activity
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Panel de Actividad del Sistema</h1>
        <p>Monitoreo en tiempo real de la actividad de usuarios</p>
      </div>

      <div className={styles.statsGrid}>
        {systemStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: stat.color }}>
                <Icon size={24} />
              </div>
              <div className={styles.statContent}>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
                <span className={styles.trend}>{stat.trend}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Bitácora de Actividad Reciente</h2>
          <div className={styles.activityList}>
            {recentActivities.map((activity) => {
              const ActionIcon = getActionIcon(activity.action)
              return (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIconWrapper}>
                    <ActionIcon size={20} className={styles.activityActionIcon} />
                  </div>
                  
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <strong className={styles.username}>{activity.username}</strong>
                      <span 
                        className={styles.status}
                        style={{ backgroundColor: getStatusColor(activity.status) }}
                      >
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                    
                    <p className={styles.activityAction}>{activity.action}</p>
                    
                    {activity.details && (
                      <p className={styles.activityDetails}>{activity.details}</p>
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
              )
            })}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Estadísticas de Sesiones</h2>
          <div className={styles.sessionStats}>
            <div className={styles.sessionCard}>
              <h3>Usuarios más Activos (Hoy)</h3>
              <div className={styles.userList}>
                <div className={styles.userItem}>
                  <span className={styles.userRank}>1</span>
                  <span className={styles.userName}>admin</span>
                  <span className={styles.userActivity}>15 acciones</span>
                </div>
                <div className={styles.userItem}>
                  <span className={styles.userRank}>2</span>
                  <span className={styles.userName}>maria_garcia</span>
                  <span className={styles.userActivity}>8 acciones</span>
                </div>
                <div className={styles.userItem}>
                  <span className={styles.userRank}>3</span>
                  <span className={styles.userName}>ana_martin</span>
                  <span className={styles.userActivity}>5 acciones</span>
                </div>
              </div>
            </div>

            <div className={styles.sessionCard}>
              <h3>Alertas de Seguridad</h3>
              <div className={styles.alertList}>
                <div className={styles.alertItem}>
                  <div className={styles.alertDot} style={{ backgroundColor: "#ef4444" }}></div>
                  <span>3 intentos fallidos de carlos_lopez</span>
                </div>
                <div className={styles.alertItem}>
                  <div className={styles.alertDot} style={{ backgroundColor: "#f59e0b" }}></div>
                  <span>2 sesiones expiradas por inactividad</span>
                </div>
                <div className={styles.alertItem}>
                  <div className={styles.alertDot} style={{ backgroundColor: "#10b981" }}></div>
                  <span>Sistema funcionando normalmente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}