import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  LogOut,
  Home,
  Menu,
  X,
  Shield,
  Lock,
  Activity,
} from "lucide-react";
import { usePermissions } from "../../contexts/PermissionsContext";
import { ROUTES, ROUTE_PERMISSIONS } from "../../config/routes";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  onLogout: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({
  onLogout,
  isMobileOpen,
  onMobileClose,
  isCollapsed = false,
  onToggle,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // No need to reset collapsed state as it's now controlled by parent
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const allMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: ROUTES.DASHBOARD,
      permission: ROUTE_PERMISSIONS[ROUTES.DASHBOARD],
    },
    {
      id: "users",
      label: "Usuarios",
      icon: Users,
      path: ROUTES.USERS,
      permission: ROUTE_PERMISSIONS[ROUTES.USERS],
    },
    {
      id: "roles",
      label: "Roles",
      icon: Shield,
      path: ROUTES.ROLES,
      permission: ROUTE_PERMISSIONS[ROUTES.ROLES],
    },
    {
      id: "permissions",
      label: "Permisos",
      icon: Lock,
      path: ROUTES.PERMISSIONS,
      permission: ROUTE_PERMISSIONS[ROUTES.PERMISSIONS],
    },
    {
      id: "activity-log",
      label: "Bitácora",
      icon: Activity,
      path: ROUTES.ACTIVITY_LOG,
      permission: ROUTE_PERMISSIONS[ROUTES.ACTIVITY_LOG],
    },
  ];

  // Filtrar elementos del menú basándose en los permisos del usuario
  const menuItems = allMenuItems.filter((item) =>
    hasPermission(item.permission)
  );

  const handleNavItemClick = (path: string) => {
    navigate(path);
    // On mobile, close sidebar when navigating
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  // Determine CSS classes for sidebar
  const sidebarClasses = [
    styles.sidebar,
    isCollapsed && !isMobile ? styles.collapsed : "",
    isMobile ? styles.mobile : "",
    isMobile && isMobileOpen ? styles.open : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sidebarClasses}>
      <div className={styles.header}>
        <button
          onClick={() => {
            if (isMobile && onMobileClose) {
              onMobileClose();
            } else if (onToggle) {
              onToggle();
            }
          }}
          className={styles.toggleButton}
        >
          {isMobile ? (
            <X size={20} />
          ) : isCollapsed ? (
            <Menu size={20} />
          ) : (
            <X size={20} />
          )}
        </button>
        {(!isCollapsed || isMobile) && (
          <h2 className={styles.title}>Golden Spartan GYM</h2>
        )}
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavItemClick(item.path)}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <Icon size={20} />
              {(!isCollapsed || isMobile) && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button onClick={onLogout} className={styles.logoutButton}>
          <LogOut size={20} />
          {(!isCollapsed || isMobile) && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}
