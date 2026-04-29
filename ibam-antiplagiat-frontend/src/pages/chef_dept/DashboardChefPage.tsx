import { useQuery } from "@tanstack/react-query";
import { themesApi } from "@/api/themes.api";
import { rapportsApi } from "@/api/rapports.api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  FileText, CheckCircle, AlertTriangle, 
  ChevronRight, ArrowRight, Eye, Search
} from "lucide-react";

export default function DashboardChefPage() {
  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await themesApi.lister();
      const data = (res.data as any);
      return Array.isArray(data) ? data : (data?.results || []);
    }
  });
  const { data: rapports } = useQuery({
    queryKey: ["rapports"],
    queryFn: async () => {
      const res = await rapportsApi.lister();
      const data = (res.data as any);
      return Array.isArray(data) ? data : (data?.results || []);
    }
  });

  const themesEnAttente = themes?.filter(t => ["EN_ATTENTE", "ANALYSE"].includes(t.statut)).length || 0;
  const themesAcceptes = themes?.filter(t => t.statut === "ACCEPTE").length || 0;
  const rapportsAAnalyser = rapports?.filter(r => r.statut === "SOUMIS").length || 0;
  const rapportsCritiques = rapports?.filter(r => r.taux_similarite > 50).length || 0;

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getTauxColor = (taux: number) => {
    if (taux >= 60) return { bg: "bg-red-500", text: "text-red-600", bar: "bg-red-500", alert: "critique" };
    if (taux >= 40) return { bg: "bg-orange-500", text: "text-orange-600", bar: "bg-orange-500", alert: "rouge" };
    if (taux >= 25) return { bg: "bg-yellow-500", text: "text-yellow-600", bar: "bg-yellow-500", alert: "orange" };
    return { bg: "bg-green-500", text: "text-green-600", bar: "bg-green-500", alert: "vert" };
  };

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      "EN_ATTENTE": { label: "En attente", className: "bg-slate-100/80 text-slate-700" },
      "ANALYSE": { label: "En analyse", className: "bg-blue-100/80 text-blue-800" },
      "ACCEPTE": { label: "Accepté", className: "bg-green-100/80 text-green-800" },
      "REFUSE": { label: "Refusé", className: "bg-red-100/80 text-red-800" },
      "A_REFORMULER": { label: "À reformuler", className: "bg-orange-100/80 text-orange-800" },
      "SOUMIS": { label: "Soumis", className: "bg-slate-100/80 text-slate-700" },
      "VALIDE": { label: "Validé", className: "bg-green-100/80 text-green-800" },
    };
    return badges[statut] || { label: statut, className: "bg-gray-100/80 text-gray-800" };
  };

  const getNiveauAlerte = (taux: number) => {
    if (taux >= 50) return { label: "Critique", className: "bg-red-100/80 text-red-800" };
    if (taux >= 31) return { label: "Fort", className: "bg-red-100/80 text-red-800" };
    if (taux >= 16) return { label: "Modéré", className: "bg-orange-100/80 text-orange-800" };
    return { label: "Original", className: "bg-green-100/80 text-green-800" };
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const themesWaiting = themes?.filter(t => ["EN_ATTENTE", "ANALYSE"].includes(t.statut)).slice(0, 3) || [];
  const rapportsWaiting = rapports?.filter(r => r.statut === "SOUMIS").slice(0, 5) || [];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#1A3A5C]">Tableau de bord</h1>
        <p className="text-sm text-[#64748B] mt-1">Bienvenue, Prof. Dabiré. Voici l'état de vos validations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Thèmes en attente */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#2E6DA4]" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-600">+2</span>
          </div>
          <div className="text-3xl font-bold text-[#1E293B]">{themesEnAttente}</div>
          <div className="text-sm text-[#64748B]">Thèmes en attente</div>
        </div>

        {/* Rapports à analyser */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#F97316]" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-600">+3</span>
          </div>
          <div className="text-3xl font-bold text-[#1E293B]">{rapportsAAnalyser}</div>
          <div className="text-sm text-[#64748B]">Rapports à analyser</div>
        </div>

        {/* Thèmes validés */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#22C55E]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1E293B]">{themesAcceptes}</div>
          <div className="text-sm text-[#64748B]">Thèmes validés (mois)</div>
        </div>

        {/* Alertes critiques */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1E293B]">{rapportsCritiques}</div>
          <div className="text-sm text-[#64748B]">Alertes critiques</div>
        </div>
      </div>

      {/* Recent Themes Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden mb-6">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1E293B]">Thèmes récents à valider</h3>
          <Link to="/chef/themes">
            <Button variant="outline" size="sm" className="text-[#1A3A5C] border-[#E2E8F0]">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Étudiant</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Intitulé</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Session</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Date soumission</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Statut</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {themesWaiting.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-[#64748B]">
                    Aucun thème en attente
                  </td>
                </tr>
              ) : (
                themesWaiting.map((t: any) => {
                  const statutBadge = getStatutBadge(t.statut);
                  return (
                    <tr key={t.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="py-4 px-6 text-sm text-[#1E293B]">{t.etudiant_nom || "Étudiant inconnu"}</td>
                      <td className="py-4 px-6 text-sm text-[#1E293B] max-w-[250px] truncate">{t.intitule || ""}</td>
                      <td className="py-4 px-6 text-sm text-[#64748B]">S3 2024-2025</td>
                      <td className="py-4 px-6 text-sm text-[#64748B]">{formatDate(t.date_soumission)}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statutBadge.className}`}>
                          {statutBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Link to={`/chef/themes/${t.id}`}>
                          <Button variant="outline" size="sm" className="text-[#1A3A5C] border-[#E2E8F0]">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Rapports Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1E293B]">Rapports récents à analyser</h3>
          <Link to="/chef/rapports-a-analyser">
            <Button variant="outline" size="sm" className="text-[#1A3A5C] border-[#E2E8F0]">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Étudiant</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Titre</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Session</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Date soumission</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Taux</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Niveau</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rapportsWaiting.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm text-[#64748B]">
                    Aucun rapport en attente
                  </td>
                </tr>
              ) : (
                rapportsWaiting.map((r: any) => {
                  const taux = r.taux_similarite || 0;
                  const niveauAlerte = getNiveauAlerte(taux);
                  const statutBadge = getStatutBadge(r.statut);
                  return (
                    <tr key={r.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="py-4 px-6 text-sm text-[#1E293B]">{r.etudiant_nom || "Étudiant inconnu"}</td>
                      <td className="py-4 px-6 text-sm text-[#1E293B] max-w-[250px] truncate">{r.titre || ""}</td>
                      <td className="py-4 px-6 text-sm text-[#64748B]">S3 2024-2025</td>
                      <td className="py-4 px-6 text-sm text-[#64748B]">{formatDate(r.date_depot)}</td>
                      <td className="py-4 px-6 text-sm text-[#1E293B]">{taux > 0 ? `${taux.toFixed(1)}%` : "—"}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold ${niveauAlerte.className}`}>
                          {niveauAlerte.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Link to={`/chef/rapports/${r.id}`}>
                          <Button variant="outline" size="sm" className="text-[#1A3A5C] border-[#E2E8F0]">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
