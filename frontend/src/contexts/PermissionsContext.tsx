import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

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
}

interface User {
  id: string
  username: string
  email: string
  role: Role
  isActive: boolean
}

interface PermissionsContextType {
  user: User | null
  hasPermission: (permissionId: string) => boolean
  hasAnyPermission: (permissionIds: string[]) => boolean
  hasAllPermissions: (permissionIds: string[]) => boolean
  userPermissions: string[]
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

interface PermissionsProviderProps {
  children: ReactNode
  user: any // Usuario del AuthContext
}

// Roles predefinidos del sistema
const SYSTEM_ROLES: Record<string, Role> = {
  'super_admin': {
    id: 'super_admin',
    name: 'Super Administrador',
    description: 'Acceso completo al sistema',
    permissions: [
      'system.admin',
      'dashboard.view',
      'users.view', 'users.create', 'users.edit', 'users.delete',
      'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
      'clients.view', 'clients.create', 'clients.edit', 'clients.delete',
      'reports.view', 'reports.export'
    ]
  },
  'admin': {
    id: 'admin',
    name: 'Administrador',
    description: 'Gestión de usuarios y clientes',
    permissions: [
      'dashboard.view',
      'users.view', 'users.create', 'users.edit',
      'roles.view',
      'clients.view', 'clients.create', 'clients.edit',
      'reports.view'
    ]
  },
  'trainer': {
    id: 'trainer',
    name: 'Entrenador',
    description: 'Gestión básica de clientes',
    permissions: [
      'dashboard.view',
      'clients.view', 'clients.edit'
    ]
  },
  
}

export function PermissionsProvider({ children, user }: PermissionsProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    if (user) {
      // Determinar el rol basado en el usuario
      let roleKey = 'admin' // rol por defecto
      
      if (user.username === 'admin') {
        roleKey = 'super_admin'
      } else if (user.role) {
        roleKey = user.role
      }

      const role = SYSTEM_ROLES[roleKey] || SYSTEM_ROLES.admin

      setCurrentUser({
        id: user.id || '1',
        username: user.username,
        email: user.email || `${user.username}@gym.com`,
        role: role,
        isActive: true
      })
    } else {
      setCurrentUser(null)
    }
  }, [user])

  const hasPermission = (permissionId: string): boolean => {
    if (!currentUser) return false
    return currentUser.role.permissions.includes(permissionId)
  }

  const hasAnyPermission = (permissionIds: string[]): boolean => {
    if (!currentUser) return false
    return permissionIds.some(permissionId => 
      currentUser.role.permissions.includes(permissionId)
    )
  }

  const hasAllPermissions = (permissionIds: string[]): boolean => {
    if (!currentUser) return false
    return permissionIds.every(permissionId => 
      currentUser.role.permissions.includes(permissionId)
    )
  }

  const userPermissions = currentUser ? currentUser.role.permissions : []

  const value: PermissionsContextType = {
    user: currentUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions
  }

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}

// Componente para mostrar contenido condicionalmente basado en permisos
interface ProtectedComponentProps {
  children: ReactNode
  permission?: string
  permissions?: string[]
  requireAll?: boolean
  fallback?: ReactNode
}

export function ProtectedComponent({ 
  children, 
  permission, 
  permissions = [], 
  requireAll = false, 
  fallback = null 
}: ProtectedComponentProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(permission)
  } else if (permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
  } else {
    hasAccess = true // Si no se especifican permisos, mostrar por defecto
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

// Hook para verificar permisos de manera más simple
export function useHasPermission(permissionId: string): boolean {
  const { hasPermission } = usePermissions()
  return hasPermission(permissionId)
}

export function useHasAnyPermission(permissionIds: string[]): boolean {
  const { hasAnyPermission } = usePermissions()
  return hasAnyPermission(permissionIds)
}

export function useHasAllPermissions(permissionIds: string[]): boolean {
  const { hasAllPermissions } = usePermissions()
  return hasAllPermissions(permissionIds)
}