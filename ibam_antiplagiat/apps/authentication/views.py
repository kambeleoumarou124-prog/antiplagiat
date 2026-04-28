from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        user = request.user
        data = {
            "role": user.role,
            "message": f"Bienvenue {user.prenom} sur votre tableau de bord."
        }
        return Response(data)
