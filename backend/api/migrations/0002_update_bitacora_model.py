# Generated manually for Bitacora model update

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="bitacora",
            old_name="ip",
            new_name="ip_address",
        ),
        migrations.RemoveField(
            model_name="bitacora",
            name="fecha",
        ),
        migrations.RemoveField(
            model_name="bitacora",
            name="hora",
        ),
        migrations.AddField(
            model_name="bitacora",
            name="datos_adicionales",
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="bitacora",
            name="descripcion",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="bitacora",
            name="fecha_hora",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name="bitacora",
            name="nivel",
            field=models.CharField(
                choices=[
                    ("info", "Información"),
                    ("warning", "Advertencia"),
                    ("error", "Error"),
                    ("critical", "Crítico"),
                ],
                default="info",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="bitacora",
            name="tipo_accion",
            field=models.CharField(
                choices=[
                    ("login", "Inicio de Sesión"),
                    ("logout", "Cierre de Sesión"),
                    ("create_user", "Crear Usuario"),
                    ("update_user", "Actualizar Usuario"),
                    ("delete_user", "Eliminar Usuario"),
                    ("create_role", "Crear Rol"),
                    ("update_role", "Actualizar Rol"),
                    ("delete_role", "Eliminar Rol"),
                    ("assign_role", "Asignar Rol"),
                    ("remove_role", "Remover Rol"),
                    ("create_permission", "Crear Permiso"),
                    ("update_permission", "Actualizar Permiso"),
                    ("delete_permission", "Eliminar Permiso"),
                    ("system_start", "Inicio del Sistema"),
                    ("system_stop", "Parada del Sistema"),
                    ("error", "Error del Sistema"),
                    ("other", "Otra Actividad"),
                ],
                default="other",
                max_length=50,
            ),
        ),
        migrations.AddField(
            model_name="bitacora",
            name="user_agent",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="bitacora",
            name="accion",
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name="bitacora",
            name="usuario",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="auth.user",
            ),
        ),
    ]
