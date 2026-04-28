from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'nom', 'prenom', 'role', 'actif', 'eligibilite_rapport', 'date_creation']
        read_only_fields = ['id', 'email', 'role', 'actif', 'eligibilite_rapport', 'date_creation']
