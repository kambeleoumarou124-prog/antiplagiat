from celery import shared_task

@shared_task(bind=True, max_retries=3, default_retry_delay=600)
def send_email_retry_task(self, notification_id: int):
    """Retry envoi email"""
    pass

@shared_task
def send_notification_batch(session_id: int, type_session: str):
    """Envoi batch notifications ouverture session"""
    pass
