#!/usr/bin/env python
"""
Script para configurar y ejecutar el backend Django
"""

import os
import sys
import subprocess
import django
from django.core.management import execute_from_command_line


def setup_environment():
    """Configurar variables de entorno"""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

    # Configuración de desarrollo
    os.environ["SECRET_KEY"] = (
        "django-insecure-)&$-5a7zpb^z0@1g+u0t@j2fs%5sx+$q2mxpr2oqjn1z+kq*_5"
    )
    os.environ["DEBUG"] = "True"
    os.environ["ALLOWED_HOSTS"] = "localhost,127.0.0.1,0.0.0.0"
    os.environ["CORS_ALLOWED_ORIGINS"] = "http://localhost:5173,http://127.0.0.1:5173"


def run_migrations():
    """Ejecutar migraciones"""
    print("🔄 Ejecutando migraciones...")
    execute_from_command_line(["manage.py", "migrate"])


def create_superuser():
    """Crear superusuario si no existe"""
    from django.contrib.auth.models import User

    if not User.objects.filter(username="admin").exists():
        print("👤 Creando superusuario...")
        User.objects.create_superuser("admin", "admin@gym.com", "admin")
        print("✅ Superusuario creado: admin/admin")
    else:
        print("✅ Superusuario ya existe")


def seed_data():
    """Poblar la base de datos con datos iniciales"""
    print("🌱 Poblando base de datos...")
    try:
        execute_from_command_line(["manage.py", "seed"])
        print("✅ Datos iniciales creados")
    except Exception as e:
        print(f"⚠️ Error al poblar datos: {e}")


def main():
    """Función principal"""
    print("🚀 Configurando backend Django...")

    # Configurar entorno
    setup_environment()

    # Configurar Django
    django.setup()

    # Ejecutar migraciones
    run_migrations()

    # Crear superusuario
    create_superuser()

    # Poblar datos
    seed_data()

    print("✅ Backend configurado correctamente")
    print("🌐 Ejecutando servidor en http://localhost:8000")

    # Ejecutar servidor
    execute_from_command_line(["manage.py", "runserver", "0.0.0.0:8000"])


if __name__ == "__main__":
    main()
