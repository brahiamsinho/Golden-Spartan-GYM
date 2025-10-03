from django.core.management.base import BaseCommand
from django.db import transaction
from django.core.management import call_command
from seeders.user_seeder import UserSeeder
from seeders.rol_permiso_seeder import RolPermisoSeeder
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Ejecuta los seeders para poblar la base de datos con datos iniciales"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Elimina los datos existentes antes de crear los nuevos",
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Iniciando proceso de seeders..."))

        try:
            # Ejecutar migraciones primero
            self.stdout.write("Ejecutando migraciones...")
            call_command("migrate", verbosity=0)
            self.stdout.write(self.style.SUCCESS("Migraciones completadas"))

            with transaction.atomic():
                # Ejecutar seeders
                self.run_seeders(options)

            self.stdout.write(self.style.SUCCESS("Seeders ejecutados correctamente!"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error ejecutando seeders: {str(e)}"))
            raise

    def run_seeders(self, options):
        """Ejecuta todos los seeders registrados"""
        # Lista de seeders a ejecutar
        seeders = [
            RolPermisoSeeder(self),  # Primero crear roles y permisos
            UserSeeder(self),  # Luego crear usuarios
        ]

        for seeder in seeders:
            if options["reset"]:
                # Si tiene método reset, ejecutarlo
                if hasattr(seeder, "reset_data"):
                    seeder.reset_data()

            # Ejecutar el seeder
            seeder.run()
