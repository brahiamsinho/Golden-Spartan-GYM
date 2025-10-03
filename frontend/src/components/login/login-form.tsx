import type React from "react";
import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./login-form.module.css";

interface LoginFormProps {
  apiConnected?: boolean;
}

export default function LoginForm({ apiConnected = false }: LoginFormProps) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!usuario) newErrors.push("Usuario requerido");
    if (!password) newErrors.push("Contraseña requerida");

    // Verificar si la API está conectada
    if (!apiConnected) {
      newErrors.push("El servidor no está disponible. Verifica la conexión.");
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      try {
        const success = await login(usuario, password);
        if (!success) {
          setErrors([
            "Credenciales incorrectas. Verifica tu usuario y contraseña.",
          ]);
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        setErrors([
          "Error de conexión con el servidor. Verifica que el backend esté en ejecución.",
        ]);
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Lock className={styles.lockIcon} />
          <h2 className={styles.title}>Iniciar sesión</h2>
        </div>
      </div>
      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Campo de Usuario */}
          <div className={styles.field}>
            <label htmlFor="usuario" className={styles.label}>
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className={styles.input}
              placeholder="Usuario"
              required
            />
          </div>

          {/* Campo de Contraseña */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Errores */}
          {errors.length > 0 && (
            <div className={styles.errors}>
              {errors.map((error, index) => (
                <p key={index} className={styles.error}>
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Botón de Envío */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className={styles.spinner} />
                Iniciando...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
