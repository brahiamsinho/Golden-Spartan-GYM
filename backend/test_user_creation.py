#!/usr/bin/env python
"""
Script para probar la creación de usuarios
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth.models import User
from api.models import Rol, UsuarioRol
from api.serializers import UserCreateSerializer


def test_user_creation():
    """Probar la creación de un usuario instructor"""

    print("Probando creación de usuario instructor...")

    # Datos de prueba
    test_data = {
        "username": "test_instructor",
        "email": "test@instructor.com",
        "password": "test123",
        "first_name": "Test",
        "last_name": "Instructor",
        "rol": 3,  # ID del rol Instructor
    }

    print(f"Datos de prueba: {test_data}")

    # Crear serializer
    serializer = UserCreateSerializer(data=test_data)

    if serializer.is_valid():
        print("Datos validos")
        user = serializer.save()
        print(f"Usuario creado: {user.username}")

        # Verificar rol asignado
        usuario_rol = UsuarioRol.objects.get(usuario=user)
        print(f"Rol asignado: {usuario_rol.rol.nombre}")

        # Limpiar usuario de prueba
        user.delete()
        print("Usuario de prueba eliminado")

    else:
        print("Errores de validacion:")
        for field, errors in serializer.errors.items():
            print(f"  {field}: {errors}")


def test_roles():
    """Verificar roles disponibles"""
    print("\nRoles disponibles:")
    roles = Rol.objects.all()
    for rol in roles:
        print(f"  ID: {rol.id}, Nombre: {rol.nombre}")


if __name__ == "__main__":
    test_roles()
    test_user_creation()
