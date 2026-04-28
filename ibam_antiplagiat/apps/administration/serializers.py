from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ConfigurationSeuils, AuditLog, Alerte

User = get_user_model()

class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ConfigurationSeuilsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfigurationSeuils
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'

class AlerteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerte
        fields = '__all__'
