from django.contrib import admin
from .models import Rol, Permiso, RolPermiso, UsuarioRol, Bitacora

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'descripcion')
    search_fields = ('nombre',)

@admin.register(Permiso)
class PermisoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'descripcion')
    search_fields = ('nombre',)

@admin.register(RolPermiso)
class RolPermisoAdmin(admin.ModelAdmin):
    list_display = ('id', 'rol', 'permiso')
    list_filter = ('rol',)
    search_fields = ('rol__nombre', 'permiso__nombre')

@admin.register(UsuarioRol)
class UsuarioRolAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'rol')
    list_filter = ('rol',)
    search_fields = ('usuario__username', 'rol__nombre')

@admin.register(Bitacora)
class BitacoraAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'accion', 'fecha', 'hora', 'ip')
    list_filter = ('fecha', 'usuario')
    search_fields = ('usuario__username', 'accion', 'ip')
    date_hierarchy = 'fecha'
    readonly_fields = ('fecha', 'hora')
