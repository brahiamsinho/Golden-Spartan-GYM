import { useState } from "react";
import { User, Lock, Mail, Shield, Save, X } from "lucide-react";
import styles from "./RegisterPage.module.css";

interface UserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "administrador" | "entrenador";
  firstName: string;
  lastName: string;
  phone: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "administrador",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    // Validar campos requeridos
    if (!formData.username.trim())
      newErrors.username = "El nombre de usuario es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.password.trim())
      newErrors.password = "La contraseña es requerida";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirmar contraseña es requerido";
    if (!formData.firstName.trim())
      newErrors.firstName = "El nombre es requerido";
    if (!formData.lastName.trim())
      newErrors.lastName = "El apellido es requerido";

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validar contraseña
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar username único (simulación)
    if (
      formData.username &&
      (formData.username === "admin" || formData.username === "usuario1")
    ) {
      newErrors.username = "Este nombre de usuario ya existe";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simular llamada a API
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccessMessage(
        `${
          formData.role === "administrador" ? "Administrador" : "Entrenador"
        } "${formData.username}" registrado exitosamente`
      );

      // Resetear formulario
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "administrador",
        firstName: "",
        lastName: "",
        phone: "",
      });

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "administrador",
      firstName: "",
      lastName: "",
      phone: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Shield className={styles.titleIcon} />
          Registrar Usuario del Sistema
        </h1>
        <p className={styles.subtitle}>
          Crear nuevo administrador o entrenador para el sistema
        </p>
      </div>

      {successMessage && (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Información Personal */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <User size={18} />
              Información Personal
            </h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="firstName" className={styles.label}>
                  Nombre *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.firstName ? styles.inputError : ""
                  }`}
                  placeholder="Ingrese el nombre"
                />
                {errors.firstName && (
                  <span className={styles.error}>{errors.firstName}</span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName" className={styles.label}>
                  Apellido *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.lastName ? styles.inputError : ""
                  }`}
                  placeholder="Ingrese el apellido"
                />
                {errors.lastName && (
                  <span className={styles.error}>{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                <Mail size={16} />
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.email ? styles.inputError : ""
                }`}
                placeholder="usuario@example.com"
              />
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="+1234567890"
              />
            </div>
          </div>

          {/* Información de Cuenta */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Lock size={18} />
              Información de Cuenta
            </h3>

            <div className={styles.field}>
              <label htmlFor="role" className={styles.label}>
                <Shield size={16} />
                Rol del Usuario *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="administrador">Administrador</option>
                <option value="entrenador">Entrenador</option>
              </select>
              <small className={styles.hint}>
                {formData.role === "administrador"
                  ? "Acceso completo al sistema y gestión de usuarios"
                  : "Acceso a gestión de clientes y horarios de entrenamiento"}
              </small>
            </div>

            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>
                Nombre de Usuario *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.username ? styles.inputError : ""
                }`}
                placeholder="Nombre de usuario único"
              />
              {errors.username && (
                <span className={styles.error}>{errors.username}</span>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>
                  Contraseña *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.password ? styles.inputError : ""
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <span className={styles.error}>{errors.password}</span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.confirmPassword ? styles.inputError : ""
                  }`}
                  placeholder="Repetir contraseña"
                />
                {errors.confirmPassword && (
                  <span className={styles.error}>{errors.confirmPassword}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            disabled={isSubmitting}
          >
            <X size={16} />
            Limpiar
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            <Save size={16} />
            {isSubmitting ? "Registrando..." : "Registrar Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}
