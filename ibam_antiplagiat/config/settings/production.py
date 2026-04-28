from .base import *

DEBUG = False
# ALLOWED_HOSTS defined in environment variable in base.py

# Production specific settings like secure cookies, etc.
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
