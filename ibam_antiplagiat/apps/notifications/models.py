from django.db import models
from django.conf import settings

class Notification(models.Model):
    destinataire    = models.ForeignKey(settings.AUTH_USER_MODEL,
                                        on_delete=models.CASCADE,
                                        related_name="notifications")
    type_notif      = models.CharField(max_length=50)
    titre           = models.CharField(max_length=200)
    contenu         = models.TextField()
    lue             = models.BooleanField(default=False)
    rapport         = models.ForeignKey("rapports.RapportStage",
                                        null=True, blank=True,
                                        on_delete=models.SET_NULL)
    theme           = models.ForeignKey("themes.ThemeStage",
                                        null=True, blank=True,
                                        on_delete=models.SET_NULL)
    date_envoi      = models.DateTimeField(auto_now_add=True)
    email_envoye    = models.BooleanField(default=False)
    email_retries   = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = "notifications"
        ordering = ["-date_envoi"]
        
    def __str__(self):
        return f"{self.titre} - {self.destinataire.email}"
