import { Badge } from "@/components/ui/badge";

export default function DashboardAdminPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">Total Utilisateurs</div>
          <div className="text-3xl font-semibold text-[#1A3A5C]">156</div>
          <div className="text-sm text-green-600 mt-2">↑ 12 ce mois</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">Sessions actives</div>
          <div className="text-3xl font-semibold text-[#1A3A5C]">3</div>
          <div className="text-sm text-slate-500 mt-2">L2/L3 Info, L3 Math</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">Analyses ce mois</div>
          <div className="text-3xl font-semibold text-[#1A3A5C]">89</div>
          <div className="text-sm text-green-600 mt-2">↑ 23%</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">Taux plagiat moyen</div>
          <div className="text-3xl font-semibold text-[#1A3A5C]">8.2%</div>
          <div className="text-sm text-red-500 mt-2">↓ 2.1%</div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-lg text-[#1E293B]">Activité récente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Utilisateur</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Détails</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-sm text-slate-600">29/04/2026 14:32</td>
                <td className="py-3 px-4 text-sm">Dr. Ouédraogo</td>
                <td className="py-3 px-4"><Badge className="bg-blue-100 text-blue-800">Connexion</Badge></td>
                <td className="py-3 px-4 text-sm text-slate-600">Connexion réussie</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-sm text-slate-600">29/04/2026 14:15</td>
                <td className="py-3 px-4 text-sm">Kaboré A.</td>
                <td className="py-3 px-4"><Badge className="bg-amber-100 text-amber-800">Création</Badge></td>
                <td className="py-3 px-4 text-sm text-slate-600">Nouveau thème créé</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-sm text-slate-600">29/04/2026 13:45</td>
                <td className="py-3 px-4 text-sm">Sys</td>
                <td className="py-3 px-4"><Badge className="bg-blue-100 text-blue-800">Config</Badge></td>
                <td className="py-3 px-4 text-sm text-slate-600">Seuils mis à jour</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-sm text-slate-600">29/04/2026 12:20</td>
                <td className="py-3 px-4 text-sm">Ilboudo</td>
                <td className="py-3 px-4"><Badge className="bg-green-100 text-green-800">Soumission</Badge></td>
                <td className="py-3 px-4 text-sm text-slate-600">Rapport déposé</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-sm text-slate-600">29/04/2026 11:05</td>
                <td className="py-3 px-4 text-sm">Dr. Sawadogo</td>
                <td className="py-3 px-4"><Badge className="bg-purple-100 text-purple-800">Signature</Badge></td>
                <td className="py-3 px-4 text-sm text-slate-600">Rapport #2026-045 validé</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Role Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg text-[#1E293B] mb-5">Répartition par rôle</h3>
          
          <div className="py-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm">Étudiants</span>
              <span className="font-mono text-sm text-slate-600">98 (62.8%)</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '62.8%' }}></div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm">Chefs de département</span>
              <span className="font-mono text-sm text-slate-600">12 (7.7%)</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '7.7%' }}></div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm">Directeurs adjoints</span>
              <span className="font-mono text-sm text-slate-600">6 (3.8%)</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '3.8%' }}></div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm">Administrateurs</span>
              <span className="font-mono text-sm text-slate-600">4 (2.6%)</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#1A3A5C] rounded-full" style={{ width: '2.6%' }}></div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm">En attente validation</span>
              <span className="font-mono text-sm text-slate-600">36 (23.1%)</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-slate-400 rounded-full" style={{ width: '23.1%' }}></div>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg text-[#1E293B] mb-5">Alertes système</h3>
          
          <div className="py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-sm">⚠</div>
              <div>
                <div className="font-medium text-sm">Session L2 Info</div>
                <div className="text-xs text-slate-500">Date limite proche (3 jours)</div>
              </div>
            </div>
          </div>
          
          <div className="py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-800 flex items-center justify-center text-sm">!</div>
              <div>
                <div className="font-medium text-sm">3 utilisateurs bloqués</div>
                <div className="text-xs text-slate-500">Mot de passe expiré</div>
              </div>
            </div>
          </div>
          
          <div className="py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-sm">ℹ</div>
              <div>
                <div className="font-medium text-sm">Mise à jour disponible</div>
                <div className="text-xs text-slate-500">Version 2.4.1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
