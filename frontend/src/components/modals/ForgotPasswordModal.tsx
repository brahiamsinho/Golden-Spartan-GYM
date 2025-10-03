import { useState } from "react";
import { X, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import styles from "./ForgotPasswordModal.module.css";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"input" | "success" | "error">("input");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage("El email es requerido");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/forgot-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStep("success");
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "No se encontró una cuenta con ese email"
        );
        setStep("error");
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      setErrorMessage(
        "Error de conexión. Verifica que el servidor esté funcionando."
      );
      setStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setStep("input");
    setErrorMessage("");
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <Mail className={styles.icon} />
            <h2 className={styles.title}>Recuperar Contraseña</h2>
          </div>
          <button onClick={handleClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {step === "input" && (
            <form onSubmit={handleSubmit}>
              <p className={styles.description}>
                Ingresa tu email y te enviaremos instrucciones para restablecer
                tu contraseña.
              </p>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              {errorMessage && (
                <div className={styles.errorContainer}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={handleClose}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.submitButton}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className={styles.spinner} />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Instrucciones"
                  )}
                </button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className={styles.successContainer}>
              <CheckCircle className={styles.successIcon} />
              <h3 className={styles.successTitle}>¡Email Enviado!</h3>
              <p className={styles.successMessage}>
                Hemos enviado las instrucciones para restablecer tu contraseña a{" "}
                <strong>{email}</strong>
              </p>
              <p className={styles.successNote}>
                Si no recibes el email en unos minutos, verifica tu carpeta de
                spam.
              </p>
              <button onClick={handleClose} className={styles.okButton}>
                Entendido
              </button>
            </div>
          )}

          {step === "error" && (
            <div className={styles.errorContainer}>
              <AlertCircle className={styles.errorIcon} />
              <h3 className={styles.errorTitle}>Error</h3>
              <p className={styles.errorMessage}>{errorMessage}</p>
              <div className={styles.actions}>
                <button
                  onClick={() => setStep("input")}
                  className={styles.retryButton}
                >
                  Intentar de Nuevo
                </button>
                <button onClick={handleClose} className={styles.cancelButton}>
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}