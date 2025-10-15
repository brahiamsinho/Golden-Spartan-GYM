"""
Servicio de email para Golden Spartan Gym
"""
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone
from .models import PasswordResetToken, Bitacora
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Servicio para manejo de correos electrónicos"""
    
    @staticmethod
    def send_password_reset_email(user: User, token: str, ip_address: str = "127.0.0.1", user_agent: str = ""):
        """
        Envía correo de recuperación de contraseña
        """
        try:
            # URL de recuperación
            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
            
            # Contexto para el template
            context = {
                'user': user,
                'reset_url': reset_url,
                'site_name': 'Golden Spartan Gym',
                'valid_hours': 1,
            }
            
            # Asunto del correo
            subject = 'Recuperación de Contraseña - Golden Spartan Gym'
            
            # Mensaje en texto plano
            text_message = f"""
Hola {user.first_name or user.username},

Has solicitado recuperar tu contraseña para Golden Spartan Gym.

Para crear una nueva contraseña, haz clic en el siguiente enlace:
{reset_url}

Este enlace es válido por 1 hora.

Si no solicitaste este cambio, puedes ignorar este correo.

Saludos,
Equipo de Golden Spartan Gym
            """.strip()
            
            # Mensaje HTML
            html_message = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .container {{
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            text-align: center;
            margin-bottom: 30px;
        }}
        .logo {{
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 10px;
        }}
        .button {{
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }}
        .button:hover {{
            background: linear-gradient(135deg, #2563eb, #7c3aed);
        }}
        .warning {{
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }}
        .footer {{
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏋️ Golden Spartan Gym</div>
            <h2>Recuperación de Contraseña</h2>
        </div>
        
        <p>Hola <strong>{user.first_name or user.username}</strong>,</p>
        
        <p>Has solicitado recuperar tu contraseña para tu cuenta en Golden Spartan Gym.</p>
        
        <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
        
        <p style="text-align: center;">
            <a href="{reset_url}" class="button">Recuperar Contraseña</a>
        </p>
        
        <div class="warning">
            <strong>⚠️ Importante:</strong>
            <ul>
                <li>Este enlace es válido por <strong>1 hora</strong></li>
                <li>Solo puedes usarlo una vez</li>
                <li>Si no solicitaste este cambio, ignora este correo</li>
            </ul>
        </div>
        
        <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">
            {reset_url}
        </p>
        
        <div class="footer">
            <p>¿Necesitas ayuda? Contacta con nosotros:</p>
            <p>📧 soporte@goldenspartan.com | 📞 (+591) 2-1234567</p>
            <p style="margin-top: 20px; font-size: 12px;">
                Golden Spartan Gym - Tu gimnasio de confianza
            </p>
        </div>
    </div>
</body>
</html>
            """.strip()
            
            # Crear y enviar email
            print(f"Enviando email de recuperación a: {user.email}")
            print(f"Backend de email configurado: {settings.EMAIL_BACKEND}")
            print(f"URL de recuperación: {reset_url}")
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )
            email.attach_alternative(html_message, "text/html")
            
            # Enviar email
            print("Intentando enviar email...")
            result = email.send()
            print(f"Resultado del envío: {result}")
            
            if result:
                # Registrar en bitácora
                Bitacora.log_activity(
                    usuario=user,
                    tipo_accion="forgot_password",
                    accion="Correo de recuperación enviado",
                    descripcion=f"Correo de recuperación enviado a {user.email}",
                    nivel="info",
                    ip_address=ip_address,
                    user_agent=user_agent,
                    datos_adicionales={
                        "email": user.email,
                        "reset_url": reset_url,
                        "token_expires": "1 hour"
                    }
                )
                logger.info(f"Password reset email sent to {user.email}")
                print(f"✅ Email enviado exitosamente a {user.email}")
                return True
            else:
                logger.error(f"Failed to send password reset email to {user.email}")
                print(f"❌ Error: No se pudo enviar email a {user.email}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending password reset email to {user.email}: {str(e)}")
            # Registrar error en bitácora
            Bitacora.log_activity(
                usuario=user,
                tipo_accion="error",
                accion="Error enviando correo de recuperación",
                descripcion=f"Error: {str(e)}",
                nivel="error",
                ip_address=ip_address,
                user_agent=user_agent,
                datos_adicionales={
                    "email": user.email,
                    "error": str(e)
                }
            )
            return False
    
    @staticmethod
    def send_password_changed_notification(user: User, ip_address: str = "127.0.0.1"):
        """
        Envía notificación de que la contraseña fue cambiada exitosamente
        """
        try:
            subject = 'Contraseña Cambiada - Golden Spartan Gym'
            
            text_message = f"""
Hola {user.first_name or user.username},

Tu contraseña ha sido cambiada exitosamente en Golden Spartan Gym.

Fecha: {timezone.now().strftime('%d/%m/%Y a las %H:%M')}
IP: {ip_address}

Si no fuiste tú quien cambió la contraseña, contacta inmediatamente con soporte.

Saludos,
Equipo de Golden Spartan Gym
            """.strip()
            
            html_message = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contraseña Cambiada</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .container {{
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        .success {{
            background-color: #d1fae5;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }}
        .warning {{
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h2>🏋️ Golden Spartan Gym</h2>
        <h3>Contraseña Cambiada Exitosamente</h3>
        
        <div class="success">
            <strong>✅ ¡Contraseña actualizada!</strong><br>
            Tu contraseña ha sido cambiada correctamente.
        </div>
        
        <p>Hola <strong>{user.first_name or user.username}</strong>,</p>
        
        <p>Te confirmamos que tu contraseña ha sido cambiada exitosamente.</p>
        
        <p><strong>Detalles del cambio:</strong></p>
        <ul>
            <li>📅 Fecha: {timezone.now().strftime('%d/%m/%Y a las %H:%M')}</li>
            <li>🌐 IP: {ip_address}</li>
        </ul>
        
        <div class="warning">
            <strong>⚠️ ¿No fuiste tú?</strong><br>
            Si no cambiaste tu contraseña, contacta inmediatamente con soporte:
            <br>📧 soporte@goldenspartan.com | 📞 (+591) 2-1234567
        </div>
        
        <p>Gracias por usar Golden Spartan Gym.</p>
    </div>
</body>
</html>
            """.strip()
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )
            email.attach_alternative(html_message, "text/html")
            
            result = email.send()
            
            if result:
                logger.info(f"Password changed notification sent to {user.email}")
                return True
            else:
                logger.error(f"Failed to send password changed notification to {user.email}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending password changed notification to {user.email}: {str(e)}")
            return False