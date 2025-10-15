from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid
from datetime import timedelta

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


class PasswordResetToken(models.Model):
    """Modelo para tokens de recuperación de contraseña"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Token de Recuperación"
        verbose_name_plural = "Tokens de Recuperación"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Token para {self.user.username} - {self.created_at.strftime('%d/%m/%Y %H:%M')}"
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # El token expira en 1 hora
            self.expires_at = timezone.now() + timedelta(hours=1)
        super().save(*args, **kwargs)
    
    def is_expired(self):
        """Verifica si el token ha expirado"""
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        """Verifica si el token es válido (no usado y no expirado)"""
        return not self.used and not self.is_expired()
    
    def mark_as_used(self):
        """Marca el token como usado"""
        self.used = True
        self.save()


# ===== MODELOS DE CLIENTES Y MEMBRESÍAS =====

class Cliente(models.Model):
    """Modelo para los clientes del gimnasio"""
    EXPERIENCIA_CHOICES = [
        ('principiante', 'Principiante'),
        ('intermedio', 'Intermedio'),
        ('avanzado', 'Avanzado'),
        ('experto', 'Experto'),
    ]
    
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    telefono = models.CharField(max_length=20)
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    altura = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    experiencia = models.CharField(max_length=20, choices=EXPERIENCIA_CHOICES, default='principiante')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ['apellido', 'nombre']
    
    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    
    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"


class PlanMembresia(models.Model):
    """Modelo para los planes de membresía disponibles"""
    nombre = models.CharField(max_length=50)
    duracion = models.IntegerField(help_text="Duración en días")
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Plan de Membresía"
        verbose_name_plural = "Planes de Membresía"
        ordering = ['precio_base']
    
    def __str__(self):
        return f"{self.nombre} - {self.duracion} días"


class Promocion(models.Model):
    """Modelo para promociones aplicables a membresías"""
    ESTADO_CHOICES = [
        ('activa', 'Activa'),
        ('inactiva', 'Inactiva'),
        ('vencida', 'Vencida'),
    ]
    
    nombre = models.CharField(max_length=100)
    meses = models.IntegerField(help_text="Duración de la promoción en meses")
    descuento = models.DecimalField(max_digits=5, decimal_places=2, help_text="Porcentaje de descuento")
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activa')
    
    class Meta:
        verbose_name = "Promoción"
        verbose_name_plural = "Promociones"
        ordering = ['-fecha_inicio']
    
    def __str__(self):
        return f"{self.nombre} - {self.descuento}% descuento"
    
    def is_active(self):
        """Verifica si la promoción está activa y dentro del período válido"""
        from django.utils import timezone
        today = timezone.now().date()
        return self.estado == 'activa' and self.fecha_inicio <= today <= self.fecha_fin


class InscripcionMembresia(models.Model):
    """Modelo para las inscripciones de membresía"""
    METODO_PAGO_CHOICES = [
        ('efectivo', 'Efectivo'),
        ('tarjeta_credito', 'Tarjeta de Crédito'),
        ('tarjeta_debito', 'Tarjeta de Débito'),
        ('transferencia', 'Transferencia Bancaria'),
        ('paypal', 'PayPal'),
    ]
    
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='inscripciones')
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_de_pago = models.CharField(max_length=30, choices=METODO_PAGO_CHOICES)
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Inscripción de Membresía"
        verbose_name_plural = "Inscripciones de Membresía"
        ordering = ['-fecha_inscripcion']
    
    def __str__(self):
        return f"Inscripción {self.cliente.nombre_completo} - ${self.monto}"


class Membresia(models.Model):
    """Modelo para las membresías activas de los clientes"""
    ESTADO_CHOICES = [
        ('activa', 'Activa'),
        ('vencida', 'Vencida'),
        ('suspendida', 'Suspendida'),
        ('cancelada', 'Cancelada'),
    ]
    
    inscripcion = models.OneToOneField(InscripcionMembresia, on_delete=models.CASCADE, related_name='membresia')
    plan = models.ForeignKey(PlanMembresia, on_delete=models.CASCADE, related_name='membresias')
    usuario_registro = models.ForeignKey(User, on_delete=models.CASCADE, related_name='membresias_registradas')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activa')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    
    class Meta:
        verbose_name = "Membresía"
        verbose_name_plural = "Membresías"
        ordering = ['-fecha_inicio']
    
    def __str__(self):
        return f"Membresía {self.inscripcion.cliente.nombre_completo} - {self.plan.nombre}"
    
    def is_active(self):
        """Verifica si la membresía está activa"""
        from django.utils import timezone
        today = timezone.now().date()
        return self.estado == 'activa' and self.fecha_inicio <= today <= self.fecha_fin
    
    def days_remaining(self):
        """Calcula los días restantes de la membresía"""
        from django.utils import timezone
        today = timezone.now().date()
        if self.fecha_fin >= today:
            return (self.fecha_fin - today).days
        return 0


class MembresiaPromocion(models.Model):
    """Modelo para aplicar promociones a membresías"""
    membresia = models.ForeignKey(Membresia, on_delete=models.CASCADE, related_name='promociones')
    promocion = models.ForeignKey(Promocion, on_delete=models.CASCADE, related_name='membresias')
    fecha_aplicacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('membresia', 'promocion')
        verbose_name = "Membresía-Promoción"
        verbose_name_plural = "Membresías-Promociones"
    
    def __str__(self):
        return f"{self.membresia} - {self.promocion.nombre}"
