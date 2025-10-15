import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginHeader from "./components/login/login-header";
import GymImageSide from "./components/login/gym-image-side";
import LoginForm from "./components/login/login-form";
import AppRouter from "./components/routing/AppRouter";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import styles from "./App.module.css";
import "./App.css";

function LoginPage() {
  return (
    <div className={styles.container}>
      <LoginHeader />
      <div className={styles.content}>
        <GymImageSide />
        <div className={styles.formSide}>
          <LoginForm apiConnected={true} />
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AppRouter />;
  }

  return <LoginPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
