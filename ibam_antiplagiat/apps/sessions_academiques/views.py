from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import SessionAcademique
from .serializers import SessionAcademiqueSerializer
from apps.authentication.permissions import IsDirAdjoint

class SessionAcademiqueViewSet(viewsets.ModelViewSet):
    queryset = SessionAcademique.objects.all()
    serializer_class = SessionAcademiqueSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsDirAdjoint]
        return super().get_permissions()

    def perform_create(self, serializer):
        from .services import SessionService
        # L'appel au service devrait être fait ici en fonction de la validation
        serializer.save(createur=self.request.user)
