import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  PermissionsProvider,
  usePermissions,
} from "../../contexts/PermissionsContext";
import Sidebar from "../navigation/Sidebar";
import Header from "../header/Header";
import DashboardPage from "../../pages/DashboardPage";
import UsersPage from "../../pages/UsersPage";
import RolesPage from "../../pages/RolesPage";
import PermissionsPage from "../../pages/PermissionsPage";
import ActivityLogPage from "../../pages/ActivityLogPage";
import ProfilePage from "../../pages/ProfilePage";
import ClientesPage from "../../pages/ClientesPage";
import PlanesPage from "../../pages/PlanesPage";
import LogoutModal from "../modals/LogoutModal";
import LogoutSuccessModal from "../modals/LogoutSuccessModal";
import ProtectedRoute from "./ProtectedRoute";
import NoRolesAssigned from "../access/NoRolesAssigned";
import { ROUTES } from "../../config/routes";
import styles from "../dashboard/dashboard.module.css";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

interface DashboardContentProps {
  user: any;
  onLogout: () => void;
  showLogoutModal: boolean;
  showSuccessModal: boolean;
  isMobileSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  isMobile: boolean;
  onMobileClose: () => void;
  onSidebarToggle: () => void;
  onMainClick: () => void;
  onLogoutConfirm: () => void;
  onSuccessClose: () => void;
  setShowLogoutModal: (show: boolean) => void;
}

function DashboardContent({
  user,
  onLogout,
  showLogoutModal,
  showSuccessModal,
  isMobileSidebarOpen,
  isSidebarCollapsed,
  isMobile,
  onMobileClose,
  onSidebarToggle,
  onMainClick,
  onLogoutConfirm,
  onSuccessClose,
  setShowLogoutModal,
}: DashboardContentProps) {
  const { user: currentUser, userPermissions } = usePermissions();

  // Verificar si el usuario tiene roles y permisos
  if (currentUser) {
    // Los superusuarios siempre tienen acceso
    if (currentUser.role.id === "super_admin") {
      console.log("Superuser detected, granting full access:", currentUser);
    } else {
      // Si no tiene roles asignados o no tiene permisos
      if (
        currentUser.role.id === "no_role" ||
        currentUser.role.id === "unknown_role" ||
        userPermissions.length === 0
      ) {
        console.log("User has no roles or permissions:", currentUser);
        return <NoRolesAssigned />;
      }
    }
  }

  return (
    <div
      className={`${styles.container} ${
        isMobileSidebarOpen ? styles.sidebarOpen : ""
      } ${isSidebarCollapsed ? styles.sidebarCollapsed : ""}`}
    >
      <Sidebar
        onLogout={onLogout}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={onMobileClose}
        isCollapsed={isSidebarCollapsed}
        onToggle={onSidebarToggle}
      />

      <div className={styles.contentWrapper}>
        <Header onLogout={onLogout} />

        <main className={styles.main} onClick={onMainClick}>
          {isMobile && (
            <div className={styles.mobileHeader}>
              <button
                className={styles.menuButton}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering handleMainClick
                  onSidebarToggle();
                }}
              >
                <Menu size={24} />
              </button>
              <h2>Golden Spartan GYM</h2>
            </div>
          )}

          <Routes>
            <Route
              path={ROUTES.HOME}
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute requiredPermission="Ver Dashboard">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.USERS}
              element={
                <ProtectedRoute requiredPermission="Ver Usuarios">
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ROLES}
              element={
                <ProtectedRoute requiredPermission="Ver Roles">
                  <RolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PERMISSIONS}
              element={
                <ProtectedRoute requiredPermission="Ver Permisos">
                  <PermissionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ACTIVITY_LOG}
              element={
                <ProtectedRoute requiredPermission="Ver Bitácora">
                  <ActivityLogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CLIENTES}
              element={
                <ProtectedRoute requiredPermission="ver_cliente">
                  <ClientesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PLANES}
              element={
                <ProtectedRoute requiredPermission="ver_plan">
                  <PlanesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={<ProfilePage />}
            />
            <Route
              path="*"
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
          </Routes>
        </main>
      </div>

      {/* Modals */}
      {showLogoutModal && (
        <LogoutModal
          isOpen={showLogoutModal}
          onConfirm={onLogoutConfirm}
          onClose={() => setShowLogoutModal(false)}
          userName={
            user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.username || "Usuario"
          }
        />
      )}

      {showSuccessModal && (
        <LogoutSuccessModal
          isOpen={showSuccessModal}
          onClose={onSuccessClose}
          userName={
            user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.username || "Usuario"
          }
        />
      )}
    </div>
  );
}

function DashboardLayout() {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);

      // Close sidebar automatically when switching to mobile
      if (isMobileView) {
        setIsMobileSidebarOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleSidebarToggle = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleMainClick = () => {
    if (isMobile && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    try {
      await logout();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <PermissionsProvider user={user}>
      <DashboardContent
        user={user}
        onLogout={handleLogout}
        showLogoutModal={showLogoutModal}
        showSuccessModal={showSuccessModal}
        isMobileSidebarOpen={isMobileSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onSidebarToggle={handleSidebarToggle}
        onMainClick={handleMainClick}
        onLogoutConfirm={handleLogoutConfirm}
        onSuccessClose={handleSuccessClose}
        setShowLogoutModal={setShowLogoutModal}
      />
    </PermissionsProvider>
  );
}

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // This will be handled by App.tsx
  }

  return <DashboardLayout />;
}
