import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  User,
  Clock,
} from "lucide-react";
import RegisterUserModal from "../components/modals/RegisterUserModal";
import EditUserModal from "../components/modals/EditUserModal";
import apiService from "../services/api";
import styles from "./UsersPage.module.css";

interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string | null;
  last_login: string | null;
  roles?: { id: number; nombre: string }[];
  permisos?: string[];
}

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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Cargar usuarios del backend
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUsers(page, 10);

      if (response.results) {
        // Respuesta paginada
        setUsuarios(response.results);
        setPagination({
          currentPage: response.current_page,
          totalPages: response.total_pages,
          totalCount: response.count,
          hasNext: response.has_next,
          hasPrevious: response.has_previous,
        });
      } else {
        // Respuesta sin paginación (fallback)
        setUsuarios(response);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCount: response.length,
          hasNext: false,
          hasPrevious: false,
        });
      }
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError(
        "Error al cargar usuarios. Verifica que el backend esté ejecutándose."
      );
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserRegistered = async (newUser: UserFormData) => {
    try {
      // Obtener roles disponibles
      const roles = await apiService.getRoles();

      const selectedRole = roles.find((r: any) => r.nombre === newUser.role);

      if (!selectedRole) {
        throw new Error(`Rol '${newUser.role}' no encontrado`);
      }

      // Crear usuario en el backend
      const userData = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        rol: selectedRole.id, // ID del rol
      };

      const createdUser = await apiService.createUser(userData);

      // Recargar la lista de usuarios
      await loadUsers();
    } catch (error) {
      console.error("Error creando usuario:", error);
      setError(
        `Error al crear usuario: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  };

  const handleEditUser = (user: Usuario) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      return;
    }

    try {
      await apiService.deleteUser(userId.toString());
      await loadUsers();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      setError("Error al eliminar usuario");
    }
  };

  const handleUserUpdated = async () => {
    await loadUsers();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Administrador":
        return "#ef4444";
      case "Administrador":
        return "#3b82f6";
      case "Instructor":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "#10b981" : "#6b7280";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Activo" : "Inactivo";
  };

  const getDisplayName = (usuario: Usuario) => {
    return (
      `${usuario.first_name} ${usuario.last_name}`.trim() || usuario.username
    );
  };

  const getPrimaryRole = (usuario: Usuario) => {
    return usuario.roles && usuario.roles.length > 0
      ? usuario.roles[0].nombre
      : "Sin rol";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("es-ES");
    } catch {
      return "N/A";
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Nunca";
      return date.toLocaleString("es-ES");
    } catch {
      return "Nunca";
    }
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const displayName = getDisplayName(usuario);
    const primaryRole = getPrimaryRole(usuario);

    const matchesSearch =
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      primaryRole.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterRole === "all" || primaryRole === filterRole;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className={styles.users}>
        <div className={styles.header}>
          <div>
            <h1>Usuarios Administrativos</h1>
            <p>Cargando usuarios...</p>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div>Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.users}>
      <div className={styles.header}>
        <div>
          <h1>Usuarios Administrativos</h1>
          <p>Gestiona los usuarios del sistema y sus permisos</p>
          {error && (
            <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>{error}</p>
          )}
        </div>
        <button
          className={styles.addButton}
          onClick={() => setShowRegisterModal(true)}
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar usuarios por nombre, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Todos los roles</option>
          <option value="Super Administrador">Super Administrador</option>
          <option value="Administrador">Administrador</option>
          <option value="Gerente">Gerente</option>
          <option value="Instructor">Instructor</option>
        </select>

        <button className={styles.filterButton}>
          <Filter size={20} />
          Más filtros
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol y Permisos</th>
              <th>Estado</th>
              <th>Último Acceso</th>
              <th>Sesiones</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario) => {
              const displayName = getDisplayName(usuario);
              const primaryRole = getPrimaryRole(usuario);
              const lastLogin = formatDateTime(usuario.last_login);
              const dateJoined = formatDate(usuario.date_joined);

              return (
                <tr key={usuario.id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        <User size={20} />
                      </div>
                      <div>
                        <div className={styles.userName}>{displayName}</div>
                        <div className={styles.userEmail}>{usuario.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.roleInfo}>
                      <span
                        className={styles.role}
                        style={{ backgroundColor: getRoleColor(primaryRole) }}
                      >
                        <Shield size={14} />
                        {primaryRole}
                      </span>
                      <div className={styles.permissions}>
                        {usuario.permisos &&
                          usuario.permisos.slice(0, 2).map((permiso, index) => (
                            <span key={index} className={styles.permission}>
                              {permiso}
                            </span>
                          ))}
                        {usuario.permisos && usuario.permisos.length > 2 && (
                          <span className={styles.morePermissions}>
                            +{usuario.permisos.length - 2} más
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={styles.status}
                      style={{
                        backgroundColor: getStatusColor(usuario.is_active),
                      }}
                    >
                      {getStatusText(usuario.is_active)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.lastAccess}>
                      <Clock size={14} />
                      <div>
                        <div>{lastLogin}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.sessions}>
                      <span
                        className={`${styles.sessionBadge} ${
                          usuario.is_active ? styles.active : styles.inactive
                        }`}
                      >
                        {usuario.is_active ? "1 activa" : "0 activas"}
                      </span>
                    </div>
                  </td>
                  <td>{dateJoined}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEditUser(usuario)}
                        className={styles.actionButton}
                        title="Editar usuario"
                        disabled={usuario.username === "admin"}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(usuario.id)}
                        className={styles.actionButton}
                        title="Eliminar usuario"
                        disabled={usuario.username === "admin"}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        className={styles.actionButton}
                        title="Más opciones"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span>
          Mostrando {usuarios.length} de {pagination.totalCount} usuarios
        </span>
        <div className={styles.paginationButtons}>
          <button
            onClick={() => loadUsers(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevious}
          >
            Anterior
          </button>

          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => loadUsers(pageNum)}
                  className={
                    pageNum === pagination.currentPage ? styles.active : ""
                  }
                >
                  {pageNum}
                </button>
              );
            }
          )}

          <button
            onClick={() => loadUsers(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Siguiente
          </button>
        </div>
      </div>

      <RegisterUserModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onUserRegistered={handleUserRegistered}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}
