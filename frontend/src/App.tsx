import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginHeader from "./components/login/login-header";
import GymImageSide from "./components/login/gym-image-side";
import LoginForm from "./components/login/login-form";
import Dashboard from "./components/dashboard/dashboard";
import styles from "./App.module.css";
import "./App.css";

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className={styles.container}>
      <LoginHeader />
      <div className={styles.content}>
        <GymImageSide />
        <div className={styles.formSide}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
