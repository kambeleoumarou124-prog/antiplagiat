import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, CheckCircle, UploadCloud, FileText } from "lucide-react";
import { toast } from "sonner";
import "@/styles/student-theme.css";

export default function AutoAnalysePage() {
  const navigate = useNavigate();
  const [docType, setDocType] = useState<"theme" | "rapport">("theme");
  const [docTitle, setDocTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyseResult, setAnalyseResult] = useState<any>(null);

  const handleAnalyse = () => {
    if (!selectedFile) {
      toast.error("Veuillez d'abord sélectionner un fichier");
      return;
    }
    if (!docTitle || docTitle.length < 5) {
      toast.error("Veuillez d'abord saisir un titre valide (au moins 5 caractères)");
      return;
    }

    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalyseResult({
        taux_similarite_global: 42,
        original: 58,
        modere: 25,
        fort: 17
      });
      setIsAnalyzing(false);
      toast.warning("Analyse terminée - Taux: 42%");
    }, 2500);
  };

  return (
    <div className="student-page">
      <div className="student-page-header">
        <div className="student-page-title">Auto-analyse</div>
        <div className="student-page-sub">Testez votre document avant soumission officielle</div>
      </div>

      <div className="student-two-col">
        <div className="student-col-card">
          <div className="student-section-title" style={{ marginBottom: '16px' }}>Télécharger un document</div>
          
          <div className="student-form-group">
            <label className="student-form-label">Type de document</label>
            <select 
              className="student-form-select" 
              value={docType}
              onChange={(e) => setDocType(e.target.value as "theme" | "rapport")}
            >
              <option value="theme">Thème de stage</option>
              <option value="rapport">Rapport de stage</option>
            </select>
          </div>

          <div className="student-form-group">
            <label className="student-form-label">Titre/Intitulé *</label>
            <input 
              type="text" 
              className="student-form-input" 
              placeholder="Entrez le titre ou intitulé"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
            />
          </div>

          <div className="student-form-group">
            <label className="student-form-label">Fichier *</label>
            <div className="student-file-upload">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
                id="aa-file"
              />
              <label htmlFor="aa-file" style={{ cursor: 'pointer' }}>
                {selectedFile ? (
                  <>
                    <div className="student-file-upload-icon">
                      <FileText className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="student-file-upload-text">{selectedFile.name}</div>
                    <div className="student-file-upload-hint">{(selectedFile.size / 1024 / 1024).toFixed(2)} Mo</div>
                  </>
                ) : (
                  <>
                    <div className="student-file-upload-icon">
                      <UploadCloud className="w-6 h-6" style={{ color: 'var(--muted)' }} />
                    </div>
                    <div className="student-file-upload-text">Glissez votre fichier ici ou cliquez pour parcourir</div>
                    <div className="student-file-upload-hint">PDF ou DOCX · Max 50 Mo</div>
                  </>
                )}
              </label>
            </div>
          </div>

          <button 
            className="student-btn student-btn-primary"
            onClick={handleAnalyse}
            disabled={isAnalyzing}
            style={{ width: '100%' }}
          >
            {isAnalyzing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Analyse en cours...
              </span>
            ) : (
              <>
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Lancer l'analyse
              </>
            )}
          </button>
        </div>

        <div className="student-col-card">
          <div className="student-section-title" style={{ marginBottom: '16px' }}>Résultat d'analyse</div>
          {isAnalyzing && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', background: 'var(--bg)', borderRadius: '8px' }}>
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>Analyse en cours...</div>
            </div>
          )}
          {analyseResult && (
            <>
              <div className="student-progress-ring-container">
                <div className="student-progress-ring">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle className="student-progress-ring-bg" cx="60" cy="60" r="50"/>
                    <circle 
                      className={`student-progress-ring-fill ${analyseResult.taux_similarite_global > 30 ? 'pr-orange' : 'pr-vert'}`} 
                      cx="60" cy="60" r="50" 
                      strokeDasharray="314" 
                      strokeDashoffset={314 - (314 * analyseResult.taux_similarite_global / 100)}
                    />
                  </svg>
                  <div className="student-progress-ring-text">
                    <div className="student-pr-value">{analyseResult.taux_similarite_global}%</div>
                    <div className="student-pr-label">Similarité</div>
                  </div>
                </div>
                <div className="student-progress-legend">
                  <div className="student-legend-item">
                    <div className="student-legend-dot" style={{ background: 'var(--vert)' }}></div>
                    <span className="student-legend-text">Original</span>
                    <span className="student-legend-value">{analyseResult.original}%</span>
                  </div>
                  <div className="student-legend-item">
                    <div className="student-legend-dot" style={{ background: 'var(--orange)' }}></div>
                    <span className="student-legend-text">Modéré</span>
                    <span className="student-legend-value">{analyseResult.modere}%</span>
                  </div>
                  <div className="student-legend-item">
                    <div className="student-legend-dot" style={{ background: 'var(--rouge)' }}></div>
                    <span className="student-legend-text">Fort</span>
                    <span className="student-legend-value">{analyseResult.fort}%</span>
                  </div>
                </div>
              </div>
              <div className={`student-alert ${analyseResult.taux_similarite_global > 30 ? 'student-alert-warning' : 'student-alert-success'}`} style={{ marginTop: '16px' }}>
                {analyseResult.taux_similarite_global > 30 ? (
                  <AlertTriangle className="w-4.5 h-4.5" />
                ) : (
                  <CheckCircle className="w-4.5 h-4.5" />
                )}
                <div className="student-alert-text">
                  <strong>Taux de similarité élevé ({analyseResult.taux_similarite_global}%)</strong> — Nous vous recommandons de revoir les passages similaires avant de soumettre votre document.
                </div>
              </div>
              <button 
                className="student-btn student-btn-secondary" 
                style={{ width: '100%', marginTop: '12px' }}
              >
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6l3 3 5-5"/></svg>
                Voir les passages similaires
              </button>
            </>
          )}
          {!analyseResult && !isAnalyzing && (
            <div className="student-empty-state">
              <div className="student-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div className="student-empty-title">Prêt pour l'analyse</div>
              <div className="student-empty-text">Téléchargez un document et lancez l'analyse pour voir les résultats ici</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
