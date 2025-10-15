import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
}

interface PermissionsContextType {
  user: User | null;
  hasPermission: (permissionId: string) => boolean;
  hasAnyPermission: (permissionIds: string[]) => boolean;
  hasAllPermissions: (permissionIds: string[]) => boolean;
  userPermissions: string[];
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

interface PermissionsProviderProps {
  children: ReactNode;
  user: any; // Usuario del AuthContext
}

// Roles predefinidos del sistema
const SYSTEM_ROLES: Record<string, Role> = {
  "Super Administrador": {
    id: "super_admin",
    name: "Super Administrador",
    description: "Acceso completo al sistema",
    permissions: [
      "Ver Dashboard",
      "Ver Usuarios",
      "Crear Usuario",
      "Editar Usuario",
      "Eliminar Usuario",
      "Ver Roles",
      "Crear Rol",
      "Editar Rol",
      "Eliminar Rol",
      "Ver Permisos",
      "Asignar Permisos",
      "Ver Bitácora",
    ],
  },
  Administrador: {
    id: "admin",
    name: "Administrador",
    description: "Gestión de usuarios y sistema",
    permissions: [
      "Ver Dashboard",
      "Ver Usuarios",
      "Crear Usuario",
      "Editar Usuario",
      "Ver Roles",
      "Ver Bitácora",
    ],
  },
  Instructor: {
    id: "instructor",
    name: "Instructor",
    description: "Acceso básico al dashboard",
    permissions: ["Ver Dashboard"],
  },
};

export function PermissionsProvider({
  children,
  user,
}: PermissionsProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      // Verificar si es superusuario primero
      if (user.is_superuser) {
        console.log("User is superuser, granting all permissions:", user);
        setCurrentUser({
          id: String(user.id),
          username: user.username,
          email: user.email || `${user.username}@gym.com`,
          role: SYSTEM_ROLES["Super Administrador"],
          isActive: true,
        });
        return;
      }

      // Determinar el rol basado en los datos del usuario
      let roleName = null;

      if (user.roles && user.roles.length > 0) {
        roleName = user.roles[0].nombre;
      } else if (user.role) {
        roleName = user.role;
      }

      // Si no tiene roles asignados, crear un rol vacío
      if (!roleName) {
        console.log("User has no roles assigned:", user);
        setCurrentUser({
          id: String(user.id),
          username: user.username,
          email: user.email || `${user.username}@gym.com`,
          role: {
            id: "no_role",
            name: "Sin Rol",
            description: "Usuario sin roles asignados",
            permissions: [],
          },
          isActive: true,
        });
        return;
      }

      const role = SYSTEM_ROLES[roleName];

      // Si el rol no existe en el sistema, crear un rol vacío
      if (!role) {
        console.log("User role not found in system:", roleName);
        setCurrentUser({
          id: String(user.id),
          username: user.username,
          email: user.email || `${user.username}@gym.com`,
          role: {
            id: "unknown_role",
            name: roleName,
            description: "Rol no reconocido en el sistema",
            permissions: [],
          },
          isActive: true,
        });
        return;
      }

      setCurrentUser({
        id: String(user.id),
        username: user.username,
        email: user.email || `${user.username}@gym.com`,
        role: role,
        isActive: true,
      });
    } else {
      setCurrentUser(null);
    }
  }, [user]);

  const hasPermission = (permissionId: string): boolean => {
    if (!currentUser) {
      console.log("No current user, denying permission:", permissionId);
      return false;
    }

    // Los superusuarios siempre tienen acceso
    if (currentUser.role.id === "super_admin") {
      console.log(`Superuser granted permission: ${permissionId}`);
      return true;
    }

    // Si no tiene roles o tiene roles vacíos, denegar acceso
    if (
      currentUser.role.id === "no_role" ||
      currentUser.role.id === "unknown_role" ||
      currentUser.role.permissions.length === 0
    ) {
      console.log(
        "User has no valid role or permissions, denying access to:",
        permissionId
      );
      return false;
    }

    const hasAccess = currentUser.role.permissions.includes(permissionId);
    console.log(
      `Permission check for "${permissionId}":`,
      hasAccess,
      "User permissions:",
      currentUser.role.permissions
    );

    return hasAccess;
  };

  const hasAnyPermission = (permissionIds: string[]): boolean => {
    if (!currentUser) return false;

    // Los superusuarios siempre tienen acceso
    if (currentUser.role.id === "super_admin") {
      return true;
    }

    // Si no tiene roles o tiene roles vacíos, denegar acceso
    if (
      currentUser.role.id === "no_role" ||
      currentUser.role.id === "unknown_role" ||
      currentUser.role.permissions.length === 0
    ) {
      return false;
    }

    return permissionIds.some((permissionId) =>
      currentUser.role.permissions.includes(permissionId)
    );
  };

  const hasAllPermissions = (permissionIds: string[]): boolean => {
    if (!currentUser) return false;

    // Los superusuarios siempre tienen acceso
    if (currentUser.role.id === "super_admin") {
      return true;
    }

    // Si no tiene roles o tiene roles vacíos, denegar acceso
    if (
      currentUser.role.id === "no_role" ||
      currentUser.role.id === "unknown_role" ||
      currentUser.role.permissions.length === 0
    ) {
      return false;
    }

    return permissionIds.every((permissionId) =>
      currentUser.role.permissions.includes(permissionId)
    );
  };

  const userPermissions = currentUser ? currentUser.role.permissions : [];

  const value: PermissionsContextType = {
    user: currentUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}

// Componente para mostrar contenido condicionalmente basado en permisos
interface ProtectedComponentProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function ProtectedComponent({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
}: ProtectedComponentProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = true; // Si no se especifican permisos, mostrar por defecto
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Hook para verificar permisos de manera más simple
export function useHasPermission(permissionId: string): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission(permissionId);
}

export function useHasAnyPermission(permissionIds: string[]): boolean {
  const { hasAnyPermission } = usePermissions();
  return hasAnyPermission(permissionIds);
}

export function useHasAllPermissions(permissionIds: string[]): boolean {
  const { hasAllPermissions } = usePermissions();
  return hasAllPermissions(permissionIds);
}
