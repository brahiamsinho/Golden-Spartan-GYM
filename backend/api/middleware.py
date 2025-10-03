from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import User
from .models import Bitacora
import json


class ActivityLoggingMiddleware(MiddlewareMixin):
    """
    Middleware para capturar automáticamente actividades del sistema
    """

    def process_request(self, request):
        # Agregar información de la IP y User-Agent a la request
        request.ip_address = self.get_client_ip(request)
        request.user_agent = request.META.get("HTTP_USER_AGENT", "")
        return None

    def process_response(self, request, response):
        # Solo registrar actividades para usuarios autenticados y ciertos endpoints
        if (
            hasattr(request, "user")
            and request.user.is_authenticated
            and request.method in ["POST", "PUT", "PATCH", "DELETE"]
        ):
            self.log_request_activity(request, response)

        return response

    def get_client_ip(self, request):
        """Obtiene la IP real del cliente"""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip

    def log_request_activity(self, request, response):
        """Registra la actividad basada en la request"""
        try:
            # Determinar el tipo de actividad basado en la URL y método
            path = request.path
            method = request.method

            # Mapeo de URLs a tipos de actividad
            activity_mapping = {
                ("/api/token/", "POST"): ("login", "Inicio de sesión"),
                ("/api/token/refresh/", "POST"): ("login", "Renovación de token"),
                ("/api/logout/", "POST"): ("logout", "Cierre de sesión"),
                ("/api/users/", "POST"): ("create_user", "Crear usuario"),
                ("/api/users/", "PUT"): ("update_user", "Actualizar usuario"),
                ("/api/users/", "PATCH"): ("update_user", "Actualizar usuario"),
                ("/api/users/", "DELETE"): ("delete_user", "Eliminar usuario"),
                ("/api/roles/", "POST"): ("create_role", "Crear rol"),
                ("/api/roles/", "PUT"): ("update_role", "Actualizar rol"),
                ("/api/roles/", "PATCH"): ("update_role", "Actualizar rol"),
                ("/api/roles/", "DELETE"): ("delete_role", "Eliminar rol"),
                ("/api/permissions/", "POST"): ("create_permission", "Crear permiso"),
                ("/api/permissions/", "PUT"): (
                    "update_permission",
                    "Actualizar permiso",
                ),
                ("/api/permissions/", "PATCH"): (
                    "update_permission",
                    "Actualizar permiso",
                ),
                ("/api/permissions/", "DELETE"): (
                    "delete_permission",
                    "Eliminar permiso",
                ),
            }

            # Buscar el tipo de actividad
            tipo_accion, accion_desc = activity_mapping.get(
                (path, method), ("other", f"{method} {path}")
            )

            # Determinar el nivel basado en el código de respuesta
            if response.status_code >= 500:
                nivel = "error"
            elif response.status_code >= 400:
                nivel = "warning"
            else:
                nivel = "info"

            # Obtener datos adicionales de la request
            datos_adicionales = {
                "method": method,
                "path": path,
                "status_code": response.status_code,
                "content_type": request.META.get("CONTENT_TYPE", ""),
            }

            # Agregar datos del body si es relevante (sin información sensible)
            if hasattr(request, "data") and request.data:
                # Filtrar información sensible
                safe_data = {}
                for key, value in request.data.items():
                    if key.lower() not in ["password", "token", "secret"]:
                        safe_data[key] = str(value)[:100]  # Limitar longitud
                datos_adicionales["request_data"] = safe_data

            # Registrar en la bitácora
            Bitacora.log_activity(
                usuario=request.user,
                tipo_accion=tipo_accion,
                accion=accion_desc,
                descripcion=f"Acceso a {path} via {method}",
                nivel=nivel,
                ip_address=request.ip_address,
                user_agent=request.user_agent,
                datos_adicionales=datos_adicionales,
            )

        except Exception as e:
            # En caso de error, registrar el error en la bitácora
            try:
                Bitacora.log_activity(
                    usuario=request.user if hasattr(request, "user") else None,
                    tipo_accion="error",
                    accion="Error en middleware de logging",
                    descripcion=f"Error al registrar actividad: {str(e)}",
                    nivel="error",
                    ip_address=getattr(request, "ip_address", "127.0.0.1"),
                    user_agent=getattr(request, "user_agent", ""),
                    datos_adicionales={"error": str(e)},
                )
            except:
                pass  # Si falla el logging del error, no hacer nada
