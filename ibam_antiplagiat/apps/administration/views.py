from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.authentication.permissions import IsAdminIBAM
from django.contrib.auth import get_user_model
from .models import ConfigurationSeuils, AuditLog
from .serializers import UserAdminSerializer, ConfigurationSeuilsSerializer, AuditLogSerializer

User = get_user_model()

class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminIBAM]

class ConfigurationSeuilsViewSet(viewsets.ModelViewSet):
    queryset = ConfigurationSeuils.objects.all()
    serializer_class = ConfigurationSeuilsSerializer
    permission_classes = [IsAuthenticated, IsAdminIBAM]
    lookup_field = 'cle'

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsAdminIBAM]

class StatsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsAdminIBAM]

    @action(detail=False, methods=['get'])
    def global_stats(self, request):
        return Response({"message": "Statistiques globales"})
