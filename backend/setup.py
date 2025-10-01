#!/usr/bin/env python
"""
Script de configuración automática para el proyecto Golden Spartan SI1
Ejecuta migraciones, crea superusuario y configura la base de datos
"""

import os
import sys
import django
from django.core.management import execute_from_command_line


def setup_database():
    """Configura la base de datos ejecutando migraciones y seeders"""

    print("🚀 Iniciando configuración del proyecto Golden Spartan SI1...")

    # Configurar Django
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    django.setup()

    try:
        # Ejecutar migraciones
        print("📦 Ejecutando migraciones...")
        execute_from_command_line(["manage.py", "migrate"])
        print("✅ Migraciones completadas")

        # Ejecutar seeders
        print("🌱 Ejecutando seeders...")
        execute_from_command_line(["manage.py", "seed"])
        print("✅ Seeders completados")

        print("\n🎉 ¡Configuración completada exitosamente!")
        print("\n📋 Información de acceso:")
        print("   🌐 Admin Panel: http://localhost:8000/admin/")
        print("   👤 Username: admin")
        print("   🔑 Password: admin")
        print("\n🚀 Para iniciar el servidor ejecuta:")
        print("   python manage.py runserver")

    except Exception as e:
        print(f"❌ Error durante la configuración: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    setup_database()
