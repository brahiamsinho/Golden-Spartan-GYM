import { useState } from 'react'
import { Shield, Edit, Trash2, Plus, Check, X, Users, Lock, Search, Calendar, Activity } from 'lucide-react'
import styles from './RolesPage.module.css'

interface Permission {
  id: string
  name: string
  description: string
  module: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  usersCount: number
  isActive: boolean
  createdAt: string
}

const AVAILABLE_PERMISSIONS: Permission[] = [
  // Dashboard y Sistema
  { id: 'dashboard.view', name: 'Ver Dashboard', description: 'Acceso al panel principal del sistema', module: 'Dashboard' },
  { id: 'system.admin', name: 'Administrador del Sistema', description: 'Acceso completo a todas las funciones', module: 'Sistema' },
  
  // Usuarios
  { id: 'users.view', name: 'Ver Usuarios', description: 'Ver lista de usuarios del sistema', module: 'Usuarios' },
  { id: 'users.create', name: 'Crear Usuarios', description: 'Registrar nuevos usuarios', module: 'Usuarios' },
  { id: 'users.edit', name: 'Editar Usuarios', description: 'Modificar información de usuarios', module: 'Usuarios' },
  { id: 'users.delete', name: 'Eliminar Usuarios', description: 'Eliminar usuarios del sistema', module: 'Usuarios' },
  
  // Clientes
  { id: 'clients.view', name: 'Ver Clientes', description: 'Ver lista de clientes del gimnasio', module: 'Clientes' },
  { id: 'clients.create', name: 'Crear Clientes', description: 'Registrar nuevos clientes', module: 'Clientes' },
  { id: 'clients.edit', name: 'Editar Clientes', description: 'Modificar información de clientes', module: 'Clientes' },
  { id: 'clients.delete', name: 'Eliminar Clientes', description: 'Eliminar clientes del sistema', module: 'Clientes' },
  
  // Roles y Permisos
  { id: 'roles.view', name: 'Ver Roles', description: 'Ver lista de roles del sistema', module: 'Roles' },
  { id: 'roles.create', name: 'Crear Roles', description: 'Crear nuevos roles', module: 'Roles' },
  { id: 'roles.edit', name: 'Editar Roles', description: 'Modificar roles existentes', module: 'Roles' },
  { id: 'roles.delete', name: 'Eliminar Roles', description: 'Eliminar roles del sistema', module: 'Roles' },
  
  // Reportes
  { id: 'reports.view', name: 'Ver Reportes', description: 'Acceso a reportes y estadísticas', module: 'Reportes' },
  { id: 'reports.export', name: 'Exportar Reportes', description: 'Descargar reportes en diferentes formatos', module: 'Reportes' },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Administrador',
      description: 'Acceso completo al sistema',
      permissions: AVAILABLE_PERMISSIONS.map(p => p.id),
      usersCount: 1,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Administrador',
      description: 'Gestión de usuarios y clientes',
      permissions: ['dashboard.view', 'users.view', 'users.create', 'users.edit', 'clients.view', 'clients.create', 'clients.edit', 'reports.view'],
      usersCount: 3,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Entrenador',
      description: 'Gestión básica de clientes',
      permissions: ['dashboard.view', 'clients.view', 'clients.edit'],
      usersCount: 5,
      isActive: true,
      createdAt: '2024-01-20'
    },
  
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  })

  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = []
    }
    acc[permission.module].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateRole = () => {
    if (!newRole.name.trim()) return

    const role: Role = {
      id: (roles.length + 1).toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      usersCount: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setRoles([...roles, role])
    setNewRole({ name: '', description: '', permissions: [] })
    setShowCreateModal(false)
  }

  const handleEditRole = () => {
    if (!selectedRole || !newRole.name.trim()) return

    setRoles(roles.map(role =>
      role.id === selectedRole.id
        ? { ...role, name: newRole.name, description: newRole.description, permissions: newRole.permissions }
        : role
    ))
    setShowEditModal(false)
    setSelectedRole(null)
    setNewRole({ name: '', description: '', permissions: [] })
  }

  const handleDeleteRole = () => {
    if (!selectedRole) return

    if (selectedRole.usersCount > 0) {
      alert('No se puede eliminar un rol que tiene usuarios asignados')
      return
    }

    setRoles(roles.filter(role => role.id !== selectedRole.id))
    setShowDeleteModal(false)
    setSelectedRole(null)
  }

  const toggleRoleStatus = (roleId: string) => {
    setRoles(roles.map(role =>
      role.id === roleId
        ? { ...role, isActive: !role.isActive }
        : role
    ))
  }

  const openEditModal = (role: Role) => {
    setSelectedRole(role)
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (role: Role) => {
    setSelectedRole(role)
    setShowDeleteModal(true)
  }

  const togglePermission = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const getPermissionName = (permissionId: string) => {
    const permission = AVAILABLE_PERMISSIONS.find(p => p.id === permissionId)
    return permission ? permission.name : permissionId
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
              <span className={styles.statValue}>{roles.filter(r => r.isActive).length}</span>
              <span className={styles.statLabel}>Activos</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rolesGrid}>
        {filteredRoles.map((role) => (
          <div key={role.id} className={`${styles.roleCard} ${!role.isActive ? styles.inactive : ''}`}>
            <div className={styles.roleHeader}>
              <div className={styles.roleInfo}>
                <h3 className={styles.roleName}>{role.name}</h3>
                <p className={styles.roleDescription}>{role.description}</p>
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
                  onClick={() => toggleRoleStatus(role.id)}
                  className={`${styles.actionButton} ${role.isActive ? styles.deactivate : styles.activate}`}
                  title={role.isActive ? 'Desactivar' : 'Activar'}
                >
                  {role.isActive ? <X size={16} /> : <Check size={16} />}
                </button>
                <button
                  onClick={() => openDeleteModal(role)}
                  className={`${styles.actionButton} ${styles.delete}`}
                  title="Eliminar rol"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className={styles.roleStats}>
              <div className={styles.roleStat}>
                <Users size={16} />
                <span>{role.usersCount} usuarios</span>
              </div>
              <div className={styles.roleStat}>
                <Lock size={16} />
                <span>{role.permissions.length} permisos</span>
              </div>
              <div className={styles.roleStatus}>
                <span className={`${styles.statusBadge} ${role.isActive ? styles.active : styles.inactive}`}>
                  {role.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className={styles.permissionsPreview}>
              <h4 className={styles.permissionsTitle}>Permisos asignados:</h4>
              <div className={styles.permissionsList}>
                {role.permissions.slice(0, 3).map(permissionId => (
                  <span key={permissionId} className={styles.permissionTag}>
                    {getPermissionName(permissionId)}
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span className={styles.morePermissions}>
                    +{role.permissions.length - 3} más
                  </span>
                )}
              </div>
            </div>

            <div className={styles.roleFooter}>
              <div className={styles.createdDate}>
                <Calendar size={12} />
                <span>Creado: {new Date(role.createdAt).toLocaleDateString()}</span>
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
              <button onClick={() => setShowCreateModal(false)} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre del Rol *</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  className={styles.input}
                  placeholder="Ej: Administrador de Ventas"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  className={styles.textarea}
                  placeholder="Descripción del rol y sus responsabilidades"
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Permisos</label>
                <div className={styles.permissionsContainer}>
                  {Object.entries(groupedPermissions).map(([module, permissions]) => (
                    <div key={module} className={styles.permissionModule}>
                      <h4 className={styles.moduleTitle}>{module}</h4>
                      <div className={styles.modulePermissions}>
                        {permissions.map(permission => (
                          <label key={permission.id} className={styles.permissionItem}>
                            <input
                              type="checkbox"
                              checked={newRole.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className={styles.checkbox}
                            />
                            <div className={styles.permissionInfo}>
                              <span className={styles.permissionName}>{permission.name}</span>
                              <span className={styles.permissionDescription}>{permission.description}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setShowCreateModal(false)} className={styles.cancelButton}>
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
              <button onClick={() => setShowEditModal(false)} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre del Rol *</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Permisos</label>
                <div className={styles.permissionsContainer}>
                  {Object.entries(groupedPermissions).map(([module, permissions]) => (
                    <div key={module} className={styles.permissionModule}>
                      <h4 className={styles.moduleTitle}>{module}</h4>
                      <div className={styles.modulePermissions}>
                        {permissions.map(permission => (
                          <label key={permission.id} className={styles.permissionItem}>
                            <input
                              type="checkbox"
                              checked={newRole.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className={styles.checkbox}
                            />
                            <div className={styles.permissionInfo}>
                              <span className={styles.permissionName}>{permission.name}</span>
                              <span className={styles.permissionDescription}>{permission.description}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setShowEditModal(false)} className={styles.cancelButton}>
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
              <button onClick={() => setShowDeleteModal(false)} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.deleteWarning}>
                <div className={styles.warningIcon}>⚠️</div>
                <div>
                  <p>¿Estás seguro de que quieres eliminar el rol <strong>"{selectedRole.name}"</strong>?</p>
                  {selectedRole.usersCount > 0 ? (
                    <p className={styles.errorText}>
                      Este rol tiene {selectedRole.usersCount} usuarios asignados. No se puede eliminar.
                    </p>
                  ) : (
                    <p>Esta acción no se puede deshacer.</p>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setShowDeleteModal(false)} className={styles.cancelButton}>
                Cancelar
              </button>
              <button 
                onClick={handleDeleteRole} 
                className={styles.deleteButton}
                disabled={selectedRole.usersCount > 0}
              >
                <Trash2 size={16} />
                Eliminar Rol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}