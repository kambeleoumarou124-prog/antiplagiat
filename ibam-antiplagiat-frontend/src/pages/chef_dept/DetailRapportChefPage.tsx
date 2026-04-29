import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rapportsApi } from "@/api/rapports.api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ArrowLeft, Download, FileText, ExternalLink, AlertTriangle, 
  Info, Check, Link as LinkIcon, ChevronLeft, ChevronRight, Play
} from "lucide-react";

export default function DetailRapportChefPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("document");
  const [decision, setDecision] = useState("");
  const [commentaire, setCommentaire] = useState("");

  const { data: rapport, isLoading } = useQuery({
    queryKey: ["rapport_detail", id],
    queryFn: async () => {
      const res = await rapportsApi.detail(Number(id));
      return res.data;
    },
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: ({ decision, commentaire }: { decision: "VALIDE" | "REFUSE" | "CORRECTIONS", commentaire: string }) => 
      (rapportsApi as any).attribuerDecision(Number(id), { decision, commentaire }),
    onSuccess: () => {
      toast.success("Décision enregistrée avec succès");
      queryClient.invalidateQueries({ queryKey: ["rapport_detail", id] });
      queryClient.invalidateQueries({ queryKey: ["rapports_to_analyze"] });
      navigate("/chef/rapports-a-analyser");
    },
  });

  const downloadMutation = useMutation({
    mutationFn: () => rapportsApi.telechargerFichier(Number(id)),
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Téléchargement réussi");
    },
    onError: () => {
      toast.error("Erreur lors du téléchargement");
    },
  });

  const analyseMutation = useMutation({
    mutationFn: () => rapportsApi.lancerAnalyse(Number(id)),
    onSuccess: (data) => {
      toast.success("Analyse lancée avec succès");
      queryClient.invalidateQueries({ queryKey: ["rapport_detail", id] });
      if (data.data.task_id) {
        navigate(`/chef/analyses/${data.data.task_id}`);
      }
    },
    onError: () => {
      toast.error("Erreur lors du lancement de l'analyse");
    },
  });

  const handleSubmit = () => {
    if (!decision) {
      toast.error("Veuillez sélectionner une décision");
      return;
    }
    if (commentaire.length < 50) {
      toast.error("Le commentaire doit contenir au moins 50 caractères");
      return;
    }
    mutation.mutate({ decision: decision as any, commentaire });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#64748B]">Chargement...</div>
      </div>
    );
  }

  if (!rapport) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#64748B]">Rapport non trouvé</div>
      </div>
    );
  }

  const taux = (rapport as any).taux_similarite || 0;
  const isCritique = taux >= 50;

  return (
    <div>
      {/* Back Button */}
      <Link to="/chef/rapports-a-analyser">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux rapports
        </Button>
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#1A3A5C]">Détails du rapport</h1>
      </div>

      {/* Critical Alert */}
      {isCritique && (
        <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-red-900">⚠ ALERTE CRITIQUE</strong>
            <p className="text-sm text-red-800 mt-1">Taux de similarité supérieur à 50% — Une décision de refus ou corrections est fortement recommandée.</p>
          </div>
        </div>
      )}

      {/* Detail Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-serif font-bold text-[#1A3A5C] mb-4">{rapport.titre || "Pas de titre"}</h2>
        <div className="flex flex-wrap gap-6 text-sm text-[#64748B]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{rapport.etudiant_nom || "Étudiant inconnu"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Soumis le {formatDate((rapport as any).date_depot)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>S3 2024-2025</span>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100/80 text-slate-700">
            Soumis
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F8FAFC] p-1 rounded-lg mb-6">
        <button 
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "document" ? "bg-white text-[#1A3A5C] shadow-sm" : "text-[#64748B] hover:text-[#1E293B]"}`}
          onClick={() => setActiveTab("document")}
        >
          Document
        </button>
        <button 
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "analyse" ? "bg-white text-[#1A3A5C] shadow-sm" : "text-[#64748B] hover:text-[#1E293B]"}`}
          onClick={() => setActiveTab("analyse")}
        >
          Analyse
        </button>
        <button 
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "historique" ? "bg-white text-[#1A3A5C] shadow-sm" : "text-[#64748B] hover:text-[#1E293B]"}`}
          onClick={() => setActiveTab("historique")}
        >
          Historique
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mb-6">
        {/* Document Column */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#1E293B]">Document du rapport</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => downloadMutation.mutate()}
              disabled={downloadMutation.isPending}
            >
              <Download className="w-4 h-4 mr-2" />
              {downloadMutation.isPending ? "Téléchargement..." : "Télécharger"}
            </Button>
          </div>
          <div className="bg-[#F8FAFC] p-12 text-center rounded-lg">
            <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
            <p className="text-[#64748B] mb-4">Visionneuse PDF intégrée</p>
            <Button className="bg-[#1A3A5C] hover:bg-[#0D1F33] text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ouvrir dans un nouvel onglet
            </Button>
          </div>
        </div>

        {/* Analysis Gauge Column */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#1E293B] mb-6">Résultat d'analyse</h3>
          
          <div className="flex flex-col items-center p-6">
            <div className="relative w-48 h-48 mb-4">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#E2E8F0" strokeWidth="20" />
                <circle 
                  cx="100" cy="100" r="80" 
                  fill="none" 
                  strokeWidth="20" 
                  strokeLinecap="round"
                  stroke={isCritique ? "#7F1D1D" : taux >= 31 ? "#EF4444" : taux >= 16 ? "#F97316" : "#22C55E"}
                  strokeDasharray="502"
                  strokeDashoffset={502 - (502 * taux / 100)}
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-[#1E293B]">{taux.toFixed(1)}%</div>
                <div className="text-sm text-[#64748B]">Similarité</div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold ${
              isCritique ? "bg-red-100/80 text-red-800" : 
              taux >= 31 ? "bg-red-100/80 text-red-800" : 
              taux >= 16 ? "bg-orange-100/80 text-orange-800" : 
              "bg-green-100/80 text-green-800"
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              {isCritique ? "Critique — >50%" : taux >= 31 ? "Fort" : taux >= 16 ? "Modéré" : "Original"}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button 
              className="w-full bg-[#1A3A5C] hover:bg-[#0D1F33] text-white"
              onClick={() => analyseMutation.mutate()}
              disabled={analyseMutation.isPending}
            >
              <Play className="w-4 h-4 mr-2" />
              {analyseMutation.isPending ? "Lancement en cours..." : "Relancer l'analyse"}
            </Button>
            <Button className="w-full bg-[#1A3A5C] hover:bg-[#0D1F33] text-white">
              <Download className="w-4 h-4 mr-2" />
              Télécharger rapport d'analyse (PDF)
            </Button>
          </div>
        </div>
      </div>

      {/* Passages Similaires */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#1E293B]">Passages similaires détectés</h3>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        </div>

        {/* Mock Passages */}
        <div className="space-y-4">
          <div className="p-4 border border-[#E2E8F0] rounded-lg">
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wider text-[#64748B] font-semibold mb-1">Passage de votre document</div>
              <div className="text-sm text-[#1E293B] leading-relaxed">La gestion des risques financiers constitue un enjeu majeur pour les PME burkinabè qui font face à de multiples contraintes...</div>
            </div>
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wider text-[#64748B] font-semibold mb-1">Source détectée</div>
              <div className="flex items-center gap-2 text-sm text-[#1A3A5C]">
                <LinkIcon className="w-3.5 h-3.5" />
                Mémoire de master - Université Ouaga I
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">0.92</span>
          </div>

          <div className="p-4 border border-[#E2E8F0] rounded-lg">
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wider text-[#64748B] font-semibold mb-1">Passage de votre document</div>
              <div className="text-sm text-[#1E293B] leading-relaxed">Les PME représentent plus de 90% du tissu économique national et contribuent significativement à la création d'emplois...</div>
            </div>
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wider text-[#64748B] font-semibold mb-1">Source détectée</div>
              <div className="flex items-center gap-2 text-sm text-[#1A3A5C]">
                <LinkIcon className="w-3.5 h-3.5" />
                Article scientifique - Revue burkinabè de gestion
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">0.87</span>
          </div>

          <div className="p-4 border border-[#E2E8F0] rounded-lg">
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wider text-[#64748B] font-semibold mb-1">Passage de votre document</div>
              <div className="text-sm text-[#1E293B] leading-relaxed">L'accès au financement reste l'une des principales difficultés rencontrées par les entrepreneurs locaux...</div>
            </div>
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wider text-[#64748B] font-semibold mb-1">Source détectée</div>
              <div className="flex items-center gap-2 text-sm text-[#1A3A5C]">
                <LinkIcon className="w-3.5 h-3.5" />
                Rapport BCEAO 2024
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-800">0.74</span>
          </div>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-[#E2E8F0] flex items-center justify-between mt-6">
          <div className="text-sm text-[#64748B]">
            Affichage de 1 à 3 sur 12 passages
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-[#1A3A5C] text-white flex items-center justify-center">1</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">2</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">3</button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-lg bg-white flex items-center justify-center hover:bg-[#F8FAFC]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sources Détectées */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#1E293B] mb-6">Sources détectées</h3>

        <div className="space-y-4">
          <div className="flex items-center p-4 border-b border-[#E2E8F0]">
            <div className="flex-1">
              <div className="text-sm font-medium text-[#1E293B]">Mémoire de master - Université Ouaga I</div>
              <div className="text-xs text-[#64748B]">https://uoi.bf/archives/memoires/2024/0123</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-[#1E293B]">5 passages</div>
              <div className="text-xs text-[#64748B]">42%</div>
              <div className="w-24 h-1.5 bg-[#E2E8F0] rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-[#1A3A5C] rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center p-4 border-b border-[#E2E8F0]">
            <div className="flex-1">
              <div className="text-sm font-medium text-[#1E293B]">Revue burkinabè de gestion</div>
              <div className="text-xs text-[#64748B]">https://rbg.revue.bf/volume-15</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-[#1E293B]">4 passages</div>
              <div className="text-xs text-[#64748B]">28%</div>
              <div className="w-24 h-1.5 bg-[#E2E8F0] rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-[#1A3A5C] rounded-full" style={{ width: "28%" }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center p-4">
            <div className="flex-1">
              <div className="text-sm font-medium text-[#1E293B]">Rapport BCEAO 2024</div>
              <div className="text-xs text-[#64748B]">https://bceao.int/publications/rapport-2024</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-[#1E293B]">3 passages</div>
              <div className="text-xs text-[#64748B]">18%</div>
              <div className="w-24 h-1.5 bg-[#E2E8F0] rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-[#1A3A5C] rounded-full" style={{ width: "18%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#1E293B] mb-6">Rendre ma décision</h3>
        
        {/* Decision Select */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[#1E293B] mb-2">Décision du Chef de Département</label>
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm"
          >
            <option value="">Sélectionner une décision</option>
            <option value="VALIDE">✓ Valider le rapport</option>
            <option value="REFUSE">✗ Refuser le rapport</option>
            <option value="CORRECTIONS">↺ Demander des corrections</option>
          </select>
        </div>

        {/* Commentaire */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[#1E293B] mb-2">Commentaire</label>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Entrez votre commentaire (minimum 50 caractères)..."
            className="w-full min-32 px-4 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-sm resize-y focus:outline-none focus:border-[#1A3A5C]"
          />
          <div className={`text-xs text-right mt-1 ${commentaire.length >= 50 ? "text-green-600" : "text-[#64748B]"}`}>
            {commentaire.length} / 50 caractères minimum
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 border-l-4 border-l-blue-500 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-blue-900">Information</strong>
            <p className="text-sm text-blue-800 mt-1">Cette décision sera notifiée au Directeur Adjoint pour validation finale.</p>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          className="bg-[#E8A020] hover:bg-[#B87B10] text-[#0D1F33]"
          onClick={handleSubmit}
          disabled={mutation.isPending}
        >
          <Check className="w-4 h-4 mr-2" />
          Soumettre la décision
        </Button>
      </div>
    </div>
  );
}
