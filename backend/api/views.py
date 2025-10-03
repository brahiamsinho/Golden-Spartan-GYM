from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Rol, Permiso, RolPermiso, UsuarioRol, Bitacora
from .serializers import (
    UserSerializer,
    RolSerializer,
    PermisoSerializer,
    RolPermisoSerializer,
    UsuarioRolSerializer,
    BitacoraSerializer,
    UserWithRolesSerializer,
    UserCreateSerializer,
)
from django.db.models import Q
from django.utils import timezone


# Permiso personalizado para verificar si el usuario tiene el permiso requerido
class HasPermission(permissions.BasePermission):
    def __init__(self, required_permission):
        self.required_permission = required_permission

    def has_permission(self, request, view):
        # El superusuario siempre tiene acceso
        if request.user.is_superuser:
            return True

        try:
            # Obtener los roles del usuario
            usuario_roles = UsuarioRol.objects.filter(usuario=request.user)

            # Si no tiene roles asignados, no tiene permisos
            if not usuario_roles.exists():
                return False

            # Verificar si alguno de los roles tiene el permiso requerido
            for ur in usuario_roles:
                rol_permisos = RolPermiso.objects.filter(
                    rol=ur.rol, permiso__nombre=self.required_permission
                )
                if rol_permisos.exists():
                    return True

            return False
        except Exception:
            return False


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        if self.action == "list" or self.action == "retrieve":
            return UserWithRolesSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == "list":
            return [HasPermission("Ver Usuarios")]
        elif self.action in ["create", "update", "partial_update"]:
            # Verificar si el usuario tiene permiso para crear/editar el tipo específico de usuario
            user_type = self.request.data.get("rol")
            if user_type:
                try:
                    rol = Rol.objects.get(id=user_type)
                    if rol.nombre == "Administrador":
                        return [HasPermission("Gestionar Administradores")]
                    elif rol.nombre == "Instructor":
                        return [HasPermission("Gestionar Instructores")]
                except Rol.DoesNotExist:
                    pass
            return [HasPermission("Crear Usuario")]
        elif self.action == "destroy":
            return [HasPermission("Eliminar Usuario")]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        print(f"Datos recibidos: {request.data}")

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Errores de validación: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)

        # Registrar en bitácora
        rol_id = request.data.get("rol")
        try:
            rol = Rol.objects.get(id=rol_id)
            Bitacora.objects.create(
                usuario=request.user,
                accion=f"Creó usuario {serializer.data['username']} con rol {rol.nombre}",
                ip=self.get_client_ip(request),
            )
        except Exception as e:
            print(f"Error creando bitácora: {e}")
            pass

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR", "0.0.0.0")
        return ip


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

    def get_permissions(self):
        if self.action == "list":
            return [HasPermission("Ver Roles")]
        elif self.action in ["create", "update", "partial_update"]:
            return [HasPermission("Crear Rol")]
        elif self.action == "destroy":
            return [HasPermission("Eliminar Rol")]
        return [IsAuthenticated()]


class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permiso.objects.all()
    serializer_class = PermisoSerializer

    def get_permissions(self):
        if self.action == "list":
            return [HasPermission("Ver Permisos")]
        return [HasPermission("Asignar Permisos")]


class RolPermisoViewSet(viewsets.ModelViewSet):
    queryset = RolPermiso.objects.all()
    serializer_class = RolPermisoSerializer

    def get_permissions(self):
        return [HasPermission("Asignar Permisos")]


class UsuarioRolViewSet(viewsets.ModelViewSet):
    queryset = UsuarioRol.objects.all()
    serializer_class = UsuarioRolSerializer

    def get_permissions(self):
        if self.action == "list":
            return [HasPermission("Ver Usuarios")]
        return [HasPermission("Crear Usuario")]


class BitacoraViewSet(viewsets.ModelViewSet):
    queryset = Bitacora.objects.all().order_by("-fecha", "-hora")
    serializer_class = BitacoraSerializer

    def get_permissions(self):
        return [HasPermission("Ver Bitácora")]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtrar por usuario
        usuario = self.request.query_params.get("usuario")
        if usuario:
            queryset = queryset.filter(usuario__username__icontains=usuario)

        # Filtrar por fecha
        fecha_inicio = self.request.query_params.get("fecha_inicio")
        fecha_fin = self.request.query_params.get("fecha_fin")

        if fecha_inicio:
            queryset = queryset.filter(fecha__gte=fecha_inicio)
        if fecha_fin:
            queryset = queryset.filter(fecha__lte=fecha_fin)

        # Filtrar por acción
        accion = self.request.query_params.get("accion")
        if accion:
            queryset = queryset.filter(accion__icontains=accion)

        return queryset


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_permissions(request):
    try:
        # Obtener los roles del usuario
        usuario_roles = UsuarioRol.objects.filter(usuario=request.user)

        if not usuario_roles.exists():
            return Response(
                {"error": "Usuario no tiene roles asignados"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Obtener todos los permisos para los roles del usuario
        permisos = set()
        roles = []

        for ur in usuario_roles:
            roles.append({"id": ur.rol.id, "nombre": ur.rol.nombre})

            # Obtener los permisos asociados a este rol
            rol_permisos = RolPermiso.objects.filter(rol=ur.rol)
            for rp in rol_permisos:
                permisos.add(rp.permiso.nombre)

        return Response({"permisos": list(permisos), "roles": roles})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def registrar_bitacora(request):
    try:
        # Obtener la IP del cliente
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR", "0.0.0.0")

        # Crear entrada en bitácora
        bitacora = Bitacora(
            usuario=request.user,
            accion=request.data.get("accion", "Acción no especificada"),
            ip=ip,
            fecha=timezone.now().date(),
            hora=timezone.now().time(),
        )
        bitacora.save()

        serializer = BitacoraSerializer(bitacora)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """Obtener información del usuario actualmente autenticado"""
    try:
        user = request.user
        # Obtener roles del usuario
        usuario_roles = UsuarioRol.objects.filter(usuario=user)
        roles = [{"id": ur.rol.id, "nombre": ur.rol.nombre} for ur in usuario_roles]

        # Obtener permisos del usuario
        permisos = set()
        for ur in usuario_roles:
            rol_permisos = RolPermiso.objects.filter(rol=ur.rol)
            for rp in rol_permisos:
                permisos.add(rp.permiso.nombre)

        # Registrar inicio de sesión en bitácora
        Bitacora.objects.create(
            usuario=user,
            accion="Inicio de sesión",
            ip=get_client_ip(request),
            fecha=timezone.now().date(),
            hora=timezone.now().time(),
        )

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "roles": roles,
                "permisos": list(permisos),
            }
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR", "0.0.0.0")
    return ip
