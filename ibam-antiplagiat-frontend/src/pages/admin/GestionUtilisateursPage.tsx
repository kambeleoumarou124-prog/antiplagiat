import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

export default function GestionUtilisateursPage() {
  const users = [
    { id: 1, email: "ouedraogo@ibam.bf", nom: "Ouédraogo", prenom: "Dr.", role: "Administrateur", departement: "—", actif: true, lastLogin: "29/04/2026" },
    { id: 2, email: "kabore@ibam.bf", nom: "Kaboré", prenom: "B.", role: "Chef dept.", departement: "Informatique", actif: true, lastLogin: "28/04/2026" },
    { id: 3, email: "traore.i@ibam.bf", nom: "Traoré", prenom: "I.", role: "Étudiant", departement: "L3 Info", actif: true, lastLogin: "29/04/2026" },
    { id: 4, email: "sawadogo@ibam.bf", nom: "Sawadogo", prenom: "Dr.", role: "Dir. Adjoint", departement: "Mathématiques", actif: true, lastLogin: "27/04/2026" },
    { id: 5, email: "ilboudo@ibam.bf", nom: "Ilboudo", prenom: "M.", role: "Étudiant", departement: "L2 Math", actif: false, lastLogin: "15/03/2026" },
  ];

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      "Administrateur": { bg: "bg-blue-100", text: "text-blue-800" },
      "Chef dept.": { bg: "bg-amber-100", text: "text-amber-800" },
      "Étudiant": { bg: "bg-green-100", text: "text-green-800" },
      "Dir. Adjoint": { bg: "bg-purple-100", text: "text-purple-800" },
    };
    const style = badges[role] || { bg: "bg-slate-100", text: "text-slate-800" };
    return <Badge className={`${style.bg} ${style.text}`}>{role}</Badge>;
  };

  const getInitials = (prenom: string, nom: string) => {
    return (prenom[0] + nom[0]).toUpperCase();
  };

  const getAvatarColor = (role: string) => {
    const colors: Record<string, string> = {
      "Administrateur": "bg-[#1A3A5C]",
      "Chef dept.": "bg-orange-500",
      "Étudiant": "bg-green-500",
      "Dir. Adjoint": "bg-purple-500",
    };
    return colors[role] || "bg-slate-400";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-lg text-[#1E293B]">Gestion des utilisateurs</h3>
          <Button className="bg-[#E8A020] text-[#1A3A5C] hover:bg-[#F0B040]">
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </div>

        <div className="flex gap-3 mb-5">
          <Input 
            placeholder="Rechercher..." 
            className="max-w-[300px] border-slate-200"
          />
          <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm">
            <option>Tous les rôles</option>
            <option>Étudiant</option>
            <option>Chef de département</option>
            <option>Directeur Adjoint</option>
            <option>Administrateur</option>
          </select>
          <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm">
            <option>Tous les statuts</option>
            <option>Actif</option>
            <option>Inactif</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Utilisateur</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Rôle</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Département</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Dernière connexion</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${getAvatarColor(user.role)} text-white flex items-center justify-center font-semibold text-sm mr-3`}>
                        {getInitials(user.prenom, user.nom)}
                      </div>
                      <div className="text-sm">{user.prenom} {user.nom}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm text-slate-600">{user.email}</td>
                  <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                  <td className="py-3 px-4 text-sm">{user.departement}</td>
                  <td className="py-3 px-4">
                    {user.actif ? (
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Inactif</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm text-slate-600">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded bg-slate-50 hover:bg-[#1A3A5C] hover:text-white transition-colors" title="Modifier">
                        ✎
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded bg-slate-50 hover:bg-[#1A3A5C] hover:text-white transition-colors" title={user.actif ? "Désactiver" : "Activer"}>
                        {user.actif ? "◯" : "◉"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-5 pt-5 border-t border-slate-200">
          <div className="text-sm text-slate-500">Affichage de 1 à 5 sur 24 utilisateurs</div>
          <div className="flex gap-2">
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-[#1A3A5C] hover:text-white transition-colors">←</button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded bg-[#1A3A5C] text-white">1</button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-[#1A3A5C] hover:text-white transition-colors">2</button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-[#1A3A5C] hover:text-white transition-colors">3</button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-[#1A3A5C] hover:text-white transition-colors">4</button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-[#1A3A5C] hover:text-white transition-colors">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
