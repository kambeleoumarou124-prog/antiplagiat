import { useQuery } from "@tanstack/react-query";
import { themesApi } from "@/api/themes.api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { ThemeStage } from "@/types/theme.types";
import "@/styles/student-theme.css";

export default function MesThemesPage() {
  const navigate = useNavigate();
  const { data: themes, isLoading } = useQuery({
    queryKey: ["my_themes"],
    queryFn: async () => {
      // Pour l'instant on mock en appelant la liste globale car on n'a pas la route /etudiant/me/
      // En vrai ce serait themesApi.getAll() avec un filtre
      const res = await themesApi.lister();
      // DRF retourne { results: [], count: ... } pour les réponses paginées
      const data = (res.data as any);
      return Array.isArray(data) ? data : (data?.results || []);
    },
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


  return (
    <div className="student-page">
      <div className="student-page-header">
        <div className="student-page-title">Mes thèmes</div>
        <div className="student-page-sub">Historique de vos soumissions de thèmes</div>
      </div>

      <div className="student-section-card">
        <div className="student-section-header">
          <div className="student-section-title">Tous mes thèmes</div>
          <button 
            className="student-btn student-btn-primary student-btn-sm"
            onClick={() => navigate("/etudiant/themes/nouveau")}
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3v6M3 6h6"/></svg>
            Nouveau thème
          </button>
        </div>
        
        {isLoading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" style={{ width: '48px', height: '48px' }}></div>
              <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>Chargement...</div>
            </div>
          </div>
        ) : themes && themes.length > 0 ? (
          <>
            <table className="student-data-table">
              <thead>
                <tr>
                  <th>Intitulé</th>
                  <th>Session</th>
                  <th>Soumis le</th>
                  <th>Version</th>
                  <th>Statut</th>
                  <th>Taux</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {themes.map((theme: ThemeStage) => (
                  <tr key={theme.id}>
                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {theme.intitule}
                    </td>
                    <td style={{ fontSize: '12px' }}>S3 2024-2025</td>
                    <td style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {new Date(theme.date_soumission).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ fontSize: '12px' }}>v1</td>
                    <td>{getStatutBadge(theme.statut)}</td>
                    <td><span style={{ fontSize: '11px', color: 'var(--muted)' }}>—</span></td>
                    <td>
                      <button 
                        className="student-btn student-btn-outline student-btn-sm"
                        onClick={() => navigate(`/etudiant/themes/${theme.id}`)}
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="student-pagination">
              <div className="student-pagination-info">Affichage de 1 à {themes.length} sur {themes.length} thème{themes.length > 1 ? 's' : ''}</div>
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
            <div className="student-empty-title">Aucun thème soumis</div>
            <div className="student-empty-text">Vous n'avez pas encore soumis de thème de stage.</div>
          </div>
        )}
      </div>
    </div>
  );
}
