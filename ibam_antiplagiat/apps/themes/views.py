from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.authentication.permissions import IsEtudiant, IsChefDept
from .models import ThemeStage
from .serializers import ThemeDetailSerializer, SoumissionThemeSerializer, DecisionThemeSerializer

class ThemeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ETUDIANT":
            return ThemeStage.objects.filter(etudiant=user)
        elif user.role in ["CHEF_DEPT", "DIR_ADJOINT", "ADMIN"]:
            return ThemeStage.objects.all()
        return ThemeStage.objects.none()
        
    def get_serializer_class(self):
        if self.action == 'create':
            return SoumissionThemeSerializer
        return ThemeDetailSerializer

    def perform_create(self, serializer):
        from .services import ThemeService
        ThemeService.soumettre_theme(
            etudiant=self.request.user,
            session_id=serializer.validated_data['session'].id,
            intitule=serializer.validated_data['intitule'],
            fichier=serializer.validated_data.get('fichier')
        )

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated, IsEtudiant])
    def auto_analyse(self, request):
        return Response({"message": "Auto-analyse effectuée"})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsChefDept])
    def analyse(self, request, pk=None):
        return Response({"message": "Analyse lancée"})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsChefDept])
    def decision(self, request, pk=None):
        serializer = DecisionThemeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        from .services import ThemeService
        theme = ThemeService.attribuer_decision(
            theme_id=pk,
            chef=request.user,
            decision=serializer.validated_data['decision'],
            commentaire=serializer.validated_data['commentaire']
        )
        return Response(ThemeDetailSerializer(theme).data)

    @action(detail=True, methods=["put"], permission_classes=[IsAuthenticated, IsEtudiant])
    def resubmit(self, request, pk=None):
        return Response({"message": "Thème resoumis"})

    @action(detail=True, methods=["get"])
    def history(self, request, pk=None):
        return Response({"message": "Historique des versions"})
