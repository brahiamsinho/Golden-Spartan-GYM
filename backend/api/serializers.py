from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Rol, Permiso, RolPermiso, UsuarioRol, Bitacora,
    Cliente, PlanMembresia, Promocion, InscripcionMembresia, 
    Membresia, MembresiaPromocion
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "date_joined",
            "last_login",
        ]
        read_only_fields = ["id", "date_joined", "last_login"]


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
            "activo",
            "fecha_creacion",
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
            "date_joined",
            "last_login",
            "roles",
        ]

    def get_roles(self, obj):
        try:
            usuario_roles = UsuarioRol.objects.filter(usuario=obj)
            return [{"id": ur.rol.id, "nombre": ur.rol.nombre} for ur in usuario_roles]
        except Exception as e:
            print(f"Error obteniendo roles para usuario {obj.username}: {e}")
            return []


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


# ===== SERIALIZERS PARA CLIENTES Y MEMBRESÍAS =====

class ClienteSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    experiencia_display = serializers.CharField(source='get_experiencia_display', read_only=True)
    
    class Meta:
        model = Cliente
        fields = [
            'id', 'nombre', 'apellido', 'nombre_completo', 'telefono', 
            'peso', 'altura', 'experiencia', 'experiencia_display', 
            'fecha_registro', 'activo'
        ]
        read_only_fields = ['id', 'fecha_registro']
    
    def validate_peso(self, value):
        if value is not None and (value <= 0 or value > 500):
            raise serializers.ValidationError("El peso debe estar entre 1 y 500 kg.")
        return value
    
    def validate_altura(self, value):
        if value is not None and (value <= 0 or value > 3.0):
            raise serializers.ValidationError("La altura debe estar entre 0.1 y 3.0 metros.")
        return value


class PlanMembresiaSerializer(serializers.ModelSerializer):
    membresias_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PlanMembresia
        fields = [
            'id', 'nombre', 'duracion', 'precio_base', 'descripcion', 
            'activo', 'fecha_creacion', 'membresias_count'
        ]
        read_only_fields = ['id', 'fecha_creacion']
    
    def get_membresias_count(self, obj):
        return obj.membresias.filter(estado='activa').count()
    
    def validate_duracion(self, value):
        if value <= 0:
            raise serializers.ValidationError("La duración debe ser mayor a 0 días.")
        return value
    
    def validate_precio_base(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio base debe ser mayor a 0.")
        return value


class PromocionSerializer(serializers.ModelSerializer):
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    is_active_now = serializers.SerializerMethodField()
    
    class Meta:
        model = Promocion
        fields = [
            'id', 'nombre', 'meses', 'descuento', 'fecha_inicio', 
            'fecha_fin', 'estado', 'estado_display', 'is_active_now'
        ]
        read_only_fields = ['id']
    
    def get_is_active_now(self, obj):
        return obj.is_active()
    
    def validate_descuento(self, value):
        if value <= 0 or value > 100:
            raise serializers.ValidationError("El descuento debe estar entre 1% y 100%.")
        return value
    
    def validate(self, data):
        if data['fecha_inicio'] >= data['fecha_fin']:
            raise serializers.ValidationError("La fecha de inicio debe ser anterior a la fecha de fin.")
        return data


class InscripcionMembresiaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.ReadOnlyField(source='cliente.nombre_completo')
    metodo_de_pago_display = serializers.CharField(source='get_metodo_de_pago_display', read_only=True)
    
    class Meta:
        model = InscripcionMembresia
        fields = [
            'id', 'cliente', 'cliente_nombre', 'monto', 'metodo_de_pago', 
            'metodo_de_pago_display', 'fecha_inscripcion'
        ]
        read_only_fields = ['id', 'fecha_inscripcion']
    
    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser mayor a 0.")
        return value


class MembresiaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.ReadOnlyField(source='inscripcion.cliente.nombre_completo')
    plan_nombre = serializers.ReadOnlyField(source='plan.nombre')
    usuario_registro_nombre = serializers.ReadOnlyField(source='usuario_registro.username')
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    is_active_now = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    promociones = serializers.SerializerMethodField()
    
    class Meta:
        model = Membresia
        fields = [
            'id', 'inscripcion', 'cliente_nombre', 'plan', 'plan_nombre',
            'usuario_registro', 'usuario_registro_nombre', 'estado', 'estado_display',
            'fecha_inicio', 'fecha_fin', 'is_active_now', 'days_remaining', 'promociones'
        ]
        read_only_fields = ['id']
    
    def get_is_active_now(self, obj):
        return obj.is_active()
    
    def get_days_remaining(self, obj):
        return obj.days_remaining()
    
    def get_promociones(self, obj):
        promociones = obj.promociones.all()
        return [{'id': mp.promocion.id, 'nombre': mp.promocion.nombre, 'descuento': mp.promocion.descuento} 
                for mp in promociones]
    
    def validate(self, data):
        if data['fecha_inicio'] >= data['fecha_fin']:
            raise serializers.ValidationError("La fecha de inicio debe ser anterior a la fecha de fin.")
        return data


class MembresiaPromocionSerializer(serializers.ModelSerializer):
    membresia_info = serializers.SerializerMethodField()
    promocion_info = serializers.SerializerMethodField()
    
    class Meta:
        model = MembresiaPromocion
        fields = ['id', 'membresia', 'promocion', 'fecha_aplicacion', 'membresia_info', 'promocion_info']
        read_only_fields = ['id', 'fecha_aplicacion']
    
    def get_membresia_info(self, obj):
        return {
            'id': obj.membresia.id,
            'cliente': obj.membresia.inscripcion.cliente.nombre_completo,
            'plan': obj.membresia.plan.nombre
        }
    
    def get_promocion_info(self, obj):
        return {
            'id': obj.promocion.id,
            'nombre': obj.promocion.nombre,
            'descuento': obj.promocion.descuento
        }


class ClienteDetailSerializer(ClienteSerializer):
    """Serializer detallado para cliente con información de membresías"""
    membresias_activas = serializers.SerializerMethodField()
    total_inscripciones = serializers.SerializerMethodField()
    
    class Meta(ClienteSerializer.Meta):
        fields = ClienteSerializer.Meta.fields + ['membresias_activas', 'total_inscripciones']
    
    def get_membresias_activas(self, obj):
        membresias_activas = []
        for inscripcion in obj.inscripciones.all():
            if hasattr(inscripcion, 'membresia') and inscripcion.membresia.is_active():
                membresias_activas.append({
                    'id': inscripcion.membresia.id,
                    'plan': inscripcion.membresia.plan.nombre,
                    'fecha_inicio': inscripcion.membresia.fecha_inicio,
                    'fecha_fin': inscripcion.membresia.fecha_fin,
                    'days_remaining': inscripcion.membresia.days_remaining()
                })
        return membresias_activas
    
    def get_total_inscripciones(self, obj):
        return obj.inscripciones.count()
