import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { PermissionsProvider } from "../../contexts/PermissionsContext"
import Sidebar from "../navigation/Sidebar"
import DashboardPage from "../../pages/DashboardPage"
import UsersPage from "../../pages/UsersPage"
import RolesPage from "../../pages/RolesPage"
import PermissionsPage from "../../pages/PermissionsPage"
import MembersPage from "../../pages/MembersPage"
import LogoutModal from "../modals/LogoutModal"
import LogoutSuccessModal from "../modals/LogoutSuccessModal"
import styles from "./dashboard.module.css"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    setShowLogoutModal(false)
    setShowSuccessModal(true)
    
    setTimeout(() => {
      setShowSuccessModal(false)
      logout()
    }, 2000)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "users":
        return <UsersPage />
      case "roles":
        return <RolesPage />
      case "permissions":
        return <PermissionsPage />
      case "members":
        return <MembersPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <PermissionsProvider user={user}>
      <div className={styles.container}>
        <Sidebar 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
        />
        
        <main className={styles.main}>
          <div className={styles.content}>
            {renderCurrentPage()}
          </div>
        </main>

        <LogoutModal
          isOpen={showLogoutModal}
          onConfirm={confirmLogout}
          onClose={() => setShowLogoutModal(false)}
          userName={user?.username || 'Usuario'}
        />

        <LogoutSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      </div>
    </PermissionsProvider>
  )
}