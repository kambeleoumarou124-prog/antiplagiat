from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'nom', 'prenom', 'role', 'actif', 'eligibilite_rapport', 'date_creation']
        read_only_fields = ['id', 'email', 'role', 'actif', 'eligibilite_rapport', 'date_creation']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from django.contrib.auth import authenticate
        from django.contrib.auth.models import update_last_login
        import logging

        logger = logging.getLogger(__name__)
        logger.info(f"Login attempt with email: {attrs.get('email')}")

        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                                email=email, password=password)
            logger.info(f"Authentication result: {user}")
            if not user:
                logger.warning(f"Authentication failed for email: {email}")
                raise serializers.ValidationError("Email ou mot de passe incorrect")
            if not user.is_active:
                logger.warning(f"User inactive: {email}")
                raise serializers.ValidationError("Compte désactivé")
            attrs['user'] = user
            # Mettre à jour la dernière connexion
            update_last_login(None, user)
        else:
            logger.warning(f"Missing credentials - email: {bool(email)}, password: {bool(password)}")
            raise serializers.ValidationError("Email et mot de passe requis")

        return attrs


class TokenResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()
