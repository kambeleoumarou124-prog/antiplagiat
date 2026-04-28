from django.db import models
from django.conf import settings

class ThemeStatutChoices(models.TextChoices):
    EN_ATTENTE    = "EN_ATTENTE",    "En attente"
    ANALYSE       = "ANALYSE",       "Analysé"
    ACCEPTE       = "ACCEPTE",       "Accepté"
    REFUSE        = "REFUSE",        "Refusé"
    A_REFORMULER  = "A_REFORMULER",  "À reformuler"

class ThemeStage(models.Model):
    etudiant        = models.ForeignKey(settings.AUTH_USER_MODEL,
                                        on_delete=models.CASCADE,
                                        related_name="themes")
    session         = models.ForeignKey("sessions_academiques.SessionAcademique",
                                        on_delete=models.CASCADE,
                                        related_name="themes")
    intitule        = models.CharField(max_length=300)
    fichier_path    = models.CharField(max_length=500, blank=True)
    version         = models.PositiveSmallIntegerField(default=1)
    theme_parent    = models.ForeignKey("self", null=True, blank=True,
                                        on_delete=models.SET_NULL,
                                        related_name="versions")
    statut          = models.CharField(max_length=20, choices=ThemeStatutChoices.choices,
                                       default=ThemeStatutChoices.EN_ATTENTE)
    commentaire_chef    = models.TextField(blank=True)
    taux_similarite     = models.FloatField(null=True, blank=True)
    date_soumission     = models.DateTimeField(auto_now_add=True)
    date_decision       = models.DateTimeField(null=True, blank=True)
    decideur            = models.ForeignKey(settings.AUTH_USER_MODEL,
                                            null=True, blank=True,
                                            on_delete=models.SET_NULL,
                                            related_name="themes_decides")

    class Meta:
        db_table = "themes_stage"
        verbose_name = "Thème de stage"
        
    def __str__(self):
        return f"{self.intitule[:50]}... ({self.etudiant.email})"
