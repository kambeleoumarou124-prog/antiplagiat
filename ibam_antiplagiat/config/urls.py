from django.urls import path, include

urlpatterns = [
    # Admin natif (sous un chemin potentiellement caché pour plus de sécu, on le laisse sous api/v1/admin/django pour l'instant ou admin/)
    path("admin/", include("apps.administration.urls")), # Sera mappé à /admin/ par défaut si on importe django.contrib.admin.urls
    
    # API Endpoints
    path("api/v1/auth/", include("apps.authentication.urls")),
    path("api/v1/sessions/", include("apps.sessions_academiques.urls")),
    path("api/v1/themes/", include("apps.themes.urls")),
    path("api/v1/rapports/", include("apps.rapports.urls")),
    path("api/v1/analyses/", include("apps.analyses.urls")),
    path("api/v1/notifications/", include("apps.notifications.urls")),
    path("api/v1/admin/", include("apps.administration.urls")),
]
