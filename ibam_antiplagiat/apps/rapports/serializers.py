from rest_framework import serializers
from .models import RapportStage

class SoumissionRapportSerializer(serializers.ModelSerializer):
    fichier = serializers.FileField(required=True)

    class Meta:
        model = RapportStage
        fields = ['session', 'theme', 'titre', 'fichier']

    def validate_titre(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Le titre doit contenir au moins 5 caractères.")
        return value

    def validate_fichier(self, value):
        if value:
            # Validation basique de taille
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("La taille du fichier ne doit pas dépasser 10 Mo.")
        return value

class RapportStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RapportStage
        fields = '__all__'
        read_only_fields = ['etudiant', 'statut', 'date_soumission']
