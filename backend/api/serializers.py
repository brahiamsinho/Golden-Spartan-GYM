from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Rol, Permiso, RolPermiso, UsuarioRol, Bitacora


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_active"]
        read_only_fields = ["id"]


class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permiso
        fields = "__all__"


class RolSerializer(serializers.ModelSerializer):
    permisos = serializers.SerializerMethodField()
    usuarios_count = serializers.SerializerMethodField()

    class Meta:
        model = Rol
        fields = [
            "id",
            "nombre",
            "descripcion",
            "permisos",
            "usuarios_count",
        ]

    def get_permisos(self, obj):
        # Obtener los permisos a través de la relación RolPermiso
        rol_permisos = obj.permisos.all()
        permisos = [rp.permiso for rp in rol_permisos]
        return PermisoSerializer(permisos, many=True).data

    def get_usuarios_count(self, obj):
        return UsuarioRol.objects.filter(rol=obj).count()


class RolPermisoSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.ReadOnlyField(source="rol.nombre")
    permiso_nombre = serializers.ReadOnlyField(source="permiso.nombre")

    class Meta:
        model = RolPermiso
        fields = ["id", "rol", "permiso", "rol_nombre", "permiso_nombre"]


class UsuarioRolSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source="usuario.username")
    rol_nombre = serializers.ReadOnlyField(source="rol.nombre")

    class Meta:
        model = UsuarioRol
        fields = ["id", "usuario", "rol", "usuario_nombre", "rol_nombre"]


class BitacoraSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    tipo_accion_display = serializers.CharField(
        source="get_tipo_accion_display", read_only=True
    )
    nivel_display = serializers.CharField(source="get_nivel_display", read_only=True)
    fecha_formateada = serializers.SerializerMethodField()

    class Meta:
        model = Bitacora
        fields = [
            "id",
            "usuario",
            "usuario_nombre",
            "tipo_accion",
            "tipo_accion_display",
            "accion",
            "descripcion",
            "nivel",
            "nivel_display",
            "ip_address",
            "user_agent",
            "fecha_hora",
            "fecha_formateada",
            "datos_adicionales",
        ]
        read_only_fields = ["id", "fecha_hora"]

    def get_usuario_nombre(self, obj):
        return obj.usuario.username if obj.usuario else "Sistema"

    def get_fecha_formateada(self, obj):
        return obj.fecha_hora.strftime("%d/%m/%Y %H:%M:%S")


class UserWithRolesSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "roles",
        ]

    def get_roles(self, obj):
        usuario_roles = UsuarioRol.objects.filter(usuario=obj)
        return [{"id": ur.rol.id, "nombre": ur.rol.nombre} for ur in usuario_roles]


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    rol = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "rol"]

    def create(self, validated_data):
        rol_id = validated_data.pop("rol")
        password = validated_data.pop("password")

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        try:
            rol = Rol.objects.get(id=rol_id)
            UsuarioRol.objects.create(usuario=user, rol=rol)
        except Rol.DoesNotExist:
            user.delete()
            raise serializers.ValidationError({"rol": "El rol especificado no existe."})

        return user
