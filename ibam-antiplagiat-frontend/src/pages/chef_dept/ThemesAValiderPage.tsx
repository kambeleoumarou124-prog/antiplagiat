import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { themesApi } from "@/api/themes.api";
import { Button } from "@/components/ui/button";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function ThemesAValiderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: themes, isLoading } = useQuery({
    queryKey: ["themes_to_validate"],
    queryFn: async () => {
      const res = await themesApi.lister();
      const data = (res.data as any);
      const items = Array.isArray(data) ? data : (data?.results || []);
      return items.filter((t: any) => ["EN_ATTENTE", "ANALYSE", "ACCEPTE", "REFUSE", "A_REFORMULER"].includes(t.statut));
    },
  });

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      "EN_ATTENTE": { label: "En attente", className: "bg-slate-100/80 text-slate-700" },
      "ANALYSE": { label: "En analyse", className: "bg-blue-100/80 text-blue-800" },
      "ACCEPTE": { label: "Accepté", className: "bg-green-100/80 text-green-800" },
      "REFUSE": { label: "Refusé", className: "bg-red-100/80 text-red-800" },
      "A_REFORMULER": { label: "À reformuler", className: "bg-orange-100/80 text-orange-800" },
    };
    return badges[statut] || { label: statut, className: "bg-gray-100/80 text-gray-800" };
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const filteredThemes = themes?.filter((t: any) => {
    const matchesSearch = t.etudiant_nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.intitule?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.statut === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#1A3A5C]">Thèmes à valider</h1>
        <p className="text-sm text-[#64748B] mt-1">Gérez les soumissions de thèmes des étudiants.</p>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1E293B]">Tous les thèmes</h3>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg w-72">
              <Search className="w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Rechercher un thème..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="ANALYSE">En analyse</option>
              <option value="ACCEPTE">Accepté</option>
              <option value="REFUSE">Refusé</option>
              <option value="A_REFORMULER">À reformuler</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Étudiant</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Intitulé</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Session</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Date soumission</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Taux similarité</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Statut</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm text-[#64748B]">
                    Chargement...
                  </td>
                </tr>
              ) : filteredThemes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm text-[#64748B]">
                    Aucun thème trouvé
                  </td>
                </tr>
              ) : (
                filteredThemes.map((t: any) => {
                  const statutBadge = getStatutBadge(t.statut);
                  const taux = t.taux_similarite || 0;
                  return (
                    <tr key={t.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="py-4 px-6 text-sm text-[#1E293B]">{t.etudiant_nom || "Étudiant inconnu"}</td>
                      <td className="py-4 px-6 text-sm text-[#1E293B] max-w-[300px] truncate">{t.intitule || ""}</td>
                      <td className="py-4 px-6 text-sm text-[#64748B]">S3 2024-2025</td>
                      <td className="py-4 px-6 text-sm text-[#64748B]">{formatDate(t.date_soumission)}</td>
                      <td className="py-4 px-6 text-sm text-[#1E293B]">{taux > 0 ? `${taux.toFixed(1)}%` : "—"}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statutBadge.className}`}>
                          {statutBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Link to={`/chef/themes/${t.id}`}>
                          <Button className="bg-[#1A3A5C] hover:bg-[#0D1F33] text-white text-xs px-4 py-2 rounded-lg">
                            <Eye className="w-4 h-4 mr-2" />
                            Examiner
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

        {/* Pagination */}
        <div className="p-5 border-t border-[#E2E8F0] flex items-center justify-between">
          <div className="text-sm text-[#64748B]">
            Affichage de 1 à {filteredThemes.length} sur {filteredThemes.length} éléments
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-[#1A3A5C] text-white flex items-center justify-center">1</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">2</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">3</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
