from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.authentication.permissions import IsEtudiant, IsChefDept, IsDirAdjoint
from .models import RapportStage
from .serializers import RapportStageSerializer, SoumissionRapportSerializer

class RapportViewSet(viewsets.ModelViewSet):
    serializer_class = RapportStageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ETUDIANT":
            return RapportStage.objects.filter(etudiant=user)
        return RapportStage.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return SoumissionRapportSerializer
        return RapportStageSerializer

    def perform_create(self, serializer):
        from .services import RapportService
        import os
        from django.conf import settings

        # Sauvegarder le fichier
        fichier = serializer.validated_data.get('fichier')
        fichier_path = ""
        fichier_anonymise_path = ""

        if fichier:
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'rapports')
            os.makedirs(upload_dir, exist_ok=True)
            file_path = os.path.join(upload_dir, fichier.name)
            with open(file_path, 'wb+') as destination:
                for chunk in fichier.chunks():
                    destination.write(chunk)
            fichier_path = f"rapports/{fichier.name}"
            fichier_anonymise_path = f"rapports/anonymise_{fichier.name}"

        RapportService.soumettre_rapport(
            etudiant=self.request.user,
            session_id=serializer.validated_data['session'].id,
            theme_id=serializer.validated_data['theme'].id,
            titre=serializer.validated_data['titre'],
            fichier_path=fichier_path,
            fichier_anonymise_path=fichier_anonymise_path
        )

    @action(detail=True, methods=["post"], url_path="auto-analyser", permission_classes=[IsAuthenticated, IsEtudiant])
    def auto_analyse(self, request, pk=None):
        rapport = self.get_object()
        fichier = request.FILES.get('fichier')
        if not fichier:
            from rest_framework import status
            return Response({"detail": "Fichier requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        import tempfile
        import os
        from nlp.pipeline import run_pipeline
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(fichier.name)[1]) as tmp:
            for chunk in fichier.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
        
        try:
            result = run_pipeline(tmp_path, request.user, rapport_id=rapport.id, est_officielle=False)
        finally:
            os.unlink(tmp_path)
            
        return Response(result)

    @action(detail=True, methods=["post"], url_path="analyser", permission_classes=[IsAuthenticated])
    def analyse(self, request, pk=None):
        rapport = self.get_object()
        fichier = request.FILES.get('fichier')
        if not fichier:
            from rest_framework import status
            return Response({"detail": "Fichier requis"}, status=status.HTTP_400_BAD_REQUEST)
        if fichier.size > 50 * 1024 * 1024:
            from rest_framework import status
            return Response({"detail": "Fichier trop volumineux"}, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
        if not fichier.name.endswith('.pdf') and not fichier.name.endswith('.docx'):
            from rest_framework import status
            return Response({"detail": "Type invalide"}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
        
        import tempfile
        import os
        from nlp.pipeline import run_pipeline
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(fichier.name)[1]) as tmp:
            for chunk in fichier.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
            
        try:
            analyse_obj = run_pipeline(tmp_path, request.user, rapport_id=rapport.id, est_officielle=True)
            if request.user.role == "CHEF_DEPT":
                rapport.statut = "ANALYSE_CHEF"
                rapport.taux_similarite_global = analyse_obj.taux_global
                rapport.save()
        except Exception as e:
            from rest_framework import status
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        finally:
            os.unlink(tmp_path)
            
        return Response({"message": "Analyse lancée"})

    @action(detail=True, methods=["post"], url_path="decision-chef", permission_classes=[IsAuthenticated, IsChefDept])
    def decision_chef(self, request, pk=None):
        rapport = self.get_object()
        decision = request.data.get("decision")
        rapport.decision_chef = decision
        rapport.statut = "DECISION_CHEF"
        rapport.save()
        return Response({"message": "Décision chef attribuée"})

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated, IsDirAdjoint])
    def dossier(self, request, pk=None):
        return Response({"message": "Dossier complet"})

    @action(detail=True, methods=["post"], url_path="decision-finale", permission_classes=[IsAuthenticated, IsDirAdjoint])
    def decision_finale(self, request, pk=None):
        rapport = self.get_object()
        decision_finale = request.data.get("decision_finale")
        rapport.decision_finale = decision_finale
        rapport.statut = decision_finale
        rapport.save()
        return Response({"message": "Décision finale attribuée"})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def signer(self, request, pk=None):
        return Response({"message": "Document signé"})

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def download_signe(self, request, pk=None):
        return Response({"message": "Téléchargement document signé"})
