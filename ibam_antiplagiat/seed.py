import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.authentication.models import User

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
