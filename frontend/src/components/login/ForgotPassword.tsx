import { useState } from 'react'
import { Mail, ArrowLeft, Check } from 'lucide-react'
import styles from './ForgotPassword.module.css'
import ApiService from '../../services/api'

interface ForgotPasswordProps {
  onBack: () => void
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido')
      setIsLoading(false)
      return
    }

    try {
      await ApiService.forgotPassword(email)
      setSuccess(true)
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error)
      setError('Error al enviar el email. Por favor intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <Check size={48} />
          </div>
          <h2>¡Email Enviado!</h2>
          <p>Hemos enviado las instrucciones de recuperación a tu email.</p>
          <p className={styles.successNote}>
            Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
          </p>
          <button onClick={onBack} className={styles.backButton}>
            Volver al Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backArrow}>
          <ArrowLeft size={20} />
        </button>
        <h2>Recuperar Contraseña</h2>
      </div>

      <form onSubmit={handleSendEmail} className={styles.form}>
        <div className={styles.description}>
          <p>Ingresa tu email para recibir las instrucciones de recuperación</p>
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
        </button>
      </form>
    </div>
  )
}