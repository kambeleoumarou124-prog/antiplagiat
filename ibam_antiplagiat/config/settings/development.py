from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']

# Utilisation de SQLite pour le développement et les tests (pour contourner le besoin de PostgreSQL local)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Optional: debug toolbar, etc.
