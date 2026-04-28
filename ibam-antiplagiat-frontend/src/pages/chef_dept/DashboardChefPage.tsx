import { useQuery } from "@tanstack/react-query";
import { themesApi } from "@/api/themes.api";
import { rapportsApi } from "@/api/rapports.api";
import { StatCard } from "@/components/ui/StatCard";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function DashboardChefPage() {
  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await themesApi.lister();
      const data = (res.data as any);
      return Array.isArray(data) ? data : (data?.results || []);
    }
  });
  const { data: rapports } = useQuery({
    queryKey: ["rapports"],
    queryFn: async () => {
      const res = await rapportsApi.lister();
      const data = (res.data as any);
      return Array.isArray(data) ? data : (data?.results || []);
    }
  });

  const themesEnAttente = themes?.filter(t => t.statut === "EN_ATTENTE").length || 0;
  const rapportsAAnalyser = rapports?.filter(r => r.statut === "SOUMIS").length || 0;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif text-primary tracking-tight">Tableau de bord - Chef de Département</h1>
        <p className="text-muted-foreground">Aperçu des validations en attente et des analyses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Thèmes en attente"
          value={themesEnAttente}
          icon={<Clock className="w-6 h-6 text-orange-500" />}
          description="Propositions à examiner"
          className="hover-lift border-l-4 border-l-orange-500 shadow-md bg-white"
        />
        <StatCard
          title="Rapports à analyser"
          value={rapportsAAnalyser}
          icon={<FileText className="w-6 h-6 text-blue-500" />}
          description="En attente d'analyse"
          className="hover-lift border-l-4 border-l-blue-500 shadow-md bg-white"
        />
        <StatCard
          title="Total Thèmes validés"
          value={themes?.filter(t => t.statut === "ACCEPTE").length || 0}
          icon={<CheckCircle className="w-6 h-6 text-green-500" />}
          description="Thèmes acceptés cette session"
          className="hover-lift border-l-4 border-l-green-500 shadow-md bg-white"
        />
        <StatCard
          title="Alertes Plagiat"
          value={rapports?.filter(r => r.statut === "EN_REVISION").length || 0}
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
          description="Rapports nécessitant une révision"
          className="hover-lift border-l-4 border-l-red-500 shadow-md bg-white"
        />
      </div>

      {/* Récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass border border-border/50 rounded-2xl p-6 bg-white/50 backdrop-blur-sm">
          <h3 className="font-semibold mb-4 text-primary font-serif text-lg">Thèmes récents à valider</h3>
          {themesEnAttente === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground text-sm">Aucun thème en attente.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {themes?.filter(t => t.statut === "EN_ATTENTE").slice(0, 5).map(t => (
                <li key={t.id} className="flex justify-between items-center text-sm border-b border-border/50 pb-3 last:border-0">
                  <span className="font-medium text-foreground truncate flex-1 mr-4">{t.intitule}</span>
                  <span className="text-muted-foreground text-xs bg-slate-100 px-2 py-1 rounded-full">{t.etudiant_nom}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
