import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { PermissionsProvider } from "../../contexts/PermissionsContext";
import Sidebar from "../navigation/Sidebar";
import Header from "../header/Header";
import DashboardPage from "../../pages/DashboardPage";
import LogoutModal from "../modals/LogoutModal";
import LogoutSuccessModal from "../modals/LogoutSuccessModal";
import styles from "./dashboard.module.css";
import { Menu } from "lucide-react";

export default function Dashboard() {
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

  const handleSidebarToggle = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const renderCurrentPage = () => {
    return <DashboardPage />;
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
            <div className={styles.content}>{renderCurrentPage()}</div>
          </main>
        </div>

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
