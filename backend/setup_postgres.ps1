# Este script configura PostgreSQL para el proyecto
# Debe ejecutarse desde PowerShell

# Verificar si PostgreSQL está instalado
Write-Host "Verificando instalación de PostgreSQL..." -ForegroundColor Green
$pgInstalled = $false

# Intentar encontrar PostgreSQL en el registro de Windows
$pgRegistry = Get-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\SOFTWARE\PostgreSQL\Installations\*' -ErrorAction SilentlyContinue | Select-Object BaseDirectory

if ($pgRegistry) {
    Write-Host "PostgreSQL encontrado en: $($pgRegistry.BaseDirectory)" -ForegroundColor Green
    $pgInstalled = $true
} else {
    Write-Host "No se encontró PostgreSQL instalado en el registro de Windows." -ForegroundColor Yellow
    
    # Verificar si existe el comando psql
    if (Get-Command "psql" -ErrorAction SilentlyContinue) {
        Write-Host "Se encontró el comando psql. PostgreSQL podría estar instalado." -ForegroundColor Green
        $pgInstalled = $true
    } else {
        Write-Host "No se encontró el comando psql." -ForegroundColor Yellow
    }
}

if (-not $pgInstalled) {
    Write-Host "PostgreSQL no parece estar instalado. Por favor, instálelo desde https://www.postgresql.org/download/" -ForegroundColor Red
    Write-Host "Continuando con SQLite..." -ForegroundColor Yellow
    
    # Actualizar .env para usar SQLite
    $envContent = Get-Content -Path ".env" -Raw
    $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=sqlite:///db.sqlite3"
    $envContent | Set-Content -Path ".env" -NoNewline
    
    Write-Host "Configuración actualizada para usar SQLite." -ForegroundColor Green
    exit
}

# Solicitar credenciales para PostgreSQL
$pgUser = Read-Host "Usuario de PostgreSQL (por defecto: postgres)"
if (-not $pgUser) { $pgUser = "postgres" }

$pgPassword = Read-Host "Contraseña de PostgreSQL" -AsSecureString
$pgPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword))

$pgHost = Read-Host "Host de PostgreSQL (por defecto: localhost)"
if (-not $pgHost) { $pgHost = "localhost" }

$pgPort = Read-Host "Puerto de PostgreSQL (por defecto: 5432)"
if (-not $pgPort) { $pgPort = "5432" }

$dbName = Read-Host "Nombre de la base de datos a crear (por defecto: golden_spartan)"
if (-not $dbName) { $dbName = "golden_spartan" }

# Probar conexión
Write-Host "Probando conexión a PostgreSQL..." -ForegroundColor Green
$env:PGPASSWORD = $pgPasswordPlain

try {
    $testConnection = & psql -U $pgUser -h $pgHost -p $pgPort -c "\conninfo" 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Error al conectar"
    }
    Write-Host "Conexión exitosa." -ForegroundColor Green
}
catch {
    Write-Host "Error al conectar a PostgreSQL. Verifique las credenciales e intente nuevamente." -ForegroundColor Red
    Write-Host "Continuando con SQLite..." -ForegroundColor Yellow
    
    # Actualizar .env para usar SQLite
    $envContent = Get-Content -Path ".env" -Raw
    $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=sqlite:///db.sqlite3"
    $envContent | Set-Content -Path ".env" -NoNewline
    
    Write-Host "Configuración actualizada para usar SQLite." -ForegroundColor Green
    exit
}

# Crear base de datos si no existe
Write-Host "Verificando si la base de datos '$dbName' existe..." -ForegroundColor Green
$dbExists = & psql -U $pgUser -h $pgHost -p $pgPort -t -c "SELECT 1 FROM pg_database WHERE datname='$dbName'" | Out-String

if ($dbExists.Trim() -ne "1") {
    Write-Host "Creando base de datos '$dbName'..." -ForegroundColor Green
    $createDb = & psql -U $pgUser -h $pgHost -p $pgPort -c "CREATE DATABASE $dbName" 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error al crear la base de datos. $createDb" -ForegroundColor Red
        Write-Host "Continuando con SQLite..." -ForegroundColor Yellow
        
        # Actualizar .env para usar SQLite
        $envContent = Get-Content -Path ".env" -Raw
        $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=sqlite:///db.sqlite3"
        $envContent | Set-Content -Path ".env" -NoNewline
        
        Write-Host "Configuración actualizada para usar SQLite." -ForegroundColor Green
        exit
    }
    
    Write-Host "Base de datos '$dbName' creada exitosamente." -ForegroundColor Green
} else {
    Write-Host "La base de datos '$dbName' ya existe." -ForegroundColor Green
}

# Actualizar .env para usar PostgreSQL
Write-Host "Actualizando archivo .env con configuración de PostgreSQL..." -ForegroundColor Green
$envContent = Get-Content -Path ".env" -Raw
$envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=postgresql://${pgUser}:${pgPasswordPlain}@${pgHost}:${pgPort}/${dbName}"
$envContent | Set-Content -Path ".env" -NoNewline

Write-Host "Configuración completada. El proyecto ahora está configurado para usar PostgreSQL." -ForegroundColor Green
Write-Host "Para migrar la base de datos, ejecute:" -ForegroundColor Cyan
Write-Host "python manage.py makemigrations" -ForegroundColor White
Write-Host "python manage.py migrate" -ForegroundColor White

# Limpiar variable de contraseña
$env:PGPASSWORD = ""