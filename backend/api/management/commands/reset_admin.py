from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UsuarioRol, Rol

class Command(BaseCommand):
    help = "Restablece o crea el usuario administrador con contraseña admin"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Restableciendo el usuario administrador..."))
        
        try:
            # Crear o actualizar el usuario admin
            admin_user, created = User.objects.get_or_create(
                username="admin",
                defaults={
                    "email": "admin@goldenspartan.com",
                    "first_name": "Super",
                    "last_name": "Admin",
                    "is_staff": True,
                    "is_superuser": True
                }
            )
            
            # Asegurarse de que el usuario tenga la contraseña correcta y permisos
            admin_user.set_password("admin")
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            
            # Asignar rol de SuperAdmin si existe el modelo Rol
            try:
                super_admin = Rol.objects.get(nombre="SuperAdmin")
                UsuarioRol.objects.get_or_create(
                    usuario=admin_user,
                    rol=super_admin
                )
                self.stdout.write(self.style.SUCCESS(f"Usuario {admin_user.username} asignado como SuperAdmin"))
            except Rol.DoesNotExist:
                self.stdout.write(self.style.WARNING("El rol SuperAdmin no existe. Se ha creado el usuario admin pero sin rol asignado."))
            
            self.stdout.write(self.style.SUCCESS(f"{'Creado' if created else 'Restablecido'} usuario admin con contraseña: admin"))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error al restablecer usuario admin: {str(e)}"))
            return
        
        self.stdout.write(self.style.SUCCESS("Proceso completado. Puede acceder al panel de administración con:"))
        self.stdout.write(self.style.SUCCESS("URL: http://localhost:8000/admin/"))
        self.stdout.write(self.style.SUCCESS("Usuario: admin"))
        self.stdout.write(self.style.SUCCESS("Contraseña: admin"))