import { useQuery } from "@tanstack/react-query";
import { rapportsApi } from "@/api/rapports.api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RapportStage } from "@/types/rapport.types";

export default function MesRapportsPage() {
  const navigate = useNavigate();
  const { data: rapports, isLoading } = useQuery({
    queryKey: ["my_rapports"],
    queryFn: async () => {
      const res = await rapportsApi.lister();
      return res.data;
    },
  });

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "VALIDE_DEF": return <Badge variant="success">Validé (Définitif)</Badge>;
      case "REFUSE_DEF": return <Badge variant="destructive">Refusé (Définitif)</Badge>;
      case "EN_REVISION": return <Badge variant="warning">En révision</Badge>;
      case "DECISION_CHEF": return <Badge variant="default">Analyse Chef Terminée</Badge>;
      case "ANALYSE_CHEF": return <Badge variant="default">Analyse Chef</Badge>;
      case "ERREUR_EXTRACTION": return <Badge variant="destructive">Erreur</Badge>;
      default: return <Badge variant="outline">Soumis</Badge>;
    }
  };

  const columns = [
    { header: "Titre du Rapport", accessor: "titre" as keyof RapportStage },
    { header: "Statut", accessor: (row: RapportStage) => getStatutBadge(row.statut) },
    { header: "Date de Dépôt", accessor: (row: RapportStage) => new Date(row.date_soumission).toLocaleDateString() },
    { 
      header: "Actions", 
      accessor: (row: RapportStage) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/etudiant/rapports/${row.id}`)}>
          Consulter
        </Button>
      ) 
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-primary tracking-tight">Mes Rapports</h1>
          <p className="text-muted-foreground">Suivez l'état d'analyse et de validation de vos rapports.</p>
        </div>
        <Button 
          onClick={() => navigate("/etudiant/rapports/deposer")}
          className="bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-primary/30 transition-all duration-200 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Déposer un Rapport
        </Button>
      </div>

      <div className="glass border border-border/50 rounded-2xl p-6 bg-white/50 backdrop-blur-sm">
        <DataTable
          columns={columns}
          data={rapports || []}
          isLoading={isLoading}
          searchKey="titre"
        />
      </div>
    </div>
  );
}
