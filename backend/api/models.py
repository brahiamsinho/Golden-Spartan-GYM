from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Rol(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)
    
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
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name='permisos')
    permiso = models.ForeignKey(Permiso, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('rol', 'permiso')
        verbose_name = "Rol-Permiso"
        verbose_name_plural = "Roles-Permisos"
    
    def __str__(self):
        return f"{self.rol.nombre} - {self.permiso.nombre}"

class UsuarioRol(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roles')
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('usuario', 'rol')
        verbose_name = "Usuario-Rol"
        verbose_name_plural = "Usuarios-Roles"
    
    def __str__(self):
        return f"{self.usuario.username} - {self.rol.nombre}"

class Bitacora(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    accion = models.CharField(max_length=100)
    fecha = models.DateField(auto_now_add=True)
    hora = models.TimeField(auto_now_add=True)
    ip = models.GenericIPAddressField()
    
    class Meta:
        verbose_name_plural = "Bitácora"
    
    def __str__(self):
        return f"{self.usuario.username if self.usuario else 'Sistema'} - {self.accion} - {self.fecha}"
