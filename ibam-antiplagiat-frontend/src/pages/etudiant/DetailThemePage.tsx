import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { themesApi } from "@/api/themes.api";
import { FileText, Calendar, Clock, Edit, Download, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import "@/styles/student-theme.css";

export default function DetailThemePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"document" | "analyse" | "historique">("document");
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(false);
  const [autoAnalyseResult, setAutoAnalyseResult] = useState<any>(null);

  const { data: theme, isLoading } = useQuery({
    queryKey: ["theme_detail", id],
    queryFn: async () => {
      const res = await themesApi.lister();
      const data = (res.data as any);
      const items = Array.isArray(data) ? data : (data?.results || []);
      return items.find((t: any) => t.id === parseInt(id || "0"));
    },
    enabled: !!id,
  });

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "ACCEPTE": return <span className="student-badge b-accepte"><span className="student-badge-dot"></span>Accepté</span>;
      case "REFUSE": return <span className="student-badge b-refuse"><span className="student-badge-dot"></span>Refusé</span>;
      case "A_REFORMULER": return <span className="student-badge b-reform"><span className="student-badge-dot"></span>À reformuler</span>;
      case "EN_ANALYSE": return <span className="student-badge b-analyse"><span className="student-badge-dot"></span>En analyse</span>;
      default: return <span className="student-badge b-attente"><span className="student-badge-dot"></span>En attente</span>;
    }
  };

  const autoAnalyseMutation = useMutation({
    mutationFn: async () => {
      if (!theme?.fichier_path) {
        throw new Error("Aucun fichier joint à ce thème");
      }
      setIsAutoAnalyzing(true);
      try {
        const res = await themesApi.autoAnalyseTheme(parseInt(id || "0"));
        return res.data;
      } finally {
        setIsAutoAnalyzing(false);
      }
    },
    onSuccess: (result) => {
      setAutoAnalyseResult(result);
      setActiveTab("analyse");
      toast.success("Auto-analyse terminée");
    },
    onError: (err: any) => {
      toast.error(err.message || err.response?.data?.detail || "Erreur lors de l'auto-analyse");
      setIsAutoAnalyzing(false);
    },
  });

  const handleDownload = async () => {
    if (!theme?.fichier_path) {
      toast.error("Aucun document à télécharger");
      return;
    }
    try {
      toast.info("Téléchargement du document...");
      const res = await themesApi.telechargerFichier(parseInt(id || "0"));
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `theme_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Document téléchargé avec succès");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Erreur lors du téléchargement");
    }
  };

  const handleModify = () => {
    if (theme?.statut === "EN_ATTENTE" || theme?.statut === "A_REFORMULER") {
      navigate(`/etudiant/themes/nouveau?edit=${id}`);
    } else {
      toast.error("Ce thème ne peut plus être modifié");
    }
  };

  if (isLoading) {
    return (
      <div className="student-page">
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" style={{ width: '48px', height: '48px' }}></div>
            <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>Chargement...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="student-page">
        <div className="student-empty-state">
          <div className="student-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div className="student-empty-title">Thème non trouvé</div>
          <div className="student-empty-text">Le thème demandé n'existe pas ou a été supprimé.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-page">
      <button 
        className="student-btn student-btn-secondary student-btn-sm" 
        onClick={() => navigate("/etudiant/themes")}
        style={{ marginBottom: '16px' }}
      >
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l-4 4 4 4"/></svg>
        Retour à mes thèmes
      </button>

      <div className="student-detail-header">
        <div className="student-detail-title">{theme.intitule}</div>
        <div className="student-detail-meta">
          <div className="student-detail-meta-item">
            <Calendar className="w-3.5 h-3.5" />
            Soumis le {new Date(theme.date_soumission).toLocaleDateString('fr-FR')}
          </div>
          <div className="student-detail-meta-item">
            <Clock className="w-3.5 h-3.5" />
            Version 1
          </div>
          <div className="student-detail-meta-item">
            {getStatutBadge(theme.statut)}
          </div>
        </div>
      </div>

      <div className="student-tabs">
        <button 
          className={`student-tab ${activeTab === "document" ? "active" : ""}`}
          onClick={() => setActiveTab("document")}
        >
          Document
        </button>
        <button 
          className={`student-tab ${activeTab === "analyse" ? "active" : ""}`}
          onClick={() => setActiveTab("analyse")}
        >
          Analyse
        </button>
        <button 
          className={`student-tab ${activeTab === "historique" ? "active" : ""}`}
          onClick={() => setActiveTab("historique")}
        >
          Historique
        </button>
      </div>

      {activeTab === "document" && (
        <div className="student-col-card">
          <div className="student-section-header">
            <div className="student-section-title">Document du thème</div>
            <button 
              className="student-btn student-btn-secondary student-btn-sm"
              onClick={handleDownload}
            >
              <Download className="w-3 h-3" />
              Télécharger
            </button>
          </div>
          {theme?.fichier_path ? (
            <div style={{ background: 'var(--bg)', padding: '48px', textAlign: 'center', borderRadius: '8px' }}>
              <div className="student-empty-icon" style={{ margin: '0 auto 12px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div className="student-empty-title">Document disponible</div>
              <div className="student-empty-text">Cliquez sur Télécharger pour récupérer votre document</div>
            </div>
          ) : (
            <div style={{ background: 'var(--bg)', padding: '48px', textAlign: 'center', borderRadius: '8px' }}>
              <div className="student-empty-icon" style={{ margin: '0 auto 12px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div className="student-empty-title">Aucun document joint</div>
              <div className="student-empty-text">Vous avez soumis uniquement l'intitulé du thème</div>
            </div>
          )}
        </div>
      )}

      {activeTab === "analyse" && (
        <div className="student-col-card">
          <div className="student-section-title" style={{ marginBottom: '16px' }}>Résultat d'analyse</div>
          {isAutoAnalyzing && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', background: 'var(--bg)', borderRadius: '8px' }}>
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>Auto-analyse en cours...</div>
            </div>
          )}
          {autoAnalyseResult && (
            <>
              <div className="student-progress-ring-container">
                <div className="student-progress-ring">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle className="student-progress-ring-bg" cx="60" cy="60" r="50"/>
                    <circle 
                      className={`student-progress-ring-fill ${autoAnalyseResult.taux_similarite_global > 30 ? 'pr-rouge' : 'pr-vert'}`} 
                      cx="60" cy="60" r="50" 
                      strokeDasharray="314" 
                      strokeDashoffset={314 - (314 * (autoAnalyseResult.taux_similarite_global || 0) / 100)}
                    />
                  </svg>
                  <div className="student-progress-ring-text">
                    <div className="student-pr-value">{autoAnalyseResult.taux_similarite_global || 0}%</div>
                    <div className="student-pr-label">Similarité</div>
                  </div>
                </div>
                <div className="student-progress-legend">
                  <div className="student-legend-item">
                    <div className="student-legend-dot" style={{ background: 'var(--vert)' }}></div>
                    <span className="student-legend-text">Original</span>
                    <span className="student-legend-value">{100 - (autoAnalyseResult.taux_similarite_global || 0)}%</span>
                  </div>
                  <div className="student-legend-item">
                    <div className="student-legend-dot" style={{ background: 'var(--orange)' }}></div>
                    <span className="student-legend-text">Modéré</span>
                    <span className="student-legend-value">~20%</span>
                  </div>
                  <div className="student-legend-item">
                    <div className="student-legend-dot" style={{ background: 'var(--rouge)' }}></div>
                    <span className="student-legend-text">Fort</span>
                    <span className="student-legend-value">~10%</span>
                  </div>
                </div>
              </div>
              <div className={`student-alert ${autoAnalyseResult.taux_similarite_global > 30 ? 'student-alert-warning' : 'student-alert-success'}`} style={{ marginTop: '16px' }}>
                {autoAnalyseResult.taux_similarite_global > 30 ? (
                  <AlertTriangle className="w-4.5 h-4.5" />
                ) : (
                  <CheckCircle className="w-4.5 h-4.5" />
                )}
                <div className="student-alert-text">
                  <strong>{autoAnalyseResult.taux_similarite_global > 30 ? 'Taux de similarité élevé' : 'Taux acceptable'}</strong> — {autoAnalyseResult.taux_similarite_global > 30
                    ? "Nous vous recommandons de revoir les passages similaires."
                    : "Votre thème présente un taux de similarité acceptable."}
                </div>
              </div>
            </>
          )}
          {!autoAnalyseResult && !isAutoAnalyzing && (
            <div className="student-empty-state">
              <div className="student-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div className="student-empty-title">Aucune analyse</div>
              <div className="student-empty-text">Cliquez sur "Auto-analyser" pour lancer l'analyse de votre thème</div>
            </div>
          )}
        </div>
      )}

      {activeTab === "historique" && (
        <div className="student-col-card">
          <div className="student-section-title" style={{ marginBottom: '16px' }}>Historique des versions</div>
          <div className="student-empty-state">
            <div className="student-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <div className="student-empty-title">Historique vide</div>
            <div className="student-empty-text">Aucune modification enregistrée pour ce thème</div>
          </div>
        </div>
      )}

      <div className="student-col-card" style={{ marginTop: '16px' }}>
        <div className="student-section-title" style={{ marginBottom: '16px' }}>Actions disponibles</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="student-btn student-btn-outline"
            onClick={() => autoAnalyseMutation.mutate()}
            disabled={isAutoAnalyzing || !theme?.fichier_path}
          >
            {isAutoAnalyzing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Analyse en cours...
              </span>
            ) : (
              <>
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="4"/><path d="M6 4v2l1.5 1.5"/></svg>
                Auto-analyser
              </>
            )}
          </button>
          <button 
            className="student-btn student-btn-secondary"
            onClick={handleModify}
            disabled={theme?.statut !== "EN_ATTENTE" && theme?.statut !== "A_REFORMULER"}
          >
            <Edit className="w-3.5 h-3.5" />
            Modifier le thème
          </button>
        </div>
      </div>
    </div>
  );
}
