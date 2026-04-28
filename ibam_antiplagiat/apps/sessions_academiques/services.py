from django.db import transaction
from django.utils import timezone
from .models import SessionAcademique, SessionTypeChoices, SessionStatutChoices
from apps.administration.models import AuditLog
from apps.administration.exceptions import SessionDejaOuverteError
from rest_framework.exceptions import APIException
# from tasks.email_tasks import send_notification_batch

class DureeSessionInvalideError(APIException):
    status_code = 400
    default_detail = "La durée minimale d'une session est de 24 heures."

class SessionThemeEncoreOuverteError(APIException):
    status_code = 409
    default_detail = "La session de thème doit être fermée avant d'ouvrir une session rapport."

class SessionService:

    @staticmethod
    @transaction.atomic
    def ouvrir_session(type_session: str, date_ouverture, date_fermeture,
                       promotion: str, description: str, createur) -> SessionAcademique:
        if SessionAcademique.objects.filter(
                type=type_session, statut=SessionStatutChoices.OUVERTE).exists():
            raise SessionDejaOuverteError()

        delta = date_fermeture - date_ouverture
        if delta.total_seconds() < 86400:
            raise DureeSessionInvalideError()

        if type_session == SessionTypeChoices.RAPPORT:
            if SessionAcademique.objects.filter(
                    type=SessionTypeChoices.THEME,
                    statut=SessionStatutChoices.OUVERTE).exists():
                raise SessionThemeEncoreOuverteError()

        session = SessionAcademique.objects.create(
            type=type_session,
            date_ouverture=date_ouverture,
            date_fermeture=date_fermeture,
            promotion=promotion,
            description=description,
            createur=createur,
            statut=SessionStatutChoices.OUVERTE
        )

        AuditLog.objects.create(
            user=createur, action="OUVERTURE_SESSION",
            entite_type="SessionAcademique", entite_id=session.id,
            details={"type": type_session, "promotion": promotion}
        )

        # send_notification_batch.delay(session.id, type_session)

        return session

    @staticmethod
    @transaction.atomic
    def fermer_session(session_id: int, user) -> SessionAcademique:
        session = SessionAcademique.objects.get(id=session_id)
        session.statut = SessionStatutChoices.FERMEE
        session.date_fermeture = timezone.now()
        session.save()
        
        AuditLog.objects.create(
            user=user, action="FERMETURE_SESSION",
            entite_type="SessionAcademique", entite_id=session.id,
            details={}
        )
        return session

    @staticmethod
    @transaction.atomic
    def prolonger_session(session_id: int, nouvelle_date_fermeture, user):
        session = SessionAcademique.objects.get(id=session_id)
        session.date_fermeture = nouvelle_date_fermeture
        session.save()
        
        AuditLog.objects.create(
            user=user, action="PROLONGATION_SESSION",
            entite_type="SessionAcademique", entite_id=session.id,
            details={"nouvelle_date": str(nouvelle_date_fermeture)}
        )
        return session
