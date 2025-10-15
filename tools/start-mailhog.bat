@echo off
echo Iniciando MailHog...
echo Interfaz web disponible en: http://localhost:8025
echo Servidor SMTP en puerto: 1025
echo Presiona Ctrl+C para detener
cd /d "d:\Gym\tools\mailhog"
mailhog.exe
pause