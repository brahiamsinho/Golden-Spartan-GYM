import { useState, useEffect } from "react";
import {
  Lock,
  Search,
  Filter,
  Users,
  Shield,
  Settings,
  Database,
  BarChart,
  RefreshCw,
  Eye,
  Plus,
  Edit,
  Trash2,
  Activity,
  Key,
  Download,
  X,
} from "lucide-react";
import apiService from "../services/api";
import styles from "./PermissionsPage.module.css";

interface Permission {
  id: number;
  nombre: string;
  descripcion: string;
}

const MODULE_ICONS = {
  dashboard: BarChart,
  users: Users,
  roles: Shield,
  permissions: Lock,
  bitacora: Database,
  system: Settings,
  otros: Database,
};

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [newPermission, setNewPermission] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPermissions();
      setPermissions(data);
    } catch (err) {
      setError("Error al cargar permisos");
      console.error("Error loading permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const getModuleIcon = (module: string) => {
    return (
      MODULE_ICONS[module.toLowerCase() as keyof typeof MODULE_ICONS] ||
      Database
    );
  };

  const getPermissionIcon = (permissionName: string) => {
    const name = permissionName.toLowerCase();

    if (name.includes("ver") || name.includes("view")) return Eye;
    if (name.includes("crear") || name.includes("create")) return Plus;
    if (name.includes("editar") || name.includes("edit")) return Edit;
    if (name.includes("eliminar") || name.includes("delete")) return Trash2;
    if (name.includes("asignar") || name.includes("assign")) return Key;
    if (name.includes("gestionar") || name.includes("manage")) return Settings;
    if (name.includes("exportar") || name.includes("export")) return Download;
    if (name.includes("dashboard")) return BarChart;
    if (name.includes("usuario") || name.includes("user")) return Users;
    if (name.includes("rol") || name.includes("role")) return Shield;
    if (name.includes("permiso") || name.includes("permission")) return Lock;
    if (name.includes("bitacora") || name.includes("log")) return Activity;
    if (name.includes("sistema") || name.includes("system")) return Settings;

    return Lock;
  };

  const getPermissionColor = (permissionName: string) => {
    const name = permissionName.toLowerCase();

    if (name.includes("ver") || name.includes("view")) return "#3b82f6";
    if (name.includes("crear") || name.includes("create")) return "#10b981";
    if (name.includes("editar") || name.includes("edit")) return "#f59e0b";
    if (name.includes("eliminar") || name.includes("delete")) return "#ef4444";
    if (name.includes("asignar") || name.includes("assign")) return "#8b5cf6";
    if (name.includes("gestionar") || name.includes("manage")) return "#06b6d4";
    if (name.includes("exportar") || name.includes("export")) return "#84cc16";

    return "#64748b";
  };

  const handleCreatePermission = async () => {
    if (!newPermission.nombre.trim() || !newPermission.descripcion.trim()) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiService.createPermission(newPermission);
      await loadPermissions();
      setShowCreateModal(false);
      setNewPermission({ nombre: "", descripcion: "" });
    } catch (err) {
      setError("Error al crear permiso");
      console.error("Error creating permission:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPermission = async () => {
    if (
      !selectedPermission ||
      !newPermission.nombre.trim() ||
      !newPermission.descripcion.trim()
    ) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiService.updatePermission(selectedPermission.id, newPermission);
      await loadPermissions();
      setShowEditModal(false);
      setSelectedPermission(null);
      setNewPermission({ nombre: "", descripcion: "" });
    } catch (err: any) {
      console.error("Error updating permission:", err);
      // Manejar error específico del backend
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Error al actualizar permiso");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePermission = async (permissionId: number) => {
    console.log("Attempting to delete permission:", permissionId);
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este permiso?")
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiService.deletePermission(permissionId);
      await loadPermissions();
    } catch (err: any) {
      console.error("Error deleting permission:", err);
      // Manejar error específico del backend
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Error al eliminar permiso");
      }
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (permission: Permission) => {
    console.log("Opening edit modal for permission:", permission);
    console.log("Current showEditModal state:", showEditModal);
    setSelectedPermission(permission);
    setNewPermission({
      nombre: permission.nombre,
      descripcion: permission.descripcion,
    });
    setShowEditModal(true);
    console.log("Edit modal should now be open");
  };

  const getModuleColor = (module: string) => {
    const colors = {
      dashboard: "#3b82f6",
      users: "#10b981",
      roles: "#f59e0b",
      permissions: "#8b5cf6",
      bitacora: "#ef4444",
      system: "#6b7280",
      otros: "#64748b",
    };
    return colors[module.toLowerCase() as keyof typeof colors] || "#64748b";
  };

  // Agrupar permisos por módulo (basado en el nombre)
  const groupedPermissions = permissions.reduce((acc, permission) => {
    let module = "otros";

    // Mapeo inteligente de módulos
    const name = permission.nombre.toLowerCase();
    if (name.includes("dashboard")) module = "dashboard";
    else if (name.includes("usuario") || name.includes("user"))
      module = "users";
    else if (name.includes("rol") || name.includes("role")) module = "roles";
    else if (name.includes("permiso") || name.includes("permission"))
      module = "permissions";
    else if (name.includes("bitacora") || name.includes("log"))
      module = "bitacora";
    else if (name.includes("sistema") || name.includes("system"))
      module = "system";
    else {
      // Intentar extraer del formato "modulo.accion"
      const parts = permission.nombre.split(".");
      if (parts.length > 1) {
        module = parts[0];
      }
    }

    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Filtrar permisos
  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    // Usar el mismo mapeo inteligente para el filtro
    let module = "otros";
    const name = permission.nombre.toLowerCase();
    if (name.includes("dashboard")) module = "dashboard";
    else if (name.includes("usuario") || name.includes("user"))
      module = "users";
    else if (name.includes("rol") || name.includes("role")) module = "roles";
    else if (name.includes("permiso") || name.includes("permission"))
      module = "permissions";
    else if (name.includes("bitacora") || name.includes("log"))
      module = "bitacora";
    else if (name.includes("sistema") || name.includes("system"))
      module = "system";
    else {
      const parts = permission.nombre.split(".");
      if (parts.length > 1) {
        module = parts[0];
      }
    }

    const matchesModule = selectedModule === "all" || module === selectedModule;
    return matchesSearch && matchesModule;
  });

  // Obtener módulos únicos
  const modules = Object.keys(groupedPermissions).map((module) => ({
    name: module,
    icon: getModuleIcon(module),
    color: getModuleColor(module),
    permissions: groupedPermissions[module],
  }));

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando permisos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={loadPermissions} className={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.permissions}>
      <div className={styles.header}>
        <div>
          <h1>Permisos del Sistema</h1>
          <p>Gestiona los permisos disponibles en el sistema</p>
        </div>
        <div className={styles.headerActions}>
        <button
          onClick={() => setShowCreateModal(true)}
          className={styles.createButton}
        >
            <Plus size={20} />
          Nuevo Permiso
        </button>
          <button onClick={loadPermissions} className={styles.refreshButton}>
            <RefreshCw size={20} />
            Actualizar
          </button>
        </div>
      </div>

      <div className={styles.filters}>
          <div className={styles.searchBox}>
          <Search size={20} />
            <input
              type="text"
              placeholder="Buscar permisos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos los módulos</option>
          {modules.map((module) => (
            <option key={module.name} value={module.name}>
              {module.name.charAt(0).toUpperCase() + module.name.slice(1)}
            </option>
              ))}
            </select>

        <button className={styles.filterButton}>
          <Filter size={20} />
          Filtros
        </button>
          </div>
          
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "#3b82f6" }}
          >
            <Lock size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{permissions.length}</span>
            <span className={styles.statLabel}>Total Permisos</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "#10b981" }}
          >
            <Database size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{modules.length}</span>
            <span className={styles.statLabel}>Módulos</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "#f59e0b" }}
          >
            <Filter size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>
              {filteredPermissions.length}
            </span>
            <span className={styles.statLabel}>Filtrados</span>
          </div>
        </div>
      </div>

      <div className={styles.permissionsGrid}>
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <div key={module.name} className={styles.permissionCard}>
              <div className={styles.permissionHeader}>
                  <div 
                    className={styles.moduleIcon}
                  style={{ backgroundColor: module.color }}
                  >
                  <Icon size={24} />
                  </div>
                <div className={styles.moduleInfo}>
                  <h3 className={styles.moduleName}>
                    {module.name.charAt(0).toUpperCase() + module.name.slice(1)}
                  </h3>
                  <p className={styles.moduleCount}>
                    {module.permissions.length} permisos
                  </p>
                </div>
              </div>

              <div className={styles.permissionsList}>
                {module.permissions.map((permission) => {
                  const PermissionIcon = getPermissionIcon(permission.nombre);
                  const permissionColor = getPermissionColor(permission.nombre);
                  return (
                    <div key={permission.id} className={styles.permissionItem}>
                      <div
                        className={styles.permissionIcon}
                        style={{
                          background: `linear-gradient(135deg, ${permissionColor}20, ${permissionColor}10)`,
                          color: permissionColor,
                          border: `1px solid ${permissionColor}30`,
                        }}
                      >
                        <PermissionIcon size={20} />
                      </div>
                      <div className={styles.permissionInfo}>
                        <h4 className={styles.permissionName}>
                          {permission.nombre}
                        </h4>
                        <p className={styles.permissionDescription}>
                          {permission.descripcion}
                        </p>
                      </div>
                        <div className={styles.permissionActions}>
                          <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("=== EDIT BUTTON CLICKED ===");
                            console.log("Permission:", permission);
                            console.log("Permission ID:", permission.id);
                            console.log("Permission name:", permission.nombre);
                            console.log("Event:", e);
                            console.log("Target:", e.target);
                            console.log("Current target:", e.currentTarget);
                            openEditModal(permission);
                          }}
                          onMouseDown={(e) => {
                            console.log("=== EDIT BUTTON MOUSE DOWN ===");
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onMouseUp={(e) => {
                            console.log("=== EDIT BUTTON MOUSE UP ===");
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                            className={styles.actionButton}
                            title="Editar permiso"
                          style={{
                            pointerEvents: "auto",
                            cursor: "pointer",
                            zIndex: 9999,
                            position: "relative",
                          }}
                        >
                          <Edit size={16} />
                          </button>
                          <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("=== DELETE BUTTON CLICKED ===");
                            console.log("Permission:", permission);
                            console.log("Permission ID:", permission.id);
                            console.log("Permission name:", permission.nombre);
                            console.log("Event:", e);
                            console.log("Target:", e.target);
                            console.log("Current target:", e.currentTarget);
                            handleDeletePermission(permission.id);
                          }}
                          onMouseDown={(e) => {
                            console.log("=== DELETE BUTTON MOUSE DOWN ===");
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onMouseUp={(e) => {
                            console.log("=== DELETE BUTTON MOUSE UP ===");
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                            title="Eliminar permiso"
                          style={{
                            pointerEvents: "auto",
                            cursor: "pointer",
                            zIndex: 9999,
                            position: "relative",
                          }}
                        >
                          <Trash2 size={16} />
                          </button>
                        </div>
                    </div>
                  );
                })}
                      </div>
                    </div>
          );
        })}
      </div>

      {filteredPermissions.length === 0 && (
        <div className={styles.emptyState}>
          <Lock size={48} />
          <h3>No se encontraron permisos</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Modal Crear Permiso */}
      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Crear Nuevo Permiso</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {error && <div className={styles.errorMessage}>{error}</div>}
              <div className={styles.formGroup}>
                <label>Nombre del Permiso</label>
                <input
                  type="text"
                  value={newPermission.nombre}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      nombre: e.target.value,
                    })
                  }
                  placeholder="Ej: users.create"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Descripción</label>
                <textarea
                  value={newPermission.descripcion}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      descripcion: e.target.value,
                    })
                  }
                  placeholder="Descripción del permiso..."
                  className={styles.formTextarea}
                  rows={3}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowCreateModal(false)}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePermission}
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Permiso"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Permiso */}
      {showEditModal && selectedPermission && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Editar Permiso</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {error && <div className={styles.errorMessage}>{error}</div>}
              <div className={styles.formGroup}>
                <label>Nombre del Permiso</label>
                <input
                  type="text"
                  value={newPermission.nombre}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      nombre: e.target.value,
                    })
                  }
                  placeholder="Ej: users.create"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Descripción</label>
                <textarea
                  value={newPermission.descripcion}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      descripcion: e.target.value,
                    })
                  }
                  placeholder="Descripción del permiso..."
                  className={styles.formTextarea}
                  rows={3}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowEditModal(false)}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button 
                onClick={handleEditPermission}
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar Permiso"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
