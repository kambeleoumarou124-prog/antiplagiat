import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rapportsApi } from "@/api/rapports.api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileSignature, XCircle } from "lucide-react";
import { SignatureModal } from "@/components/signature/SignatureModal";
import { useState } from "react";
import type { RapportStage } from "@/types/rapport.types";

export default function RapportsAValiderPage() {
  const queryClient = useQueryClient();
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedRapportId, setSelectedRapportId] = useState<number | null>(null);

  const { data: rapports, isLoading } = useQuery({
    queryKey: ["rapports_to_validate_dir"],
    queryFn: async () => {
      const res = await rapportsApi.lister();
      return res.data.filter(r => r.statut === "DECISION_CHEF"); // Assume the Chef has finished his part
    },
  });

  const handleSignClick = (id: number) => {
    setSelectedRapportId(id);
    setSignatureModalOpen(true);
  };

  const handleSignatureComplete = () => {
    toast.success("Rapport signé et validé définitivement.");
    queryClient.invalidateQueries({ queryKey: ["rapports_to_validate_dir"] });
  };

  const columns = [
    { header: "Étudiant", accessor: "etudiant_nom" as keyof RapportStage },
    { header: "Titre du Rapport", accessor: "titre" as keyof RapportStage },
    { header: "Déposé le", accessor: (row: any) => new Date(row.date_soumission).toLocaleDateString() },
    { 
      header: "Actions", 
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <Button variant="default" size="sm" onClick={() => handleSignClick(row.id)} className="bg-purple-600 hover:bg-purple-700">
            <FileSignature className="w-4 h-4 mr-1" /> Signer (Valider)
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
            <XCircle className="w-4 h-4 mr-1" /> Refuser
          </Button>
        </div>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif">Validation Définitive des Rapports</h1>
        <p className="text-slate-500">Signez numériquement les rapports approuvés par les chefs de département.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <DataTable
          columns={columns}
          data={rapports || []}
          isLoading={isLoading}
          searchKey="titre"
        />
      </div>

      {selectedRapportId && (
        <SignatureModal 
          rapportId={selectedRapportId} 
          isOpen={signatureModalOpen} 
          onClose={() => setSignatureModalOpen(false)}
          onSuccess={handleSignatureComplete}
        />
      )}
    </div>
  );
}
