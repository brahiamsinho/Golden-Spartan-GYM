from rest_framework import permissions
from .models import Usuario, RolPermiso


class HasPermission(permissions.BasePermission):
    """
    Permiso personalizado que verifica si el usuario tiene un permiso específico.
    """

    def __init__(self, permission_code):
        self.permission_code = permission_code

    def has_permission(self, request, view):
        # Si no está autenticado, denegar acceso
        if not request.user or not request.user.is_authenticated:
            return False

        try:
            # Obtener el usuario del modelo personalizado
            usuario = Usuario.objects.get(id=request.user.id)

            # Si es superadmin, permitir todo
            if usuario.is_superuser:
                return True

            # Verificar si el usuario tiene el permiso específico
            roles_usuario = usuario.roles.all()
            for rol in roles_usuario:
                if RolPermiso.objects.filter(
                    rol=rol, permiso__codigo=self.permission_code
                ).exists():
                    return True

            return False

        except Usuario.DoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


def require_permission(permission_code):
    """
    Decorador para vistas que requieren un permiso específico.
    """

    def decorator(view_class):
        original_permission_classes = getattr(view_class, "permission_classes", [])
        view_class.permission_classes = original_permission_classes + [
            HasPermission(permission_code)
        ]
        return view_class

    return decorator
