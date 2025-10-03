import { useState, useEffect } from "react";
import {
  Shield,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Users,
  Lock,
  Search,
  Calendar,
  Activity,
  AlertTriangle,
} from "lucide-react";
import styles from "./RolesPage.module.css";
import apiService from "../services/api";

interface Permission {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: Permission[];
  usuarios_count: number;
  activo: boolean;
  fecha_creacion: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newRole, setNewRole] = useState({
    nombre: "",
    descripcion: "",
    permisos: [] as number[],
  });

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRoles();
      setRoles(data);
    } catch (err) {
      setError("Error al cargar roles");
      console.error("Error loading roles:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const data = await apiService.getPermissions();
      setPermissions(data);
    } catch (err) {
      console.error("Error loading permissions:", err);
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const module = permission.nombre.split(".")[0] || "Otros";
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const filteredRoles = roles.filter(
    (role) =>
      role.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = async () => {
    if (!newRole.nombre.trim()) return;

    try {
      await apiService.createRole({
        nombre: newRole.nombre,
        descripcion: newRole.descripcion,
        permisos: newRole.permisos,
      });

      await loadRoles();
      setNewRole({ nombre: "", descripcion: "", permisos: [] });
      setShowCreateModal(false);
    } catch (err) {
      setError("Error al crear rol");
      console.error("Error creating role:", err);
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole || !newRole.nombre.trim()) return;

    try {
      await apiService.updateRole(selectedRole.id, {
        nombre: newRole.nombre,
        descripcion: newRole.descripcion,
        permisos: newRole.permisos,
      });

      await loadRoles();
      setShowEditModal(false);
      setSelectedRole(null);
      setNewRole({ nombre: "", descripcion: "", permisos: [] });
    } catch (err) {
      setError("Error al actualizar rol");
      console.error("Error updating role:", err);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    if (selectedRole.usuarios_count > 0) {
      alert("No se puede eliminar un rol que tiene usuarios asignados");
      return;
    }

    try {
      await apiService.deleteRole(selectedRole.id);
      await loadRoles();
      setShowDeleteModal(false);
      setSelectedRole(null);
    } catch (err) {
      setError("Error al eliminar rol");
      console.error("Error deleting role:", err);
    }
  };

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setNewRole({
      nombre: role.nombre,
      descripcion: role.descripcion,
      permisos: role.permisos.map((p) => p.id),
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const togglePermission = (permissionId: number) => {
    setNewRole((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(permissionId)
        ? prev.permisos.filter((id) => id !== permissionId)
        : [...prev.permisos, permissionId],
    }));
  };

  const getPermissionName = (permissionId: number) => {
    const permission = permissions.find((p) => p.id === permissionId);
    return permission ? permission.nombre : `Permiso ${permissionId}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando roles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadRoles} className={styles.retryButton}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <Shield className={styles.titleIcon} />
            Roles y Permisos
          </h1>
          <p className={styles.subtitle}>
            Gestión de roles del sistema y asignación de permisos
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={styles.createButton}
        >
          <Plus size={16} />
          Nuevo Rol
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Shield size={16} className={styles.statIcon} />
            <div>
              <span className={styles.statValue}>{roles.length}</span>
              <span className={styles.statLabel}>Total Roles</span>
            </div>
          </div>
          <div className={styles.stat}>
            <Activity size={16} className={styles.statIcon} />
            <div>
              <span className={styles.statValue}>
                {roles.filter((r) => r.activo).length}
              </span>
              <span className={styles.statLabel}>Activos</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rolesGrid}>
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className={`${styles.roleCard} ${
              !role.activo ? styles.inactive : ""
            }`}
          >
            <div className={styles.roleHeader}>
              <div className={styles.roleInfo}>
                <h3 className={styles.roleName}>{role.nombre}</h3>
                <p className={styles.roleDescription}>{role.descripcion}</p>
              </div>
              <div className={styles.roleActions}>
                <button
                  onClick={() => openEditModal(role)}
                  className={styles.actionButton}
                  title="Editar rol"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => openDeleteModal(role)}
                  className={`${styles.actionButton} ${styles.delete}`}
                  title="Eliminar rol"
                  disabled={role.nombre === "Super Administrador"}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className={styles.roleStats}>
              <div className={styles.roleStat}>
                <Users size={16} />
                <span>{role.usuarios_count} usuarios</span>
              </div>
              <div className={styles.roleStat}>
                <Lock size={16} />
                <span>{role.permisos.length} permisos</span>
              </div>
              <div className={styles.roleStatus}>
                <span
                  className={`${styles.statusBadge} ${
                    role.activo ? styles.active : styles.inactive
                  }`}
                >
                  {role.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            <div className={styles.permissionsPreview}>
              <h4 className={styles.permissionsTitle}>Permisos asignados:</h4>
              <div className={styles.permissionsList}>
                {role.permisos.slice(0, 3).map((permission) => (
                  <span key={permission.id} className={styles.permissionTag}>
                    {permission.nombre}
                  </span>
                ))}
                {role.permisos.length > 3 && (
                  <span className={styles.morePermissions}>
                    +{role.permisos.length - 3} más
                  </span>
                )}
              </div>
            </div>

            <div className={styles.roleFooter}>
              <div className={styles.createdDate}>
                <Calendar size={12} />
                <span>
                  Creado: {new Date(role.fecha_creacion).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear Rol */}
      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Crear Nuevo Rol</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre del Rol *</label>
                <input
                  type="text"
                  value={newRole.nombre}
                  onChange={(e) =>
                    setNewRole((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                  className={styles.input}
                  placeholder="Ej: Administrador de Ventas"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  value={newRole.descripcion}
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      descripcion: e.target.value,
                    }))
                  }
                  className={styles.textarea}
                  placeholder="Descripción del rol y sus responsabilidades"
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Permisos</label>
                <div className={styles.permissionsContainer}>
                  {Object.entries(groupedPermissions).map(
                    ([module, modulePermissions]) => (
                      <div key={module} className={styles.permissionModule}>
                        <h4 className={styles.moduleTitle}>{module}</h4>
                        <div className={styles.modulePermissions}>
                          {modulePermissions.map((permission) => (
                            <label
                              key={permission.id}
                              className={styles.permissionItem}
                            >
                              <input
                                type="checkbox"
                                checked={newRole.permisos.includes(
                                  permission.id
                                )}
                                onChange={() => togglePermission(permission.id)}
                                className={styles.checkbox}
                              />
                              <div className={styles.permissionInfo}>
                                <span className={styles.permissionName}>
                                  {permission.nombre}
                                </span>
                                <span className={styles.permissionDescription}>
                                  {permission.descripcion}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowCreateModal(false)}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button onClick={handleCreateRole} className={styles.saveButton}>
                <Plus size={16} />
                Crear Rol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Rol */}
      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Editar Rol</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre del Rol *</label>
                <input
                  type="text"
                  value={newRole.nombre}
                  onChange={(e) =>
                    setNewRole((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  value={newRole.descripcion}
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      descripcion: e.target.value,
                    }))
                  }
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Permisos</label>
                <div className={styles.permissionsContainer}>
                  {Object.entries(groupedPermissions).map(
                    ([module, modulePermissions]) => (
                      <div key={module} className={styles.permissionModule}>
                        <h4 className={styles.moduleTitle}>{module}</h4>
                        <div className={styles.modulePermissions}>
                          {modulePermissions.map((permission) => (
                            <label
                              key={permission.id}
                              className={styles.permissionItem}
                            >
                              <input
                                type="checkbox"
                                checked={newRole.permisos.includes(
                                  permission.id
                                )}
                                onChange={() => togglePermission(permission.id)}
                                className={styles.checkbox}
                              />
                              <div className={styles.permissionInfo}>
                                <span className={styles.permissionName}>
                                  {permission.nombre}
                                </span>
                                <span className={styles.permissionDescription}>
                                  {permission.descripcion}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowEditModal(false)}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button onClick={handleEditRole} className={styles.saveButton}>
                <Edit size={16} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Rol */}
      {showDeleteModal && selectedRole && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Eliminar Rol</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.deleteWarning}>
                <div className={styles.warningIcon}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p>
                    ¿Estás seguro de que quieres eliminar el rol{" "}
                    <strong>"{selectedRole.nombre}"</strong>?
                  </p>
                  {selectedRole.usuarios_count > 0 ? (
                    <p className={styles.errorText}>
                      Este rol tiene {selectedRole.usuarios_count} usuarios
                      asignados. No se puede eliminar.
                    </p>
                  ) : (
                    <p>Esta acción no se puede deshacer.</p>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteRole}
                className={styles.deleteButton}
                disabled={
                  selectedRole.usuarios_count > 0 ||
                  selectedRole.nombre === "Super Administrador"
                }
              >
                <Trash2 size={16} />
                Eliminar Rol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
