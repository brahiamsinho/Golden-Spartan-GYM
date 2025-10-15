# Script para instalar y configurar MailHog en el proyecto
# Golden Spartan Gym - Configuración de MailHog para desarrollo

Write-Host "🚀 Configurando MailHog para Golden Spartan Gym..." -ForegroundColor Green

# Verificar si MailHog está instalado
if (Get-Command mailhog -ErrorAction SilentlyContinue) {
    Write-Host "✅ MailHog ya está instalado" -ForegroundColor Green
} else {
    Write-Host "📦 Instalando MailHog..." -ForegroundColor Yellow
    
    # Verificar si Go está instalado
    if (Get-Command go -ErrorAction SilentlyContinue) {
        Write-Host "📦 Instalando MailHog con Go..." -ForegroundColor Yellow
        go install github.com/mailhog/MailHog@latest
    } else {
        Write-Host "❌ Go no está instalado. Descargando MailHog..." -ForegroundColor Red
        
        # Crear directorio para MailHog
        $mailhogDir = "tools\mailhog"
        if (!(Test-Path $mailhogDir)) {
            New-Item -ItemType Directory -Path $mailhogDir -Force
        }
        
        # Descargar MailHog para Windows
        $mailhogUrl = "https://github.com/mailhog/MailHog/releases/download/v1.0.1/MailHog_windows_amd64.exe"
        $mailhogPath = "$mailhogDir\mailhog.exe"
        
        Write-Host "⬇️ Descargando MailHog desde GitHub..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $mailhogUrl -OutFile $mailhogPath
        
        Write-Host "✅ MailHog descargado en: $mailhogPath" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🔧 Configuración de MailHog:" -ForegroundColor Cyan
Write-Host "- Puerto SMTP: 1025" -ForegroundColor White
Write-Host "- Puerto Web UI: 8025" -ForegroundColor White
Write-Host "- URL Web UI: http://localhost:8025" -ForegroundColor White
Write-Host ""
Write-Host "▶️ Para iniciar MailHog, ejecuta:" -ForegroundColor Yellow
Write-Host "   mailhog" -ForegroundColor White
Write-Host "   o desde el directorio tools:" -ForegroundColor White
Write-Host "   .\tools\mailhog\mailhog.exe" -ForegroundColor White
Write-Host ""
Write-Host "✅ Configuración completada!" -ForegroundColor Green