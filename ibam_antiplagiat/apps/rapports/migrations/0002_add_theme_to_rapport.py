# Generated migration to add theme field to RapportStage

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rapports', '0001_initial'),
        ('themes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='rapportstage',
            name='theme',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='rapports',
                to='themes.themestage'
            ),
        ),
    ]
