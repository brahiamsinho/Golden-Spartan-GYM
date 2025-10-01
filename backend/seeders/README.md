# 🌱 Seeders - Golden Spartan SI1

Este directorio contiene todos los seeders para poblar la base de datos con datos iniciales.

## 📁 Estructura

```
backend/seeders/
├── __init__.py          # Exporta todos los seeders
├── base_seeder.py       # Clase base para todos los seeders
├── user_seeder.py       # Seeder para usuarios del sistema
├── member_seeder.py     # Seeder para miembros del gimnasio
├── plan_seeder.py       # Seeder para planes de membresía
└── README.md           # Esta documentación
```

## 🚀 Cómo usar

### Ejecutar todos los seeders:

```bash
python manage.py seed
```

### Ejecutar con reset (elimina datos existentes):

```bash
python manage.py seed --reset
```

## 🔧 Crear un nuevo seeder

1. **Crea el archivo del seeder:**

```python
# backend/seeders/mi_nuevo_seeder.py
from .base_seeder import BaseSeeder

class MiNuevoSeeder(BaseSeeder):
    def run(self):
        """Lógica para crear datos"""
        self.log_info("Creando datos...")
        # Tu lógica aquí
        self.log_success("Datos creados correctamente")

    def reset_data(self):
        """Lógica para eliminar datos existentes"""
        self.log_info("Eliminando datos existentes...")
        # Tu lógica aquí
        self.log_warning("Datos eliminados")
```

2. **Registra el seeder en `__init__.py`:**

```python
from .mi_nuevo_seeder import MiNuevoSeeder
__all__ = [..., 'MiNuevoSeeder']
```

3. **Agrega el seeder al comando en `seed.py`:**

```python
seeders = [
    UserSeeder(self),
    MemberSeeder(self),
    PlanSeeder(self),
    MiNuevoSeeder(self),  # Agregar aquí
]
```

## 📋 Seeders disponibles

### UserSeeder

- **Propósito:** Crear usuarios del sistema
- **Datos creados:**
  - Superusuario admin (admin/admin)
  - Usuarios de prueba (opcional)

### MemberSeeder

- **Propósito:** Crear miembros del gimnasio
- **Estado:** Preparado para implementar cuando tengas el modelo

### PlanSeeder

- **Propósito:** Crear planes de membresía
- **Estado:** Preparado para implementar cuando tengas el modelo

## 🎯 Buenas prácticas

1. **Hereda de BaseSeeder** para tener funcionalidad común
2. **Implementa `run()`** para la lógica principal
3. **Implementa `reset_data()`** para limpiar datos
4. **Usa los métodos de logging** para mensajes informativos
5. **Maneja errores** apropiadamente
6. **Usa transacciones** cuando sea necesario

## 🔍 Debugging

Para ver logs detallados, ejecuta:

```bash
python manage.py seed --verbosity=2
```

## 📝 Notas

- Los seeders se ejecutan en el orden definido en `seed.py`
- Cada seeder puede tener su propia lógica de reset
- Los seeders son idempotentes (se pueden ejecutar múltiples veces)
- Usa `--reset` solo cuando necesites limpiar datos existentes
