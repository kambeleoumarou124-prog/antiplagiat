from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, LoginSerializer, TokenResponseSerializer


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
            "message": f"Bienvenue {user.prenom} sur votre tableau de bord.",
        }

        # Pour les étudiants, ajouter les stats de thèmes et rapports
        if user.role == "ETUDIANT":
            from apps.themes.models import ThemeStage, ThemeStatutChoices
            from apps.rapports.models import RapportStage, RapportStatutChoices

            # Statut du thème le plus récent
            dernier_theme = ThemeStage.objects.filter(etudiant=user).order_by('-date_soumission').first()
            if dernier_theme:
                data["theme_statut"] = dernier_theme.get_statut_display()
            else:
                data["theme_statut"] = None

            # Éligibilité rapport (si un thème est accepté)
            data["eligibilite_rapport"] = user.eligibilite_rapport

            # Statut du rapport le plus récent
            dernier_rapport = RapportStage.objects.filter(etudiant=user).order_by('-date_soumission').first()
            if dernier_rapport:
                data["rapport_statut"] = dernier_rapport.get_statut_display()
            else:
                data["rapport_statut"] = None

        return Response(data)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vue personnalisée pour la connexion qui retourne
    l'access token, le refresh token et les infos utilisateur.
    """
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Générer les tokens JWT
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )
