from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def compare(matrices, phrases_document, phrases_corpus, sources, seuil=0.60):
    """Comparaison cosinus + détection des passages similaires."""
    passages = []
    
    if matrices is None or matrices["doc"] is None or matrices["corpus"] is None:
        return passages
        
    matrice_doc = matrices["doc"]
    matrice_corpus = matrices["corpus"]
    
    # Calcul des similarités
    similarites = cosine_similarity(matrice_doc, matrice_corpus)
    
    # Pour chaque phrase du document
    for i, phrase_doc in enumerate(phrases_document):
        # Trouver la phrase du corpus la plus similaire
        j_max = np.argmax(similarites[i])
        score_max = similarites[i][j_max]
        
        if score_max >= seuil:
            passages.append({
                "phrase_document": phrase_doc["originale"] if isinstance(phrase_doc, dict) else phrase_doc,
                "phrase_source": phrases_corpus[j_max]["originale"] if isinstance(phrases_corpus[j_max], dict) else phrases_corpus[j_max],
                "score": float(score_max),
                "source_id": sources[j_max]["id"] if j_max < len(sources) else None
            })
            
    return passages

def calculer_taux_global(passages, texte_brut):
    """Calcul du taux global de similarité."""
    if not texte_brut:
        return 0.0
        
    # Approximation basique: longueur des passages copiés / longueur totale
    # Idéalement, il faut fusionner les intervalles pour éviter de compter plusieurs fois
    longueur_copiee = sum(len(p["phrase_document"]) for p in passages)
    taux = (longueur_copiee / len(texte_brut)) * 100
    return min(100.0, max(0.0, taux))
