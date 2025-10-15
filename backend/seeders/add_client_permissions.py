#!/usr/bin/env python
"""
Script para agregar permisos relacionados con clientes y membresías
"""

import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Permiso, Rol, RolPermiso

def add_client_permissions():
    """Agregar permisos para clientes y membresías"""
    
    # Permisos para clientes
    client_permissions = [
        ('ver_cliente', 'Ver información de clientes'),
        ('crear_cliente', 'Crear nuevos clientes'),
        ('editar_cliente', 'Editar información de clientes'),
        ('eliminar_cliente', 'Eliminar/desactivar clientes'),
        
        # Permisos para planes de membresía
        ('ver_plan', 'Ver planes de membresía'),
        ('crear_plan', 'Crear planes de membresía'),
        ('editar_plan', 'Editar planes de membresía'),
        ('eliminar_plan', 'Eliminar planes de membresía'),
        
        # Permisos para promociones
        ('ver_promocion', 'Ver promociones'),
        ('crear_promocion', 'Crear promociones'),
        ('editar_promocion', 'Editar promociones'),
        ('eliminar_promocion', 'Eliminar promociones'),
        
        # Permisos para inscripciones
        ('ver_inscripcion', 'Ver inscripciones de membresía'),
        ('crear_inscripcion', 'Crear inscripciones de membresía'),
        ('editar_inscripcion', 'Editar inscripciones de membresía'),
        ('eliminar_inscripcion', 'Eliminar inscripciones de membresía'),
        
        # Permisos para membresías
        ('ver_membresia', 'Ver membresías'),
        ('crear_membresia', 'Crear membresías'),
        ('editar_membresia', 'Editar membresías'),
        ('eliminar_membresia', 'Eliminar membresías'),
        ('aplicar_promocion', 'Aplicar promociones a membresías'),
        ('remover_promocion', 'Remover promociones de membresías'),
    ]
    
    created_permissions = []
    for nombre, descripcion in client_permissions:
        permiso, created = Permiso.objects.get_or_create(
            nombre=nombre,
            defaults={'descripcion': descripcion}
        )
        if created:
            created_permissions.append(nombre)
            print(f"✅ Permiso creado: {nombre}")
        else:
            print(f"📝 Permiso ya existe: {nombre}")
    
    # Asignar permisos a roles existentes
    try:
        # Superadministrador - todos los permisos
        superadmin_role = Rol.objects.get(nombre='Superadministrador')
        admin_role = Rol.objects.get(nombre='Administrador')
        
        # Asignar todos los permisos al superadministrador
        for nombre, _ in client_permissions:
            permiso = Permiso.objects.get(nombre=nombre)
            RolPermiso.objects.get_or_create(rol=superadmin_role, permiso=permiso)
        
        print(f"\n✅ Todos los permisos asignados a Superadministrador")
        
        # Asignar permisos básicos al administrador (sin eliminar)
        admin_permissions = [
            'ver_cliente', 'crear_cliente', 'editar_cliente',
            'ver_plan', 'crear_plan', 'editar_plan',
            'ver_promocion', 'crear_promocion', 'editar_promocion',
            'ver_inscripcion', 'crear_inscripcion', 'editar_inscripcion',
            'ver_membresia', 'crear_membresia', 'editar_membresia',
            'aplicar_promocion', 'remover_promocion'
        ]
        
        for nombre in admin_permissions:
            permiso = Permiso.objects.get(nombre=nombre)
            RolPermiso.objects.get_or_create(rol=admin_role, permiso=permiso)
        
        print(f"✅ Permisos básicos asignados a Administrador")
        
    except Rol.DoesNotExist as e:
        print(f"❌ Error: No se encontró el rol especificado: {e}")
    
    print(f"\n📊 Resumen:")
    print(f"   - Permisos creados: {len(created_permissions)}")
    print(f"   - Total de permisos de clientes: {len(client_permissions)}")
    
    return created_permissions

if __name__ == "__main__":
    print("🚀 Agregando permisos para clientes y membresías...")
    print("=" * 50)
    
    created = add_client_permissions()
    
    print("\n" + "=" * 50)
    print("✅ Proceso completado exitosamente!")
    
    if created:
        print(f"\n🆕 Nuevos permisos agregados:")
        for perm in created:
            print(f"   - {perm}")