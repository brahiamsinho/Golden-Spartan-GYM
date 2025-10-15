#!/usr/bin/env python
"""
Script para agregar datos de ejemplo para clientes y membresías
"""

import os
import sys
import django
from datetime import date, timedelta
from decimal import Decimal

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Cliente, PlanMembresia, Promocion, InscripcionMembresia, Membresia

def create_sample_data():
    """Crear datos de ejemplo"""
    
    print("🏋️ Creando datos de ejemplo para Golden Spartan Gym...")
    print("=" * 60)
    
    # 1. Crear planes de membresía
    print("\n📋 Creando planes de membresía...")
    planes = [
        {
            'nombre': 'Plan Básico',
            'duracion': 30,  # 30 días
            'precio_base': Decimal('150.00'),
            'descripcion': 'Acceso completo al gimnasio por 1 mes'
        },
        {
            'nombre': 'Plan Trimestral',
            'duracion': 90,  # 90 días
            'precio_base': Decimal('400.00'),
            'descripcion': 'Acceso completo al gimnasio por 3 meses con 10% de descuento'
        },
        {
            'nombre': 'Plan Semestral',
            'duracion': 180,  # 180 días
            'precio_base': Decimal('750.00'),
            'descripcion': 'Acceso completo al gimnasio por 6 meses con 15% de descuento'
        },
        {
            'nombre': 'Plan Anual',
            'duracion': 365,  # 365 días
            'precio_base': Decimal('1400.00'),
            'descripcion': 'Acceso completo al gimnasio por 1 año con 20% de descuento'
        },
        {
            'nombre': 'Plan Premium',
            'duracion': 30,  # 30 días
            'precio_base': Decimal('250.00'),
            'descripcion': 'Acceso completo + clases personalizadas + nutricionista'
        }
    ]
    
    created_plans = []
    for plan_data in planes:
        plan, created = PlanMembresia.objects.get_or_create(
            nombre=plan_data['nombre'],
            defaults=plan_data
        )
        if created:
            created_plans.append(plan.nombre)
            print(f"✅ Plan creado: {plan.nombre} - ${plan.precio_base}")
        else:
            print(f"📝 Plan ya existe: {plan.nombre}")
    
    # 2. Crear promociones
    print("\n🎉 Creando promociones...")
    today = date.today()
    promociones = [
        {
            'nombre': 'Descuento de Año Nuevo',
            'meses': 1,
            'descuento': Decimal('20.00'),
            'fecha_inicio': today,
            'fecha_fin': today + timedelta(days=30),
            'estado': 'activa'
        },
        {
            'nombre': 'Promo Estudiantes',
            'meses': 3,
            'descuento': Decimal('15.00'),
            'fecha_inicio': today,
            'fecha_fin': today + timedelta(days=90),
            'estado': 'activa'
        },
        {
            'nombre': 'Descuento Familiar',
            'meses': 6,
            'descuento': Decimal('25.00'),
            'fecha_inicio': today,
            'fecha_fin': today + timedelta(days=60),
            'estado': 'activa'
        }
    ]
    
    created_promos = []
    for promo_data in promociones:
        promo, created = Promocion.objects.get_or_create(
            nombre=promo_data['nombre'],
            defaults=promo_data
        )
        if created:
            created_promos.append(promo.nombre)
            print(f"✅ Promoción creada: {promo.nombre} - {promo.descuento}% descuento")
        else:
            print(f"📝 Promoción ya existe: {promo.nombre}")
    
    # 3. Crear clientes de ejemplo
    print("\n👥 Creando clientes de ejemplo...")
    clientes_data = [
        {
            'nombre': 'Juan Carlos',
            'apellido': 'Pérez González',
            'telefono': '+591 70123456',
            'peso': Decimal('75.50'),
            'altura': Decimal('1.75'),
            'experiencia': 'intermedio'
        },
        {
            'nombre': 'María Elena',
            'apellido': 'Rodriguez Morales',
            'telefono': '+591 71234567',
            'peso': Decimal('62.00'),
            'altura': Decimal('1.65'),
            'experiencia': 'principiante'
        },
        {
            'nombre': 'Roberto',
            'apellido': 'Silva Mamani',
            'telefono': '+591 72345678',
            'peso': Decimal('80.25'),
            'altura': Decimal('1.80'),
            'experiencia': 'avanzado'
        },
        {
            'nombre': 'Ana Sofía',
            'apellido': 'Gutierrez Quispe',
            'telefono': '+591 73456789',
            'peso': Decimal('58.75'),
            'altura': Decimal('1.68'),
            'experiencia': 'intermedio'
        },
        {
            'nombre': 'Carlos Alberto',
            'apellido': 'Mendoza Vargas',
            'telefono': '+591 74567890',
            'peso': Decimal('85.00'),
            'altura': Decimal('1.82'),
            'experiencia': 'experto'
        }
    ]
    
    created_clients = []
    for cliente_data in clientes_data:
        cliente, created = Cliente.objects.get_or_create(
            nombre=cliente_data['nombre'],
            apellido=cliente_data['apellido'],
            defaults=cliente_data
        )
        if created:
            created_clients.append(cliente.nombre_completo)
            print(f"✅ Cliente creado: {cliente.nombre_completo} - {cliente.telefono}")
        else:
            print(f"📝 Cliente ya existe: {cliente.nombre_completo}")
    
    # 4. Crear algunas inscripciones y membresías
    print("\n💳 Creando inscripciones y membresías de ejemplo...")
    try:
        # Obtener usuarios admin para asignar como quien registra
        user_admin = User.objects.filter(is_superuser=True).first()
        if not user_admin:
            user_admin = User.objects.filter(username='admin').first()
        
        if user_admin:
            # Crear algunas inscripciones
            clientes = Cliente.objects.all()[:3]  # Primeros 3 clientes
            plan_basico = PlanMembresia.objects.get(nombre='Plan Básico')
            plan_trimestral = PlanMembresia.objects.get(nombre='Plan Trimestral')
            
            for i, cliente in enumerate(clientes):
                plan = plan_basico if i % 2 == 0 else plan_trimestral
                
                # Crear inscripción
                inscripcion, created = InscripcionMembresia.objects.get_or_create(
                    cliente=cliente,
                    defaults={
                        'monto': plan.precio_base,
                        'metodo_de_pago': 'efectivo' if i % 2 == 0 else 'tarjeta_credito'
                    }
                )
                
                if created:
                    print(f"✅ Inscripción creada para: {cliente.nombre_completo}")
                    
                    # Crear membresía
                    fecha_inicio = today
                    fecha_fin = fecha_inicio + timedelta(days=plan.duracion)
                    
                    membresia, memb_created = Membresia.objects.get_or_create(
                        inscripcion=inscripcion,
                        defaults={
                            'plan': plan,
                            'usuario_registro': user_admin,
                            'fecha_inicio': fecha_inicio,
                            'fecha_fin': fecha_fin,
                            'estado': 'activa'
                        }
                    )
                    
                    if memb_created:
                        print(f"✅ Membresía creada: {cliente.nombre_completo} - {plan.nombre}")
                else:
                    print(f"📝 Inscripción ya existe para: {cliente.nombre_completo}")
        else:
            print("⚠️ No se encontró usuario administrador para asignar membresías")
    
    except Exception as e:
        print(f"❌ Error creando inscripciones: {e}")
    
    # Resumen
    print("\n" + "=" * 60)
    print("📊 RESUMEN DE DATOS CREADOS:")
    print(f"   📋 Planes de membresía: {len(created_plans)}")
    print(f"   🎉 Promociones: {len(created_promos)}")
    print(f"   👥 Clientes: {len(created_clients)}")
    print(f"   💼 Total en base de datos:")
    print(f"      - Planes: {PlanMembresia.objects.count()}")
    print(f"      - Promociones: {Promocion.objects.count()}")
    print(f"      - Clientes: {Cliente.objects.count()}")
    print(f"      - Inscripciones: {InscripcionMembresia.objects.count()}")
    print(f"      - Membresías: {Membresia.objects.count()}")
    
    return {
        'planes': created_plans,
        'promociones': created_promos,
        'clientes': created_clients
    }

if __name__ == "__main__":
    result = create_sample_data()
    print("\n✅ ¡Datos de ejemplo creados exitosamente!")
    print("\n🚀 Ahora puedes probar las APIs de clientes y membresías:")
    print("   - GET /api/clientes/")
    print("   - GET /api/planes-membresia/")
    print("   - GET /api/promociones/")
    print("   - GET /api/membresias/")