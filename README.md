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
- **Python 3.12** - Lenguaje de programación

### Frontend
- **React** - Biblioteca de JavaScript para interfaces de usuario
- **Vite** - Herramienta de construcción rápida
- **ESLint** - Linter para JavaScript

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
python3 -m venv venv
source venv/bin/activate
```

3. Instala las dependencias:
```bash
pip install -r requirements.txt
```

4. Ejecuta las migraciones:
```bash
python manage.py migrate
```

5. Crea un superusuario:
```bash
python manage.py createsuperuser
```

6. Inicia el servidor de desarrollo:
```bash
python manage.py runserver
```

El backend estará disponible en `http://localhost:8000`

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

El frontend estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

### Backend
```
backend/
├── api/                 # Aplicación principal de la API
│   ├── models.py       # Modelos de datos
│   ├── views.py        # Vistas de la API
│   ├── serializers.py  # Serializadores
│   └── urls.py         # URLs de la API
├── config/             # Configuración de Django
│   ├── settings.py     # Configuración principal
│   └── urls.py         # URLs principales
└── manage.py           # Script de administración
```

### Frontend
```
frontend/
├── src/                # Código fuente de React
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas de la aplicación
│   ├── services/       # Servicios para API calls
│   └── utils/          # Utilidades
├── public/             # Archivos estáticos
└── package.json        # Dependencias de Node.js
```

## 🔧 Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` con las siguientes variables:

```env
SECRET_KEY=tu_clave_secreta_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/logout/` - Cerrar sesión
- `POST /api/auth/register/` - Registro de usuario

### Gestión de Miembros
- `GET /api/members/` - Listar miembros
- `POST /api/members/` - Crear miembro
- `GET /api/members/{id}/` - Obtener miembro específico
- `PUT /api/members/{id}/` - Actualizar miembro
- `DELETE /api/members/{id}/` - Eliminar miembro

## 🧪 Testing

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Despliegue

### Backend
1. Configura las variables de entorno de producción
2. Ejecuta `python manage.py collectstatic`
3. Configura tu servidor web (Nginx, Apache)
4. Usa Gunicorn o similar como servidor WSGI

### Frontend
1. Ejecuta `npm run build`
2. Sube los archivos de `dist/` a tu servidor web

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [tu-usuario-github](https://github.com/tu-usuario-github)

## 📞 Contacto

Si tienes preguntas sobre el proyecto, puedes contactarme en:
- Email: tu-email@ejemplo.com
- GitHub: [@tu-usuario-github](https://github.com/tu-usuario-github)

---

⭐ ¡No olvides darle una estrella al proyecto si te ha sido útil!
