import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { PermissionsProvider } from "../../contexts/PermissionsContext";
import Sidebar from "../navigation/Sidebar";
import DashboardPage from "../../pages/DashboardPage";
import UsersPage from "../../pages/UsersPage";
import RolesPage from "../../pages/RolesPage";
import PermissionsPage from "../../pages/PermissionsPage";
import ActivityLogPage from "../../pages/ActivityLogPage";
import LogoutModal from "../modals/LogoutModal";
import LogoutSuccessModal from "../modals/LogoutSuccessModal";
import styles from "./dashboard.module.css";
import { Menu } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Close sidebar when clicking on overlay
  const handleMainClick = () => {
    if (isMobile && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      logout();
    }, 2000);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "users":
        return <UsersPage />;
      case "roles":
        return <RolesPage />;
      case "permissions":
        return <PermissionsPage />;
      case "activity-log":
        return <ActivityLogPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <PermissionsProvider user={user}>
      <div
        className={`${styles.container} ${
          isMobileSidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className={styles.main} onClick={handleMainClick}>
          {isMobile && (
            <div className={styles.mobileHeader}>
              <button
                className={styles.menuButton}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering handleMainClick
                  toggleMobileSidebar();
                }}
              >
                <Menu size={24} />
              </button>
              <h2>Golden Spartan GYM</h2>
            </div>
          )}
          <div className={styles.content}>{renderCurrentPage()}</div>
        </main>

        <LogoutModal
          isOpen={showLogoutModal}
          onConfirm={confirmLogout}
          onClose={() => setShowLogoutModal(false)}
          userName={user?.username || "Usuario"}
        />

        <LogoutSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      </div>
    </PermissionsProvider>
  );
}
