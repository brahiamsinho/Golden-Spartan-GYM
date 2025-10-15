import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../contexts/PermissionsContext";
import { User, Edit, Save, X, Eye, EyeOff } from "lucide-react";
import styles from "./UserProfile.module.css";

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { user, logout } = useAuth();
  const { userPermissions } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        username: user.username || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Aquí implementarías la lógica para guardar los cambios
    console.log("Guardando cambios del perfil:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        username: user.username || "",
        password: "",
        confirmPassword: "",
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>No se pudo cargar la información del usuario</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <User size={48} />
        </div>
        <div className={styles.userInfo}>
          <h1 className={styles.name}>
            {user.first_name && user.last_name
              ? `${user.first_name} ${user.last_name}`
              : user.username || "Usuario"}
          </h1>
          <p className={styles.role}>
            {user.role?.nombre || "Sin rol asignado"}
          </p>
        </div>
        <div className={styles.actions}>
          {!isEditing ? (
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              <Edit size={20} />
              Editar Perfil
            </button>
          ) : (
            <div className={styles.editActions}>
              <button className={styles.saveButton} onClick={handleSave}>
                <Save size={20} />
                Guardar
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
                <X size={20} />
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información Personal</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre</label>
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Nombre"
                />
              ) : (
                <p className={styles.value}>
                  {user.first_name || "No especificado"}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Apellido</label>
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Apellido"
                />
              ) : (
                <p className={styles.value}>
                  {user.last_name || "No especificado"}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Email"
                />
              ) : (
                <p className={styles.value}>
                  {user.email || "No especificado"}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Usuario</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Nombre de usuario"
                />
              ) : (
                <p className={styles.value}>
                  {user.username || "No especificado"}
                </p>
              )}
            </div>

            {isEditing && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nueva Contraseña</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Nueva contraseña"
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Confirmar nueva contraseña"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información del Rol</h2>
          <div className={styles.roleInfo}>
            <div className={styles.roleItem}>
              <span className={styles.roleLabel}>Rol:</span>
              <span className={styles.roleValue}>
                {user.role?.nombre || "Sin rol"}
              </span>
            </div>
            <div className={styles.roleItem}>
              <span className={styles.roleLabel}>Descripción:</span>
              <span className={styles.roleValue}>
                {user.role?.descripcion || "Sin descripción"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Permisos Asignados</h2>
          <div className={styles.permissionsList}>
            {userPermissions.length > 0 ? (
              userPermissions.map((permission, index) => (
                <div key={index} className={styles.permissionItem}>
                  <span className={styles.permissionName}>
                    {permission.nombre}
                  </span>
                  <span className={styles.permissionCode}>
                    ({permission.codigo})
                  </span>
                </div>
              ))
            ) : (
              <p className={styles.noPermissions}>No hay permisos asignados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
