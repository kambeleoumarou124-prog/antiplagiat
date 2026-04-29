import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { notificationsApi } from "@/api/notifications.api";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, AlertTriangle, Bell, X, Calendar, Home, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import "@/styles/student-theme.css";

export default function DashboardEtudiant() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: authApi.getDashboard,
    select: (res) => res.data,
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await notificationsApi.lister();
      const data = (res.data as any);
      return Array.isArray(data) ? data : (data?.results || []);
    },
  });

  const handleMarkAsRead = async (id: number) => {
    await notificationsApi.marquerLue(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const handleMarkAllAsRead = async () => {
    await notificationsApi.marquerToutesLues();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    toast.success("Toutes les notifications marquées comme lues");
  };

  const unreadCount = notifications?.filter((n: any) => !n.lue).length || 0;

  if (isLoading) return <div className="p-12 text-center text-muted-foreground animate-pulse flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p>Chargement de votre espace...</p>
    </div>
  </div>;

  return (
    <div className="student-page">
      <div className="student-page-header">
        <div className="student-page-title">Tableau de bord</div>
        <div className="student-page-sub">Bienvenue sur votre espace étudiant</div>
      </div>

      {/* STATS GRID */}
      <div className="student-stats-grid">
        <div className="student-stat-card s-blue">
          <div className="student-stat-icon si-blue">
            <FileText className="w-4 h-4" />
          </div>
          <div className="student-stat-val">{stats?.theme_statut ? "1" : "0"}</div>
          <div className="student-stat-label">Mon thème</div>
          <div className="student-stat-sub">{stats?.theme_statut || "Non soumis"}</div>
        </div>
        <div className="student-stat-card s-green">
          <div className="student-stat-icon si-green">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="student-stat-val">{stats?.eligibilite_rapport ? "Éligible" : "—"}</div>
          <div className="student-stat-label">Mon rapport</div>
          <div className="student-stat-sub">{stats?.eligibilite_rapport ? "Prêt" : "Non éligible"}</div>
        </div>
        <div className="student-stat-card s-orange">
          <div className="student-stat-icon si-orange">
            <Clock className="w-4 h-4" />
          </div>
          <div className="student-stat-val">18</div>
          <div className="student-stat-label">Jours restants</div>
          <div className="student-stat-sub">Session en cours</div>
        </div>
        <div className="student-stat-card s-accent">
          <div className="student-stat-icon si-accent">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div className="student-stat-val">{unreadCount}</div>
          <div className="student-stat-label">Alertes</div>
          <div className="student-stat-sub">{unreadCount > 0 ? "Notifications" : "Aucune"}</div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="student-timeline">
        <div className={`student-timeline-step ${stats?.theme_statut ? 'completed' : ''}`}>
          <div className="student-ts-icon">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <div className="student-ts-label">Soumission<br/>thème</div>
        </div>
        <div className={`student-timeline-step ${stats?.theme_statut && !stats?.eligibilite_rapport ? 'active' : ''}`}>
          <div className="student-ts-icon">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="student-ts-label">Décision<br/>chef dept</div>
        </div>
        <div className={`student-timeline-step ${stats?.eligibilite_rapport ? 'active' : ''}`}>
          <div className="student-ts-icon">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="student-ts-label">Dépôt<br/>rapport</div>
        </div>
        <div className="student-timeline-step">
          <div className="student-ts-icon">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="student-ts-label">Analyse<br/>chef dept</div>
        </div>
        <div className="student-timeline-step">
          <div className="student-ts-icon">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <div className="student-ts-label">Validation<br/>finale</div>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div className="student-two-col">
        {/* MON THÈME */}
        <div className="student-section-card">
          <div className="student-section-header">
            <div className="student-section-title">Mon thème de stage</div>
            <div className="student-section-action" onClick={() => navigate("/etudiant/themes")}>
              Voir détails
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2l4 4-4 4"/></svg>
            </div>
          </div>
          <div style={{ padding: '12px 0' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
              {stats?.theme_statut || "Aucun thème soumis"}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginBottom: '12px' }}>
              {stats?.theme_statut ? "Soumis récemment" : "Vous devez soumettre un thème"}
            </div>
            {stats?.theme_statut ? (
              <span className="student-badge b-analyse"><span className="student-badge-dot"></span>En cours</span>
            ) : (
              <span className="student-badge b-attente"><span className="student-badge-dot"></span>Non soumis</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="student-btn student-btn-outline student-btn-sm" onClick={() => navigate("/etudiant/themes/nouveau")}>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3v6M3 6h6"/></svg>
              Soumettre
            </button>
          </div>
        </div>

        {/* INFOS SESSION */}
        <div className="student-section-card">
          <div className="student-section-header">
            <div className="student-section-title">Session active</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: '#E0F2FE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar className="w-6 h-6" style={{ color: '#0369A1' }} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Session Thème S3</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>2024-2025 · L3 Informatique</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--muted)' }}>Ouverture</span>
              <span style={{ color: 'var(--text)', fontWeight: 500 }}>01 avr. 2025</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--muted)' }}>Fermeture</span>
              <span style={{ color: 'var(--text)', fontWeight: 500 }}>15 mai 2025</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--muted)' }}>Temps restant</span>
              <span style={{ color: 'var(--orange)', fontWeight: 600 }}>18 jours</span>
            </div>
          </div>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginBottom: '6px' }}>Progression</div>
            <div style={{ background: 'var(--border)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: '35%', height: '100%', background: 'var(--primary-light)', borderRadius: '10px' }}></div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', textAlign: 'right' }}>35% complété</div>
          </div>
        </div>
      </div>

      {/* RAPPORT STATUS */}
      <div className="student-section-card">
        <div className="student-section-header">
          <div className="student-section-title">Statut de mon rapport de stage</div>
        </div>
        <div className={`student-alert ${stats?.eligibilite_rapport ? 'student-alert-success' : 'student-alert-info'}`}>
          {stats?.eligibilite_rapport ? (
            <CheckCircle className="w-4.5 h-4.5" />
          ) : (
            <AlertTriangle className="w-4.5 h-4.5" />
          )}
          <div className="student-alert-text">
            <strong>{stats?.eligibilite_rapport ? 'Éligible' : 'Non éligible'}</strong> — {stats?.eligibilite_rapport 
              ? "Vous pouvez déposer votre rapport de stage." 
              : "Vous devez d'abord obtenir la validation de votre thème par le Chef de Département avant de pouvoir déposer votre rapport."}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg)', borderRadius: '8px' }}>
          <FileText className="w-8 h-8" style={{ color: 'var(--muted)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>Dépôt de rapport</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{stats?.eligibilite_rapport ? "Prêt à déposer" : "Disponible après validation du thème"}</div>
          </div>
          <button 
            className="student-btn student-btn-secondary student-btn-sm" 
            onClick={() => navigate("/etudiant/rapports/deposer")}
            disabled={!stats?.eligibilite_rapport}
            style={{ opacity: stats?.eligibilite_rapport ? 1 : 0.5 }}
          >
            {stats?.eligibilite_rapport ? 'Déposer' : 'Indisponible'}
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      {notifications && notifications.length > 0 && (
        <div className="student-section-card">
          <div className="student-section-header">
            <div className="student-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell className="w-4 h-4" />
              Notifications
            </div>
            {unreadCount > 0 && (
              <button className="student-btn student-btn-outline student-btn-sm" onClick={handleMarkAllAsRead}>
                Tout marquer comme lu
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.slice(0, 5).map((notif: any) => (
              <div
                key={notif.id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${!notif.lue ? '#BFDBFE' : '#E2E8F0'}`,
                  background: !notif.lue ? '#EFF6FF' : '#F8FAFC',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      {!notif.lue && (
                        <div style={{ width: '6px', height: '6px', background: '#3B82F6', borderRadius: '50%' }}></div>
                      )}
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)' }}>{notif.titre}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{notif.contenu}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
                      {new Date(notif.date_envoi).toLocaleString('fr-FR')}
                    </div>
                  </div>
                  {!notif.lue && (
                    <button 
                      className="student-btn student-btn-outline student-btn-sm" 
                      onClick={() => handleMarkAsRead(notif.id)}
                      style={{ padding: '4px' }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
