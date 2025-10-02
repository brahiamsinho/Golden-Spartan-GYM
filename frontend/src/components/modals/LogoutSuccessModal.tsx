import React from "react"
import { CheckCircle, X } from "lucide-react"
import styles from "./LogoutSuccessModal.module.css"

interface LogoutSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
}

export default function LogoutSuccessModal({ isOpen, onClose, userName = "Usuario" }: LogoutSuccessModalProps) {
  // Auto-close después de 3 segundos
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header del Modal */}
        <div className={styles.header}>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <CheckCircle className={styles.successIcon} />
          </div>
          
          <h2 className={styles.title}>¡Sesión Cerrada!</h2>
          
          <p className={styles.message}>
            <span className={styles.userName}>{userName}</span>, has cerrado sesión exitosamente.
          </p>
          
          <p className={styles.subMessage}>
            Te redirigiremos al login automáticamente...
          </p>

          {/* Barra de progreso */}
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>

        {/* Botón opcional */}
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.okButton}>
            Ir al Login Ahora
          </button>
        </div>
      </div>
    </div>
  )
}