# Generated manually to fix existing Bitacora data

from django.db import migrations
from django.utils import timezone


def populate_fecha_hora(apps, schema_editor):
    """Poblar fecha_hora con valores por defecto para registros existentes"""
    Bitacora = apps.get_model("api", "Bitacora")

    # Para registros existentes sin fecha_hora, usar la fecha actual
    for bitacora in Bitacora.objects.filter(fecha_hora__isnull=True):
        bitacora.fecha_hora = timezone.now()
        bitacora.save()


def reverse_populate_fecha_hora(apps, schema_editor):
    """Función reversa - no hace nada"""
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_update_bitacora_model"),
    ]

    operations = [
        migrations.RunPython(populate_fecha_hora, reverse_populate_fecha_hora),
    ]
