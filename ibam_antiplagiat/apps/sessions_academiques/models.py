from django.db import models
from django.conf import settings

class SessionTypeChoices(models.TextChoices):
    THEME   = "SESSION_THEME",   "Session Thème"
    RAPPORT = "SESSION_RAPPORT", "Session Rapport"

class SessionStatutChoices(models.TextChoices):
    OUVERTE = "OUVERTE", "Ouverte"
    FERMEE  = "FERMEE",  "Fermée"

class SessionAcademique(models.Model):
    type           = models.CharField(max_length=20, choices=SessionTypeChoices.choices)
    statut         = models.CharField(max_length=10, choices=SessionStatutChoices.choices,
                                      default=SessionStatutChoices.OUVERTE)
    date_ouverture = models.DateTimeField()
    date_fermeture = models.DateTimeField()
    promotion      = models.CharField(max_length=100)
    description    = models.TextField(blank=True)
    createur       = models.ForeignKey(settings.AUTH_USER_MODEL,
                                       on_delete=models.PROTECT,
                                       related_name="sessions_creees")
    date_creation  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "sessions_academiques"
        verbose_name = "Session académique"
        
    def __str__(self):
        return f"{self.get_type_display()} - {self.promotion}"
