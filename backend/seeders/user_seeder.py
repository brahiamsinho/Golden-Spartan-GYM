"""
Seeder para usuarios del sistema
Crea usuarios iniciales incluyendo el superusuario admin
"""

from django.contrib.auth.models import User
from .base_seeder import BaseSeeder


class UserSeeder(BaseSeeder):
    """Seeder para crear usuarios del sistema"""

    def run(self):
        """Ejecuta el seeder de usuarios"""
        self.log_info("Creando usuarios del sistema...")

        # Crear superusuario admin
        self.create_admin_user()

        # Aquí puedes agregar más usuarios si es necesario
        # self.create_test_users()

        self.log_success("Usuarios creados correctamente")

    def create_admin_user(self):
        """Crea el superusuario admin"""
        username = "admin"
        email = "admin@gym.com"
        password = "admin"

        # Verificar si el usuario ya existe
        if User.objects.filter(username=username).exists():
            self.log_warning(f'El usuario "{username}" ya existe')
            return

        # Crear el superusuario
        user = User.objects.create_superuser(
            username=username, email=email, password=password
        )

        self.log_success(
            f"Superusuario creado:\n"
            f"   Username: {username}\n"
            f"   Email: {email}\n"
            f"   Password: {password}"
        )

        # Log para desarrollo
        logger.info(f"Superusuario {username} creado exitosamente")
        return user

    def create_test_users(self):
        """Crea usuarios de prueba (opcional)"""
        test_users = [
            {
                "username": "test_user",
                "email": "test@gym.com",
                "password": "test123",
                "is_staff": False,
                "is_superuser": False,
            },
            {
                "username": "trainer",
                "email": "trainer@gym.com",
                "password": "trainer123",
                "is_staff": True,
                "is_superuser": False,
            },
        ]

        for user_data in test_users:
            if not User.objects.filter(username=user_data["username"]).exists():
                User.objects.create_user(
                    username=user_data["username"],
                    email=user_data["email"],
                    password=user_data["password"],
                    is_staff=user_data["is_staff"],
                    is_superuser=user_data["is_superuser"],
                )
                self.log_info(f"Usuario de prueba creado: {user_data['username']}")

    def reset_data(self):
        """Elimina todos los usuarios excepto el que ejecuta el comando"""
        self.log_info("Eliminando usuarios existentes...")

        # Eliminar usuarios (excepto superusuarios)
        deleted_count = User.objects.exclude(is_superuser=True).count()
        User.objects.exclude(is_superuser=True).delete()

        self.log_warning(f"Datos existentes eliminados: {deleted_count} usuarios")
