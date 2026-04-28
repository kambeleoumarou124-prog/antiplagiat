import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Edit, ShieldOff } from "lucide-react";

export default function GestionUtilisateursPage() {
  const [users] = useState([
    { id: 1, email: "etudiant@ibam.bf", nom: "Sawadogo", prenom: "Ali", role: "ETUDIANT", actif: true },
    { id: 2, email: "chef@ibam.bf", nom: "Ouedraogo", prenom: "Awa", role: "CHEF_DEPT", actif: true },
    { id: 3, email: "dir@ibam.bf", nom: "Kambire", prenom: "Paul", role: "DIR_ADJOINT", actif: true },
    { id: 4, email: "ancien@ibam.bf", nom: "Zongo", prenom: "Jean", role: "ETUDIANT", actif: false },
  ]);

  const columns = [
    { header: "Nom", accessor: "nom" as keyof typeof users[0] },
    { header: "Prénom", accessor: "prenom" as keyof typeof users[0] },
    { header: "Email", accessor: "email" as keyof typeof users[0] },
    { header: "Rôle", accessor: (row: any) => <Badge variant="outline">{row.role}</Badge> },
    { header: "Statut", accessor: (row: any) => row.actif ? <Badge variant="success">Actif</Badge> : <Badge variant="destructive">Inactif</Badge> },
    { 
      header: "Actions", 
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500">
            <ShieldOff className="w-4 h-4" />
          </Button>
        </div>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-serif">Gestion des Utilisateurs</h1>
          <p className="text-slate-500">Administrez les comptes et les rôles (RBAC).</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <DataTable
          columns={columns}
          data={users}
          isLoading={false}
          searchKey="email"
        />
      </div>
    </div>
  );
}
