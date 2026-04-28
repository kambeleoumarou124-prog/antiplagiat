from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    user            = models.ForeignKey(settings.AUTH_USER_MODEL,
                                        null=True, on_delete=models.SET_NULL)
    action          = models.CharField(max_length=100)
    entite_type     = models.CharField(max_length=50)
    entite_id       = models.PositiveIntegerField(null=True)
    details         = models.JSONField(default=dict)
    ip_address      = models.GenericIPAddressField(null=True)
    date_action     = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "audit_logs"
        ordering = ["-date_action"]
        
    def __str__(self):
        return f"{self.action} par {self.user} le {self.date_action}"

class ConfigurationSeuils(models.Model):
    cle             = models.CharField(max_length=100, unique=True)
    valeur          = models.CharField(max_length=100)
    description     = models.TextField(blank=True)
    modifie_par     = models.ForeignKey(settings.AUTH_USER_MODEL,
                                        null=True, on_delete=models.SET_NULL)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "configuration_seuils"
        verbose_name = "Configuration seuils"

    def __str__(self):
        return f"{self.cle}: {self.valeur}"

class Signature(models.Model):
    rapport         = models.OneToOneField("rapports.RapportStage",
                                           on_delete=models.CASCADE,
                                           related_name="signature")
    signataire      = models.ForeignKey(settings.AUTH_USER_MODEL,
                                        on_delete=models.CASCADE)
    hash_sha256     = models.CharField(max_length=64)
    signature_rsa   = models.TextField()           # hex de la signature
    date_signature  = models.DateTimeField(auto_now_add=True)
    fichier_signe_path = models.CharField(max_length=500)
    valide          = models.BooleanField(default=True)

    class Meta:
        db_table = "signatures"
        
    def __str__(self):
        return f"Signature de {self.rapport.titre} par {self.signataire.email}"

class Alerte(models.Model):
    rapport         = models.ForeignKey("rapports.RapportStage",
                                        null=True, blank=True,
                                        on_delete=models.CASCADE)
    theme           = models.ForeignKey("themes.ThemeStage",
                                        null=True, blank=True,
                                        on_delete=models.CASCADE)
    niveau          = models.CharField(max_length=10)
    taux_detecte    = models.FloatField()
    notifie_chef    = models.BooleanField(default=False)
    notifie_dir     = models.BooleanField(default=False)
    date_creation   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "alertes"
        
    def __str__(self):
        return f"Alerte {self.niveau} - Taux: {self.taux_detecte}%"
