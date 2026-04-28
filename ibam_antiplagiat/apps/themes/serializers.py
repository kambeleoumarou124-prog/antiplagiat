from rest_framework import serializers
from .models import ThemeStage

class SoumissionThemeSerializer(serializers.ModelSerializer):
    fichier = serializers.FileField(required=False)

    class Meta:
        model  = ThemeStage
        fields = ["intitule", "fichier", "session"]

    def validate_intitule(self, value):
        if len(value) < 50:
            raise serializers.ValidationError(
                "L'intitulé doit contenir au moins 50 caractères.")
        if len(value) > 300:
            raise serializers.ValidationError(
                "L'intitulé ne peut pas dépasser 300 caractères.")
        return value

    def validate_fichier(self, value):
        if value:
            from security.file_validator import validate_file
            validate_file(value, max_size_mb=10)
        return value

class DecisionThemeSerializer(serializers.Serializer):
    decision    = serializers.ChoiceField(
        choices=["ACCEPTE", "REFUSE", "A_REFORMULER"])
    commentaire = serializers.CharField(min_length=50)

class ThemeDetailSerializer(serializers.ModelSerializer):
    etudiant_nom = serializers.SerializerMethodField()
    niveau_alerte = serializers.SerializerMethodField()

    class Meta:
        model  = ThemeStage
        fields = "__all__"

    def get_etudiant_nom(self, obj):
        return f"{obj.etudiant.prenom} {obj.etudiant.nom}"

    def get_niveau_alerte(self, obj):
        if obj.taux_similarite is None:
            return None
        if obj.taux_similarite <= 15:
            return "VERT"
        elif obj.taux_similarite <= 30:
            return "ORANGE"
        elif obj.taux_similarite <= 50:
            return "ROUGE"
        return "CRITIQUE"
