# Script para iniciar el sistema Golden Spartan GYM
Write-Host "🏋️ Iniciando Golden Spartan GYM..." -ForegroundColor Green

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

# Verificar si el backend ya está ejecutándose
if (Test-Port 8000) {
    Write-Host "✅ Backend ya está ejecutándose en puerto 8000" -ForegroundColor Yellow
} else {
    Write-Host "🚀 Iniciando Backend..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; python manage.py runserver" -WindowStyle Normal
    Start-Sleep -Seconds 3
}

# Verificar si el frontend ya está ejecutándose
if (Test-Port 5173) {
    Write-Host "✅ Frontend ya está ejecutándose en puerto 5173" -ForegroundColor Yellow
} else {
    Write-Host "🚀 Iniciando Frontend..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "🎉 Sistema iniciado!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 Credenciales:" -ForegroundColor Yellow
Write-Host "   Usuario: admin" -ForegroundColor White
Write-Host "   Contraseña: admin" -ForegroundColor White
Write-Host ""
Write-Host "💡 Si el login no funciona, revisa la consola del navegador (F12)" -ForegroundColor Magenta
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
