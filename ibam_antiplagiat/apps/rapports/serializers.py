from rest_framework import serializers
from .models import RapportStage

class RapportStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RapportStage
        fields = '__all__'
