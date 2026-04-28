from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Analyse
from .serializers import AnalyseSerializer

class AnalyseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Analyse.objects.all()
    serializer_class = AnalyseSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"])
    def pdf(self, request, pk=None):
        return Response({"message": "Lien de téléchargement PDF"})

    @action(detail=False, methods=["get"], url_path="rapport/(?P<rapport_id>[^/.]+)")
    def analyses_rapport(self, request, rapport_id=None):
        analyses = Analyse.objects.filter(rapport_id=rapport_id)
        serializer = self.get_serializer(analyses, many=True)
        return Response(serializer.data)
