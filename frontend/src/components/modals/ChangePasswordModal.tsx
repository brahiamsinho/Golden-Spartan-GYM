import { useState } from "react";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./ChangePasswordModal.module.css";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validaciones
    if (!currentPassword) {
      setError("La contraseña actual es requerida");
      setIsLoading(false);
      return;
    }

    if (!newPassword) {
      setError("La nueva contraseña es requerida");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError(
          "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente."
        );
        setIsLoading(false);
        return;
      }

      // Llamar a la API para cambiar la contraseña
      const response = await fetch(
        "http://localhost:8000/api/change-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Error ${response.status}: ${response.statusText}`
        );
      }

      setSuccess(true);
      setIsLoading(false);

      setTimeout(() => {
        setSuccess(false);
        resetForm();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Error changing password:", err);
      setError(
        err.message ||
          "Error al cambiar la contraseña. Verifica que el servidor esté funcionando."
      );
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <Lock size={20} />
            Cambiar Contraseña
          </h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <Check size={48} />
            </div>
            <h3>¡Contraseña Cambiada!</h3>
            <p>Tu contraseña ha sido actualizada exitosamente.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.userInfo}>
              <p>
                Cambiar contraseña para: <strong>{user?.username}</strong>
              </p>
            </div>

            {/* Contraseña Actual */}
            <div className={styles.field}>
              <label htmlFor="currentPassword">Contraseña Actual *</label>
              <div className={styles.passwordWrapper}>
                <Lock className={styles.inputIcon} size={18} />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={styles.toggleButton}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div className={styles.field}>
              <label htmlFor="newPassword">Nueva Contraseña *</label>
              <div className={styles.passwordWrapper}>
                <Lock className={styles.inputIcon} size={18} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={styles.toggleButton}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div className={styles.field}>
              <label htmlFor="confirmPassword">
                Confirmar Nueva Contraseña *
              </label>
              <div className={styles.passwordWrapper}>
                <Lock className={styles.inputIcon} size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Repetir nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.toggleButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleClose}
                className={styles.cancelButton}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
