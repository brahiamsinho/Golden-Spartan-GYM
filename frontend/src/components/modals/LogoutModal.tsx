import React from "react"
import { LogOut, X } from "lucide-react"
import styles from "./LogoutModal.module.css"

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName?: string
}

export default function LogoutModal({ isOpen, onClose, onConfirm, userName = "Usuario" }: LogoutModalProps) {
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
          <div className={styles.titleSection}>
            <LogOut className={styles.icon} />
            <h2 className={styles.title}>Cerrar Sesión</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className={styles.content}>
          <p className={styles.message}>
            ¿Estás seguro que deseas cerrar sesión, <span className={styles.userName}>{userName}</span>?
          </p>
          <p className={styles.subMessage}>
            Tendrás que volver a iniciar sesión para acceder al sistema.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}