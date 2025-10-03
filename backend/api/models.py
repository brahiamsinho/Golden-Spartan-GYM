from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.


class Rol(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "Roles"


class Permiso(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre


class RolPermiso(models.Model):
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name="permisos")
    permiso = models.ForeignKey(Permiso, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("rol", "permiso")
        verbose_name = "Rol-Permiso"
        verbose_name_plural = "Roles-Permisos"

    def __str__(self):
        return f"{self.rol.nombre} - {self.permiso.nombre}"


class UsuarioRol(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="roles")
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("usuario", "rol")
        verbose_name = "Usuario-Rol"
        verbose_name_plural = "Usuarios-Roles"

    def __str__(self):
        return f"{self.usuario.username} - {self.rol.nombre}"


class Bitacora(models.Model):
    TIPO_ACCION_CHOICES = [
        ("login", "Inicio de Sesión"),
        ("logout", "Cierre de Sesión"),
        ("create_user", "Crear Usuario"),
        ("update_user", "Actualizar Usuario"),
        ("delete_user", "Eliminar Usuario"),
        ("create_role", "Crear Rol"),
        ("update_role", "Actualizar Rol"),
        ("delete_role", "Eliminar Rol"),
        ("assign_role", "Asignar Rol"),
        ("remove_role", "Remover Rol"),
        ("create_permission", "Crear Permiso"),
        ("update_permission", "Actualizar Permiso"),
        ("delete_permission", "Eliminar Permiso"),
        ("system_start", "Inicio del Sistema"),
        ("system_stop", "Parada del Sistema"),
        ("error", "Error del Sistema"),
        ("other", "Otra Actividad"),
    ]

    NIVEL_CHOICES = [
        ("info", "Información"),
        ("warning", "Advertencia"),
        ("error", "Error"),
        ("critical", "Crítico"),
    ]

    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    tipo_accion = models.CharField(
        max_length=50, choices=TIPO_ACCION_CHOICES, default="other"
    )
    accion = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    nivel = models.CharField(max_length=20, choices=NIVEL_CHOICES, default="info")
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True, null=True)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    datos_adicionales = models.JSONField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Bitácora"
        ordering = ["-fecha_hora"]

    def __str__(self):
        usuario_nombre = self.usuario.username if self.usuario else "Sistema"
        return f"{usuario_nombre} - {self.get_tipo_accion_display()} - {self.fecha_hora.strftime('%d/%m/%Y %H:%M')}"

    @classmethod
    def log_activity(
        cls,
        usuario=None,
        tipo_accion="other",
        accion="",
        descripcion="",
        nivel="info",
        ip_address="127.0.0.1",
        user_agent="",
        datos_adicionales=None,
    ):
        """Método helper para registrar actividades fácilmente"""
        return cls.objects.create(
            usuario=usuario,
            tipo_accion=tipo_accion,
            accion=accion,
            descripcion=descripcion,
            nivel=nivel,
            ip_address=ip_address,
            user_agent=user_agent,
            datos_adicionales=datos_adicionales or {},
        )
