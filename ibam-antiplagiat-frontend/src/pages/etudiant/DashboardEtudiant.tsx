import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DashboardEtudiant() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: authApi.getDashboard,
    select: (res) => res.data,
  });

  if (isLoading) return <div className="p-12 text-center text-muted-foreground animate-pulse flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p>Chargement de votre espace...</p>
    </div>
  </div>;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif text-primary tracking-tight">Mon Espace Étudiant</h1>
        <p className="text-muted-foreground">Bienvenue sur votre tableau de bord de suivi académique.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Statut du Thème"
          value={stats?.theme_statut ? <Badge className="mt-1 shadow-sm">{stats.theme_statut}</Badge> : "Aucun"}
          icon={<FileText className="w-5 h-5" />}
          description={!stats?.theme_statut ? "Vous devez soumettre un thème" : "Mise à jour récente"}
          className="hover-lift border-primary/10 shadow-md bg-white"
        />
        <StatCard
          title="Éligibilité Rapport"
          value={stats?.eligibilite_rapport ? <span className="text-green-600 flex items-center gap-2 mt-1"><CheckCircle className="w-6 h-6"/> Oui</span> : <span className="text-orange-500 flex items-center gap-2 mt-1"><AlertTriangle className="w-6 h-6"/> Non</span>}
          description="Conditionnée par la validation du thème"
          className="hover-lift border-primary/10 shadow-md bg-white"
        />
        <StatCard
          title="Statut du Rapport"
          value={stats?.rapport_statut ? <Badge variant="secondary" className="mt-1 shadow-sm">{stats.rapport_statut}</Badge> : "Non soumis"}
          icon={<Clock className="w-5 h-5" />}
          className="hover-lift border-primary/10 shadow-md bg-white"
          description="En attente de dépôt"
        />
      </div>

      <div className="glass border border-border/50 rounded-2xl p-8 space-y-6 bg-white/50 backdrop-blur-sm">
        <h2 className="text-xl font-serif text-primary border-b border-border/50 pb-4">Actions Rapides</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => navigate("/etudiant/themes/nouveau")} 
            className="bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-primary/30 transition-all duration-200 px-8 py-6 rounded-xl font-medium"
          >
            Soumettre un thème de stage
          </Button>
          <Button 
            onClick={() => navigate("/etudiant/rapports/deposer")} 
            variant="outline" 
            disabled={!stats?.eligibilite_rapport}
            className="hover:bg-slate-50 hover:border-primary hover:text-primary transition-all duration-200 px-8 py-6 rounded-xl font-medium border-slate-300"
          >
            Déposer mon rapport final
          </Button>
        </div>
      </div>
    </div>
  );
}
