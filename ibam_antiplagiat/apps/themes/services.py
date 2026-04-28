from django.db import transaction
from .models import ThemeStage, ThemeStatutChoices
from apps.administration.exceptions import ThemeDejaActifError, CommentaireTropCourtError

class ThemeService:

    @staticmethod
    @transaction.atomic
    def soumettre_theme(etudiant, session_id: int, intitule: str,
                        fichier=None) -> ThemeStage:
        # RM-TH-01 : 1 seul thème actif
        actif_statuses = [ThemeStatutChoices.EN_ATTENTE, ThemeStatutChoices.ANALYSE]
        if ThemeStage.objects.filter(etudiant=etudiant, session_id=session_id, statut__in=actif_statuses).exists():
            raise ThemeDejaActifError()
            
        theme = ThemeStage.objects.create(
            etudiant=etudiant,
            session_id=session_id,
            intitule=intitule,
            fichier_path=fichier if fichier else ""
        )
        return theme

    @staticmethod
    @transaction.atomic
    def attribuer_decision(theme_id: int, chef, decision: str,
                           commentaire: str) -> ThemeStage:
        if len(commentaire) < 50:
            raise CommentaireTropCourtError()
            
        theme = ThemeStage.objects.get(id=theme_id)
        theme.statut = decision
        theme.commentaire_chef = commentaire
        theme.decideur = chef
        
        if decision == ThemeStatutChoices.ACCEPTE:
            theme.etudiant.eligibilite_rapport = True
            theme.etudiant.save()
            
        theme.save()
        return theme
