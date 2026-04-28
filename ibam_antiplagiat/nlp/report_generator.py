from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
import uuid

def generate_pdf_report(lanceur, taux, niveau, passages, texte_brut) -> str:
    """Génération rapport PDF avec ReportLab."""
    # Créer un chemin temporaire
    filename = f"rapport_analyse_{uuid.uuid4().hex[:8]}.pdf"
    filepath = os.path.join("/tmp", filename) # A adapter avec MEDIA_ROOT plus tard
    
    c = canvas.Canvas(filepath, pagesize=letter)
    c.drawString(100, 750, f"Rapport d'Analyse Anti-Plagiat IBAM")
    c.drawString(100, 730, f"Lanceur: {lanceur.email if lanceur else 'Inconnu'}")
    c.drawString(100, 710, f"Taux Global: {taux:.1f}%")
    c.drawString(100, 690, f"Niveau d'alerte: {niveau}")
    
    y = 650
    c.drawString(100, y, "Passages détectés (échantillon):")
    y -= 20
    
    for i, p in enumerate(passages[:5]): # Max 5 pour l'exemple
        if y < 100:
            c.showPage()
            y = 750
        c.drawString(100, y, f"- Score: {p['score']:.2f}")
        y -= 15
        text = p['phrase_document'][:80] + "..." if len(p['phrase_document']) > 80 else p['phrase_document']
        c.drawString(120, y, text)
        y -= 25
        
    c.save()
    return filepath
