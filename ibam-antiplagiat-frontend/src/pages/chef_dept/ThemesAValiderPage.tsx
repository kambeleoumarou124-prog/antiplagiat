import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { themesApi } from "@/api/themes.api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import type { ThemeStage } from "@/types/theme.types";

export default function ThemesAValiderPage() {
  const queryClient = useQueryClient();
  const { data: themes, isLoading } = useQuery({
    queryKey: ["themes_to_validate"],
    queryFn: async () => {
      const res = await themesApi.lister();
      return res.data.filter(t => t.statut === "EN_ATTENTE");
    },
  });

  const mutation = useMutation({
    mutationFn: ({ id, decision, commentaire }: { id: number, decision: "ACCEPTE" | "REFUSE" | "A_REFORMULER", commentaire: string }) => 
      themesApi.attribuerDecision(id, { decision, commentaire }),
    onSuccess: () => {
      toast.success("Décision enregistrée avec succès");
      queryClient.invalidateQueries({ queryKey: ["themes_to_validate"] });
    },
  });

  const handleDecision = (id: number, decision: "ACCEPTE" | "REFUSE") => {
    // Dans une vraie app, on ouvrirait un modal pour le commentaire
    mutation.mutate({ id, decision, commentaire: "Décision rapide du chef" });
  };

  const columns = [
    { header: "Étudiant", accessor: "etudiant_nom" as keyof ThemeStage },
    { header: "Intitulé du Thème", accessor: "intitule" as keyof ThemeStage },
    { header: "Soumis le", accessor: (row: any) => new Date(row.date_soumission).toLocaleDateString() },
    { 
      header: "Actions", 
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleDecision(row.id, "ACCEPTE")} className="text-green-600 border-green-200 hover:bg-green-50">
            <CheckCircle className="w-4 h-4 mr-1" /> Accepter
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDecision(row.id, "REFUSE")} className="text-red-600 border-red-200 hover:bg-red-50">
            <XCircle className="w-4 h-4 mr-1" /> Refuser
          </Button>
        </div>
      ) 
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif text-primary tracking-tight">Thèmes à valider</h1>
        <p className="text-muted-foreground">Examinez les propositions de thèmes de stage des étudiants.</p>
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
