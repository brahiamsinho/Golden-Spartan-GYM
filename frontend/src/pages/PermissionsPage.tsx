import { useState } from 'react'
import { Lock, Search, Filter, Users, Shield, Settings, Database, BarChart, Edit, Trash2, Plus, X } from 'lucide-react'
import styles from './PermissionsPage.module.css'

interface Permission {
  id: string
  name: string
  description: string
  module: string
  isSystem: boolean
  usedInRoles: number
  createdAt: string
}

interface Module {
  name: string
  icon: any
  color: string
  permissions: Permission[]
}

const PERMISSIONS_DATA: Permission[] = [
  // Dashboard y Sistema
  { id: 'dashboard.view', name: 'Ver Dashboard', description: 'Acceso al panel principal del sistema', module: 'Dashboard', isSystem: true, usedInRoles: 4, createdAt: '2024-01-01' },
  { id: 'system.admin', name: 'Administrador del Sistema', description: 'Acceso completo a todas las funciones', module: 'Sistema', isSystem: true, usedInRoles: 1, createdAt: '2024-01-01' },
  
  // Usuarios
  { id: 'users.view', name: 'Ver Usuarios', description: 'Ver lista de usuarios del sistema', module: 'Usuarios', isSystem: false, usedInRoles: 3, createdAt: '2024-01-01' },
  { id: 'users.create', name: 'Crear Usuarios', description: 'Registrar nuevos usuarios', module: 'Usuarios', isSystem: false, usedInRoles: 2, createdAt: '2024-01-01' },
  { id: 'users.edit', name: 'Editar Usuarios', description: 'Modificar información de usuarios', module: 'Usuarios', isSystem: false, usedInRoles: 2, createdAt: '2024-01-01' },
  { id: 'users.delete', name: 'Eliminar Usuarios', description: 'Eliminar usuarios del sistema', module: 'Usuarios', isSystem: false, usedInRoles: 1, createdAt: '2024-01-01' },
  
  // Clientes
  { id: 'clients.view', name: 'Ver Clientes', description: 'Ver lista de clientes del gimnasio', module: 'Clientes', isSystem: false, usedInRoles: 4, createdAt: '2024-01-01' },
  { id: 'clients.create', name: 'Crear Clientes', description: 'Registrar nuevos clientes', module: 'Clientes', isSystem: false, usedInRoles: 3, createdAt: '2024-01-01' },
  { id: 'clients.edit', name: 'Editar Clientes', description: 'Modificar información de clientes', module: 'Clientes', isSystem: false, usedInRoles: 3, createdAt: '2024-01-01' },
  { id: 'clients.delete', name: 'Eliminar Clientes', description: 'Eliminar clientes del sistema', module: 'Clientes', isSystem: false, usedInRoles: 1, createdAt: '2024-01-01' },
  
  // Roles y Permisos
  { id: 'roles.view', name: 'Ver Roles', description: 'Ver lista de roles del sistema', module: 'Roles', isSystem: false, usedInRoles: 2, createdAt: '2024-01-01' },
  { id: 'roles.create', name: 'Crear Roles', description: 'Crear nuevos roles', module: 'Roles', isSystem: false, usedInRoles: 1, createdAt: '2024-01-01' },
  { id: 'roles.edit', name: 'Editar Roles', description: 'Modificar roles existentes', module: 'Roles', isSystem: false, usedInRoles: 1, createdAt: '2024-01-01' },
  { id: 'roles.delete', name: 'Eliminar Roles', description: 'Eliminar roles del sistema', module: 'Roles', isSystem: false, usedInRoles: 1, createdAt: '2024-01-01' },
  
  // Reportes
  { id: 'reports.view', name: 'Ver Reportes', description: 'Acceso a reportes y estadísticas', module: 'Reportes', isSystem: false, usedInRoles: 2, createdAt: '2024-01-01' },
  { id: 'reports.export', name: 'Exportar Reportes', description: 'Descargar reportes en diferentes formatos', module: 'Reportes', isSystem: false, usedInRoles: 1, createdAt: '2024-01-01' },
]

const MODULE_ICONS: Record<string, { icon: React.ComponentType<any>, color: string }> = {
  'Dashboard': { icon: BarChart, color: '#3b82f6' },
  'Sistema': { icon: Settings, color: '#ef4444' },
  'Usuarios': { icon: Users, color: '#22c55e' },
  'Clientes': { icon: Users, color: '#8b5cf6' },
  'Roles': { icon: Shield, color: '#f59e0b' },
  'Reportes': { icon: Database, color: '#06b6d4' },
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>(PERMISSIONS_DATA)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedModule, setSelectedModule] = useState<string>('all')
  const [showSystemPermissions, setShowSystemPermissions] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [newPermission, setNewPermission] = useState({
    name: '',
    description: '',
    module: 'Usuarios',
    id: ''
  })

  // Filtrar permisos
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.module.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesModule = selectedModule === 'all' || permission.module === selectedModule
    const matchesSystemFilter = showSystemPermissions || !permission.isSystem
    
    return matchesSearch && matchesModule && matchesSystemFilter
  })

  // Agrupar permisos por módulo
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = []
    }
    acc[permission.module].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const modules = Array.from(new Set(permissions.map(p => p.module)))
  const totalPermissions = permissions.length
  const systemPermissions = permissions.filter(p => p.isSystem).length
  const customPermissions = permissions.filter(p => !p.isSystem).length

  const handleCreatePermission = () => {
    if (!newPermission.name.trim() || !newPermission.description.trim()) return

    const permission: Permission = {
      id: newPermission.id || `${newPermission.module.toLowerCase()}.${newPermission.name.toLowerCase().replace(/\s+/g, '_')}`,
      name: newPermission.name,
      description: newPermission.description,
      module: newPermission.module,
      isSystem: false,
      usedInRoles: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setPermissions([...permissions, permission])
    setNewPermission({ name: '', description: '', module: 'Usuarios', id: '' })
    setShowCreateModal(false)
  }

  const handleEditPermission = () => {
    if (!selectedPermission || !newPermission.name.trim()) return

    setPermissions(permissions.map(permission =>
      permission.id === selectedPermission.id
        ? { ...permission, name: newPermission.name, description: newPermission.description, module: newPermission.module }
        : permission
    ))
    setShowEditModal(false)
    setSelectedPermission(null)
    setNewPermission({ name: '', description: '', module: 'Usuarios', id: '' })
  }

  const handleDeletePermission = () => {
    if (!selectedPermission) return

    if (selectedPermission.isSystem) {
      alert('No se pueden eliminar permisos del sistema')
      return
    }

    if (selectedPermission.usedInRoles > 0) {
      alert('No se puede eliminar un permiso que está siendo usado en roles')
      return
    }

    setPermissions(permissions.filter(permission => permission.id !== selectedPermission.id))
    setShowDeleteModal(false)
    setSelectedPermission(null)
  }

  const openEditModal = (permission: Permission) => {
    setSelectedPermission(permission)
    setNewPermission({
      name: permission.name,
      description: permission.description,
      module: permission.module,
      id: permission.id
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (permission: Permission) => {
    setSelectedPermission(permission)
    setShowDeleteModal(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <Lock className={styles.titleIcon} />
            Gestión de Permisos
          </h1>
          <p className={styles.subtitle}>
            Administrar permisos del sistema y sus asignaciones
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={styles.createButton}
        >
          <Plus size={16} />
          Nuevo Permiso
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <Lock className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalPermissions}</span>
            <span className={styles.statLabel}>Total Permisos</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Settings className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{systemPermissions}</span>
            <span className={styles.statLabel}>Sistema</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Edit className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{customPermissions}</span>
            <span className={styles.statLabel}>Personalizados</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Shield className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{modules.length}</span>
            <span className={styles.statLabel}>Módulos</span>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar permisos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <Filter className={styles.filterIcon} />
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos los módulos</option>
              {modules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
          </div>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showSystemPermissions}
              onChange={(e) => setShowSystemPermissions(e.target.checked)}
              className={styles.checkbox}
            />
            <span>Mostrar permisos del sistema</span>
          </label>
        </div>
      </div>

      <div className={styles.permissionsContainer}>
        {Object.entries(groupedPermissions).map(([moduleName, modulePermissions]) => {
          const moduleInfo = MODULE_ICONS[moduleName] || { icon: Lock, color: '#6b7280' }
          const ModuleIcon = moduleInfo.icon

          return (
            <div key={moduleName} className={styles.moduleSection}>
              <div className={styles.moduleHeader}>
                <div className={styles.moduleTitle}>
                  <div 
                    className={styles.moduleIcon}
                    style={{ backgroundColor: moduleInfo.color + '20', color: moduleInfo.color }}
                  >
                    <ModuleIcon size={20} />
                  </div>
                  <h3>{moduleName}</h3>
                  <span className={styles.permissionCount}>
                    {modulePermissions.length} permiso{modulePermissions.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className={styles.permissionsGrid}>
                {modulePermissions.map((permission) => (
                  <div key={permission.id} className={`${styles.permissionCard} ${permission.isSystem ? styles.systemPermission : ''}`}>
                    <div className={styles.permissionHeader}>
                      <div className={styles.permissionInfo}>
                        <h4 className={styles.permissionName}>
                          {permission.isSystem && <Settings size={14} className={styles.systemIcon} />}
                          {permission.name}
                        </h4>
                        <p className={styles.permissionDescription}>{permission.description}</p>
                      </div>
                      
                      {!permission.isSystem && (
                        <div className={styles.permissionActions}>
                          <button
                            onClick={() => openEditModal(permission)}
                            className={styles.actionButton}
                            title="Editar permiso"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(permission)}
                            className={`${styles.actionButton} ${styles.delete}`}
                            title="Eliminar permiso"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className={styles.permissionFooter}>
                      <div className={styles.permissionMeta}>
                        <span className={styles.permissionId}>ID: {permission.id}</span>
                        <span className={styles.usageInfo}>
                          <Shield size={12} />
                          Usado en {permission.usedInRoles} rol{permission.usedInRoles !== 1 ? 'es' : ''}
                        </span>
                      </div>
                      
                      <div className={styles.permissionBadges}>
                        {permission.isSystem ? (
                          <span className={styles.systemBadge}>Sistema</span>
                        ) : (
                          <span className={styles.customBadge}>Personalizado</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Crear Permiso */}
      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Crear Nuevo Permiso</h2>
              <button onClick={() => setShowCreateModal(false)} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre del Permiso *</label>
                <input
                  type="text"
                  value={newPermission.name}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, name: e.target.value }))}
                  className={styles.input}
                  placeholder="Ej: Ver Reportes de Ventas"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>ID del Permiso</label>
                <input
                  type="text"
                  value={newPermission.id}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, id: e.target.value }))}
                  className={styles.input}
                  placeholder="Ej: reports.sales.view (opcional, se genera automáticamente)"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción *</label>
                <textarea
                  value={newPermission.description}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, description: e.target.value }))}
                  className={styles.textarea}
                  placeholder="Descripción detallada del permiso"
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Módulo *</label>
                <select
                  value={newPermission.module}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, module: e.target.value }))}
                  className={styles.select}
                >
                  {modules.map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setShowCreateModal(false)} className={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={handleCreatePermission} className={styles.saveButton}>
                <Plus size={16} />
                Crear Permiso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Permiso */}
      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Editar Permiso</h2>
              <button onClick={() => setShowEditModal(false)} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre del Permiso *</label>
                <input
                  type="text"
                  value={newPermission.name}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, name: e.target.value }))}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción *</label>
                <textarea
                  value={newPermission.description}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, description: e.target.value }))}
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Módulo *</label>
                <select
                  value={newPermission.module}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, module: e.target.value }))}
                  className={styles.select}
                >
                  {modules.map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setShowEditModal(false)} className={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={handleEditPermission} className={styles.saveButton}>
                <Edit size={16} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Permiso */}
      {showDeleteModal && selectedPermission && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Eliminar Permiso</h2>
              <button onClick={() => setShowDeleteModal(false)} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.deleteWarning}>
                <div className={styles.warningIcon}>⚠️</div>
                <div>
                  <p>¿Estás seguro de que quieres eliminar el permiso <strong>"{selectedPermission.name}"</strong>?</p>
                  {selectedPermission.usedInRoles > 0 ? (
                    <p className={styles.errorText}>
                      Este permiso está siendo usado en {selectedPermission.usedInRoles} roles. No se puede eliminar.
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
                onClick={handleDeletePermission} 
                className={styles.deleteButton}
                disabled={selectedPermission.usedInRoles > 0 || selectedPermission.isSystem}
              >
                <Trash2 size={16} />
                Eliminar Permiso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}