#!/usr/bin/env python
"""
Script para verificar permisos del usuario admin
"""
import os
import sys
import django

# Setup Django
sys.path.append('/d/Gym/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UsuarioRol, RolPermiso, Permiso

def verificar_permisos_usuario(username='admin'):
    try:
        user = User.objects.get(username=username)
        print(f"Usuario: {user.username}")
        print(f"Es superusuario: {user.is_superuser}")
        print(f"Es staff: {user.is_staff}")
        print(f"Está activo: {user.is_active}")
        print("-" * 50)
        
        # Verificar roles
        usuario_roles = UsuarioRol.objects.filter(usuario=user)
        print(f"Roles asignados: {usuario_roles.count()}")
        
        for ur in usuario_roles:
            print(f"  - {ur.rol.nombre}: {ur.rol.descripcion}")
            
            # Verificar permisos del rol
            rol_permisos = RolPermiso.objects.filter(rol=ur.rol)
            print(f"    Permisos ({rol_permisos.count()}):")
            
            for rp in rol_permisos:
                print(f"      * {rp.permiso.nombre}")
        
        print("-" * 50)
        
        # Verificar permisos específicos para gestionar usuarios
        permisos_necesarios = [
            "Gestionar Administradores",
            "Gestionar Instructores", 
            "Gestionar Super Administradores",
            "Editar Usuario",
            "Ver Usuarios"
        ]
        
        print("Verificación de permisos específicos:")
        for permiso_nombre in permisos_necesarios:
            tiene_permiso = False
            
            if user.is_superuser:
                tiene_permiso = True
                razon = "Es superusuario"
            else:
                for ur in usuario_roles:
                    rol_permisos = RolPermiso.objects.filter(
                        rol=ur.rol, permiso__nombre=permiso_nombre
                    )
                    if rol_permisos.exists():
                        tiene_permiso = True
                        razon = f"A través del rol {ur.rol.nombre}"
                        break
                
                if not tiene_permiso:
                    razon = "No tiene este permiso"
            
            status = "✓" if tiene_permiso else "✗"
            print(f"  {status} {permiso_nombre}: {razon}")
            
    except User.DoesNotExist:
        print(f"Usuario '{username}' no existe")

if __name__ == "__main__":
    verificar_permisos_usuario()