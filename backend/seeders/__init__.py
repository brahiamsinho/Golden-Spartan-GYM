"""
Módulo de seeders para el proyecto Golden Spartan SI1
Contiene todos los seeders para poblar la base de datos con datos iniciales
"""

from .base_seeder import BaseSeeder
from .user_seeder import UserSeeder
from .rol_permiso_seeder import RolPermisoSeeder

__all__ = ["BaseSeeder", "UserSeeder", "RolPermisoSeeder"]
