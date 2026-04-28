from sklearn.feature_extraction.text import TfidfVectorizer

def vectorize(phrases_document, phrases_corpus):
    """Vectorisation TF-IDF sklearn."""
    vectorizer = TfidfVectorizer()
    
    # Textes nettoyés
    textes_doc = [p["nettoye"] if isinstance(p, dict) else p for p in phrases_document]
    textes_corpus = [p["nettoye"] if isinstance(p, dict) else p for p in phrases_corpus]
    
    # On ajuste le vectorizer sur tout le corpus + le document pour avoir un vocabulaire commun
    tous_textes = textes_doc + textes_corpus
    
    if not tous_textes:
        return None, None
        
    vectorizer.fit(tous_textes)
    matrice_doc = vectorizer.transform(textes_doc)
    matrice_corpus = vectorizer.transform(textes_corpus)
    
    return {"doc": matrice_doc, "corpus": matrice_corpus}, vectorizer
