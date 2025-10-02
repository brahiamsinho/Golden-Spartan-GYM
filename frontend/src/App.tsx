import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginHeader from "./components/login/login-header"
import GymImageSide from "./components/login/gym-image-side"
import LoginForm from "./components/login/login-form"
import Dashboard from "./components/dashboard/Dashboard"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import styles from "./App.module.css"
import "./App.css"

// Componente de la página de login
const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
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
};

// Componente de ruta protegida
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Ruta por defecto - redirige a la página principal */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
