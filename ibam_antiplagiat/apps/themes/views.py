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

    @action(detail=False, methods=["post"], url_path="auto-analyse", permission_classes=[IsAuthenticated, IsEtudiant])
    def auto_analyse(self, request):
        fichier = request.FILES.get('fichier')
        if not fichier:
            return Response({"detail": "Fichier requis"}, status=status.HTTP_400_BAD_REQUEST)
        if fichier.size > 10 * 1024 * 1024:
            return Response({"detail": "Fichier trop volumineux (max 10 Mo)"}, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
        if not fichier.name.endswith('.pdf') and not fichier.name.endswith('.docx'):
            return Response({"detail": "Type de fichier non supporté"}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
        
        import tempfile
        import os
        from nlp.pipeline import run_pipeline
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(fichier.name)[1]) as tmp:
            for chunk in fichier.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
        
        try:
            result = run_pipeline(tmp_path, request.user, theme_id=None, est_officielle=False)
        finally:
            os.unlink(tmp_path)
            
        return Response(result)

    @action(detail=True, methods=["post"], url_path="auto-analyser", permission_classes=[IsAuthenticated, IsEtudiant])
    def auto_analyse_theme(self, request, pk=None):
        theme = self.get_object()
        if theme.session.statut == "FERMEE":
            return Response({"detail": "Session fermée"}, status=status.HTTP_403_FORBIDDEN)
        fichier = request.FILES.get('fichier')
        if not fichier:
            return Response({"detail": "Fichier requis"}, status=status.HTTP_400_BAD_REQUEST)
        if fichier.size > 10 * 1024 * 1024:
            return Response({"detail": "Fichier trop volumineux (max 10 Mo)"}, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
        if not fichier.name.endswith('.pdf') and not fichier.name.endswith('.docx'):
            return Response({"detail": "Type de fichier non supporté"}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
        
        import tempfile
        import os
        from nlp.pipeline import run_pipeline
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(fichier.name)[1]) as tmp:
            for chunk in fichier.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
        
        try:
            result = run_pipeline(tmp_path, request.user, theme_id=theme.id, est_officielle=False)
        finally:
            os.unlink(tmp_path)
            
        return Response(result)

    @action(detail=True, methods=["post"], url_path="analyser", permission_classes=[IsAuthenticated, IsChefDept])
    def analyse(self, request, pk=None):
        theme = self.get_object()
        fichier = request.FILES.get('fichier')
        if not fichier:
            return Response({"detail": "Fichier requis"}, status=status.HTTP_400_BAD_REQUEST)
            
        import tempfile
        import os
        from nlp.pipeline import run_pipeline
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(fichier.name)[1]) as tmp:
            for chunk in fichier.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
            
        try:
            analyse_obj = run_pipeline(tmp_path, request.user, theme_id=theme.id, est_officielle=True)
            if request.user.role == "CHEF_DEPT":
                theme.statut = "ANALYSE"
                theme.taux_similarite = analyse_obj.taux_global
                theme.save()
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        finally:
            os.unlink(tmp_path)
            
        return Response({"message": "Analyse officielle terminée", "taux": analyse_obj.taux_global})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsChefDept])
    def decision(self, request, pk=None):
        theme = self.get_object()
        if theme.statut == "EN_ATTENTE":
            return Response({"detail": "Analyse requise avant toute décision"}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = DecisionThemeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        from .services import ThemeService
        theme = ThemeService.attribuer_decision(
            theme_id=pk,
            chef=request.user,
            decision=serializer.validated_data['decision'],
            commentaire=serializer.validated_data.get('commentaire', '')
        )
        return Response(ThemeDetailSerializer(theme).data)

    @action(detail=True, methods=["put"], permission_classes=[IsAuthenticated, IsEtudiant])
    def resubmit(self, request, pk=None):
        return Response({"message": "Thème resoumis"})

    @action(detail=True, methods=["get"])
    def history(self, request, pk=None):
        return Response({"message": "Historique des versions"})

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        theme = self.get_object()
        if not theme.fichier_path:
            return Response({"detail": "Aucun fichier disponible"}, status=status.HTTP_404_NOT_FOUND)
        
        import os
        from django.http import FileResponse
        from django.conf import settings
        
        file_path = os.path.join(settings.MEDIA_ROOT, theme.fichier_path.lstrip('/'))
        if not os.path.exists(file_path):
            return Response({"detail": "Fichier non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=f"theme_{pk}.pdf")
