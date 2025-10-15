# Sistema de Gestión de Clientes y Membresías - Golden Spartan Gym

## 📋 Resumen de Implementación

Se ha implementado completamente el módulo de **Clientes y Membresías** basado en el diagrama PlantUML proporcionado.

## 🏗️ Modelos Implementados

### 1. **Cliente**
```python
- id (PK)
- nombre (VARCHAR 50)
- apellido (VARCHAR 50) 
- telefono (VARCHAR 20)
- peso (DECIMAL 5,2)
- altura (DECIMAL 3,2)
- experiencia (CHOICES: principiante, intermedio, avanzado, experto)
- fecha_registro (DateTime)
- activo (Boolean)
```

### 2. **PlanMembresia** 
```python
- id (PK)
- nombre (VARCHAR 50)
- duracion (INT - días)
- precio_base (DECIMAL 10,2)
- descripcion (TEXT)
- activo (Boolean)
- fecha_creacion (DateTime)
```

### 3. **Promocion**
```python
- id (PK)
- nombre (VARCHAR 100)
- meses (INT)
- descuento (DECIMAL 5,2 - porcentaje)
- fecha_inicio (DATE)
- fecha_fin (DATE)
- estado (CHOICES: activa, inactiva, vencida)
```

### 4. **InscripcionMembresia**
```python
- id (PK)
- cliente_id (FK → Cliente)
- monto (DECIMAL 10,2)
- metodo_de_pago (CHOICES: efectivo, tarjeta_credito, tarjeta_debito, transferencia, paypal)
- fecha_inscripcion (DateTime)
```

### 5. **Membresia**
```python
- id (PK)
- inscripcion_id (FK → InscripcionMembresia) [OneToOne]
- plan_id (FK → PlanMembresia)
- usuario_registro_id (FK → User)
- estado (CHOICES: activa, vencida, suspendida, cancelada)
- fecha_inicio (DATE)
- fecha_fin (DATE)
```

### 6. **MembresiaPromocion** (Tabla de relación)
```python
- id (PK)
- membresia_id (FK → Membresia)
- promocion_id (FK → Promocion)
- fecha_aplicacion (DateTime)
```

## 🔌 APIs Implementadas

### Clientes (`/api/clientes/`)
- **GET** `/api/clientes/` - Listar todos los clientes
- **POST** `/api/clientes/` - Crear nuevo cliente
- **GET** `/api/clientes/{id}/` - Obtener cliente específico (detallado)
- **PUT/PATCH** `/api/clientes/{id}/` - Actualizar cliente
- **DELETE** `/api/clientes/{id}/` - Desactivar cliente
- **GET** `/api/clientes/activos/` - Solo clientes activos

### Planes de Membresía (`/api/planes-membresia/`)
- **GET** `/api/planes-membresia/` - Listar planes
- **POST** `/api/planes-membresia/` - Crear plan
- **GET** `/api/planes-membresia/{id}/` - Obtener plan específico
- **PUT/PATCH** `/api/planes-membresia/{id}/` - Actualizar plan
- **DELETE** `/api/planes-membresia/{id}/` - Eliminar plan
- **GET** `/api/planes-membresia/activos/` - Solo planes activos

### Promociones (`/api/promociones/`)
- **GET** `/api/promociones/` - Listar promociones
- **POST** `/api/promociones/` - Crear promoción
- **GET** `/api/promociones/{id}/` - Obtener promoción específica
- **PUT/PATCH** `/api/promociones/{id}/` - Actualizar promoción
- **DELETE** `/api/promociones/{id}/` - Eliminar promoción
- **GET** `/api/promociones/activas/` - Solo promociones activas y vigentes

### Inscripciones (`/api/inscripciones-membresia/`)
- **GET** `/api/inscripciones-membresia/` - Listar inscripciones
- **POST** `/api/inscripciones-membresia/` - Crear inscripción
- **GET** `/api/inscripciones-membresia/{id}/` - Obtener inscripción específica
- **PUT/PATCH** `/api/inscripciones-membresia/{id}/` - Actualizar inscripción
- **DELETE** `/api/inscripciones-membresia/{id}/` - Eliminar inscripción

### Membresías (`/api/membresias/`)
- **GET** `/api/membresias/` - Listar membresías
- **POST** `/api/membresias/` - Crear membresía
- **GET** `/api/membresias/{id}/` - Obtener membresía específica
- **PUT/PATCH** `/api/membresias/{id}/` - Actualizar membresía
- **DELETE** `/api/membresias/{id}/` - Eliminar membresía
- **GET** `/api/membresias/activas/` - Solo membresías activas
- **GET** `/api/membresias/por_vencer/?dias=30` - Membresías que vencen en X días
- **POST** `/api/membresias/{id}/aplicar_promocion/` - Aplicar promoción

### Membresías-Promociones (`/api/membresias-promociones/`)
- **GET** `/api/membresias-promociones/` - Listar relaciones
- **POST** `/api/membresias-promociones/` - Crear relación
- **DELETE** `/api/membresias-promociones/{id}/` - Eliminar relación

## 🔐 Sistema de Permisos

Se han creado **22 permisos específicos** para el módulo:

### Clientes
- `ver_cliente` - Ver información de clientes
- `crear_cliente` - Crear nuevos clientes  
- `editar_cliente` - Editar información de clientes
- `eliminar_cliente` - Eliminar/desactivar clientes

### Planes
- `ver_plan` - Ver planes de membresía
- `crear_plan` - Crear planes de membresía
- `editar_plan` - Editar planes de membresía
- `eliminar_plan` - Eliminar planes de membresía

### Promociones
- `ver_promocion` - Ver promociones
- `crear_promocion` - Crear promociones
- `editar_promocion` - Editar promociones
- `eliminar_promocion` - Eliminar promociones

### Inscripciones
- `ver_inscripcion` - Ver inscripciones de membresía
- `crear_inscripcion` - Crear inscripciones de membresía
- `editar_inscripcion` - Editar inscripciones de membresía
- `eliminar_inscripcion` - Eliminar inscripciones de membresía

### Membresías
- `ver_membresia` - Ver membresías
- `crear_membresia` - Crear membresías
- `editar_membresia` - Editar membresías
- `eliminar_membresia` - Eliminar membresías
- `aplicar_promocion` - Aplicar promociones a membresías
- `remover_promocion` - Remover promociones de membresías

## 📊 Datos de Ejemplo Creados

### Planes de Membresía (5)
1. **Plan Básico** - 30 días - $150.00
2. **Plan Trimestral** - 90 días - $400.00
3. **Plan Semestral** - 180 días - $750.00
4. **Plan Anual** - 365 días - $1,400.00
5. **Plan Premium** - 30 días - $250.00

### Promociones (3)
1. **Descuento de Año Nuevo** - 20% descuento
2. **Promo Estudiantes** - 15% descuento
3. **Descuento Familiar** - 25% descuento

### Clientes (5)
1. Juan Carlos Pérez González
2. María Elena Rodriguez Morales
3. Roberto Silva Mamani
4. Ana Sofía Gutierrez Quispe
5. Carlos Alberto Mendoza Vargas

### Membresías Activas (3)
- Ana Sofía - Plan Básico
- Carlos Alberto - Plan Trimestral  
- Juan Carlos - Plan Básico

## 🔍 Características Especiales

### Validaciones Implementadas
- **Peso**: Entre 1 y 500 kg
- **Altura**: Entre 0.1 y 3.0 metros
- **Descuentos**: Entre 1% y 100%
- **Fechas**: Fecha inicio < Fecha fin
- **Montos**: Mayores a 0

### Métodos Útiles
- `Cliente.nombre_completo` - Propiedad calculada
- `Promocion.is_active()` - Verifica si está vigente
- `Membresia.is_active()` - Verifica si está activa
- `Membresia.days_remaining()` - Días restantes

### Logging y Bitácora
- Todas las operaciones CRUD se registran en bitácora
- Incluye información detallada del usuario, IP, acción realizada
- Datos adicionales para auditoría

### Serializers Especializados
- **ClienteDetailSerializer**: Incluye membresías activas
- **Validaciones personalizadas** en todos los serializers
- **Campos calculados** para mejor UX

## 🚀 Cómo Probar

1. **Iniciar servidor**: `python manage.py runserver`
2. **Autenticarse**: POST `/api/token/` con credenciales
3. **Probar endpoints**: 
   ```bash
   # Listar clientes
   GET /api/clientes/
   
   # Crear cliente
   POST /api/clientes/
   {
     "nombre": "Nuevo",
     "apellido": "Cliente", 
     "telefono": "+591 76543210",
     "experiencia": "principiante"
   }
   
   # Listar planes
   GET /api/planes-membresia/
   
   # Membresías activas
   GET /api/membresias/activas/
   ```

## 📁 Archivos Modificados/Creados

- `api/models.py` - Nuevos modelos
- `api/serializers.py` - Serializers para APIs
- `api/views.py` - ViewSets con lógica de negocio
- `config/urls.py` - Rutas de las APIs
- `seeders/add_client_permissions.py` - Script de permisos
- `seeders/create_sample_data.py` - Datos de ejemplo
- Migración: `0008_cliente_planmembresia_promocion_...`

## ✅ Estado del Proyecto

**COMPLETADO** ✅
- Modelos según PlantUML
- APIs RESTful completas  
- Sistema de permisos
- Validaciones de datos
- Logging y auditoría
- Datos de ejemplo
- Documentación

El sistema está **listo para producción** y puede escalarse fácilmente con más funcionalidades como reportes, notificaciones, etc.