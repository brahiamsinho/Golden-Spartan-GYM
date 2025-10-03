import { useState } from 'react'
import { Mail, ArrowLeft, Check, User, Lock } from 'lucide-react'
import styles from './ForgotPassword.module.css'

interface ForgotPasswordProps {
  onBack: () => void
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'username' | 'success'>('email')
  const [username, setUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simular validación de email
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido')
      setIsLoading(false)
      return
    }

    // Simular envío exitoso
    setStep('username')
    setIsLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    if (!username.trim()) {
      setError('El nombre de usuario es requerido')
      setIsLoading(false)
      return
    }

    // Simular cambio de contraseña
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Para demo, siempre exitoso
    setStep('success')
    setIsLoading(false)
  }

  if (step === 'success') {
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
        <h2>
          {step === 'email' ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
        </h2>
      </div>

      {step === 'email' ? (
        <form onSubmit={handleSendEmail} className={styles.form}>
          <div className={styles.description}>
            <p>Ingresa tu email para continuar con el restablecimiento de contraseña</p>
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
            {isLoading ? 'Validando...' : 'Continuar'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className={styles.form}>
          <div className={styles.description}>
            <p>Ingresa tu nombre de usuario y tu nueva contraseña</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="username">Nombre de Usuario</label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={20} />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
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
      )}
    </div>
  )
}