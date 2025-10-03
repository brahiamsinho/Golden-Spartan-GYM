from django.contrib import admin
from .models import Rol, Permiso, RolPermiso, UsuarioRol, Bitacora


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "descripcion")
    search_fields = ("nombre",)


@admin.register(Permiso)
class PermisoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "descripcion")
    search_fields = ("nombre",)


@admin.register(RolPermiso)
class RolPermisoAdmin(admin.ModelAdmin):
    list_display = ("id", "rol", "permiso")
    list_filter = ("rol",)
    search_fields = ("rol__nombre", "permiso__nombre")


@admin.register(UsuarioRol)
class UsuarioRolAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "rol")
    list_filter = ("rol",)
    search_fields = ("usuario__username", "rol__nombre")


@admin.register(Bitacora)
class BitacoraAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "usuario_nombre",
        "tipo_accion",
        "accion",
        "nivel",
        "fecha_hora",
        "ip_address",
    )
    list_filter = ("tipo_accion", "nivel", "fecha_hora", "usuario")
    search_fields = ("usuario__username", "accion", "ip_address", "descripcion")
    date_hierarchy = "fecha_hora"
    readonly_fields = ("fecha_hora", "ip_address", "user_agent", "datos_adicionales")
    list_per_page = 50

    def usuario_nombre(self, obj):
        return obj.usuario.username if obj.usuario else "Sistema"

    usuario_nombre.short_description = "Usuario"
