import { useQuery } from "@tanstack/react-query";
import { rapportsApi } from "@/api/rapports.api";
import { useNavigate } from "react-router-dom";
import type { RapportStage } from "@/types/rapport.types";
import "@/styles/student-theme.css";

export default function MesRapportsPage() {
  const navigate = useNavigate();
  const { data: rapports, isLoading } = useQuery({
    queryKey: ["my_rapports"],
    queryFn: async () => {
      const res = await rapportsApi.lister();
      // DRF retourne { results: [], count: ... } pour les réponses paginées
      const data = (res.data as any);
      return Array.isArray(data) ? data : (data?.results || []);
    },
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


  return (
    <div className="student-page">
      <div className="student-page-header">
        <div className="student-page-title">Mes rapports</div>
        <div className="student-page-sub">Historique de vos soumissions de rapports de stage</div>
      </div>

      <div className="student-section-card">
        <div className="student-section-header">
          <div className="student-section-title">Tous mes rapports</div>
          <button 
            className="student-btn student-btn-primary student-btn-sm"
            onClick={() => navigate("/etudiant/rapports/deposer")}
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3v6M3 6h6"/></svg>
            Nouveau rapport
          </button>
        </div>
        
        {isLoading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" style={{ width: '48px', height: '48px' }}></div>
              <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>Chargement...</div>
            </div>
          </div>
        ) : rapports && rapports.length > 0 ? (
          <>
            <table className="student-data-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Session</th>
                  <th>Déposé le</th>
                  <th>Statut</th>
                  <th>Taux</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rapports.map((rapport: RapportStage) => (
                  <tr key={rapport.id}>
                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {rapport.titre}
                    </td>
                    <td style={{ fontSize: '12px' }}>S3 2024-2025</td>
                    <td style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {new Date(rapport.date_soumission).toLocaleDateString('fr-FR')}
                    </td>
                    <td>{getStatutBadge(rapport.statut)}</td>
                    <td>
                      <div className="student-taux-cell">
                        <div className="student-taux-bar">
                          <div 
                            className={`student-taux-fill ${(rapport as any).taux_similarite > 30 ? 'tc-rouge' : (rapport as any).taux_similarite > 15 ? 'tc-orange' : 'tc-vert'}`}
                            style={{ width: `${Math.min((rapport as any).taux_similarite || 0, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`student-taux-val ${(rapport as any).taux_similarite > 30 ? 'tv-rouge' : (rapport as any).taux_similarite > 15 ? 'tv-orange' : 'tv-vert'}`}>
                          {(rapport as any).taux_similarite || 0}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="student-btn student-btn-outline student-btn-sm"
                        onClick={() => navigate(`/etudiant/rapports/${rapport.id}`)}
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="student-pagination">
              <div className="student-pagination-info">Affichage de 1 à {rapports.length} sur {rapports.length} rapport{rapports.length > 1 ? 's' : ''}</div>
              <div className="student-pagination-buttons">
                <button className="student-page-btn active">1</button>
              </div>
            </div>
          </>
        ) : (
          <div className="student-empty-state">
            <div className="student-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div className="student-empty-title">Aucun rapport soumis</div>
            <div className="student-empty-text">Vous n'avez pas encore déposé de rapport de stage. Vous pourrez soumettre un rapport une fois votre thème validé.</div>
          </div>
        )}
      </div>
    </div>
  );
}
