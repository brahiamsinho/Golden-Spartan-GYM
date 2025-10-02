import type React from "react";
import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./login-form.module.css";

export default function LoginForm() {
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
    // Eliminamos la validación de longitud mínima para permitir la contraseña "admin"
    // if (password && password.length < 8) newErrors.push("Mínimo 8 caracteres")

    setErrors(newErrors);

    if (newErrors.length === 0) {
      const success = await login(usuario, password);
      if (!success) {
        setErrors(["Credenciales incorrectas. Intenta con admin/admin"]);
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
