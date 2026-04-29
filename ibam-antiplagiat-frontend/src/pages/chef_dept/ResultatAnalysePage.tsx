import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { themesApi } from "@/api/themes.api";
import { rapportsApi } from "@/api/rapports.api";
import { Button } from "@/components/ui/button";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

export default function ResultatAnalysePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await themesApi.lister();
      const data = (res.data as any);
      return Array.isArray(data) ? data : (data?.results || []);
    },
  });

  const { data: rapports } = useQuery({
    queryKey: ["rapports"],
    queryFn: async () => {
      const res = await rapportsApi.lister();
      const data = (res.data as any);
      return Array.isArray(data) ? data : (data?.results || []);
    },
  });

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

  // Combine themes and rapports into a single history list
  const historyList = [
    ...(themes?.map((t: any) => ({
      ...t,
      type: "Thème",
      taux: t.taux_similarite || 0,
      date: t.date_soumission,
      lanceur: "Étudiant",
    })) || []),
    ...(rapports?.map((r: any) => ({
      ...r,
      type: "Rapport",
      taux: r.taux_similarite || 0,
      date: r.date_depot,
      lanceur: "Chef de département",
    })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredHistory = historyList.filter((item: any) => {
    const matchesSearch = item.etudiant_nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (item.intitule || item.titre)?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#1A3A5C]">Historique des analyses</h1>
        <p className="text-sm text-[#64748B] mt-1">Consultation de l'ensemble des analyses effectuées.</p>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1E293B]">Historique complet</h3>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg w-72">
              <Search className="w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
            {/* Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm cursor-pointer"
            >
              <option value="all">Tous les types</option>
              <option value="thème">Thème</option>
              <option value="rapport">Rapport</option>
            </select>
            {/* Export */}
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Date</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Type</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Étudiant</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Titre</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Taux</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Niveau</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Lanceur</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm text-[#64748B]">
                    Aucune analyse trouvée
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item: any) => {
                  const niveauAlerte = getNiveauAlerte(item.taux);
                  const typeBadge = item.type === "Thème" 
                    ? "bg-slate-100/80 text-slate-700" 
                    : "bg-slate-100/80 text-slate-700";
                  return (
                    <tr key={item.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="py-4 px-6 text-sm text-[#64748B]">{formatDate(item.date)}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeBadge}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-[#1E293B]">{item.etudiant_nom || "Étudiant inconnu"}</td>
                      <td className="py-4 px-6 text-sm text-[#1E293B] max-w-[250px] truncate">{item.intitule || item.titre || ""}</td>
                      <td className="py-4 px-6 text-sm text-[#1E293B]">{item.taux > 0 ? `${item.taux.toFixed(1)}%` : "—"}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold ${niveauAlerte.className}`}>
                          {niveauAlerte.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-[#64748B]">{item.lanceur}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-[#E2E8F0] flex items-center justify-between">
          <div className="text-sm text-[#64748B]">
            Affichage de 1 à {filteredHistory.length} sur {filteredHistory.length} analyses
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-[#1A3A5C] text-white flex items-center justify-center">1</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">2</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">3</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">4</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">5</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
