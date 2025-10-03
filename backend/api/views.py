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
    pagination_class = None  # Deshabilitar paginación por defecto

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

    def list(self, request, *args, **kwargs):
        """Listar usuarios con paginación personalizada"""
        from django.core.paginator import Paginator

        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("page_size", 10))

        queryset = self.get_queryset()
        paginator = Paginator(queryset, page_size)

        try:
            page_obj = paginator.page(page)
        except Exception:
            page_obj = paginator.page(1)

        serializer = self.get_serializer(page_obj.object_list, many=True)

        return Response(
            {
                "results": serializer.data,
                "count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page_obj.number,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
                "next_page": page_obj.next_page_number()
                if page_obj.has_next()
                else None,
                "previous_page": page_obj.previous_page_number()
                if page_obj.has_previous()
                else None,
            }
        )

    def create(self, request, *args, **kwargs):
        print(f"Datos recibidos: {request.data}")

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Errores de validación: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)

        # Registrar en bitácora con el nuevo sistema
        rol_id = request.data.get("rol")
        try:
            rol = Rol.objects.get(id=rol_id)
            Bitacora.log_activity(
                usuario=request.user,
                tipo_accion="create_user",
                accion=f"Creó usuario {serializer.data['username']}",
                descripcion=f"Usuario creado con rol {rol.nombre}",
                nivel="info",
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                datos_adicionales={
                    "usuario_creado": serializer.data["username"],
                    "rol_asignado": rol.nombre,
                    "email": serializer.data.get("email", ""),
                    "nombre_completo": f"{serializer.data.get('first_name', '')} {serializer.data.get('last_name', '')}".strip(),
                },
            )
        except Exception as e:
            print(f"Error creando bitácora: {e}")
            # Registrar el error también
            Bitacora.log_activity(
                usuario=request.user,
                tipo_accion="error",
                accion="Error al registrar creación de usuario en bitácora",
                descripcion=f"Error: {str(e)}",
                nivel="error",
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                datos_adicionales={"error": str(e)},
            )

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def update(self, request, *args, **kwargs):
        try:
            user = self.get_object()
            old_roles = list(user.roles.values_list("id", flat=True))

            # Actualizar datos del usuario
            user.username = request.data.get("username", user.username)
            user.email = request.data.get("email", user.email)
            user.first_name = request.data.get("first_name", user.first_name)
            user.last_name = request.data.get("last_name", user.last_name)
            user.is_active = request.data.get("is_active", user.is_active)

            # Actualizar contraseña si se proporciona
            if "password" in request.data and request.data["password"]:
                user.set_password(request.data["password"])

            user.save()

            # Actualizar rol si se proporciona
            if "rol" in request.data:
                nuevo_rol_id = request.data["rol"]

                # Eliminar roles actuales
                UsuarioRol.objects.filter(usuario=user).delete()

                # Asignar nuevo rol
                if nuevo_rol_id:
                    try:
                        rol = Rol.objects.get(id=nuevo_rol_id)
                        UsuarioRol.objects.create(usuario=user, rol=rol)
                    except Rol.DoesNotExist:
                        pass

            # Registrar en bitácora
            Bitacora.log_activity(
                usuario=request.user,
                tipo_accion="update_user",
                accion="Actualizar Usuario",
                descripcion=f'Usuario "{user.username}" actualizado',
                nivel="info",
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                datos_adicionales={
                    "usuario_id": user.id,
                    "usuario_username": user.username,
                    "roles_anteriores": old_roles,
                    "nuevo_rol": request.data.get("rol"),
                },
            )

            serializer = self.get_serializer(user)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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

    def create(self, request, *args, **kwargs):
        try:
            # Crear el rol
            rol_data = {
                "nombre": request.data.get("nombre"),
                "descripcion": request.data.get("descripcion", ""),
            }
            rol = Rol.objects.create(**rol_data)

            # Asignar permisos
            permisos_ids = request.data.get("permisos", [])
            for permiso_id in permisos_ids:
                try:
                    permiso = Permiso.objects.get(id=permiso_id)
                    RolPermiso.objects.create(rol=rol, permiso=permiso)
                except Permiso.DoesNotExist:
                    continue

            # Registrar en bitácora
            activity_data = getattr(request, "activity_data", {})
            Bitacora.log_activity(
                usuario=request.user,
                tipo_accion="create_role",
                accion="Crear Rol",
                descripcion=f'Rol "{rol.nombre}" creado con {len(permisos_ids)} permisos',
                nivel="info",
                ip_address=activity_data.get("ip_address", "127.0.0.1"),
                user_agent=activity_data.get("user_agent", "Unknown"),
                datos_adicionales={
                    "rol_id": rol.id,
                    "rol_nombre": rol.nombre,
                    "permisos_asignados": permisos_ids,
                },
            )

            serializer = self.get_serializer(rol)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            rol = self.get_object()
            old_permisos = list(rol.permisos.values_list("id", flat=True))

            # Actualizar datos del rol
            rol.nombre = request.data.get("nombre", rol.nombre)
            rol.descripcion = request.data.get("descripcion", rol.descripcion)
            rol.save()

            # Actualizar permisos
            nuevos_permisos = request.data.get("permisos", [])

            # Eliminar permisos que ya no están
            RolPermiso.objects.filter(rol=rol).exclude(
                permiso_id__in=nuevos_permisos
            ).delete()

            # Agregar nuevos permisos
            for permiso_id in nuevos_permisos:
                if not RolPermiso.objects.filter(
                    rol=rol, permiso_id=permiso_id
                ).exists():
                    try:
                        permiso = Permiso.objects.get(id=permiso_id)
                        RolPermiso.objects.create(rol=rol, permiso=permiso)
                    except Permiso.DoesNotExist:
                        continue

            # Registrar en bitácora
            activity_data = getattr(request, "activity_data", {})
            Bitacora.log_activity(
                usuario=request.user,
                tipo_accion="update_role",
                accion="Actualizar Rol",
                descripcion=f'Rol "{rol.nombre}" actualizado',
                nivel="info",
                ip_address=activity_data.get("ip_address", "127.0.0.1"),
                user_agent=activity_data.get("user_agent", "Unknown"),
                datos_adicionales={
                    "rol_id": rol.id,
                    "rol_nombre": rol.nombre,
                    "permisos_anteriores": old_permisos,
                    "permisos_nuevos": nuevos_permisos,
                },
            )

            serializer = self.get_serializer(rol)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def toggle_status(self, request, pk=None):
        """Activar/desactivar rol"""
        try:
            rol = self.get_object()
            rol.activo = not rol.activo
            rol.save()

            # Registrar en bitácora
            activity_data = getattr(request, "activity_data", {})
            Bitacora.log_activity(
                usuario=request.user,
                tipo_accion="toggle_role_status",
                accion="Cambiar Estado de Rol",
                descripcion=f'Rol "{rol.nombre}" {"activado" if rol.activo else "desactivado"}',
                nivel="info",
                ip_address=activity_data.get("ip_address", "127.0.0.1"),
                user_agent=activity_data.get("user_agent", "Unknown"),
                datos_adicionales={
                    "rol_id": rol.id,
                    "rol_nombre": rol.nombre,
                    "nuevo_estado": rol.activo,
                },
            )

            serializer = self.get_serializer(rol)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            rol = self.get_object()

            # Verificar si tiene usuarios asignados
            if UsuarioRol.objects.filter(rol=rol).exists():
                return Response(
                    {
                        "error": "No se puede eliminar un rol que tiene usuarios asignados"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            rol_nombre = rol.nombre
            rol_id = rol.id

            # Eliminar permisos del rol
            RolPermiso.objects.filter(rol=rol).delete()

            # Eliminar el rol
            rol.delete()

            # Registrar en bitácora
            activity_data = getattr(request, "activity_data", {})
            Bitacora.log_activity(
                usuario=request.user,
                tipo_accion="delete_role",
                accion="Eliminar Rol",
                descripcion=f'Rol "{rol_nombre}" eliminado',
                nivel="warning",
                ip_address=activity_data.get("ip_address", "127.0.0.1"),
                user_agent=activity_data.get("user_agent", "Unknown"),
                datos_adicionales={"rol_id": rol_id, "rol_nombre": rol_nombre},
            )

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permiso.objects.all()
    serializer_class = PermisoSerializer

    def get_permissions(self):
        if self.action == "list":
            return [HasPermission("Ver Permisos")]
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [HasPermission("Gestionar Permisos")]
        return [HasPermission("Asignar Permisos")]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                permiso = serializer.save()

                # Registrar en bitácora
                activity_data = getattr(request, "activity_data", {})
                Bitacora.log_activity(
                    usuario=request.user,
                    tipo_accion="create_permission",
                    accion="Crear Permiso",
                    descripcion=f'Permiso "{permiso.nombre}" creado',
                    nivel="info",
                    ip_address=activity_data.get("ip_address", "127.0.0.1"),
                    user_agent=activity_data.get("user_agent", "Unknown"),
                    datos_adicionales={
                        "permiso_id": permiso.id,
                        "permiso_nombre": permiso.nombre,
                    },
                )

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            permiso = self.get_object()
            old_nombre = permiso.nombre

            serializer = self.get_serializer(permiso, data=request.data)
            if serializer.is_valid():
                permiso = serializer.save()

                # Registrar en bitácora
                activity_data = getattr(request, "activity_data", {})
                Bitacora.log_activity(
                    usuario=request.user,
                    tipo_accion="update_permission",
                    accion="Actualizar Permiso",
                    descripcion=f'Permiso "{old_nombre}" actualizado a "{permiso.nombre}"',
                    nivel="info",
                    ip_address=activity_data.get("ip_address", "127.0.0.1"),
                    user_agent=activity_data.get("user_agent", "Unknown"),
                    datos_adicionales={
                        "permiso_id": permiso.id,
                        "permiso_nombre_anterior": old_nombre,
                        "permiso_nombre_nuevo": permiso.nombre,
                    },
                )

                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            permiso = self.get_object()
            permiso_nombre = permiso.nombre
            permiso_id = permiso.id

            # Verificar si el permiso está siendo usado por algún rol
            roles_usando_permiso = RolPermiso.objects.filter(permiso=permiso)
            if roles_usando_permiso.exists():
                # Obtener nombres de roles que usan este permiso
                nombres_roles = [rp.rol.nombre for rp in roles_usando_permiso]
                return Response(
                    {
                        "error": f"No se puede eliminar el permiso '{permiso_nombre}' porque está siendo usado por los siguientes roles: {', '.join(nombres_roles)}. Primero debe desasignar el permiso de estos roles."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            permiso.delete()

            # Registrar en bitácora
            activity_data = getattr(request, "activity_data", {})
            Bitacora.log_activity(
                usuario=request.user,
                tipo_accion="delete_permission",
                accion="Eliminar Permiso",
                descripcion=f'Permiso "{permiso_nombre}" eliminado',
                nivel="warning",
                ip_address=activity_data.get("ip_address", "127.0.0.1"),
                user_agent=activity_data.get("user_agent", "Unknown"),
                datos_adicionales={
                    "permiso_id": permiso_id,
                    "permiso_nombre": permiso_nombre,
                },
            )

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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


class BitacoraViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bitacora.objects.all().order_by("-fecha_hora")
    serializer_class = BitacoraSerializer

    def get_permissions(self):
        return [HasPermission("Ver Bitácora")]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtrar por usuario
        usuario = self.request.query_params.get("usuario")
        if usuario:
            queryset = queryset.filter(usuario__username__icontains=usuario)

        # Filtrar por tipo de acción
        tipo_accion = self.request.query_params.get("tipo_accion")
        if tipo_accion:
            queryset = queryset.filter(tipo_accion=tipo_accion)

        # Filtrar por nivel
        nivel = self.request.query_params.get("nivel")
        if nivel:
            queryset = queryset.filter(nivel=nivel)

        # Filtrar por fecha
        fecha_inicio = self.request.query_params.get("fecha_inicio")
        fecha_fin = self.request.query_params.get("fecha_fin")

        if fecha_inicio:
            queryset = queryset.filter(fecha_hora__date__gte=fecha_inicio)
        if fecha_fin:
            queryset = queryset.filter(fecha_hora__date__lte=fecha_fin)

        # Filtrar por acción
        accion = self.request.query_params.get("accion")
        if accion:
            queryset = queryset.filter(accion__icontains=accion)

        # Filtrar por IP
        ip = self.request.query_params.get("ip")
        if ip:
            queryset = queryset.filter(ip_address__icontains=ip)

        return queryset

    @action(detail=False, methods=["get"])
    def estadisticas(self, request):
        """Obtener estadísticas de la bitácora"""
        from django.db.models import Count
        from datetime import datetime, timedelta

        # Estadísticas por tipo de acción
        stats_por_tipo = (
            Bitacora.objects.values("tipo_accion")
            .annotate(total=Count("id"))
            .order_by("-total")
        )

        # Estadísticas por nivel
        stats_por_nivel = (
            Bitacora.objects.values("nivel")
            .annotate(total=Count("id"))
            .order_by("-total")
        )

        # Actividades de los últimos 7 días
        fecha_limite = datetime.now() - timedelta(days=7)
        actividades_recientes = Bitacora.objects.filter(
            fecha_hora__gte=fecha_limite
        ).count()

        # Top 5 usuarios más activos
        usuarios_activos = (
            Bitacora.objects.exclude(usuario=None)
            .values("usuario__username")
            .annotate(total=Count("id"))
            .order_by("-total")[:5]
        )

        return Response(
            {
                "por_tipo": list(stats_por_tipo),
                "por_nivel": list(stats_por_nivel),
                "actividades_recientes": actividades_recientes,
                "usuarios_activos": list(usuarios_activos),
                "total_registros": Bitacora.objects.count(),
            }
        )


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Cerrar sesión del usuario y registrar en bitácora"""
    try:
        user = request.user

        # Registrar logout en bitácora
        Bitacora.log_activity(
            usuario=user,
            tipo_accion="logout",
            accion="Cierre de sesión",
            descripcion=f"Usuario {user.username} cerró sesión",
            nivel="info",
            ip_address=get_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            datos_adicionales={"session_ended": True},
        )

        return Response(
            {"message": "Sesión cerrada exitosamente", "usuario": user.username}
        )
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
        Bitacora.log_activity(
            usuario=user,
            tipo_accion="login",
            accion="Inicio de sesión exitoso",
            descripcion=f"Usuario {user.username} inició sesión",
            nivel="info",
            ip_address=get_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            datos_adicionales={
                "roles": [r["nombre"] for r in roles],
                "permisos_count": len(permisos),
            },
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


# Dashboard views
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Obtener estadísticas para el dashboard"""
    try:
        from django.db.models import Count
        from datetime import datetime, timedelta

        # Fecha de hoy
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)

        # Usuarios activos hoy (que han iniciado sesión hoy)
        usuarios_activos_hoy = (
            Bitacora.objects.filter(tipo_accion="login", fecha_hora__date=today)
            .values("usuario")
            .distinct()
            .count()
        )

        # Usuarios activos ayer para comparar
        usuarios_activos_ayer = (
            Bitacora.objects.filter(tipo_accion="login", fecha_hora__date=yesterday)
            .values("usuario")
            .distinct()
            .count()
        )

        # Intentos fallidos en las últimas 24 horas
        intentos_fallidos = Bitacora.objects.filter(
            tipo_accion="login_failed",
            fecha_hora__gte=timezone.now() - timedelta(hours=24),
        ).count()

        # Total de usuarios en el sistema
        total_usuarios = User.objects.filter(is_active=True).count()

        # Total de roles
        total_roles = Rol.objects.count()

        # Actividad reciente (últimas 24 horas)
        actividad_reciente = Bitacora.objects.filter(
            fecha_hora__gte=timezone.now() - timedelta(hours=24)
        ).count()

        # Calcular diferencia de usuarios activos
        diferencia_usuarios = usuarios_activos_hoy - usuarios_activos_ayer

        stats = {
            "usuarios_activos_hoy": usuarios_activos_hoy,
            "diferencia_usuarios": diferencia_usuarios,
            "intentos_fallidos": intentos_fallidos,
            "total_usuarios": total_usuarios,
            "total_roles": total_roles,
            "actividad_reciente": actividad_reciente,
            "sistema_operativo": True,  # Siempre true por ahora
        }

        return Response(stats)

    except Exception as e:
        return Response(
            {"error": f"Error al obtener estadísticas: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Endpoint para cambiar la contraseña del usuario autenticado.
    """
    try:
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {
                    "message": "La contraseña actual y la nueva contraseña son requeridas"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificar la contraseña actual
        if not request.user.check_password(current_password):
            return Response(
                {"message": "La contraseña actual es incorrecta"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar la nueva contraseña
        if len(new_password) < 6:
            return Response(
                {"message": "La nueva contraseña debe tener al menos 6 caracteres"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Cambiar la contraseña
        request.user.set_password(new_password)
        request.user.save()

        # Registrar en bitácora
        Bitacora.log_activity(
            usuario=request.user,
            tipo_accion="change_password",
            accion="Cambio de contraseña",
            descripcion=f"Usuario {request.user.username} cambió su contraseña",
            nivel="info",
            ip_address=get_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            datos_adicionales={"user_id": request.user.id},
        )

        return Response(
            {"message": "Contraseña cambiada exitosamente"}, status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"message": "Error interno del servidor"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([])  # No requiere autenticación
def forgot_password(request):
    """
    Endpoint para solicitar restablecimiento de contraseña.
    Simula el envío de email (en un entorno real enviaría un email).
    """
    try:
        email = request.data.get("email")

        if not email:
            return Response(
                {"message": "El email es requerido"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Buscar usuario por email
        try:
            user = User.objects.get(email=email)

            # Registrar en bitácora usando el nuevo sistema
            Bitacora.log_activity(
                usuario=user,
                tipo_accion="forgot_password",
                accion="Solicitud de restablecimiento de contraseña",
                descripcion=f"Solicitud para email: {email}",
                nivel="info",
                ip_address=get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                datos_adicionales={"email": email},
            )

            # En un entorno real, aquí se enviaría un email con un token
            # Por ahora solo simulamos el éxito
            return Response(
                {"message": "Se han enviado las instrucciones a tu email"},
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            # Por seguridad, no revelamos si el email existe o no
            # Pero registramos el intento en bitácora
            Bitacora.log_activity(
                usuario=None,
                tipo_accion="forgot_password_failed",
                accion="Intento de restablecimiento con email inexistente",
                descripcion=f"Email consultado: {email}",
                nivel="warning",
                ip_address=get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                datos_adicionales={"email": email},
            )

            # Respondemos como si hubiera éxito para no revelar información
            return Response(
                {"message": "Se han enviado las instrucciones a tu email"},
                status=status.HTTP_200_OK,
            )

    except Exception:
        return Response(
            {"message": "Error interno del servidor"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
