from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Rol, Permiso, RolPermiso, UsuarioRol, Bitacora

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
        read_only_fields = ['id']

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permiso
        fields = '__all__'

class RolPermisoSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.ReadOnlyField(source='rol.nombre')
    permiso_nombre = serializers.ReadOnlyField(source='permiso.nombre')
    
    class Meta:
        model = RolPermiso
        fields = ['id', 'rol', 'permiso', 'rol_nombre', 'permiso_nombre']

class UsuarioRolSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source='usuario.username')
    rol_nombre = serializers.ReadOnlyField(source='rol.nombre')
    
    class Meta:
        model = UsuarioRol
        fields = ['id', 'usuario', 'rol', 'usuario_nombre', 'rol_nombre']

class BitacoraSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Bitacora
        fields = '__all__'
    
    def get_usuario_nombre(self, obj):
        return obj.usuario.username if obj.usuario else "Sistema"

class UserWithRolesSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'roles']
    
    def get_roles(self, obj):
        usuario_roles = UsuarioRol.objects.filter(usuario=obj)
        return [{'id': ur.rol.id, 'nombre': ur.rol.nombre} for ur in usuario_roles]

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    rol = serializers.IntegerField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'rol']
    
    def create(self, validated_data):
        rol_id = validated_data.pop('rol')
        password = validated_data.pop('password')
        
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