import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Lock, ArrowLeft, Check, AlertCircle } from 'lucide-react'
import styles from './ResetPasswordPage.module.css'
import ApiService from '../services/api'

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      setError('Token de recuperación no válido')
    } else {
      setTokenValid(true)
    }
  }, [token])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setIsLoading(true)
    setError('')

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      setIsLoading(false)
      return
    }

    try {
      await ApiService.resetPassword(token, password)
      setSuccess(true)
    } catch (error) {
      console.error('Error al restablecer contraseña:', error)
      setError('Error al restablecer la contraseña. El token puede haber expirado.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/')
  }

  if (!tokenValid) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>
            <AlertCircle size={48} />
          </div>
          <h2>Token Inválido</h2>
          <p>El enlace de recuperación no es válido o ha expirado.</p>
          <button onClick={handleBackToLogin} className={styles.backButton}>
            <ArrowLeft size={20} />
            Volver al Login
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <Check size={48} />
          </div>
          <h2>¡Contraseña Restablecida!</h2>
          <p>Tu contraseña ha sido cambiada exitosamente.</p>
          <p className={styles.successNote}>
            Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
          <button onClick={handleBackToLogin} className={styles.backButton}>
            Ir al Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button onClick={handleBackToLogin} className={styles.backArrow}>
            <ArrowLeft size={20} />
          </button>
          <div className={styles.logoSection}>
            <h1>Golden Spartan Gym</h1>
            <h2>Nueva Contraseña</h2>
          </div>
        </div>

        <form onSubmit={handleResetPassword} className={styles.form}>
          <div className={styles.description}>
            <p>Ingresa tu nueva contraseña</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Nueva Contraseña</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetir contraseña"
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
            {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}