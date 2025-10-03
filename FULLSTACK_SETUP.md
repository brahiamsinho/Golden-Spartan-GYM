# 🏋️ Golden Spartan GYM - Stack Completo

## 📋 Descripción

Sistema completo de gestión para gimnasio con backend Django REST API y frontend React + TypeScript.

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```powershell
# Ejecutar desde la raíz del proyecto
.\start_fullstack.ps1
```

### Opción 2: Manual

#### Backend (Django)

```bash
cd backend
python setup_backend.py
```

#### Frontend (React)

```bash
cd frontend
npm run dev
```

## 🌐 URLs del Sistema

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin/

## 👤 Credenciales de Prueba

- **Usuario**: admin
- **Contraseña**: admin

## 🏗️ Arquitectura

### Backend (Django REST API)

- **Framework**: Django 5.2.6
- **API**: Django REST Framework
- **Autenticación**: JWT (Simple JWT)
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **CORS**: Configurado para frontend

### Frontend (React + TypeScript)

- **Framework**: React 19.1.1
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules
- **Iconos**: Lucide React
- **Estado**: Context API

## 📁 Estructura del Proyecto

```
Golden-Spartan-SI1/
├── backend/                 # Backend Django
│   ├── api/                # App principal
│   │   ├── models.py       # Modelos de datos
│   │   ├── views.py        # Vistas API
│   │   ├── serializers.py  # Serializadores
│   │   └── urls.py         # URLs de la app
│   ├── config/             # Configuración Django
│   │   ├── settings.py     # Configuración principal
│   │   └── urls.py         # URLs principales
│   ├── seeders/            # Datos iniciales
│   └── setup_backend.py    # Script de configuración
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── contexts/       # Context API
│   │   ├── services/       # Servicios API
│   │   └── styles/         # Estilos
│   └── package.json
└── start_fullstack.ps1     # Script de inicio
```

## 🔧 Funcionalidades

### Sistema de Autenticación

- ✅ Login con JWT
- ✅ Refresh token automático
- ✅ Logout con limpieza de sesión
- ✅ Persistencia de sesión

### Sistema de Permisos

- ✅ Roles: Super Admin, Admin, Instructor
- ✅ Permisos granulares por módulo
- ✅ Control de acceso en frontend
- ✅ Protección de rutas

### Módulos del Sistema

- ✅ **Dashboard**: Resumen del sistema
- ✅ **Usuarios**: Gestión de usuarios
- ✅ **Roles**: Administración de roles
- ✅ **Permisos**: Control de permisos
- ✅ **Bitácora**: Registro de actividades

### Responsividad

- ✅ Sidebar adaptativo
- ✅ Breakpoints: 1200px, 1024px, 768px, 640px, 480px, 360px
- ✅ Navegación móvil con overlay
- ✅ Tablas con scroll horizontal

## 🛠️ Desarrollo

### Backend

```bash
cd backend
# Activar entorno virtual
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Poblar datos
python manage.py seed

# Ejecutar servidor
python manage.py runserver
```

### Frontend

```bash
cd frontend
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📊 API Endpoints

### Autenticación

- `POST /api/token/` - Obtener token JWT
- `POST /api/token/refresh/` - Renovar token
- `GET /api/user-info/` - Información del usuario

### Usuarios

- `GET /api/usuarios/` - Listar usuarios
- `POST /api/usuarios/` - Crear usuario
- `PUT /api/usuarios/{id}/` - Actualizar usuario
- `DELETE /api/usuarios/{id}/` - Eliminar usuario

### Roles

- `GET /api/roles/` - Listar roles
- `POST /api/roles/` - Crear rol
- `PUT /api/roles/{id}/` - Actualizar rol
- `DELETE /api/roles/{id}/` - Eliminar rol

### Permisos

- `GET /api/permisos/` - Listar permisos
- `GET /api/permisos-usuario/` - Permisos del usuario

### Bitácora

- `GET /api/bitacora/` - Listar actividades
- `POST /api/registrar-bitacora/` - Registrar actividad

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ CORS configurado
- ✅ Validación de permisos
- ✅ Sanitización de datos
- ✅ Protección CSRF

## 🚀 Despliegue

### Backend (Producción)

1. Configurar PostgreSQL
2. Configurar variables de entorno
3. Ejecutar migraciones
4. Configurar servidor web (Nginx + Gunicorn)

### Frontend (Producción)

1. `npm run build`
2. Servir archivos estáticos
3. Configurar proxy para API

## 🐛 Solución de Problemas

### Backend no inicia

- Verificar que Python esté instalado
- Verificar que las dependencias estén instaladas
- Verificar que el puerto 8000 esté libre

### Frontend no inicia

- Verificar que Node.js esté instalado
- Verificar que las dependencias estén instaladas
- Verificar que el puerto 5173 esté libre

### Error de CORS

- Verificar configuración en `settings.py`
- Verificar que el frontend esté en `http://localhost:5173`

## 📝 Notas

- El sistema funciona en modo desarrollo por defecto
- Los datos se almacenan en SQLite
- El frontend tiene fallback para modo desarrollo
- El sistema es completamente responsivo

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature
3. Commit cambios
4. Push a la rama
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
