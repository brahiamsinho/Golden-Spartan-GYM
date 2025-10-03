# Script de configuración automática para Windows
# Golden Spartan SI1 - Setup Script

Write-Host "🚀 Iniciando configuración del proyecto Golden Spartan SI1..." -ForegroundColor Green

# Verificar si Python está instalado
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor instala Python 3.12+ desde https://python.org" -ForegroundColor Yellow
    exit 1
}

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor instala Node.js 18+ desde https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Configuración del Backend
Write-Host "`n🔧 Configurando Backend..." -ForegroundColor Yellow

# Navegar al directorio backend
Set-Location backend

# Crear entorno virtual si no existe
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv venv
}

# Activar entorno virtual
Write-Host "🔧 Activando entorno virtual..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Instalar dependencias
Write-Host "📚 Instalando dependencias..." -ForegroundColor Yellow
pip install -r requirements.txt

# Ejecutar migraciones y seeders
Write-Host "⚙️ Configurando base de datos..." -ForegroundColor Yellow
python manage.py makemigrations
python manage.py migrate
python manage.py seed

Write-Host "✅ Backend configurado correctamente" -ForegroundColor Green

# Volver al directorio principal
Set-Location ..

# Configuración del Frontend
Write-Host "`n🔧 Configurando Frontend..." -ForegroundColor Yellow

# Navegar al directorio frontend
Set-Location frontend

# Instalar dependencias
Write-Host "📚 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Volver al directorio principal
Set-Location ..

Write-Host "`n🎉 ¡Configuración completada!" -ForegroundColor Green
Write-Host "`n📋 Para iniciar el servidor backend:" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "   python manage.py runserver" -ForegroundColor White

Write-Host "`n📋 Para iniciar el servidor frontend:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White

Write-Host "`n📝 Credenciales por defecto:" -ForegroundColor Cyan
Write-Host "   SuperAdmin: admin/admin" -ForegroundColor White
Write-Host "   Administrador: administrador/admin123" -ForegroundColor White
Write-Host "   Instructor: instructor/instructor123" -ForegroundColor White

Read-Host "`nPresiona Enter para continuar..."