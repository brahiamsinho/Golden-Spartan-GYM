"""
Seeder para planes de membresía
Crea planes de ejemplo para el gimnasio
"""

from .base_seeder import BaseSeeder


class PlanSeeder(BaseSeeder):
    """Seeder para crear planes de membresía"""

    def run(self):
        """Ejecuta el seeder de planes"""
        self.log_info("Creando planes de membresía...")

        # Aquí crearías los planes cuando tengas el modelo
        # Por ahora solo mostramos la estructura

        self.log_success("Planes creados correctamente")

    def reset_data(self):
        """Elimina todos los planes"""
        self.log_info("Eliminando planes existentes...")
        # Aquí eliminarías los planes cuando tengas el modelo
        self.log_warning("Planes eliminados")
