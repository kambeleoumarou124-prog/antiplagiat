from django.db import models
from django.conf import settings

class NiveauAlerteChoices(models.TextChoices):
    VERT     = "VERT",     "Original (0–15%)"
    ORANGE   = "ORANGE",   "Similarité modérée (16–30%)"
    ROUGE    = "ROUGE",    "Forte similarité (31–50%)"
    CRITIQUE = "CRITIQUE", "Plagiat probable (>50%)"

class TypeLanceurChoices(models.TextChoices):
    ETUDIANT    = "ETUDIANT"
    CHEF_DEPT   = "CHEF_DEPT"
    DIR_ADJOINT = "DIR_ADJOINT"

class Analyse(models.Model):
    rapport         = models.ForeignKey("rapports.RapportStage",
                                        null=True, blank=True,
                                        on_delete=models.CASCADE,
                                        related_name="analyses")
    theme           = models.ForeignKey("themes.ThemeStage",
                                        null=True, blank=True,
                                        on_delete=models.CASCADE,
                                        related_name="analyses")
    lanceur         = models.ForeignKey(settings.AUTH_USER_MODEL,
                                        on_delete=models.CASCADE,
                                        related_name="analyses_lancees")
    type_lanceur    = models.CharField(max_length=20,
                                       choices=TypeLanceurChoices.choices)
    est_officielle  = models.BooleanField(default=False)
    taux_global     = models.FloatField()
    niveau_alerte   = models.CharField(max_length=10,
                                       choices=NiveauAlerteChoices.choices)
    passages        = models.JSONField(default=list)
    sources         = models.JSONField(default=list)
    rapport_pdf_path = models.CharField(max_length=500, blank=True)
    date_analyse    = models.DateTimeField(auto_now_add=True)
    duree_ms        = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "analyses"
        verbose_name = "Analyse anti-plagiat"
        
    def __str__(self):
        doc = self.rapport if self.rapport else self.theme
        return f"Analyse {self.id} - {self.taux_global}% ({self.niveau_alerte})"
