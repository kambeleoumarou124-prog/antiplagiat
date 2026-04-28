from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SessionAcademiqueViewSet

router = DefaultRouter()
router.register(r'', SessionAcademiqueViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
