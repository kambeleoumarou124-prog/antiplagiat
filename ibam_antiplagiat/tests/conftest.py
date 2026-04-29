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

@pytest.fixture
def mock_pipeline(mocker):
    """Mock le pipeline NLP complet pour les tests d'intégration API."""
    def side_effect(filepath, lanceur, rapport_id=None, theme_id=None, est_officielle=True):
        if not est_officielle:
            return {"taux": 12.4, "niveau": "VERT", "passages": [], "sources": []}
        from apps.analyses.models import Analyse
        return Analyse.objects.create(
            rapport_id=rapport_id, theme_id=theme_id, lanceur=lanceur,
            type_lanceur=lanceur.role, est_officielle=True, taux_global=12.4,
            niveau_alerte="VERT", passages=[], sources=[],
            rapport_pdf_path="/tmp/test_analyse_rapport.pdf"
        )
    return mocker.patch("nlp.pipeline.run_pipeline", side_effect=side_effect)

@pytest.fixture
def mock_pipeline_critique(mocker):
    """Mock pipeline retournant un taux critique."""
    def side_effect(filepath, lanceur, rapport_id=None, theme_id=None, est_officielle=True):
        if not est_officielle:
            return {"taux": 58.0, "niveau": "CRITIQUE", "passages": [], "sources": []}
        from apps.analyses.models import Analyse
        from apps.administration.models import Alerte
        analyse = Analyse.objects.create(
            rapport_id=rapport_id, theme_id=theme_id, lanceur=lanceur,
            type_lanceur=lanceur.role, est_officielle=True, taux_global=58.0,
            niveau_alerte="CRITIQUE", passages=[], sources=[],
            rapport_pdf_path="/tmp/test_critique.pdf"
        )
        Alerte.objects.create(
            rapport_id=rapport_id, theme_id=theme_id,
            niveau="CRITIQUE", taux_detecte=58.0
        )
        return analyse
    return mocker.patch("nlp.pipeline.run_pipeline", side_effect=side_effect)

@pytest.fixture
def pdf_test_file(tmp_path):
    """Crée un vrai fichier PDF minimal pour les tests d'upload."""
    from reportlab.pdfgen import canvas
    pdf_path = tmp_path / "test_theme.pdf"
    c = canvas.Canvas(str(pdf_path))
    c.drawString(100, 750, "Développement d'un logiciel de gestion académique pour l'IBAM Burkina Faso.")
    c.save()
    return pdf_path

@pytest.fixture
def docx_test_file(tmp_path):
    """Crée un vrai fichier DOCX minimal pour les tests d'upload."""
    from docx import Document
    docx_path = tmp_path / "test_rapport.docx"
    doc = Document()
    doc.add_paragraph("Ce rapport présente le développement d'un système de gestion des thèmes et rapports de stage à l'IBAM.")
    doc.save(str(docx_path))
    return docx_path
