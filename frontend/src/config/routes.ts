// Configuración de rutas de la aplicación
export const ROUTES = {
  // Página principal
  HOME: "/",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Gestión de usuarios
  USERS: "/users",

  // Gestión de roles
  ROLES: "/roles",

  // Gestión de permisos
  PERMISSIONS: "/permissions",

  // Bitácora de actividades
  ACTIVITY_LOG: "/activity-log",
} as const;

// Rutas públicas (no requieren autenticación)
export const PUBLIC_ROUTES = [ROUTES.HOME] as const;

// Rutas protegidas (requieren autenticación)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.USERS,
  ROUTES.ROLES,
  ROUTES.PERMISSIONS,
  ROUTES.ACTIVITY_LOG,
] as const;

// Mapeo de rutas a permisos requeridos
export const ROUTE_PERMISSIONS = {
  [ROUTES.DASHBOARD]: "Ver Dashboard",
  [ROUTES.USERS]: "Ver Usuarios",
  [ROUTES.ROLES]: "Ver Roles",
  [ROUTES.PERMISSIONS]: "Ver Permisos",
  [ROUTES.ACTIVITY_LOG]: "Ver Bitácora",
} as const;
