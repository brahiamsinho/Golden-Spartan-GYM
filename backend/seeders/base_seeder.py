"""
Clase base para todos los seeders
Proporciona funcionalidad común para todos los seeders
"""

from django.core.management.base import BaseCommand
from django.db import transaction
import logging

logger = logging.getLogger(__name__)


class BaseSeeder:
    """Clase base para todos los seeders"""

    def __init__(self, command: BaseCommand):
        self.command = command
        self.stdout = command.stdout
        self.style = command.style

    def run(self):
        """Método principal que debe ser implementado por cada seeder"""
        raise NotImplementedError("Cada seeder debe implementar el método run()")

    def log_success(self, message: str):
        """Log de éxito"""
        self.stdout.write(self.style.SUCCESS(message))

    def log_warning(self, message: str):
        """Log de advertencia"""
        self.stdout.write(self.style.WARNING(message))

    def log_error(self, message: str):
        """Log de error"""
        self.stdout.write(self.style.ERROR(message))

    def log_info(self, message: str):
        """Log informativo"""
        self.stdout.write(message)
