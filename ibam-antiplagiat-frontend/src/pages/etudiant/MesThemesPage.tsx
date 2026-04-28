import { useQuery } from "@tanstack/react-query";
import { themesApi } from "@/api/themes.api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ThemeStage } from "@/types/theme.types";

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
      case "ACCEPTE": return <Badge variant="success">Accepté</Badge>;
      case "REFUSE": return <Badge variant="destructive">Refusé</Badge>;
      case "A_REFORMULER": return <Badge variant="warning">À reformuler</Badge>;
      default: return <Badge variant="outline">En attente</Badge>;
    }
  };

  const columns = [
    { header: "Intitulé du Thème", accessor: "intitule" as keyof ThemeStage },
    { header: "Statut", accessor: (row: ThemeStage) => getStatutBadge(row.statut) },
    { header: "Date", accessor: (row: ThemeStage) => new Date(row.date_soumission).toLocaleDateString() },
    { 
      header: "Actions", 
      accessor: (row: ThemeStage) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/etudiant/themes/${row.id}`)}>
          Détails
        </Button>
      ) 
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-primary tracking-tight">Mes Thèmes</h1>
          <p className="text-muted-foreground">Gérez vos propositions de thèmes de stage.</p>
        </div>
        <Button 
          onClick={() => navigate("/etudiant/themes/nouveau")}
          className="bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-primary/30 transition-all duration-200 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Thème
        </Button>
      </div>

      <div className="glass border border-border/50 rounded-2xl p-6 bg-white/50 backdrop-blur-sm">
        <DataTable
          columns={columns}
          data={themes || []}
          isLoading={isLoading}
          searchKey="intitule"
        />
      </div>
    </div>
  );
}
