import { useState } from "react"
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, Shield, User, Clock } from "lucide-react"
import RegisterUserModal from "../components/modals/RegisterUserModal"
import styles from "./UsersPage.module.css"

interface Usuario {
  id: number
  nombre: string
  email: string
  rol: string
  permisos: string[]
  ultimoAcceso: string
  estado: "activo" | "inactivo" | "bloqueado"
  fechaCreacion: string
  sesionesActivas: number
}

interface UserFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: 'administrador' | 'entrenador' 
  firstName: string
  lastName: string
  phone: string
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: "Admin Principal",
      email: "admin@goldenspartan.com",
      rol: "Super Administrador",
      permisos: ["Gestión Completa", "Configuración", "Usuarios", "Reportes"],
      ultimoAcceso: "2024-10-02 09:15:23",
      estado: "activo",
      fechaCreacion: "2023-01-01",
      sesionesActivas: 1
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria.garcia@goldenspartan.com",
      rol: "Administrador",
      permisos: ["Gestión Clientes", "Membresías", "Clases"],
      ultimoAcceso: "2024-10-02 08:30:15",
      estado: "activo",
      fechaCreacion: "2024-01-15",
      sesionesActivas: 1
    },
   
    {
      id: 4,
      nombre: "Ana Martín",
      email: "ana.martin@goldenspartan.com",
      rol: "Gerente",
      permisos: ["Reportes", "Inventario", "Personal"],
      ultimoAcceso: "2024-10-02 07:20:30",
      estado: "activo",
      fechaCreacion: "2023-11-10",
      sesionesActivas: 0
    },
    {
      id: 5,
      nombre: "Pedro Silva",
      email: "pedro.silva@goldenspartan.com",
      rol: "Instructor",
      permisos: ["Gestión Clases", "Rutinas"],
      ultimoAcceso: "2024-09-28 16:30:00",
      estado: "inactivo",
      fechaCreacion: "2024-03-05",
      sesionesActivas: 0
    }
  ])

  const handleUserRegistered = (newUser: UserFormData) => {
    const newUsuario: Usuario = {
      id: usuarios.length + 1,
      nombre: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      rol: newUser.role === 'administrador' ? 'Administrador' : 
           newUser.role === 'entrenador' ? 'Entrenador' : 'Instructor',//corregir
      permisos: newUser.role === 'administrador' ? ['Gestión Completa'] : 
                newUser.role === 'entrenador' ? ['Gestión Clientes', 'Clases'] : 
                ['Gestión Clientes'],
      ultimoAcceso: 'Nunca',
      estado: "activo",
      fechaCreacion: new Date().toISOString().split('T')[0],
      sesionesActivas: 0
    }
    setUsuarios(prev => [...prev, newUsuario])
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Administrador": return "#ef4444"
      case "Administrador": return "#3b82f6"
      case "Instructor": return "#f59e0b"
      default: return "#6b7280"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo": return "#10b981"
      case "inactivo": return "#6b7280"
      case "bloqueado": return "#ef4444"
      default: return "#6b7280"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "activo": return "Activo"
      case "inactivo": return "Inactivo"
      case "bloqueado": return "Bloqueado"
      default: return status
    }
  }

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterRole === "all" || usuario.rol === filterRole
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className={styles.users}>
      <div className={styles.header}>
        <div>
          <h1>Usuarios Administrativos</h1>
          <p>Gestiona los usuarios del sistema y sus permisos</p>
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
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      <User size={20} />
                    </div>
                    <div>
                      <div className={styles.userName}>{usuario.nombre}</div>
                      <div className={styles.userEmail}>{usuario.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.roleInfo}>
                    <span 
                      className={styles.role}
                      style={{ backgroundColor: getRoleColor(usuario.rol) }}
                    >
                      <Shield size={14} />
                      {usuario.rol}
                    </span>
                    <div className={styles.permissions}>
                      {usuario.permisos.slice(0, 2).map((permiso, index) => (
                        <span key={index} className={styles.permission}>
                          {permiso}
                        </span>
                      ))}
                      {usuario.permisos.length > 2 && (
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
                    style={{ backgroundColor: getStatusColor(usuario.estado) }}
                  >
                    {getStatusText(usuario.estado)}
                  </span>
                </td>
                <td>
                  <div className={styles.lastAccess}>
                    <Clock size={14} />
                    <div>
                      <div>{usuario.ultimoAcceso.split(' ')[0]}</div>
                      <div className={styles.time}>{usuario.ultimoAcceso.split(' ')[1]}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.sessions}>
                    <span className={`${styles.sessionBadge} ${usuario.sesionesActivas > 0 ? styles.active : styles.inactive}`}>
                      {usuario.sesionesActivas} activa{usuario.sesionesActivas !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                <td>{new Date(usuario.fechaCreacion).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionButton} title="Editar usuario">
                      <Edit size={16} />
                    </button>
                    <button className={styles.actionButton} title="Eliminar usuario">
                      <Trash2 size={16} />
                    </button>
                    <button className={styles.actionButton} title="Más opciones">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span>Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios</span>
        <div className={styles.paginationButtons}>
          <button>Anterior</button>
          <button className={styles.active}>1</button>
          <button>2</button>
          <button>3</button>
          <button>Siguiente</button>
        </div>
      </div>

      <RegisterUserModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onUserRegistered={handleUserRegistered}
      />
    </div>
  )
}