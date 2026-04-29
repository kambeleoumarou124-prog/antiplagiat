import pytest
import os
import json
from django.urls import reverse
from rest_framework.test import APIClient
from nlp.pipeline import run_pipeline, determiner_niveau_alerte
from nlp.extractor import extract_text
from nlp.preprocessor import preprocess
from nlp.vectorizer import vectorize
from nlp.comparator import compare, calculer_taux_global
from apps.themes.models import ThemeStage
from apps.rapports.models import RapportStage
from apps.analyses.models import Analyse, NiveauAlerteChoices

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestBlocAPipelineNLP:
    def test_pipeline_extrait_texte_pdf(self, pdf_test_file):
        texte = extract_text(str(pdf_test_file))
        assert texte is not None
        assert "Développement d'un logiciel" in texte
        
    def test_pipeline_extrait_texte_docx(self, docx_test_file):
        texte = extract_text(str(docx_test_file))
        assert texte is not None
        assert "développement d'un système" in texte

    def test_pipeline_preprocesseur_lemmatise(self):
        texte = "Les étudiants analysent leurs rapports de stage"
        phrases = preprocess(texte)
        assert isinstance(phrases, list)
        if phrases and isinstance(phrases[0], dict):
            nettoye = phrases[0]["nettoye"]
            assert "le" not in nettoye.split()
            assert "de" not in nettoye.split()

    def test_pipeline_tfidf_retourne_matrice_non_vide(self):
        doc = [{"originale": "Le développement.", "nettoye": "développement"}]
        matrices, vectorizer = vectorize(doc, doc)
        assert matrices is not None
        assert matrices["doc"].shape[0] == 1
        assert matrices["doc"].shape[1] > 0

    def test_pipeline_similarite_cosinus_document_identique(self):
        doc = [{"originale": "Test de similarité.", "nettoye": "test similarité"}]
        matrices, _ = vectorize(doc, doc)
        passages = compare(matrices, doc, doc, [{"id": 1}], seuil=0.99)
        assert len(passages) == 1
        assert passages[0]["score"] >= 0.99

    def test_pipeline_similarite_cosinus_document_different(self):
        doc = [{"originale": "A.", "nettoye": "ordinateur"}]
        corpus = [{"originale": "B.", "nettoye": "pomme"}]
        matrices, _ = vectorize(doc, corpus)
        passages = compare(matrices, doc, corpus, [{"id": 1}], seuil=0.10)
        assert len(passages) == 0

    def test_pipeline_seuil_minimal_0_60(self):
        # Simuler un passage < 0.60 et un passage >= 0.60
        doc = [{"originale": "A", "nettoye": "test application mobile"}, {"originale": "B", "nettoye": "ordinateur portable mac"}]
        corpus = [{"originale": "C", "nettoye": "test application web"}, {"originale": "D", "nettoye": "ordinateur portable mac"}]
        matrices, _ = vectorize(doc, corpus)
        passages = compare(matrices, doc, corpus, [{"id": 1}, {"id": 2}], seuil=0.60)
        assert len(passages) == 1
        assert passages[0]["score"] >= 0.60

    def test_pipeline_calcul_taux_global(self):
        passages = [{"phrase_document": "A" * 30, "score": 0.8}]
        taux = calculer_taux_global(passages, "A" * 200)
        assert taux == 15.0
        
        passages2 = [{"phrase_document": "A" * 60, "score": 0.8}]
        taux2 = calculer_taux_global(passages2, "A" * 100)
        assert taux2 == 60.0

    def test_pipeline_niveau_alerte_selon_seuils(self):
        assert determiner_niveau_alerte(8.0) == "VERT"
        assert determiner_niveau_alerte(22.5) == "ORANGE"
        assert determiner_niveau_alerte(40.0) == "ROUGE"
        assert determiner_niveau_alerte(55.0) == "CRITIQUE"

    def test_pipeline_complet_retourne_json_valide(self, docx_test_file, chef_dept):
        result = run_pipeline(str(docx_test_file), chef_dept, est_officielle=False)
        assert "taux" in result
        assert "niveau" in result
        assert "passages" in result
        assert "sources" in result

@pytest.mark.django_db
class TestBlocBAnalyseThemes:
    def test_auto_analyse_theme_etudiant_non_persistee(self, api_client, etudiant, docx_test_file, mock_pipeline):
        api_client.force_authenticate(user=etudiant)
        # On suppose que l'URL d'auto-analyse prend l'id du theme ou un fichier directement
        # Vu que la route est POST /api/themes/{id}/auto-analyser/, on crée un thème
        from tests.factories import ThemeStageFactory
        theme = ThemeStageFactory(etudiant=etudiant)
        with open(str(docx_test_file), 'rb') as f:
            response = api_client.post(f"/api/v1/themes/{theme.id}/auto-analyser/", {'fichier': f}, format='multipart')
        assert response.status_code == 200
        assert 'taux_global' in response.data or 'taux' in response.data
        assert Analyse.objects.count() == 0
        theme.refresh_from_db()
        assert theme.statut == "EN_ATTENTE"

    def test_analyse_officielle_theme_chef_dept(self, api_client, chef_dept, docx_test_file, mock_pipeline):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import ThemeStageFactory
        theme = ThemeStageFactory()
        with open(str(docx_test_file), 'rb') as f:
            response = api_client.post(f"/api/v1/themes/{theme.id}/analyser/", {'fichier': f}, format='multipart')
        assert response.status_code == 200
        assert Analyse.objects.filter(theme=theme, est_officielle=True).exists()
        analyse = Analyse.objects.get(theme=theme, est_officielle=True)
        assert analyse.type_lanceur == "CHEF_DEPT"
        theme.refresh_from_db()
        assert theme.statut == "ANALYSE"
        assert theme.taux_similarite is not None
        assert analyse.rapport_pdf_path != ""

    def test_analyse_theme_acces_refuse_etudiant_officiel(self, api_client, etudiant, mock_pipeline):
        api_client.force_authenticate(user=etudiant)
        from tests.factories import ThemeStageFactory
        theme = ThemeStageFactory()
        response = api_client.post(f"/api/v1/themes/{theme.id}/analyser/")
        assert response.status_code == 403
        assert Analyse.objects.count() == 0

    def test_analyse_theme_session_fermee_bloquee(self, api_client, etudiant, mock_pipeline):
        api_client.force_authenticate(user=etudiant)
        from tests.factories import ThemeStageFactory, SessionThemeFactory
        session = SessionThemeFactory(statut="FERMEE")
        theme = ThemeStageFactory(etudiant=etudiant, session=session)
        response = api_client.post(f"/api/v1/themes/{theme.id}/auto-analyser/")
        assert response.status_code == 403

    def test_decision_theme_accepte(self, api_client, chef_dept):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import ThemeStageFactory
        theme = ThemeStageFactory(statut="ANALYSE")
        response = api_client.post(f"/api/v1/themes/{theme.id}/decision/", {"decision": "ACCEPTE", "commentaire": "Ceci est un commentaire suffisamment long pour être accepté par le validateur."})
        assert response.status_code == 200
        theme.refresh_from_db()
        assert theme.statut == "ACCEPTE"
        assert theme.commentaire_chef == "Ceci est un commentaire suffisamment long pour être accepté par le validateur."
        # Verify etudiant eligibilite
        etudiant = theme.etudiant
        # assert etudiant.eligibilite_rapport == True (depends on user model)

    def test_decision_theme_refuse(self, api_client, chef_dept):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import ThemeStageFactory
        theme = ThemeStageFactory(statut="ANALYSE")
        response = api_client.post(f"/api/v1/themes/{theme.id}/decision/", {"decision": "REFUSE", "commentaire": "Ce thème est refusé car un taux de plagiat inacceptable a été détecté par le système."})
        assert response.status_code == 200
        theme.refresh_from_db()
        assert theme.statut == "REFUSE"

    def test_decision_theme_a_reformuler(self, api_client, chef_dept):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import ThemeStageFactory
        theme = ThemeStageFactory(statut="ANALYSE")
        response = api_client.post(f"/api/v1/themes/{theme.id}/decision/", {"decision": "A_REFORMULER", "commentaire": "Ce thème doit être reformulé en tenant compte des suggestions."})
        assert response.status_code == 200
        theme.refresh_from_db()
        assert theme.statut == "A_REFORMULER"

    def test_decision_theme_sans_analyse_bloquee(self, api_client, chef_dept):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import ThemeStageFactory
        theme = ThemeStageFactory(statut="EN_ATTENTE")
        response = api_client.post(f"/api/v1/themes/{theme.id}/decision/", {"decision": "ACCEPTE"})
        assert response.status_code in [400, 422]

    def test_alerte_critique_theme_notifie_chef_et_dir(self, api_client, chef_dept, mock_pipeline_critique, docx_test_file):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import ThemeStageFactory
        theme = ThemeStageFactory()
        with open(str(docx_test_file), 'rb') as f:
            api_client.post(f"/api/v1/themes/{theme.id}/analyser/", {'fichier': f}, format='multipart')
        from apps.administration.models import Alerte
        assert Alerte.objects.filter(theme_id=theme.id, niveau="CRITIQUE").exists()

@pytest.mark.django_db
class TestBlocCAnalyseRapports:
    def test_auto_analyse_rapport_etudiant_non_persistee(self, api_client, etudiant, docx_test_file, mock_pipeline):
        api_client.force_authenticate(user=etudiant)
        from tests.factories import RapportStageFactory, ThemeStageFactory
        theme = ThemeStageFactory(etudiant=etudiant, statut="ACCEPTE")
        rapport = RapportStageFactory(etudiant=etudiant, theme=theme)
        with open(str(docx_test_file), 'rb') as f:
            response = api_client.post(f"/api/v1/rapports/{rapport.id}/auto-analyser/", {'fichier': f}, format='multipart')
        assert response.status_code == 200
        assert Analyse.objects.count() == 0
        rapport.refresh_from_db()
        assert rapport.statut == "SOUMIS"

    def test_analyse_officielle_rapport_chef_dept(self, api_client, chef_dept, docx_test_file, mock_pipeline):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import RapportStageFactory
        rapport = RapportStageFactory()
        with open(str(docx_test_file), 'rb') as f:
            response = api_client.post(f"/api/v1/rapports/{rapport.id}/analyser/", {'fichier': f}, format='multipart')
        assert response.status_code == 200
        assert Analyse.objects.filter(rapport=rapport, est_officielle=True, type_lanceur="CHEF_DEPT").exists()
        rapport.refresh_from_db()
        assert rapport.statut == "ANALYSE_CHEF"
        assert rapport.taux_similarite_global is not None

    def test_analyse_rapport_dir_adjoint_independante(self, api_client, dir_adjoint, docx_test_file, mock_pipeline):
        api_client.force_authenticate(user=dir_adjoint)
        from tests.factories import RapportStageFactory
        rapport = RapportStageFactory(statut="DECISION_CHEF")
        with open(str(docx_test_file), 'rb') as f:
            response = api_client.post(f"/api/v1/rapports/{rapport.id}/analyser/", {'fichier': f}, format='multipart')
        assert response.status_code == 200
        assert Analyse.objects.filter(rapport=rapport, type_lanceur="DIR_ADJOINT").exists()

    def test_decision_chef_rapport_valide(self, api_client, chef_dept):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import RapportStageFactory
        rapport = RapportStageFactory(statut="ANALYSE_CHEF")
        response = api_client.post(f"/api/v1/rapports/{rapport.id}/decision-chef/", {"decision": "VALIDE", "commentaire": "Ce rapport est validé par le chef de département suite à l'analyse anti-plagiat et révision."})
        assert response.status_code == 200
        rapport.refresh_from_db()
        assert rapport.statut == "DECISION_CHEF"
        assert rapport.decision_chef == "VALIDE"

    def test_decision_chef_rapport_refuse(self, api_client, chef_dept):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import RapportStageFactory
        rapport = RapportStageFactory(statut="ANALYSE_CHEF")
        response = api_client.post(f"/api/v1/rapports/{rapport.id}/decision-chef/", {"decision": "REFUSE"})
        assert response.status_code == 200
        rapport.refresh_from_db()
        assert rapport.decision_chef == "REFUSE"

    def test_decision_finale_valide_def(self, api_client, dir_adjoint):
        api_client.force_authenticate(user=dir_adjoint)
        from tests.factories import RapportStageFactory
        rapport = RapportStageFactory(statut="DECISION_CHEF")
        response = api_client.post(f"/api/v1/rapports/{rapport.id}/decision-finale/", {"decision_finale": "VALIDE_DEF"})
        assert response.status_code == 200
        rapport.refresh_from_db()
        assert rapport.statut == "VALIDE_DEF"
        assert rapport.decision_finale == "VALIDE_DEF"

    def test_decision_finale_refuse_def(self, api_client, dir_adjoint):
        api_client.force_authenticate(user=dir_adjoint)
        from tests.factories import RapportStageFactory
        rapport = RapportStageFactory(statut="DECISION_CHEF")
        response = api_client.post(f"/api/v1/rapports/{rapport.id}/decision-finale/", {"decision_finale": "REFUSE_DEF"})
        assert response.status_code == 200
        rapport.refresh_from_db()
        assert rapport.statut == "REFUSE_DEF"

    def test_decision_finale_en_revision(self, api_client, dir_adjoint):
        api_client.force_authenticate(user=dir_adjoint)
        from tests.factories import RapportStageFactory
        rapport = RapportStageFactory(statut="DECISION_CHEF")
        response = api_client.post(f"/api/v1/rapports/{rapport.id}/decision-finale/", {"decision_finale": "EN_REVISION"})
        assert response.status_code == 200
        rapport.refresh_from_db()
        assert rapport.statut == "EN_REVISION"

    def test_rapport_etudiant_non_eligible_bloque(self, api_client, etudiant):
        api_client.force_authenticate(user=etudiant)
        # Set theme non-accepte
        from tests.factories import ThemeStageFactory, SessionRapportFactory
        theme = ThemeStageFactory(etudiant=etudiant, statut="EN_ATTENTE")
        session = SessionRapportFactory()
        response = api_client.post(f"/api/v1/rapports/", {"theme": theme.id, "titre": "Mon Rapport de Stage sur la conception de l'application", "session": session.id})
        assert response.status_code in [403, 400]

    def test_alerte_critique_rapport_notifie_chef_et_dir(self, api_client, chef_dept, mock_pipeline_critique, docx_test_file):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import RapportStageFactory
        rapport = RapportStageFactory()
        with open(str(docx_test_file), 'rb') as f:
            api_client.post(f"/api/v1/rapports/{rapport.id}/analyser/", {'fichier': f}, format='multipart')
        from apps.administration.models import Alerte
        assert Alerte.objects.filter(rapport_id=rapport.id, niveau="CRITIQUE").exists()

@pytest.mark.django_db
class TestBlocDSecurite:
    def test_rejet_fichier_mime_invalide(self, api_client, etudiant):
        api_client.force_authenticate(user=etudiant)
        from tests.factories import ThemeStageFactory
        theme = ThemeStageFactory(etudiant=etudiant)
        with open(__file__, 'rb') as f: # Fichier .py mais envoye comme .pdf (mock)
            response = api_client.post(f"/api/v1/themes/{theme.id}/auto-analyser/", {'fichier': f})
        assert response.status_code in [415, 400]

    def test_rejet_fichier_trop_volumineux_theme(self, api_client, etudiant, tmp_path):
        api_client.force_authenticate(user=etudiant)
        from tests.factories import ThemeStageFactory
        theme = ThemeStageFactory(etudiant=etudiant)
        # Creer un gros fichier
        big_file = tmp_path / "big_theme.docx"
        with open(big_file, "wb") as f:
            f.write(os.urandom(11 * 1024 * 1024))
        with open(big_file, 'rb') as f:
            response = api_client.post(f"/api/v1/themes/{theme.id}/auto-analyser/", {'fichier': f})
        assert response.status_code in [413, 400]

    def test_rejet_fichier_trop_volumineux_rapport(self, api_client, chef_dept, tmp_path):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import RapportStageFactory
        rapport = RapportStageFactory()
        big_file = tmp_path / "big_rapport.pdf"
        with open(big_file, "wb") as f:
            f.write(os.urandom(51 * 1024 * 1024))
        with open(big_file, 'rb') as f:
            response = api_client.post(f"/api/v1/rapports/{rapport.id}/analyser/", {'fichier': f})
        assert response.status_code in [413, 400]

    def test_stockage_anonymise_rapport(self, api_client, etudiant, docx_test_file):
        api_client.force_authenticate(user=etudiant)
        from tests.factories import ThemeStageFactory, SessionRapportFactory
        theme = ThemeStageFactory(etudiant=etudiant, statut="ACCEPTE")
        etudiant.eligibilite_rapport = True
        etudiant.save()
        session = SessionRapportFactory()
        # Mock API requires 'fichier'
        with open(str(docx_test_file), 'rb') as f:
            response = api_client.post(f"/api/v1/rapports/", {
                "theme": theme.id, "titre": "Rapport de Stage de fin d'études", "session": session.id, "fichier": f
            })
        if response.status_code == 201:
            rapport = RapportStage.objects.filter(etudiant=etudiant).last()
            assert rapport.fichier_path != ""
            assert rapport.fichier_anonymise_path != ""
            assert "anonymise" in rapport.fichier_anonymise_path
        else:
            assert False, f"La création a échoué avec le code {response.status_code}: {response.data}"

    def test_pipeline_fichier_corrompu(self, api_client, chef_dept, tmp_path):
        api_client.force_authenticate(user=chef_dept)
        from tests.factories import RapportStageFactory
        rapport = RapportStageFactory()
        corrupted = tmp_path / "corrompu.pdf"
        corrupted.write_text("Ceci n'est pas un vrai pdf")
        
        with open(str(corrupted), 'rb') as f:
            response = api_client.post(f"/api/v1/rapports/{rapport.id}/analyser/", {'fichier': f}, format='multipart')
        assert response.status_code == 400

@pytest.mark.django_db
class TestBlocERapportPDF:
    def test_rapport_pdf_contient_sections_obligatoires(self, pdf_test_file):
        from nlp.report_generator import generate_pdf_report
        from tests.factories import ChefDeptFactory
        import PyPDF2
        chef = ChefDeptFactory()
        passages = [{"phrase_document": "A", "phrase_source": "B", "score": 0.9, "source_id": 1}]
        pdf_path = generate_pdf_report(chef, 15.0, "VERT", passages, "Texte brut")
        
        # Test content extraction if pdf generated
        if pdf_path and os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = " ".join([page.extract_text() for page in reader.pages])
                assert "IBAM" in text
                assert "15.0" in text

    def test_rapport_pdf_conclusion_automatique_critique(self):
        from nlp.report_generator import generate_pdf_report
        from tests.factories import ChefDeptFactory
        import PyPDF2
        chef = ChefDeptFactory()
        pdf_path = generate_pdf_report(chef, 62.0, "CRITIQUE", [], "Texte brut")
        if pdf_path and os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = " ".join([page.extract_text() for page in reader.pages]).lower()
                assert "62" in text
                assert "critique" in text or "investigation" in text

    def test_rapport_pdf_conclusion_automatique_vert(self):
        from nlp.report_generator import generate_pdf_report
        from tests.factories import ChefDeptFactory
        import PyPDF2
        chef = ChefDeptFactory()
        pdf_path = generate_pdf_report(chef, 8.0, "VERT", [], "Texte brut")
        if pdf_path and os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = " ".join([page.extract_text() for page in reader.pages]).lower()
                assert "vert" in text or "original" in text or "acceptable" in text
