import { Badge } from "@/components/ui/badge";

export default function StatistiquesPage() {
  const departments = [
    { name: "Informatique", analyses: 423, avgRate: "7.2%", acceptance: "82%" },
    { name: "Mathématiques", analyses: 312, avgRate: "6.8%", acceptance: "85%" },
    { name: "Physique", analyses: 287, avgRate: "9.1%", acceptance: "76%" },
    { name: "Chimie", analyses: 156, avgRate: "8.5%", acceptance: "79%" },
    { name: "Biologie", analyses: 69, avgRate: "11.2%", acceptance: "68%" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">Total analyses</div>
          <div className="text-3xl font-semibold text-[#1A3A5C]">1,247</div>
          <div className="text-sm text-green-600 mt-2">↑ 18% vs mois dernier</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">Taux moyen global</div>
          <div className="text-3xl font-semibold text-[#1A3A5C]">8.2%</div>
          <div className="text-sm text-red-500 mt-2">↓ 2.1%</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">Rapports acceptés</div>
          <div className="text-3xl font-semibold text-[#1A3A5C]">78%</div>
          <div className="text-sm text-green-600 mt-2">↑ 5%</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">Temps moyen analyse</div>
          <div className="text-3xl font-semibold text-[#1A3A5C]">4.2s</div>
          <div className="text-sm text-slate-500 mt-2">↓ 0.8s</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Analyses par mois - Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg text-[#1E293B] mb-5">Analyses par mois</h3>
          <div className="h-[200px] bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="w-full px-8">
              <div className="flex items-end gap-4 h-[150px]">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-[#1A3A5C] rounded-t" style={{ height: '60%' }}></div>
                  <div className="mt-2 text-xs text-slate-500">Jan</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-[#1A3A5C] rounded-t" style={{ height: '75%' }}></div>
                  <div className="mt-2 text-xs text-slate-500">Fév</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-[#1A3A5C] rounded-t" style={{ height: '65%' }}></div>
                  <div className="mt-2 text-xs text-slate-500">Mar</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-[#1A3A5C] rounded-t" style={{ height: '90%' }}></div>
                  <div className="mt-2 text-xs text-slate-500">Avr</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Répartition des résultats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg text-[#1E293B] mb-5">Répartition des résultats</h3>
          
          <div className="py-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                Acceptables
              </span>
              <span className="font-mono text-sm text-slate-600">78%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-sm"></span>
                Avertissements
              </span>
              <span className="font-mono text-sm text-slate-600">15%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
                Rejetés
              </span>
              <span className="font-mono text-sm text-slate-600">7%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '7%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top départements */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-lg text-[#1E293B] mb-5">Top départements</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Département</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Analyses</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Taux moyen</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Acceptation</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm">{dept.name}</td>
                  <td className="py-3 px-4 font-mono text-sm text-slate-600">{dept.analyses}</td>
                  <td className="py-3 px-4 font-mono text-sm text-slate-600">{dept.avgRate}</td>
                  <td className="py-3 px-4">
                    <Badge className={parseInt(dept.acceptance) >= 80 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                      {dept.acceptance}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
