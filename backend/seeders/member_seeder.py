"""
Seeder para miembros del gimnasio
Crea miembros de ejemplo para testing
"""

from .base_seeder import BaseSeeder


class MemberSeeder(BaseSeeder):
    """Seeder para crear miembros del gimnasio"""

    def run(self):
        """Ejecuta el seeder de miembros"""
        self.log_info("Creando miembros del gimnasio...")

        # Aquí crearías los miembros cuando tengas el modelo
        # Por ahora solo mostramos la estructura

        self.log_success("Miembros creados correctamente")

    def reset_data(self):
        """Elimina todos los miembros"""
        self.log_info("Eliminando miembros existentes...")
        # Aquí eliminarías los miembros cuando tengas el modelo
        self.log_warning("Miembros eliminados")
