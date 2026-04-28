import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def etudiant(db):
    return User.objects.create_user(
        email="etudiant@ibam.bf", password="Test1234!",
        nom="Sawadogo", prenom="Issa", role="ETUDIANT")

@pytest.fixture
def chef_dept(db):
    return User.objects.create_user(
        email="chef@ibam.bf", password="Test1234!",
        nom="Ouedraogo", prenom="Mariam", role="CHEF_DEPT")

@pytest.fixture
def dir_adjoint(db):
    return User.objects.create_user(
        email="dir@ibam.bf", password="Test1234!",
        nom="Zongo", prenom="Pascal", role="DIR_ADJOINT")

@pytest.fixture
def session_theme_ouverte(db, dir_adjoint):
    from apps.sessions_academiques.models import SessionAcademique
    from django.utils import timezone
    from datetime import timedelta
    return SessionAcademique.objects.create(
        type="SESSION_THEME",
        statut="OUVERTE",
        date_ouverture=timezone.now(),
        date_fermeture=timezone.now() + timedelta(days=14),
        promotion="L3-2025",
        createur=dir_adjoint
    )
