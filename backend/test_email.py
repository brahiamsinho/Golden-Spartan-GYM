"""
Script de prueba para verificar el envío de emails a MailHog
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("=" * 60)
print("TEST DE ENVÍO DE EMAIL A MAILHOG")
print("=" * 60)
print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
print("=" * 60)

try:
    resultado = send_mail(
        subject="Test de MailHog",
        message="Este es un mensaje de prueba desde Django para verificar que MailHog funciona correctamente.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=["test@example.com"],
        fail_silently=False,
    )
    
    print(f"✅ Email enviado exitosamente!")
    print(f"Resultado: {resultado}")
    print(f"Verifica MailHog en: http://localhost:8025")
    
except Exception as e:
    print(f"❌ Error al enviar email: {str(e)}")
    import traceback
    traceback.print_exc()

print("=" * 60)
