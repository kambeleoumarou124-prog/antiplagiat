import spacy

try:
    nlp = spacy.load("fr_core_news_md")
except:
    nlp = None

def preprocess(texte: str) -> list:
    """Nettoyage + spaCy + lemmatisation."""
    if not nlp:
        # Fallback très basique
        return [p.strip() for p in texte.split('.') if p.strip()]
        
    doc = nlp(texte)
    phrases = []
    for sent in doc.sents:
        # Exemple simple: on garde la phrase d'origine (ou on lemmatise pour la vectorisation plus tard)
        texte_propre = " ".join([token.lemma_.lower() for token in sent if not token.is_stop and not token.is_punct])
        if len(texte_propre) > 10:  # Ignorer les phrases trop courtes
            phrases.append({"originale": sent.text, "nettoye": texte_propre})
    return phrases
