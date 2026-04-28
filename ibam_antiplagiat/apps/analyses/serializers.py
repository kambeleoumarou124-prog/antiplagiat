from rest_framework import serializers
from .models import Analyse

class AnalyseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analyse
        fields = '__all__'
