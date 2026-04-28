from rest_framework import serializers
from .models import SessionAcademique

class SessionAcademiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionAcademique
        fields = '__all__'
        read_only_fields = ['createur', 'date_creation', 'statut']
