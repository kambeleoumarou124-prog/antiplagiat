from django.db import models
from django.conf import settings

class RapportStatutChoices(models.TextChoices):
    SOUMIS              = "SOUMIS",              "Soumis"
    ANALYSE_CHEF        = "ANALYSE_CHEF",        "Analysé par le chef"
    DECISION_CHEF       = "DECISION_CHEF",       "Décision chef rendue"
    VALIDE_DEF          = "VALIDE_DEF",          "Validé définitivement"
    REFUSE_DEF          = "REFUSE_DEF",          "Refusé définitivement"
    EN_REVISION         = "EN_REVISION",         "En révision"
    ERREUR_EXTRACTION   = "ERREUR_EXTRACTION",   "Erreur extraction"

class DecisionChefChoices(models.TextChoices):
    VALIDE      = "VALIDE",      "Validé"
    REFUSE      = "REFUSE",      "Refusé"
    CORRECTIONS = "CORRECTIONS", "Corrections demandées"

class DecisionFinaleChoices(models.TextChoices):
    VALIDE_DEF  = "VALIDE_DEF",  "Validé définitivement"
    REFUSE_DEF  = "REFUSE_DEF",  "Refusé définitivement"
    EN_REVISION = "EN_REVISION", "En révision"

class RapportStage(models.Model):
    etudiant                = models.ForeignKey(settings.AUTH_USER_MODEL,
                                                on_delete=models.CASCADE,
                                                related_name="rapports")
    session                 = models.ForeignKey("sessions_academiques.SessionAcademique",
                                                on_delete=models.CASCADE)
    titre                   = models.CharField(max_length=300)
    fichier_path            = models.CharField(max_length=500)
    fichier_anonymise_path  = models.CharField(max_length=500)
    statut                  = models.CharField(max_length=25,
                                               choices=RapportStatutChoices.choices,
                                               default=RapportStatutChoices.SOUMIS)
    taux_similarite_global  = models.FloatField(null=True, blank=True)
    decision_chef           = models.CharField(max_length=20,
                                               choices=DecisionChefChoices.choices,
                                               blank=True)
    commentaire_chef        = models.TextField(blank=True)
    decideur_chef           = models.ForeignKey(settings.AUTH_USER_MODEL,
                                                null=True, blank=True,
                                                on_delete=models.SET_NULL,
                                                related_name="rapports_decides_chef")
    decision_finale         = models.CharField(max_length=20,
                                               choices=DecisionFinaleChoices.choices,
                                               blank=True)
    commentaire_final       = models.TextField(blank=True)
    decideur_final          = models.ForeignKey(settings.AUTH_USER_MODEL,
                                                null=True, blank=True,
                                                on_delete=models.SET_NULL,
                                                related_name="rapports_decides_final")
    date_soumission         = models.DateTimeField(auto_now_add=True)
    date_decision_chef      = models.DateTimeField(null=True, blank=True)
    date_decision_finale    = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "rapports_stage"
        verbose_name = "Rapport de stage"
        
    def __str__(self):
        return f"{self.titre[:50]}... ({self.etudiant.email})"
