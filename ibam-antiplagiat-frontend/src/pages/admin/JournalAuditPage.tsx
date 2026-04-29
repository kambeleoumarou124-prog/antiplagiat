import { Button } from "@/components/ui/button";

export default function JournalAuditPage() {
  const auditLogs = [
    { id: 1, date: "29/04/2026 14:32:15", user: "Dr. Ouédraogo", action: "Connexion", entity: "Session", ip: "192.168.1.45", details: "Connexion réussie", icon: "🔑", iconBg: "bg-amber-100", iconText: "text-amber-800" },
    { id: 2, date: "29/04/2026 14:15:22", user: "Kaboré B.", action: "Création", entity: "Thème", ip: "192.168.1.78", details: "Nouveau thème: \"Système de gestion\"", icon: "➕", iconBg: "bg-green-100", iconText: "text-green-800" },
    { id: 3, date: "29/04/2026 13:45:08", user: "Admin Système", action: "Modification", entity: "Configuration", ip: "192.168.1.10", details: "Seuils mis à jour", icon: "✏️", iconBg: "bg-blue-100", iconText: "text-blue-800" },
    { id: 4, date: "29/04/2026 12:20:33", user: "Ilboudo M.", action: "Dépôt", entity: "Rapport", ip: "192.168.1.92", details: "Rapport déposé: R2026-052.pdf", icon: "📤", iconBg: "bg-green-100", iconText: "text-green-800" },
    { id: 5, date: "29/04/2026 11:05:47", user: "Dr. Sawadogo", action: "Signature", entity: "Rapport", ip: "192.168.1.55", details: "Rapport #2026-045 signé", icon: "✍️", iconBg: "bg-blue-100", iconText: "text-blue-800" },
    { id: 6, date: "29/04/2026 10:30:12", user: "Admin Système", action: "Création", entity: "Utilisateur", ip: "192.168.1.10", details: "Nouvel utilisateur: Zongo A.", icon: "👤", iconBg: "bg-green-100", iconText: "text-green-800" },
    { id: 7, date: "29/04/2026 09:15:00", user: "Traoré I.", action: "Connexion", entity: "Session", ip: "192.168.1.103", details: "Échec - Mot de passe incorrect", icon: "🔑", iconBg: "bg-amber-100", iconText: "text-amber-800" },
    { id: 8, date: "28/04/2026 16:45:33", user: "Admin Système", action: "Suppression", entity: "Session", ip: "192.168.1.10", details: "Session L1 Info 2024 close", icon: "🗑️", iconBg: "bg-red-100", iconText: "text-red-800" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-lg text-[#1E293B]">Journal d'audit système</h3>
          <div className="flex gap-3">
            <select className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm">
              <option>Toutes les actions</option>
              <option>Connexion</option>
              <option>Création</option>
              <option>Modification</option>
              <option>Suppression</option>
            </select>
            <input 
              type="date" 
              defaultValue="2026-04-29"
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
            />
            <Button variant="outline" className="border-slate-200">
              Exporter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date/Heure</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Utilisateur</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Entité</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">IP</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Détails</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-sm text-slate-600">{log.date}</td>
                  <td className="py-3 px-4 text-sm">{log.user}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`w-9 h-9 rounded-lg ${log.iconBg} ${log.iconText} flex items-center justify-center text-sm mr-2`}>
                        {log.icon}
                      </div>
                      <span className="text-sm">{log.action}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{log.entity}</td>
                  <td className="py-3 px-4 font-mono text-sm text-slate-600">{log.ip}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-5 pt-5 border-t border-slate-200">
          <div className="text-sm text-slate-500">Affichage de 1 à 8 sur 247 entrées</div>
          <div className="flex gap-2">
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-[#1A3A5C] hover:text-white transition-colors">←</button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded bg-[#1A3A5C] text-white">1</button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-[#1A3A5C] hover:text-white transition-colors">2</button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-[#1A3A5C] hover:text-white transition-colors">3</button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded hover:bg-[#1A3A5C] hover:text-white transition-colors">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
