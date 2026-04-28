import PyPDF2
import docx

def validate_and_store(file_obj, path):
    # Logique pour sauvegarder le fichier de façon sécurisée
    pass

def extract_text(filepath: str) -> str:
    """Extrait le texte d'un fichier PDF ou DOCX."""
    texte = ""
    try:
        if filepath.endswith('.pdf'):
            with open(filepath, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    if page.extract_text():
                        texte += page.extract_text() + "\n"
        elif filepath.endswith('.docx'):
            doc = docx.Document(filepath)
            for para in doc.paragraphs:
                texte += para.text + "\n"
        else:
            # Format non supporté
            pass
    except Exception as e:
        # Gérer l'erreur d'extraction
        print(f"Erreur d'extraction: {e}")
        
    return texte
