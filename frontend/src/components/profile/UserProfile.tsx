import React, { useState, useEffect } from 'react';
import styles from './UserProfile.module.css';
import apiService from '../../services/api';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  last_login: string | null;
  is_active: boolean;
  roles: Array<{
    id: number;
    nombre: string;
  }>;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: ''
  });
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserProfile();
      setProfile(response);
      setFormData({
        email: response.email || '',
        first_name: response.first_name || '',
        last_name: response.last_name || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({
        type: 'error',
        text: 'Error al cargar el perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      // Validaciones básicas
      if (formData.email && !formData.email.includes('@')) {
        setMessage({
          type: 'error',
          text: 'Por favor ingresa un email válido'
        });
        return;
      }

      if (formData.first_name && formData.first_name.trim().length < 2) {
        setMessage({
          type: 'error',
          text: 'El nombre debe tener al menos 2 caracteres'
        });
        return;
      }

      if (formData.last_name && formData.last_name.trim().length < 2) {
        setMessage({
          type: 'error',
          text: 'El apellido debe tener al menos 2 caracteres'
        });
        return;
      }

      const response = await apiService.updateUserProfile(formData);
      setProfile(response.profile);
      setEditing(false);
      setMessage({
        type: 'success',
        text: response.message
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al actualizar el perfil'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || ''
      });
    }
    setEditing(false);
    setMessage(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error al cargar el perfil del usuario
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Mi Perfil</h1>
        {!editing && (
          <button 
            className={styles.editButton}
            onClick={() => setEditing(true)}
          >
            <i className="fas fa-edit"></i>
            Editar Perfil
          </button>
        )}
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            <i className="fas fa-user"></i>
          </div>
          <div className={styles.userInfo}>
            <h2>{profile.username}</h2>
            <p className={styles.status}>
              <span className={`${styles.statusDot} ${profile.is_active ? styles.active : styles.inactive}`}></span>
              {profile.is_active ? 'Activo' : 'Inactivo'}
            </p>
          </div>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.section}>
            <h3>Información Personal</h3>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label>Nombre de Usuario</label>
                <div className={styles.readOnlyField}>
                  {profile.username}
                  <span className={styles.readOnlyNote}>No se puede modificar</span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                {editing ? (
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ingresa tu email"
                  />
                ) : (
                  <div className={styles.fieldValue}>
                    {profile.email || 'No especificado'}
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="first_name">Nombre</label>
                {editing ? (
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ingresa tu nombre"
                  />
                ) : (
                  <div className={styles.fieldValue}>
                    {profile.first_name || 'No especificado'}
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="last_name">Apellido</label>
                {editing ? (
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ingresa tu apellido"
                  />
                ) : (
                  <div className={styles.fieldValue}>
                    {profile.last_name || 'No especificado'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Información del Sistema</h3>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label>Fecha de Registro</label>
                <div className={styles.fieldValue}>
                  {formatDate(profile.date_joined)}
                </div>
              </div>

              <div className={styles.field}>
                <label>Último Inicio de Sesión</label>
                <div className={styles.fieldValue}>
                  {profile.last_login ? formatDate(profile.last_login) : 'Nunca'}
                </div>
              </div>

              <div className={styles.field}>
                <label>Roles Asignados</label>
                <div className={styles.rolesContainer}>
                  {profile.roles.length > 0 ? (
                    profile.roles.map(role => (
                      <span key={role.id} className={styles.roleTag}>
                        {role.nombre}
                      </span>
                    ))
                  ) : (
                    <span className={styles.noRoles}>Sin roles asignados</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {editing && (
            <div className={styles.actions}>
              <button 
                className={styles.saveButton}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className={styles.buttonSpinner}></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Guardar Cambios
                  </>
                )}
              </button>
              <button 
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={saving}
              >
                <i className="fas fa-times"></i>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;