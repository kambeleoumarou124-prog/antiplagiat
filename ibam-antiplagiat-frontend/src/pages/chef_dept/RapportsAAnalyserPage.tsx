import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { rapportsApi } from "@/api/rapports.api";
import { Button } from "@/components/ui/button";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function RapportsAAnalyserPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [niveauFilter, setNiveauFilter] = useState("all");

  const { data: rapports, isLoading } = useQuery({
    queryKey: ["rapports_to_analyze"],
    queryFn: async () => {
      const res = await rapportsApi.lister();
      const data = (res.data as any);
      const items = Array.isArray(data) ? data : (data?.results || []);
      return items.filter((r: any) => ["SOUMIS", "ANALYSE", "VALIDE"].includes(r.statut));
    },
  });

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      "SOUMIS": { label: "Soumis", className: "bg-slate-100/80 text-slate-700" },
      "ANALYSE": { label: "En analyse", className: "bg-blue-100/80 text-blue-800" },
      "VALIDE": { label: "Décision chef", className: "bg-green-100/80 text-green-800" },
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

  const filteredRapports = rapports?.filter((r: any) => {
    const matchesSearch = r.etudiant_nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.titre?.toLowerCase().includes(searchTerm.toLowerCase());
    const taux = r.taux_similarite || 0;
    let matchesNiveau = true;
    if (niveauFilter === "original") matchesNiveau = taux < 16;
    else if (niveauFilter === "modere") matchesNiveau = taux >= 16 && taux <= 30;
    else if (niveauFilter === "fort") matchesNiveau = taux >= 31 && taux <= 50;
    else if (niveauFilter === "critique") matchesNiveau = taux > 50;
    return matchesSearch && matchesNiveau;
  }) || [];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#1A3A5C]">Rapports à analyser</h1>
        <p className="text-sm text-[#64748B] mt-1">Analysez les rapports soumis par les étudiants.</p>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1E293B]">Tous les rapports</h3>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg w-72">
              <Search className="w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Rechercher un rapport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
            {/* Filter */}
            <select
              value={niveauFilter}
              onChange={(e) => setNiveauFilter(e.target.value)}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm cursor-pointer"
            >
              <option value="all">Tous les niveaux</option>
              <option value="original">Original (0-15%)</option>
              <option value="modere">Modéré (16-30%)</option>
              <option value="fort">Fort (31-50%)</option>
              <option value="critique">Critique (&gt;50%)</option>
            </select>
          </div>
        </div>

        {/* Table */}
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
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Statut</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-sm text-[#64748B]">
                    Chargement...
                  </td>
                </tr>
              ) : filteredRapports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-sm text-[#64748B]">
                    Aucun rapport trouvé
                  </td>
                </tr>
              ) : (
                filteredRapports.map((r: any) => {
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statutBadge.className}`}>
                          {statutBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Link to={`/chef/rapports/${r.id}`}>
                          <Button className="bg-[#1A3A5C] hover:bg-[#0D1F33] text-white text-xs px-4 py-2 rounded-lg">
                            <Eye className="w-4 h-4 mr-2" />
                            Analyser
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
            Affichage de 1 à {filteredRapports.length} sur {filteredRapports.length} éléments
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
