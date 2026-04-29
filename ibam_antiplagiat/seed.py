import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.authentication.models import User
from apps.sessions_academiques.models import SessionAcademique
from django.utils import timezone
from datetime import timedelta

# Créer les utilisateurs
users_data = [
    {"email": "etudiant@ibam.bf", "nom": "Tapsoba", "prenom": "Ali", "role": "ETUDIANT", "password": "password123"},
    {"email": "chef@ibam.bf", "nom": "Ouedraogo", "prenom": "Marie", "role": "CHEF_DEPT", "password": "password123"},
    {"email": "directeur@ibam.bf", "nom": "Kambou", "prenom": "Jean", "role": "DIR_ADJOINT", "password": "password123"},
    {"email": "admin@ibam.bf", "nom": "Admin", "prenom": "System", "role": "ADMIN", "password": "password123"},
]

for data in users_data:
    if not User.objects.filter(email=data['email']).exists():
        user = User.objects.create_user(
            email=data['email'],
            password=data['password'],
            nom=data['nom'],
            prenom=data['prenom'],
            role=data['role']
        )
        print(f"Créé: {user.email} ({user.role})")
    else:
        print(f"Existe déjà: {data['email']}")

# Créer une session académique par défaut
admin_user = User.objects.filter(role='ADMIN').first()
if admin_user and not SessionAcademique.objects.exists():
    session_theme = SessionAcademique.objects.create(
        type='SESSION_THEME',
        statut='OUVERTE',
        date_ouverture=timezone.now(),
        date_fermeture=timezone.now() + timedelta(days=60),
        promotion='2025-2026',
        description='Session de soumission des thèmes de stage',
        createur=admin_user
    )
    print(f"Session créée: ID {session_theme.id} - {session_theme.type} - {session_theme.promotion}")

    session_rapport = SessionAcademique.objects.create(
        type='SESSION_RAPPORT',
        statut='OUVERTE',
        date_ouverture=timezone.now() + timedelta(days=30),
        date_fermeture=timezone.now() + timedelta(days=90),
        promotion='2025-2026',
        description='Session de dépôt des rapports de stage',
        createur=admin_user
    )
    print(f"Session créée: ID {session_rapport.id} - {session_rapport.type} - {session_rapport.promotion}")
else:
    print("Sessions existent déjà ou pas d'admin")
