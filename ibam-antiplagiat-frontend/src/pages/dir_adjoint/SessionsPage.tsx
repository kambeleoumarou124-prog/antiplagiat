import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SessionsPage() {
  // Mock data for sessions
  const [sessions] = useState([
    { id: 1, type: "SESSION_THEME", statut: "OUVERTE", date_ouverture: "2026-01-10", date_fermeture: "2026-02-28" },
    { id: 2, type: "SESSION_RAPPORT", statut: "OUVERTE", date_ouverture: "2026-05-01", date_fermeture: "2026-06-30" },
    { id: 3, type: "SESSION_THEME", statut: "FERMEE", date_ouverture: "2025-01-15", date_fermeture: "2025-02-28" },
  ]);

  const columns = [
    { header: "Type de Session", accessor: (row: any) => row.type === "SESSION_THEME" ? "Thèmes" : "Rapports" },
    { header: "Statut", accessor: (row: any) => row.statut === "OUVERTE" ? <Badge variant="success">Ouverte</Badge> : <Badge variant="outline">Fermée</Badge> },
    { header: "Date d'ouverture", accessor: (row: any) => new Date(row.date_ouverture).toLocaleDateString() },
    { header: "Date de fermeture", accessor: (row: any) => new Date(row.date_fermeture).toLocaleDateString() },
    { 
      header: "Actions", 
      accessor: (row: any) => (
        <Button variant="ghost" size="sm">
          Modifier
        </Button>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-serif">Sessions Académiques</h1>
          <p className="text-slate-500">Gérez les périodes de soumission des thèmes et rapports.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Session
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <DataTable
          columns={columns}
          data={sessions}
          isLoading={false}
          searchKey="type"
        />
      </div>
    </div>
  );
}
