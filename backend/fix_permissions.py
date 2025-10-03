#!/usr/bin/env python
"""
Script para corregir permisos de roles
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from api.models import Rol, Permiso, RolPermiso, UsuarioRol


def fix_permissions():
    """Corregir permisos de roles"""

    # Limpiar roles duplicados y permisos
    print("Limpiando roles duplicados...")
    Rol.objects.filter(nombre__in=["SuperAdmin", "Super Administrador"]).delete()
    RolPermiso.objects.all().delete()

    # Crear roles correctos
    roles_data = [
        {
            "nombre": "Super Administrador",
            "descripcion": "Acceso completo al sistema",
            "permisos": [
                "Ver Dashboard",
                "Ver Usuarios",
                "Crear Usuario",
                "Editar Usuario",
                "Eliminar Usuario",
                "Ver Roles",
                "Crear Rol",
                "Editar Rol",
                "Eliminar Rol",
                "Ver Permisos",
                "Asignar Permisos",
                "Ver Bitácora",
            ],
        },
        {
            "nombre": "Administrador",
            "descripcion": "Gestión de usuarios y sistema",
            "permisos": [
                "Ver Dashboard",
                "Ver Usuarios",
                "Crear Usuario",
                "Editar Usuario",
                "Ver Roles",
                "Ver Bitácora",
            ],
        },
        {
            "nombre": "Instructor",
            "descripcion": "Gestión básica de usuarios",
            "permisos": ["Ver Dashboard", "Ver Usuarios"],
        },
    ]

    for role_data in roles_data:
        # Crear o actualizar rol
        rol, created = Rol.objects.get_or_create(
            nombre=role_data["nombre"],
            defaults={"descripcion": role_data["descripcion"]},
        )

        if created:
            print(f"Rol creado: {rol.nombre}")
        else:
            print(f"Rol actualizado: {rol.nombre}")

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


def update_user_roles():
    """Actualizar roles de usuarios existentes"""
    from django.contrib.auth.models import User

    print("\nActualizando roles de usuarios...")

    # Mapeo de usuarios a roles
    user_roles = {
        "admin": "Super Administrador",
        "administrador": "Administrador",
        "instructor": "Instructor",
        "brahian": "Administrador",
        "brandon123": "Administrador",
        "brahi": "Instructor",
    }

    for username, role_name in user_roles.items():
        try:
            user = User.objects.get(username=username)
            rol = Rol.objects.get(nombre=role_name)

            # Eliminar roles anteriores
            UsuarioRol.objects.filter(usuario=user).delete()

            # Asignar nuevo rol
            UsuarioRol.objects.create(usuario=user, rol=rol)
            print(f"Usuario {username} -> Rol {role_name}")

        except User.DoesNotExist:
            print(f"Usuario {username} no encontrado")
        except Rol.DoesNotExist:
            print(f"Rol {role_name} no encontrado")


def main():
    print("Corrigiendo permisos de roles...")
    print("=" * 50)

    try:
        fix_permissions()
        update_user_roles()

        print("\n" + "=" * 50)
        print("Permisos corregidos exitosamente!")

        # Mostrar resumen
        print("\nRESUMEN DE PERMISOS:")
        print("-" * 30)
        for rol in Rol.objects.all():
            permisos = RolPermiso.objects.filter(rol=rol)
            print(f"\n{rol.nombre}:")
            for rp in permisos:
                print(f"  - {rp.permiso.nombre}")

    except Exception as e:
        print(f"\nError: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
