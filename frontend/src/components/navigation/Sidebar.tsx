import { useState } from "react"
import { 
  Users, 
  LogOut,
  Home,
  UserPlus,
  Menu,
  X,
  Shield,
  Lock
} from "lucide-react"
import { ProtectedComponent } from "../../contexts/PermissionsContext"
import styles from "./Sidebar.module.css"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  onLogout: () => void
}

export default function Sidebar({ currentPage, onPageChange, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, permission: "dashboard.view" },
    { id: "users", label: "Usuarios", icon: Users, permission: "users.view" },
    { id: "roles", label: "Roles", icon: Shield, permission: "roles.view" },
    { id: "permissions", label: "Permisos", icon: Lock, permission: "roles.view" },
    { id: "members", label: "Clientes", icon: UserPlus, permission: "clients.view" },
  ]

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={styles.toggleButton}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        {!isCollapsed && (
          <h2 className={styles.title}>Golden Spartan GYM</h2>
        )}
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <ProtectedComponent key={item.id} permission={item.permission}>
              <button
                onClick={() => onPageChange(item.id)}
                className={`${styles.navItem} ${currentPage === item.id ? styles.active : ''}`}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </ProtectedComponent>
          )
        })}
      </nav>

      <div className={styles.footer}>
        <button onClick={onLogout} className={styles.logoutButton}>
          <LogOut size={20} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  )
}