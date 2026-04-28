from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        response.data = {
            "erreur": True,
            "code":   response.status_code,
            "detail": response.data.get("detail", str(exc)),
        }
    return response

class SessionDejaOuverteError(APIException):
    status_code = 409
    default_detail = "Une session de ce type est déjà ouverte."
    default_code = 'session_deja_ouverte'

class SessionFermeeError(APIException):
    status_code = 403
    default_detail = "La session est fermée. Soumission impossible."
    default_code = 'session_fermee'

class ThemeDejaActifError(APIException):
    status_code = 409
    default_detail = "Vous avez déjà un thème en attente de validation."
    default_code = 'theme_deja_actif'

class RapportDejaDeposError(APIException):
    status_code = 409
    default_detail = "Vous avez déjà un rapport en cours d'analyse."
    default_code = 'rapport_deja_depose'

class ThemeNonAccepteError(APIException):
    status_code = 403
    default_detail = "Votre thème n'a pas été accepté. Dépôt de rapport impossible."
    default_code = 'theme_non_accepte'

class FichierInvalideError(APIException):
    status_code = 422
    default_detail = "Format de fichier non supporté. Utilisez PDF ou DOCX."
    default_code = 'fichier_invalide'

class TailleExcedeError(APIException):
    status_code = 413
    default_detail = "Le fichier dépasse la taille maximale autorisée."
    default_code = 'taille_excedee'

class SignatureDejaApposeeError(APIException):
    status_code = 409
    default_detail = "Ce rapport a déjà été signé. Aucune double signature possible."
    default_code = 'signature_deja_apposee'

class MotDePasseSignatureError(APIException):
    status_code = 401
    default_detail = "Mot de passe de signature incorrect."
    default_code = 'mot_de_passe_incorrect'

class CommentaireTropCourtError(APIException):
    status_code = 422
    default_detail = "Le commentaire doit contenir au moins 50 caractères."
    default_code = 'commentaire_trop_court'

class DecisionImpossibleError(APIException):
    status_code = 403
    default_detail = "Cette décision n'est pas autorisée dans l'état actuel du document."
    default_code = 'decision_impossible'
