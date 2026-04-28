from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.authentication.permissions import IsEtudiant, IsChefDept, IsDirAdjoint
from .models import RapportStage
from .serializers import RapportStageSerializer

class RapportViewSet(viewsets.ModelViewSet):
    serializer_class = RapportStageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ETUDIANT":
            return RapportStage.objects.filter(etudiant=user)
        return RapportStage.objects.all()

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated, IsEtudiant])
    def auto_analyse(self, request):
        return Response({"message": "Auto-analyse effectuée"})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsChefDept])
    def analyse(self, request, pk=None):
        return Response({"message": "Analyse lancée"})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsChefDept])
    def decision_chef(self, request, pk=None):
        return Response({"message": "Décision chef attribuée"})

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated, IsDirAdjoint])
    def dossier(self, request, pk=None):
        return Response({"message": "Dossier complet"})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsDirAdjoint])
    def decision_finale(self, request, pk=None):
        return Response({"message": "Décision finale attribuée"})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def signer(self, request, pk=None):
        return Response({"message": "Document signé"})

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def download_signe(self, request, pk=None):
        return Response({"message": "Téléchargement document signé"})
