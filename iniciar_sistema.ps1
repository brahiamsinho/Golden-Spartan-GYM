# Script para iniciar el sistema Golden Spartan SI1
# Ejecuta tanto el backend como el frontend

Write-Host "🚀 Iniciando Golden Spartan SI1..." -ForegroundColor Green

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Verificar puertos
if (Test-Port 8000) {
    Write-Host "⚠️  Puerto 8000 ya está en uso. Deteniendo proceso..." -ForegroundColor Yellow
    Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.CommandLine -like "*manage.py runserver*"} | Stop-Process -Force
    Start-Sleep -Seconds 2
}

if (Test-Port 5173) {
    Write-Host "⚠️  Puerto 5173 ya está en uso. Deteniendo proceso..." -ForegroundColor Yellow
    Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.CommandLine -like "*vite*"} | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# Verificar y iniciar MailHog
if (Test-Port 8025) {
    Write-Host "✅ MailHog ya está ejecutándose en puerto 8025" -ForegroundColor Green
} else {
    Write-Host "📧 Iniciando MailHog..." -ForegroundColor Yellow
    
    # Buscar MailHog en diferentes ubicaciones
    $mailhogPaths = @(
        "mailhog",
        ".\tools\mailhog\mailhog.exe",
        "$env:GOPATH\bin\mailhog.exe",
        "$env:USERPROFILE\go\bin\mailhog.exe"
    )
    
    $mailhogFound = $false
    foreach ($path in $mailhogPaths) {
        try {
            if (Get-Command $path -ErrorAction SilentlyContinue) {
                Start-Process -FilePath $path -WindowStyle Hidden
                $mailhogFound = $true
                break
            }
        }
        catch {
            # Continuar con la siguiente ruta
        }
    }
    
    if ($mailhogFound) {
        Write-Host "✅ MailHog iniciado correctamente" -ForegroundColor Green
        Write-Host "🌐 Interfaz web: http://localhost:8025" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  MailHog no encontrado. Instálalo ejecutando: .\setup_mailhog.ps1" -ForegroundColor Yellow
    }
}
}

# Iniciar Backend
Write-Host "🔧 Iniciando Backend (Django)..." -ForegroundColor Cyan
Set-Location backend
if (Test-Path "venv\Scripts\activate.ps1") {
    & "venv\Scripts\activate.ps1"
    Write-Host "✅ Entorno virtual activado" -ForegroundColor Green
} else {
    Write-Host "❌ Entorno virtual no encontrado. Creando..." -ForegroundColor Red
    python -m venv venv
    & "venv\Scripts\activate.ps1"
    pip install -r requirements.txt
}

# Verificar si hay migraciones pendientes
Write-Host "📊 Verificando migraciones..." -ForegroundColor Cyan
python manage.py migrate

# Iniciar servidor backend en segundo plano
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; venv\Scripts\activate.ps1; python manage.py runserver" -WindowStyle Minimized
Write-Host "✅ Backend iniciado en http://localhost:8000" -ForegroundColor Green

# Esperar un momento para que el backend se inicie
Start-Sleep -Seconds 3

# Volver al directorio raíz
Set-Location ..

# Iniciar Frontend
Write-Host "⚛️  Iniciando Frontend (React)..." -ForegroundColor Cyan
Set-Location frontend

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
    npm install
}

# Iniciar servidor frontend en segundo plano
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npm run dev" -WindowStyle Minimized
Write-Host "✅ Frontend iniciado en http://localhost:5173" -ForegroundColor Green

# Volver al directorio raíz
Set-Location ..

Write-Host ""
Write-Host "🎉 ¡Sistema iniciado correctamente!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:8000" -ForegroundColor White
Write-Host "👤 Admin Panel: http://localhost:8000/admin/" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales por defecto:" -ForegroundColor Yellow
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: admin" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener ambos servidores" -ForegroundColor Gray

# Mantener el script ejecutándose
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host ""
    Write-Host "Deteniendo servidores..." -ForegroundColor Red
    Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.CommandLine -like "*manage.py runserver*"} | Stop-Process -Force
    Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.CommandLine -like "*vite*"} | Stop-Process -Force
    Write-Host "Servidores detenidos" -ForegroundColor Green
}