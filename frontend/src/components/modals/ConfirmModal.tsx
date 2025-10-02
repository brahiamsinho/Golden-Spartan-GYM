import React from "react"
import { AlertTriangle, X } from "lucide-react"
import styles from "./ConfirmModal.module.css"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = 'warning'
}: ConfirmModalProps) {
  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'danger': return 'rgb(248, 113, 113)'
      case 'warning': return 'rgb(251, 191, 36)'
      case 'info': return 'rgb(59, 130, 246)'
      default: return 'rgb(251, 191, 36)'
    }
  }

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger': return styles.dangerButton
      case 'warning': return styles.warningButton
      case 'info': return styles.infoButton
      default: return styles.warningButton
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header del Modal */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <AlertTriangle 
              className={styles.icon} 
              style={{ color: getIconColor() }}
            />
            <h2 className={styles.title}>{title}</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>

        {/* Botones de Acción */}
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`${styles.confirmButton} ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}