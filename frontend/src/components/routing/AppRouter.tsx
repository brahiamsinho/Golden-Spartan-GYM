import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { PermissionsProvider } from "../../contexts/PermissionsContext";
import Sidebar from "../navigation/Sidebar";
import Header from "../header/Header";
import DashboardPage from "../../pages/DashboardPage";
import UsersPage from "../../pages/UsersPage";
import RolesPage from "../../pages/RolesPage";
import PermissionsPage from "../../pages/PermissionsPage";
import ActivityLogPage from "../../pages/ActivityLogPage";
import LogoutModal from "../modals/LogoutModal";
import LogoutSuccessModal from "../modals/LogoutSuccessModal";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "../../config/routes";
import styles from "../dashboard/dashboard.module.css";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

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
      <div
        className={`${styles.container} ${
          isMobileSidebarOpen ? styles.sidebarOpen : ""
        } ${isSidebarCollapsed ? styles.sidebarCollapsed : ""}`}
      >
        <Sidebar
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
        />

        <div className={styles.contentWrapper}>
          <Header onLogout={handleLogout} />

          <main className={styles.main} onClick={handleMainClick}>
            {isMobile && (
              <div className={styles.mobileHeader}>
                <button
                  className={styles.menuButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering handleMainClick
                    handleSidebarToggle();
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
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.USERS}
                element={
                  <ProtectedRoute>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ROLES}
                element={
                  <ProtectedRoute>
                    <RolesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PERMISSIONS}
                element={
                  <ProtectedRoute>
                    <PermissionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ACTIVITY_LOG}
                element={
                  <ProtectedRoute>
                    <ActivityLogPage />
                  </ProtectedRoute>
                }
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
            onConfirm={handleLogoutConfirm}
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
            onClose={handleSuccessClose}
            userName={
              user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.username || "Usuario"
            }
          />
        )}
      </div>
    </PermissionsProvider>
  );
}

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // This will be handled by App.tsx
  }

  return (
    <BrowserRouter>
      <DashboardLayout />
    </BrowserRouter>
  );
}
