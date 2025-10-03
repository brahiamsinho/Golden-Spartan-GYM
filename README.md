# Golden Spartan SI1 - Sistema de Gestión de Gimnasio

Un sistema completo de gestión de gimnasio desarrollado con Django REST Framework (backend) y React (frontend).

## 🏗️ Arquitectura del Proyecto

```
Golden-Spartan-SI1/
├── backend/          # API REST con Django
├── frontend/         # Aplicación React
└── README.md
```

## 🚀 Tecnologías Utilizadas

### Backend

- **Django 5.2.6** - Framework web de Python
- **Django REST Framework 3.16.1** - Para crear APIs REST
- **JWT Authentication** - Autenticación basada en tokens
- **CORS** - Para comunicación frontend-backend
- **Python 3.12** - Lenguaje de programación

### Frontend

- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript** - JavaScript con tipado estático
- **Vite** - Herramienta de construcción rápida
- **CSS Modules** - Estilos modulares
- **Lucide React** - Iconos

## 📋 Prerrequisitos

- Python 3.12+
- Node.js 16+
- npm o yarn

## 🛠️ Instalación y Configuración

### Backend (Django)

1. Navega al directorio del backend:

```bash
cd backend
```

2. Crea y activa un entorno virtual:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. Instala las dependencias:

```bash
pip install -r requirements.txt
```

4. Configura las variables de entorno:

```bash
# Copia el archivo de ejemplo
copy env.example .env

# Edita .env con tus configuraciones
```

5. Ejecuta las migraciones:

```bash
python manage.py migrate
```

6. Crea datos iniciales:

```bash
python manage.py seed
```

7. Inicia el servidor:

```bash
python manage.py runserver
```

### Frontend (React)

1. Navega al directorio del frontend:

```bash
cd frontend
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticación

- Login con JWT
- Logout seguro
- Protección de rutas
- Gestión de sesiones

### ✅ Gestión de Usuarios

- CRUD completo de usuarios
- Asignación de roles
- Validación de datos
- Interfaz responsiva

### ✅ Sistema de Roles y Permisos

- Roles: Super Administrador, Administrador, Instructor
- Permisos granulares
- Control de acceso basado en roles
- Asignación automática de permisos

### ✅ Bitácora de Actividades

- Registro automático de todas las actividades
- Captura de IP y User-Agent
- Filtros avanzados
- Estadísticas en tiempo real
- Diferentes niveles de log (info, warning, error, critical)

### ✅ Interfaz de Usuario

- Dashboard responsivo
- Sidebar con navegación
- Header con información del usuario
- Modales para acciones
- Diseño moderno y profesional

## 🔧 Comandos Útiles

### Backend

```bash
python manage.py runserver          # Iniciar servidor
python manage.py migrate            # Ejecutar migraciones
python manage.py seed               # Crear datos iniciales
python manage.py createsuperuser    # Crear superusuario
```

### Frontend

```bash
npm run dev                         # Modo desarrollo
npm run build                       # Build para producción
npm run lint                        # Ejecutar linter
```

## 📊 API Endpoints

### Autenticación

- `POST /api/token/` - Obtener token JWT
- `POST /api/token/refresh/` - Renovar token
- `POST /api/logout/` - Cerrar sesión
- `GET /api/user-info/` - Información del usuario

### Usuarios

- `GET /api/usuarios/` - Listar usuarios
- `POST /api/usuarios/` - Crear usuario
- `PUT /api/usuarios/{id}/` - Actualizar usuario
- `DELETE /api/usuarios/{id}/` - Eliminar usuario

### Roles y Permisos

- `GET /api/roles/` - Listar roles
- `GET /api/permisos/` - Listar permisos
- `GET /api/permisos-usuario/` - Permisos del usuario actual

### Bitácora

- `GET /api/bitacora/` - Listar actividades
- `GET /api/bitacora/estadisticas/` - Estadísticas de actividades

## 🔐 Credenciales por Defecto

- **Superusuario Admin:**
  - Username: `admin`
  - Password: `admin`
  - Email: `admin@gym.com`

## 🚀 Inicio Rápido

1. **Clona el repositorio:**

```bash
git clone https://github.com/brahiamsinho/Golden-Spartan-GYM.git
cd Golden-Spartan-SI1
```

2. **Configura el backend:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver
```

3. **Configura el frontend:**

```bash
cd ../frontend
npm install
npm run dev
```

4. **Accede a la aplicación:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin/

## 📱 Características de la Interfaz

- **Responsive Design** - Funciona en desktop, tablet y móvil
- **Tema Oscuro** - Interfaz moderna y profesional
- **Navegación Intuitiva** - Sidebar con módulos organizados
- **Feedback Visual** - Estados de carga, errores y éxito
- **Filtros Avanzados** - Búsqueda y filtrado en tiempo real

## 🔒 Seguridad

- Autenticación JWT segura
- Validación de datos en frontend y backend
- Protección CSRF
- CORS configurado correctamente
- Logs de seguridad en bitácora
- Filtrado de información sensible

## 📈 Monitoreo y Auditoría

- Bitácora completa de actividades
- Registro de IPs y User-Agents
- Estadísticas de uso
- Diferentes niveles de log
- Filtros por usuario, fecha, tipo de actividad

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal:** Brahiam Sinho
- **Proyecto:** Golden Spartan SI1
- **Año:** 2025

## 📞 Soporte

Si tienes problemas o preguntas, por favor:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

**¡Gracias por usar Golden Spartan SI1!** 🏋️‍♂️
