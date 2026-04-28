import magic
from apps.administration.exceptions import FichierInvalideError, TailleExcedeError
from django.conf import settings

def validate_file(file_obj, max_size_mb=10):
    """Vérification MIME type réel (magic bytes) + taille max."""
    if file_obj.size > max_size_mb * 1024 * 1024:
        raise TailleExcedeError()
        
    mime = magic.Magic(mime=True)
    # Lire un chunk pour détecter le mime type
    file_mime = mime.from_buffer(file_obj.read(1024))
    file_obj.seek(0) # Réinitialiser le pointeur après lecture
    
    if file_mime not in settings.ALLOWED_MIME_TYPES:
        raise FichierInvalideError(f"MIME type invalide: {file_mime}")
        
    return True
