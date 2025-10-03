# Generated manually to make fecha_hora not null

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0003_fix_bitacora_data"),
    ]

    operations = [
        migrations.AlterField(
            model_name="bitacora",
            name="fecha_hora",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
