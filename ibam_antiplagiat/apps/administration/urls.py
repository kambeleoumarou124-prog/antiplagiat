from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserAdminViewSet, ConfigurationSeuilsViewSet, AuditLogViewSet, StatsViewSet

router = DefaultRouter()
router.register(r'users', UserAdminViewSet, basename='admin-users')
router.register(r'config/seuils', ConfigurationSeuilsViewSet, basename='admin-seuils')
router.register(r'audit-logs', AuditLogViewSet, basename='admin-audit')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/global/', StatsViewSet.as_view({'get': 'global_stats'}), name='admin-stats'),
]
