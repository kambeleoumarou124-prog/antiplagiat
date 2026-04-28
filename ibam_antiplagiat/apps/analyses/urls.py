from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnalyseViewSet

router = DefaultRouter()
router.register(r'', AnalyseViewSet, basename='analyse')

urlpatterns = [
    path('', include(router.urls)),
]
