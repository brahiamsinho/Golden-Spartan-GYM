import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../contexts/PermissionsContext";
import { ROUTES, ROUTE_PERMISSIONS } from "../../config/routes";
import AccessDenied from "../access/AccessDenied";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirigir al login y guardar la ruta actual para redirigir después del login
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  // Si se especifica un permiso requerido, verificar que el usuario lo tenga
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log(
      `Access denied: User does not have permission "${requiredPermission}"`
    );
    return <AccessDenied />;
  }

  // Si no se especifica permiso, intentar obtenerlo de la ruta actual
  const currentPath = location.pathname;
  const routePermission =
    ROUTE_PERMISSIONS[currentPath as keyof typeof ROUTE_PERMISSIONS];

  if (routePermission && !hasPermission(routePermission)) {
    console.log(
      `Access denied: User does not have permission "${routePermission}" for route "${currentPath}"`
    );
    return <AccessDenied />;
  }

  return <>{children}</>;
}
