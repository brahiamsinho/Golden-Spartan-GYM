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

# Ejecutar script de configuración
Write-Host "⚙️  Configurando base de datos..." -ForegroundColor Yellow
python setup.py

Write-Host "`n🎉 ¡Configuración completada!" -ForegroundColor Green
Write-Host "`n📋 Para iniciar el servidor:" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "   python manage.py runserver" -ForegroundColor White

Write-Host "`n📋 Para el frontend:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White

Read-Host "`nPresiona Enter para continuar..."
