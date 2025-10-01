# 🚀 Guía de Inicio Rápido - Golden Spartan SI1

## Para Nuevos Contribuidores

### ⚡ Configuración en 3 pasos

1. **Clonar el repositorio:**

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd Golden-Spartan-SI1
```

2. **Configurar Backend (Django):**

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python manage.py seed
```

3. **Configurar Frontend (React):**

```bash
cd ../frontend
npm install
npm run dev
```

### 🎯 ¡Listo!

- **Backend:** http://localhost:8000
- **Admin Panel:** http://localhost:8000/admin/
  - Username: `admin`
  - Password: `admin`
- **Frontend:** http://localhost:5173

### 🔧 Comandos Útiles

```bash
# Backend
python manage.py runserver          # Iniciar servidor
python manage.py seed               # Ejecutar seeders
python manage.py seed --reset       # Resetear y ejecutar seeders
python manage.py migrate            # Solo migraciones
python manage.py createsuperuser    # Crear superusuario manual

# Frontend
npm run dev                         # Modo desarrollo
npm run build                       # Build para producción
npm test                            # Ejecutar tests
```

### 🌱 Seeders

El proyecto incluye un sistema modular de seeders en `backend/seeders/`:

- **UserSeeder**: Crea usuarios del sistema (admin/admin)
- **MemberSeeder**: Preparado para miembros del gimnasio
- **PlanSeeder**: Preparado para planes de membresía

Ver `backend/seeders/README.md` para documentación detallada.

### 🆘 ¿Problemas?

1. **Error de migraciones:** Ejecuta `python manage.py migrate`
2. **Error de dependencias:** Ejecuta `pip install -r requirements.txt`
3. **Error de Node:** Ejecuta `npm install`
4. **Puerto ocupado:** Cambia el puerto en `manage.py runserver 8001`

### 📚 Documentación Completa

Ver [README.md](README.md) para documentación detallada.

---

**¡Happy Coding! 🎉**
