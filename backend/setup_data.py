#!/usr/bin/env python
"""
Script para crear datos de prueba en el backend
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth.models import User
from api.models import Rol, Permiso, RolPermiso, UsuarioRol


def create_roles():
    """Crear roles del sistema"""
    roles_data = [
        {
            "nombre": "Super Administrador",
            "descripcion": "Acceso completo al sistema",
            "permisos": [
                "Ver Dashboard",
                "Gestionar Usuarios",
                "Crear Usuario",
                "Eliminar Usuario",
                "Ver Roles",
                "Crear Rol",
                "Eliminar Rol",
                "Ver Permisos",
                "Asignar Permisos",
                "Ver Bitácora",
                "Gestionar Administradores",
                "Gestionar Instructores",
            ],
        },
        {
            "nombre": "Administrador",
            "descripcion": "Gestión de usuarios y clientes",
            "permisos": [
                "Ver Dashboard",
                "Ver Usuarios",
                "Crear Usuario",
                "Ver Roles",
                "Ver Bitácora",
                "Gestionar Administradores",
                "Gestionar Instructores",
            ],
        },
        {
            "nombre": "Instructor",
            "descripcion": "Gestión básica de clientes",
            "permisos": ["Ver Dashboard", "Ver Usuarios"],
        },
    ]

    for role_data in roles_data:
        rol, created = Rol.objects.get_or_create(
            nombre=role_data["nombre"],
            defaults={"descripcion": role_data["descripcion"]},
        )

        if created:
            print(f"Rol creado: {rol.nombre}")
        else:
            print(f"Rol ya existe: {rol.nombre}")

        # Crear permisos si no existen
        for permiso_nombre in role_data["permisos"]:
            permiso, created = Permiso.objects.get_or_create(
                nombre=permiso_nombre,
                defaults={"descripcion": f"Permiso para {permiso_nombre}"},
            )

            if created:
                print(f"  Permiso creado: {permiso.nombre}")

            # Asignar permiso al rol
            rol_permiso, created = RolPermiso.objects.get_or_create(
                rol=rol, permiso=permiso
            )

            if created:
                print(f"  Permiso asignado: {permiso.nombre} -> {rol.nombre}")


def create_users():
    """Crear usuarios de prueba"""
    users_data = [
        {
            "username": "admin",
            "email": "admin@goldenspartan.com",
            "password": "admin",
            "first_name": "Admin",
            "last_name": "Principal",
            "role": "Super Administrador",
        },
        {
            "username": "administrador",
            "email": "admin@goldenspartan.com",
            "password": "admin123",
            "first_name": "Administrador",
            "last_name": "Sistema",
            "role": "Administrador",
        },
        {
            "username": "instructor",
            "email": "instructor@goldenspartan.com",
            "password": "instructor123",
            "first_name": "Instructor",
            "last_name": "Gym",
            "role": "Instructor",
        },
    ]

    for user_data in users_data:
        user, created = User.objects.get_or_create(
            username=user_data["username"],
            defaults={
                "email": user_data["email"],
                "first_name": user_data["first_name"],
                "last_name": user_data["last_name"],
                "is_active": True,
            },
        )

        if created:
            user.set_password(user_data["password"])
            user.save()
            print(f"Usuario creado: {user.username}")
        else:
            print(f"Usuario ya existe: {user.username}")

        # Asignar rol al usuario
        try:
            rol = Rol.objects.get(nombre=user_data["role"])
            usuario_rol, created = UsuarioRol.objects.get_or_create(
                usuario=user, rol=rol
            )

            if created:
                print(f"  Rol asignado: {rol.nombre} -> {user.username}")
        except Rol.DoesNotExist:
            print(f"  Error: Rol '{user_data['role']}' no encontrado")


def main():
    print("Iniciando configuracion de datos de prueba...")
    print("=" * 50)

    try:
        print("\nCreando roles y permisos...")
        create_roles()

        print("\nCreando usuarios...")
        create_users()

        print("\n" + "=" * 50)
        print("Configuracion completada exitosamente!")
        print("\nUsuarios de prueba creados:")
        print("  - admin/admin (Super Administrador)")
        print("  - administrador/admin123 (Administrador)")
        print("  - instructor/instructor123 (Instructor)")

    except Exception as e:
        print(f"\nError durante la configuracion: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
