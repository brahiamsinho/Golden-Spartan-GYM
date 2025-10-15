"""
Comando Django para probar el envío de emails con MailHog
"""

from django.core.management.base import BaseCommand
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
import time


class Command(BaseCommand):
    help = 'Prueba el envío de emails usando MailHog'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            default='test@goldenspartan.com',
            help='Email de destino para la prueba'
        )
        parser.add_argument(
            '--tipo',
            type=str,
            choices=['simple', 'html', 'recuperacion', 'bienvenida', 'todos'],
            default='simple',
            help='Tipo de email a enviar'
        )

    def handle(self, *args, **options):
        email_destino = options['email']
        tipo_email = options['tipo']

        self.stdout.write(
            self.style.SUCCESS(f'📧 Probando emails con MailHog...')
        )
        self.stdout.write(f'📍 Destino: {email_destino}')
        self.stdout.write(f'📋 Tipo: {tipo_email}')
        self.stdout.write(f'🌐 Interfaz web: http://localhost:8025')
        self.stdout.write('')

        if tipo_email == 'simple' or tipo_email == 'todos':
            self.enviar_email_simple(email_destino)

        if tipo_email == 'html' or tipo_email == 'todos':
            self.enviar_email_html(email_destino)

        if tipo_email == 'recuperacion' or tipo_email == 'todos':
            self.enviar_email_recuperacion(email_destino)

        if tipo_email == 'bienvenida' or tipo_email == 'todos':
            self.enviar_email_bienvenida(email_destino)

        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS('✅ Pruebas completadas. Revisa MailHog en: http://localhost:8025')
        )

    def enviar_email_simple(self, email_destino):
        """Envía un email simple de texto"""
        try:
            send_mail(
                subject='🔧 Prueba de Email Simple - Golden Spartan Gym',
                message='Este es un email de prueba desde Golden Spartan Gym.\n\nSi recibes este mensaje, MailHog está funcionando correctamente.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email_destino],
                fail_silently=False,
            )
            self.stdout.write(
                self.style.SUCCESS('✅ Email simple enviado correctamente')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error enviando email simple: {e}')
            )

    def enviar_email_html(self, email_destino):
        """Envía un email con contenido HTML"""
        try:
            html_content = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Golden Spartan Gym</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏋️ Golden Spartan Gym</h1>
                        <p>Sistema de Información 1</p>
                    </div>
                    <div class="content">
                        <h2>¡Prueba de Email HTML!</h2>
                        <p>Este es un email de prueba con formato HTML desde el sistema Golden Spartan Gym.</p>
                        <p>Características de esta prueba:</p>
                        <ul>
                            <li>✅ Formato HTML completo</li>
                            <li>✅ Estilos CSS integrados</li>
                            <li>✅ Diseño responsivo</li>
                            <li>✅ Colores del tema del gym</li>
                        </ul>
                        <a href="http://localhost:8025" class="button">Ver MailHog Interface</a>
                        <p>Si puedes ver este email correctamente, MailHog está funcionando perfectamente.</p>
                    </div>
                    <div class="footer">
                        <p>Golden Spartan Gym - Sistema de Información 1<br>
                        Email enviado automáticamente - No responder</p>
                    </div>
                </div>
            </body>
            </html>
            """

            msg = EmailMultiAlternatives(
                subject='🎨 Prueba de Email HTML - Golden Spartan Gym',
                body='Este es un email HTML. Si ves este texto, tu cliente de email no soporta HTML.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email_destino]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()

            self.stdout.write(
                self.style.SUCCESS('✅ Email HTML enviado correctamente')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error enviando email HTML: {e}')
            )

    def enviar_email_recuperacion(self, email_destino):
        """Simula un email de recuperación de contraseña"""
        try:
            html_content = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Recuperación de Contraseña - Golden Spartan Gym</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
                    .warning { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔒 Recuperación de Contraseña</h1>
                        <p>Golden Spartan Gym</p>
                    </div>
                    <div class="content">
                        <h2>Solicitud de Cambio de Contraseña</h2>
                        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                        
                        <div class="warning">
                            <strong>⚠️ Importante:</strong> Este es solo un email de prueba. El enlace no es funcional.
                        </div>
                        
                        <p>Si fuiste tú quien solicitó este cambio, haz clic en el siguiente botón:</p>
                        <a href="#" class="button">Restablecer Contraseña</a>
                        
                        <p><strong>Token de prueba:</strong> abc123xyz789</p>
                        <p><strong>Expira en:</strong> 1 hora</p>
                        
                        <p>Si no solicitaste este cambio, ignora este email. Tu contraseña permanecerá sin cambios.</p>
                    </div>
                    <div class="footer">
                        <p>Golden Spartan Gym - Sistema de Seguridad<br>
                        Este email fue enviado automáticamente</p>
                    </div>
                </div>
            </body>
            </html>
            """

            msg = EmailMultiAlternatives(
                subject='🔒 Recuperación de Contraseña - Golden Spartan Gym',
                body='Solicitud de recuperación de contraseña. Ve el email en formato HTML para ver el enlace.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email_destino]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()

            self.stdout.write(
                self.style.SUCCESS('✅ Email de recuperación enviado correctamente')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error enviando email de recuperación: {e}')
            )

    def enviar_email_bienvenida(self, email_destino):
        """Simula un email de bienvenida para nuevos usuarios"""
        try:
            html_content = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>¡Bienvenido a Golden Spartan Gym!</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
                    .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 ¡Bienvenido!</h1>
                        <p>Golden Spartan Gym</p>
                    </div>
                    <div class="content">
                        <h2>¡Tu cuenta ha sido creada exitosamente!</h2>
                        <p>Nos complace darte la bienvenida al sistema de Golden Spartan Gym.</p>
                        
                        <div class="features">
                            <h3>🏋️ Lo que puedes hacer ahora:</h3>
                            <ul>
                                <li>✅ Gestionar tu perfil personal</li>
                                <li>✅ Ver tus membresías activas</li>
                                <li>✅ Acceder a promociones exclusivas</li>
                                <li>✅ Consultar horarios y servicios</li>
                            </ul>
                        </div>
                        
                        <a href="#" class="button">Acceder al Sistema</a>
                        
                        <p><strong>Datos de tu cuenta:</strong></p>
                        <ul>
                            <li><strong>Email:</strong> {email_destino}</li>
                            <li><strong>Fecha de registro:</strong> {fecha_actual}</li>
                            <li><strong>ID de usuario:</strong> USR-{id_usuario}</li>
                        </ul>
                        
                        <p>Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.</p>
                    </div>
                    <div class="footer">
                        <p>Golden Spartan Gym - Bienvenida<br>
                        ¡Gracias por unirte a nuestra comunidad!</p>
                    </div>
                </div>
            </body>
            </html>
            """.format(
                email_destino=email_destino,
                fecha_actual=time.strftime("%d/%m/%Y %H:%M"),
                id_usuario="12345"
            )

            msg = EmailMultiAlternatives(
                subject='🎉 ¡Bienvenido a Golden Spartan Gym!',
                body=f'¡Bienvenido a Golden Spartan Gym!\n\nTu cuenta {email_destino} ha sido creada exitosamente.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email_destino]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()

            self.stdout.write(
                self.style.SUCCESS('✅ Email de bienvenida enviado correctamente')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error enviando email de bienvenida: {e}')
            )