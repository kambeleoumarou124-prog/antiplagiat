import factory
import uuid
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from apps.sessions_academiques.models import SessionAcademique
from apps.themes.models import ThemeStage
from apps.rapports.models import RapportStage
from apps.analyses.models import Analyse

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@ibam.bf")
    nom = factory.Faker('last_name')
    prenom = factory.Faker('first_name')
    role = "ETUDIANT"

class EtudiantFactory(UserFactory):
    role = "ETUDIANT"

class ChefDeptFactory(UserFactory):
    role = "CHEF_DEPT"

class DirecteurAdjointFactory(UserFactory):
    role = "DIR_ADJOINT"

class SessionThemeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SessionAcademique
    type = "SESSION_THEME"
    statut = "OUVERTE"
    date_ouverture = factory.LazyFunction(lambda: timezone.now())
    date_fermeture = factory.LazyFunction(lambda: timezone.now() + timedelta(days=30))
    promotion = "L3 Informatique 2025"
    createur = factory.SubFactory(DirecteurAdjointFactory)

class SessionRapportFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SessionAcademique
    type = "SESSION_RAPPORT"
    statut = "OUVERTE"
    date_ouverture = factory.LazyFunction(lambda: timezone.now())
    date_fermeture = factory.LazyFunction(lambda: timezone.now() + timedelta(days=30))
    promotion = "L3 Informatique 2025"
    createur = factory.SubFactory(DirecteurAdjointFactory)

class ThemeStageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ThemeStage
    etudiant = factory.SubFactory(EtudiantFactory)
    session  = factory.SubFactory(SessionThemeFactory)
    intitule = factory.Sequence(lambda n: f"Thème de stage numéro {n} : développement logiciel pour la gestion académique")
    statut   = "EN_ATTENTE"

class RapportStageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = RapportStage
    etudiant = factory.SubFactory(EtudiantFactory)
    session  = factory.SubFactory(SessionRapportFactory)
    theme    = factory.SubFactory(ThemeStageFactory)
    titre    = factory.Sequence(lambda n: f"Rapport de stage {n}")
    statut   = "SOUMIS"
    fichier_path = "/tmp/test_rapport.pdf"
    fichier_anonymise_path = factory.LazyFunction(lambda: f"/tmp/{uuid.uuid4()}.pdf")

class AnalyseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Analyse
    lanceur      = factory.SubFactory(ChefDeptFactory)
    type_lanceur = "CHEF_DEPT"
    est_officielle = True
    taux_global  = 12.4
    niveau_alerte = "VERT"
    passages     = factory.LazyFunction(list)
    sources      = factory.LazyFunction(list)
