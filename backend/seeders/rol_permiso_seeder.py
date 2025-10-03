from .base_seeder import BaseSeeder
from api.models import Rol, Permiso, RolPermiso, UsuarioRol
from django.contrib.auth.models import User
from django.db import transaction

class RolPermisoSeeder(BaseSeeder):
    def run(self):
        self.stdout.write(self.style.SUCCESS("Creando permisos..."))
        
        # Crear permisos basados en los módulos del sidebar y las jerarquías
        permisos = [
            # Dashboard - Todos pueden ver
            {"nombre": "Ver Dashboard", "descripcion": "Permite ver el panel de control"},
            
            # Usuarios - SuperAdmin puede todo, Admin solo ver
            {"nombre": "Ver Usuarios", "descripcion": "Permite ver la lista de usuarios"},
            {"nombre": "Crear Usuario", "descripcion": "Permite crear nuevos usuarios"},
            {"nombre": "Editar Usuario", "descripcion": "Permite editar usuarios existentes"},
            {"nombre": "Eliminar Usuario", "descripcion": "Permite eliminar usuarios"},
            
            # Roles - Solo SuperAdmin
            {"nombre": "Ver Roles", "descripcion": "Permite ver la lista de roles"},
            {"nombre": "Crear Rol", "descripcion": "Permite crear nuevos roles"},
            {"nombre": "Editar Rol", "descripcion": "Permite editar roles existentes"},
            {"nombre": "Eliminar Rol", "descripcion": "Permite eliminar roles"},
            
            # Permisos - Solo SuperAdmin
            {"nombre": "Ver Permisos", "descripcion": "Permite ver la lista de permisos"},
            {"nombre": "Asignar Permisos", "descripcion": "Permite asignar permisos a roles"},
            
            # Bitácora - SuperAdmin puede ver todo, Admin puede ver parcial
            {"nombre": "Ver Bitácora", "descripcion": "Permite ver los registros de actividad del sistema"},
            
            # Específicos por tipo de usuario
            {"nombre": "Gestionar Administradores", "descripcion": "Permite añadir/editar administradores (solo SuperAdmin)"},
            {"nombre": "Gestionar Instructores", "descripcion": "Permite añadir/editar instructores (SuperAdmin y Admin)"},
        ]
        
        created_permisos = []
        for perm_data in permisos:
            permiso, created = Permiso.objects.get_or_create(
                nombre=perm_data["nombre"],
                defaults={"descripcion": perm_data["descripcion"]}
            )
            created_permisos.append(permiso)
            
        # Crear roles según la jerarquía
        self.stdout.write(self.style.SUCCESS("Creando roles..."))
        super_admin = Rol.objects.get_or_create(nombre="SuperAdmin", 
                                            defaults={"descripcion": "Dueño del gimnasio con acceso completo al sistema"})[0]
        admin = Rol.objects.get_or_create(nombre="Administrador", 
                                      defaults={"descripcion": "Recepcionista con permisos para gestionar clientes e instructores"})[0]
        instructor = Rol.objects.get_or_create(nombre="Instructor", 
                                        defaults={"descripcion": "Instructor del gimnasio con acceso limitado"})[0]
        
        # SuperAdmin tiene todos los permisos
        all_permisos = Permiso.objects.all()
        for perm in all_permisos:
            RolPermiso.objects.get_or_create(rol=super_admin, permiso=perm)
        
        # Administrador tiene permisos específicos
        admin_permisos = Permiso.objects.filter(
            nombre__in=[
                "Ver Dashboard", 
                "Ver Usuarios",
                "Ver Bitácora",
                "Gestionar Instructores",
                # Se añadirán más permisos cuando se implementen clientes
            ]
        )
        for perm in admin_permisos:
            RolPermiso.objects.get_or_create(rol=admin, permiso=perm)
        
        # Instructor solo puede ver dashboard (por ahora)
        instructor_permisos = Permiso.objects.filter(
            nombre__in=["Ver Dashboard"]
        )
        for perm in instructor_permisos:
            RolPermiso.objects.get_or_create(rol=instructor, permiso=perm)
            
        # Asignar rol de SuperAdmin al usuario admin existente
        try:
            admin_user = User.objects.get(username="admin")
            UsuarioRol.objects.get_or_create(
                usuario=admin_user,
                rol=super_admin
            )
            self.stdout.write(self.style.SUCCESS(f"Usuario {admin_user.username} asignado como SuperAdmin"))
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING("Usuario admin no encontrado"))
            
        # Crear usuarios de ejemplo para cada rol
        self.create_example_users(super_admin, admin, instructor)
            
    def create_example_users(self, super_admin, admin, instructor):
        """Crear usuarios de ejemplo para cada rol"""
        try:
            # Crear usuario administrador de ejemplo
            admin_user, created = User.objects.get_or_create(
                username="administrador",
                defaults={
                    "email": "admin@goldenspartan.com",
                    "first_name": "Admin",
                    "last_name": "Usuario"
                }
            )
            if created:
                admin_user.set_password("admin123")
                admin_user.save()
                self.stdout.write(self.style.SUCCESS(f"Usuario administrador creado: administrador/admin123"))
                
            # Asignar rol de Administrador
            UsuarioRol.objects.get_or_create(
                usuario=admin_user,
                rol=admin
            )
            
            # Crear usuario instructor de ejemplo
            instructor_user, created = User.objects.get_or_create(
                username="instructor",
                defaults={
                    "email": "instructor@goldenspartan.com",
                    "first_name": "Instructor",
                    "last_name": "Usuario"
                }
            )
            if created:
                instructor_user.set_password("instructor123")
                instructor_user.save()
                self.stdout.write(self.style.SUCCESS(f"Usuario instructor creado: instructor/instructor123"))
                
            # Asignar rol de Instructor
            UsuarioRol.objects.get_or_create(
                usuario=instructor_user,
                rol=instructor
            )
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error al crear usuarios de ejemplo: {str(e)}"))