import time
from .extractor import extract_text
from .preprocessor import preprocess
from .vectorizer import vectorize
from .comparator import compare, calculer_taux_global
from .report_generator import generate_pdf_report
from apps.analyses.models import Analyse, NiveauAlerteChoices
from apps.administration.models import Alerte

def determiner_niveau_alerte(taux: float) -> str:
    if taux <= 15:
        return NiveauAlerteChoices.VERT
    elif taux <= 30:
        return NiveauAlerteChoices.ORANGE
    elif taux <= 50:
        return NiveauAlerteChoices.ROUGE
    return NiveauAlerteChoices.CRITIQUE

def _charger_corpus_reference():
    # Placeholder: En réalité, charger depuis la base de données ou un stockage externe
    return {
        "phrases": ["Ceci est une phrase de test.", "Une autre phrase pour le corpus."],
        "sources": [{"id": 1, "titre": "Source 1"}, {"id": 2, "titre": "Source 2"}]
    }

def _extraire_sources(passages):
    # Placeholder: Extraire la liste unique des sources trouvées dans les passages
    return []

def _creer_alerte_critique(analyse, taux, rapport_id, theme_id):
    Alerte.objects.create(
        rapport_id=rapport_id,
        theme_id=theme_id,
        niveau=NiveauAlerteChoices.CRITIQUE,
        taux_detecte=taux
    )

def run_pipeline(filepath: str, lanceur, rapport_id: int = None,
                 theme_id: int = None, est_officielle: bool = True):
    """
    Orchestrateur 6 étapes.
    """
    start = time.time()
    texte_brut       = extract_text(filepath)
    phrases          = preprocess(texte_brut)
    corpus           = _charger_corpus_reference()
    matrice, vect    = vectorize(phrases, corpus["phrases"])
    passages         = compare(matrice, phrases, corpus["phrases"],
                               corpus["sources"])
    taux             = calculer_taux_global(passages, texte_brut)
    niveau           = determiner_niveau_alerte(taux)
    pdf_path         = generate_pdf_report(lanceur, taux, niveau, passages,
                                           texte_brut)
    duree_ms         = int((time.time() - start) * 1000)

    if not est_officielle:
        return {"taux": taux, "niveau": niveau, "passages": passages,
                "sources": _extraire_sources(passages)}

    analyse = Analyse.objects.create(
        rapport_id=rapport_id,
        theme_id=theme_id,
        lanceur=lanceur,
        type_lanceur=lanceur.role,
        est_officielle=True,
        taux_global=round(taux, 1),
        niveau_alerte=niveau,
        passages=passages,
        sources=_extraire_sources(passages),
        rapport_pdf_path=pdf_path,
        duree_ms=duree_ms
    )

    if taux > 50:
        _creer_alerte_critique(analyse, taux, rapport_id, theme_id)

    return analyse
