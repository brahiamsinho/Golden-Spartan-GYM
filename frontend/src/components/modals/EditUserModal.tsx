import { useState, useEffect } from "react";
import { X, Save, User, Mail, Lock, Shield, Eye, EyeOff } from "lucide-react";
import apiService from "../../services/api";
import styles from "./EditUserModal.module.css";

interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  roles?: { id: number; nombre: string }[];
  permisos?: string[];
}

interface Role {
  id: number;
  nombre: string;
  descripcion: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Usuario | null;
  onUserUpdated: () => void;
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onUserUpdated,
}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    rol: 0,
    is_active: true,
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: "",
        rol: user.roles?.[0]?.id || 0,
        is_active: user.is_active,
      });
      loadRoles();
    }
  }, [isOpen, user]);

  const loadRoles = async () => {
    try {
      const data = await apiService.getRoles();
      setRoles(data);
    } catch (err) {
      console.error("Error loading roles:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.username.trim()) {
      errors.push("El nombre de usuario es requerido");
    } else if (formData.username.length < 3) {
      errors.push("El nombre de usuario debe tener al menos 3 caracteres");
    }

    if (!formData.email.trim()) {
      errors.push("El email es requerido");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("El email no tiene un formato válido");
    }

    if (!formData.first_name.trim()) {
      errors.push("El nombre es requerido");
    }

    if (!formData.last_name.trim()) {
      errors.push("El apellido es requerido");
    }

    if (formData.password && formData.password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres");
    }

    if (formData.rol === 0) {
      errors.push("Debe seleccionar un rol");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar datos para enviar (sin password si está vacío)
      const updateData: any = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        rol: formData.rol,
        is_active: formData.is_active,
      };

      // Solo incluir password si se proporcionó uno nuevo
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      await apiService.updateUser(user.id, updateData);
      onUserUpdated();
      onClose();
    } catch (err: any) {
      if (err.message && err.message.includes("username")) {
        setError("El nombre de usuario ya está en uso");
      } else if (err.message && err.message.includes("email")) {
        setError("El email ya está en uso");
      } else {
        setError("Error al actualizar usuario");
      }
      console.error("Error updating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      rol: 0,
      is_active: true,
    });
    setError(null);
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Editar Usuario</h2>
          <button onClick={handleClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.modalBody}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <User size={16} />
                Información Personal
              </h3>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Apellido *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ingrese el apellido"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email *</label>
                <div className={styles.inputGroup}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="usuario@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Shield size={16} />
                Acceso y Seguridad
              </h3>

              <div className={styles.field}>
                <label className={styles.label}>Nombre de Usuario *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Nombre de usuario único"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Nueva Contraseña</label>
                <div className={styles.inputGroup}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Dejar vacío para mantener la actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.togglePassword}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <small className={styles.hint}>
                  Dejar vacío para mantener la contraseña actual
                </small>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Rol *</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value={0}>Seleccionar rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.nombre}
                    </option>
                  ))}
                </select>
                <small className={styles.hint}>
                  {roles.find((r) => r.id === formData.rol)?.descripcion}
                </small>
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Usuario activo</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              <Save size={16} />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
