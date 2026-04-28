from celery import shared_task
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

@shared_task(bind=True, max_retries=3, time_limit=300, soft_time_limit=280)
def analyse_document_task(self, document_id: int, document_type: str,
                           lanceur_id: int, est_officielle: bool):
    """
    Tâche Celery asynchrone pour l'analyse NLP.
    """
    from django.contrib.auth import get_user_model
    from nlp.pipeline import run_pipeline

    User = get_user_model()
    try:
        lanceur = User.objects.get(id=lanceur_id)
        if document_type == "rapport":
            from apps.rapports.models import RapportStage
            doc = RapportStage.objects.get(id=document_id)
            filepath = doc.fichier_path
            result = run_pipeline(filepath, lanceur,
                                  rapport_id=document_id,
                                  est_officielle=est_officielle)
        elif document_type == "theme":
            from apps.themes.models import ThemeStage
            doc = ThemeStage.objects.get(id=document_id)
            filepath = doc.fichier_path
            result = run_pipeline(filepath, lanceur,
                                  theme_id=document_id,
                                  est_officielle=est_officielle)
        return result.id if est_officielle else result
    except Exception as exc:
        logger.error(f"Erreur analyse document {document_id} : {exc}")
        raise self.retry(exc=exc, countdown=30)
