import { useState } from "react";
import { User, LogOut, ChevronDown, Key } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import styles from "./Header.module.css";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case "Super Administrador":
        return "#ef4444";
      case "Administrador":
        return "#3b82f6";
      case "Instructor":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getRoleBadge = (roleName: string) => {
    const color = getRoleColor(roleName);
    return (
      <span className={styles.roleBadge} style={{ backgroundColor: color }}>
        {roleName}
      </span>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || "Usuario";
  };

  const getPrimaryRole = () => {
    if (user?.roles && user.roles.length > 0) {
      return user.roles[0].nombre;
    }
    return "Usuario";
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <User size={24} />
          </div>
          <div className={styles.logoText}>
            <h1>Golden Spartan GYM</h1>
            <p>Sistema de Gestión</p>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        {/* Usuario */}
        <div className={styles.userSection}>
          <button
            className={styles.userButton}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.userAvatar}>
              {getInitials(user?.first_name || "", user?.last_name || "")}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{getDisplayName()}</div>
              <div className={styles.userRole}>{getPrimaryRole()}</div>
            </div>
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${
                showUserMenu ? styles.chevronUp : ""
              }`}
            />
          </button>

          {/* Menú desplegable del usuario */}
          {showUserMenu && (
            <div className={styles.userMenu}>
              <div className={styles.userMenuHeader}>
                <div className={styles.userMenuAvatar}>
                  {getInitials(user?.first_name || "", user?.last_name || "")}
                </div>
                <div className={styles.userMenuInfo}>
                  <div className={styles.userMenuName}>{getDisplayName()}</div>
                  <div className={styles.userMenuEmail}>{user?.email}</div>
                  {getRoleBadge(getPrimaryRole())}
                </div>
              </div>

              <div className={styles.userMenuDivider} />

              <button 
                className={styles.changePasswordButton} 
                onClick={() => {
                  setShowChangePasswordModal(true);
                  setShowUserMenu(false);
                }}
              >
                <Key size={16} />
                Cambiar Contraseña
              </button>

              <button className={styles.logoutButton} onClick={onLogout}>
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </header>
  );
}
