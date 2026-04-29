import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { rapportsApi } from "@/api/rapports.api";
import { FileText, Calendar, Clock, Download, AlertTriangle, CheckCircle } from "lucide-react";
import "@/styles/student-theme.css";

export default function DetailRapportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: rapport, isLoading } = useQuery({
    queryKey: ["rapport_detail", id],
    queryFn: async () => {
      const res = await rapportsApi.lister();
      const data = (res.data as any);
      const items = Array.isArray(data) ? data : (data?.results || []);
      return items.find((r: any) => r.id === parseInt(id || "0"));
    },
    enabled: !!id,
  });

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "VALIDE_DEF": return <span className="student-badge b-valid"><span className="student-badge-dot"></span>Validé (Définitif)</span>;
      case "REFUSE_DEF": return <span className="student-badge b-refuse"><span className="student-badge-dot"></span>Refusé (Définitif)</span>;
      case "EN_REVISION": return <span className="student-badge b-analyse"><span className="student-badge-dot"></span>En révision</span>;
      case "DECISION_CHEF": return <span className="student-badge b-soumis"><span className="student-badge-dot"></span>Analyse Chef Terminée</span>;
      case "ANALYSE_CHEF": return <span className="student-badge b-analyse"><span className="student-badge-dot"></span>Analyse Chef</span>;
      case "ERREUR_EXTRACTION": return <span className="student-badge b-refuse"><span className="student-badge-dot"></span>Erreur</span>;
      default: return <span className="student-badge b-soumis"><span className="student-badge-dot"></span>Soumis</span>;
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

  if (!rapport) {
    return (
      <div className="student-page">
        <div className="student-empty-state">
          <div className="student-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div className="student-empty-title">Rapport non trouvé</div>
          <div className="student-empty-text">Le rapport demandé n'existe pas ou a été supprimé.</div>
        </div>
      </div>
    );
  }

  const taux = (rapport as any).taux_similarite || 0;

  return (
    <div className="student-page">
      <button 
        className="student-btn student-btn-secondary student-btn-sm" 
        onClick={() => navigate("/etudiant/rapports")}
        style={{ marginBottom: '16px' }}
      >
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l-4 4 4 4"/></svg>
        Retour à mes rapports
      </button>

      <div className="student-detail-header">
        <div className="student-detail-title">{rapport.titre}</div>
        <div className="student-detail-meta">
          <div className="student-detail-meta-item">
            <Calendar className="w-3.5 h-3.5" />
            Déposé le {new Date(rapport.date_soumission).toLocaleDateString('fr-FR')}
          </div>
          <div className="student-detail-meta-item">
            <Clock className="w-3.5 h-3.5" />
            Session S3 2024-2025
          </div>
          <div className="student-detail-meta-item">
            {getStatutBadge(rapport.statut)}
          </div>
        </div>
      </div>

      <div className="student-tabs">
        <button className="student-tab active">Document</button>
        <button className="student-tab">Analyse</button>
        <button className="student-tab">Historique</button>
      </div>

      <div className="student-two-col">
        <div className="student-col-card">
          <div className="student-section-header">
            <div className="student-section-title">Document du rapport</div>
            <button className="student-btn student-btn-secondary student-btn-sm">
              <Download className="w-3 h-3" />
              Télécharger
            </button>
          </div>
          <div style={{ background: 'var(--bg)', padding: '48px', textAlign: 'center', borderRadius: '8px' }}>
            <div className="student-empty-icon" style={{ margin: '0 auto 12px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div className="student-empty-title">Document disponible</div>
            <div className="student-empty-text">Cliquez sur Télécharger pour récupérer votre rapport</div>
          </div>
        </div>

        <div className="student-col-card">
          <div className="student-section-title" style={{ marginBottom: '16px' }}>Résultat d'analyse</div>
          <div className="student-progress-ring-container">
            <div className="student-progress-ring">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle className="student-progress-ring-bg" cx="60" cy="60" r="50"/>
                <circle 
                  className={`student-progress-ring-fill ${taux > 30 ? 'pr-rouge' : taux > 15 ? 'pr-orange' : 'pr-vert'}`} 
                  cx="60" cy="60" r="50" 
                  strokeDasharray="314" 
                  strokeDashoffset={314 - (314 * taux / 100)}
                />
              </svg>
              <div className="student-progress-ring-text">
                <div className="student-pr-value">{taux}%</div>
                <div className="student-pr-label">Similarité</div>
              </div>
            </div>
            <div className="student-progress-legend">
              <div className="student-legend-item">
                <div className="student-legend-dot" style={{ background: 'var(--vert)' }}></div>
                <span className="student-legend-text">Original</span>
                <span className="student-legend-value">{100 - taux}%</span>
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
          <div className={`student-alert ${taux > 30 ? 'student-alert-warning' : 'student-alert-success'}`} style={{ marginTop: '16px' }}>
            {taux > 30 ? (
              <AlertTriangle className="w-4.5 h-4.5" />
            ) : (
              <CheckCircle className="w-4.5 h-4.5" />
            )}
            <div className="student-alert-text">
              <strong>{taux > 30 ? 'Taux de similarité élevé' : 'Taux acceptable'}</strong> — {taux > 30
                ? "Le taux de similarité est élevé. Consultez les passages similaires pour plus de détails."
                : "Le taux de similarité est acceptable. Votre rapport est original."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
