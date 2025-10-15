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

  // Perfil de usuario
  PROFILE: "/profile",

  // Módulo de Clientes y Membresías
  CLIENTES: "/clientes",
  PLANES: "/planes",
  PROMOCIONES: "/promociones",
  MEMBRESIAS: "/membresias",
  INSCRIPCIONES: "/inscripciones",
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
  ROUTES.PROFILE,
  ROUTES.CLIENTES,
  ROUTES.PLANES,
  ROUTES.PROMOCIONES,
  ROUTES.MEMBRESIAS,
  ROUTES.INSCRIPCIONES,
] as const;

// Mapeo de rutas a permisos requeridos
export const ROUTE_PERMISSIONS = {
  [ROUTES.DASHBOARD]: "Ver Dashboard",
  [ROUTES.USERS]: "Ver Usuarios",
  [ROUTES.ROLES]: "Ver Roles",
  [ROUTES.PERMISSIONS]: "Ver Permisos",
  [ROUTES.ACTIVITY_LOG]: "Ver Bitácora",
  [ROUTES.CLIENTES]: "ver_cliente",
  [ROUTES.PLANES]: "ver_plan",
  [ROUTES.PROMOCIONES]: "ver_promocion",
  [ROUTES.MEMBRESIAS]: "ver_membresia",
  [ROUTES.INSCRIPCIONES]: "ver_inscripcion",
} as const;
