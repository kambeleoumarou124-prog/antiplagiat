from django.db import transaction
from .models import RapportStage, RapportStatutChoices

class RapportService:
    @staticmethod
    @transaction.atomic
    def soumettre_rapport(etudiant, session_id: int, theme_id: int, titre: str,
                          fichier_path: str, fichier_anonymise_path: str) -> RapportStage:
        rapport = RapportStage.objects.create(
            etudiant=etudiant,
            session_id=session_id,
            theme_id=theme_id,
            titre=titre,
            fichier_path=fichier_path,
            fichier_anonymise_path=fichier_anonymise_path
        )
        return rapport
