# MailHog - Configuración y Uso para Golden Spartan Gym

MailHog es una herramienta de desarrollo que captura todos los emails enviados por la aplicación sin realmente enviarlos, permitiendo ver y probar los emails en una interfaz web.

## 🚀 Instalación Rápida

```powershell
# Ejecutar desde la raíz del proyecto
.\setup_mailhog.ps1
```

## 📋 Instalación Manual

### Opción 1: Con Go (recomendado)
```bash
go install github.com/mailhog/MailHog@latest
```

### Opción 2: Descarga directa
1. Descargar desde: https://github.com/mailhog/MailHog/releases
2. Colocar el ejecutable en `tools/mailhog/mailhog.exe`

## ⚡ Uso

### Iniciar MailHog manualmente
```powershell
# Si está instalado globalmente
mailhog

# Si está en la carpeta tools
.\tools\mailhog\mailhog.exe
```

### Iniciar con el sistema completo
```powershell
# El script automáticamente inicia MailHog
.\iniciar_sistema.ps1
```

## 🌐 Interfaces

- **Puerto SMTP:** 1025 (para Django)
- **Interfaz Web:** http://localhost:8025
- **API REST:** http://localhost:8025/api/

## 🧪 Probar Emails

### Comando de prueba integrado
```bash
# Desde la carpeta backend
cd backend

# Prueba simple
python manage.py test_mailhog --email test@ejemplo.com

# Prueba específica
python manage.py test_mailhog --email usuario@gym.com --tipo html

# Todas las pruebas
python manage.py test_mailhog --email admin@gym.com --tipo todos
```

### Tipos de email disponibles:
- `simple`: Email de texto plano
- `html`: Email con formato HTML completo
- `recuperacion`: Simulación de email de recuperación de contraseña
- `bienvenida`: Email de bienvenida para nuevos usuarios
- `todos`: Envía todos los tipos

## ⚙️ Configuración en Django

### Variables de entorno (.env)
```env
# Activar MailHog (default: True en desarrollo)
USE_MAILHOG=True

# Para producción (desactivar MailHog)
USE_MAILHOG=False
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tu_email@gmail.com
EMAIL_HOST_PASSWORD=tu_app_password
```

### Configuración automática
El sistema detecta automáticamente si usar MailHog basado en:
- Variable `USE_MAILHOG=True`
- Modo `DEBUG=True`
- MailHog disponible en puerto 1025

## 📧 Funciones de Email en el Sistema

### 1. Recuperación de contraseña
```python
# En api/views.py - forgot_password
send_mail(
    subject='Recuperación de contraseña - Golden Spartan Gym',
    message=f'Token de recuperación: {token}',
    from_email=settings.DEFAULT_FROM_EMAIL,
    recipient_list=[email],
)
```

### 2. Notificaciones de sistema
```python
# Ejemplo de uso en vistas
from django.core.mail import send_mail

def enviar_notificacion_cliente(cliente):
    send_mail(
        subject=f'Bienvenido {cliente.nombre_completo}',
        message='Tu cuenta ha sido creada exitosamente.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[cliente.email],
    )
```

## 🔧 Solución de Problemas

### MailHog no inicia
1. Verificar que no esté en uso el puerto 8025:
   ```powershell
   netstat -an | findstr :8025
   ```

2. Instalar/reinstalar MailHog:
   ```powershell
   .\setup_mailhog.ps1
   ```

### Django no envía emails a MailHog
1. Verificar configuración en settings.py
2. Verificar que `USE_MAILHOG=True` en .env
3. Reiniciar el servidor Django

### No aparecen emails en la interfaz
1. Verificar que Django esté enviando emails:
   ```bash
   python manage.py test_mailhog
   ```

2. Verificar logs del servidor Django
3. Verificar que MailHog esté ejecutándose en puerto 1025

## 📱 Características de la Interfaz Web

En http://localhost:8025 puedes:

- ✅ Ver todos los emails enviados
- ✅ Leer emails en formato texto y HTML
- ✅ Ver headers completos del email
- ✅ Descargar emails como .eml
- ✅ Eliminar emails individuales o todos
- ✅ Búsqueda y filtros
- ✅ API REST para automatización

## 🔄 Integración con el Proyecto

### En desarrollo:
- MailHog captura todos los emails
- Interfaz web para revisar emails
- No requiere configuración de SMTP real

### En producción:
- Cambiar `USE_MAILHOG=False`
- Configurar SMTP real (Gmail, SendGrid, etc.)
- Emails se envían normalmente

## 📈 Beneficios

1. **Seguridad**: No envía emails reales durante desarrollo
2. **Facilidad**: No requiere configuración SMTP real
3. **Testing**: Perfecto para probar flujos de email
4. **Debug**: Ve exactamente qué emails se envían
5. **Velocidad**: No depende de servicios externos

## 🚀 Comandos Útiles

```powershell
# Ver si MailHog está corriendo
Get-Process | Where-Object {$_.ProcessName -like "*mailhog*"}

# Matar proceso MailHog
Get-Process | Where-Object {$_.ProcessName -like "*mailhog*"} | Stop-Process

# Ver puertos en uso
netstat -an | findstr :1025
netstat -an | findstr :8025

# Probar conectividad
Test-NetConnection localhost -Port 1025
Test-NetConnection localhost -Port 8025
```

---

**Golden Spartan Gym - Sistema de Información 1**  
*Configuración de MailHog completada* ✅