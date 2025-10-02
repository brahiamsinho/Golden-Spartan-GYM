import { useState, useEffect } from "react";
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
import { ProtectedComponent } from "../../contexts/PermissionsContext";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  currentPage,
  onPageChange,
  onLogout,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        // Reset collapsed state when returning to desktop
        setIsCollapsed(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      permission: "dashboard.view",
    },
    { id: "users", label: "Usuarios", icon: Users, permission: "users.view" },
    { id: "roles", label: "Roles", icon: Shield, permission: "roles.view" },
    {
      id: "permissions",
      label: "Permisos",
      icon: Lock,
      permission: "roles.view",
    },
    {
      id: "activity-log",
      label: "Bitácora",
      icon: Activity,
      permission: "dashboard.view",
    },
  ];

  const handleNavItemClick = (pageId: string) => {
    onPageChange(pageId);
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
            } else {
              setIsCollapsed(!isCollapsed);
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
          return (
            <ProtectedComponent key={item.id} permission={item.permission}>
              <button
                onClick={() => handleNavItemClick(item.id)}
                className={`${styles.navItem} ${
                  currentPage === item.id ? styles.active : ""
                }`}
              >
                <Icon size={20} />
                {(!isCollapsed || isMobile) && <span>{item.label}</span>}
              </button>
            </ProtectedComponent>
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
