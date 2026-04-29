import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { themesApi } from "@/api/themes.api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ArrowLeft, Download, FileText, ExternalLink, Play, Check, AlertTriangle, Info
} from "lucide-react";

export default function ThemeValidationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("document");
  const [decision, setDecision] = useState("");
  const [commentaire, setCommentaire] = useState("");

  const { data: theme, isLoading } = useQuery({
    queryKey: ["theme_detail", id],
    queryFn: async () => {
      const res = await themesApi.detail(Number(id));
      return res.data;
    },
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: ({ decision, commentaire }: { decision: "ACCEPTE" | "REFUSE" | "A_REFORMULER", commentaire: string }) => 
      themesApi.attribuerDecision(Number(id), { decision, commentaire }),
    onSuccess: () => {
      toast.success("Décision enregistrée avec succès");
      queryClient.invalidateQueries({ queryKey: ["theme_detail", id] });
      queryClient.invalidateQueries({ queryKey: ["themes_to_validate"] });
      navigate("/chef/themes");
    },
  });

  const downloadMutation = useMutation({
    mutationFn: () => themesApi.telechargerFichier(Number(id)),
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `theme_${id}.pdf`);
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
    mutationFn: () => themesApi.lancerAnalyse(Number(id)),
    onSuccess: (data) => {
      toast.success("Analyse lancée avec succès");
      queryClient.invalidateQueries({ queryKey: ["theme_detail", id] });
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

  if (!theme) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#64748B]">Thème non trouvé</div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <Link to="/chef/themes">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux thèmes
        </Button>
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#1A3A5C]">Détails du thème</h1>
      </div>

      {/* Detail Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-serif font-bold text-[#1A3A5C] mb-4">{theme.intitule || "Pas d'intitulé"}</h2>
        <div className="flex flex-wrap gap-6 text-sm text-[#64748B]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{theme.etudiant_nom || "Étudiant inconnu"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Soumis le {formatDate(theme.date_soumission)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>S3 2024-2025</span>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100/80 text-slate-700">
            En attente
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

      {/* Document Tab */}
      {activeTab === "document" && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#1E293B]">Document du thème</h3>
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
            <p className="text-[#64748B] mb-4">Aperçu du document PDF</p>
            <Button className="bg-[#1A3A5C] hover:bg-[#0D1F33] text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ouvrir dans un nouvel onglet
            </Button>
          </div>
        </div>
      )}

      {/* Analyse Tab */}
      {activeTab === "analyse" && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#1E293B] mb-6">Résultat d'analyse</h3>
          <div className="text-center py-12 text-[#64748B]">
            Analyse non disponible pour le moment
          </div>
        </div>
      )}

      {/* Historique Tab */}
      {activeTab === "historique" && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#1E293B] mb-6">Historique des versions</h3>
          <div className="text-center py-12 text-[#64748B]">
            Aucun historique disponible
          </div>
        </div>
      )}

      {/* Decision Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#1E293B] mb-6">Prendre une décision</h3>
        
        {/* Warning Alert */}
        <div className="bg-orange-50 border border-orange-200 border-l-4 border-l-orange-500 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-orange-900">Attention</strong>
            <p className="text-sm text-orange-800 mt-1">Ce thème n'a pas encore été analysé. Vous pouvez lancer une analyse ou rendre votre décision directement.</p>
          </div>
        </div>

        {/* Launch Analysis Button */}
        <div className="mb-6">
          <Button 
            className="bg-[#1A3A5C] hover:bg-[#0D1F33] text-white"
            onClick={() => analyseMutation.mutate()}
            disabled={analyseMutation.isPending}
          >
            <Play className="w-4 h-4 mr-2" />
            {analyseMutation.isPending ? "Lancement en cours..." : "Lancer l'analyse"}
          </Button>
        </div>

        {/* Decision Select */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[#1E293B] mb-2">Décision</label>
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm"
          >
            <option value="">Sélectionner une décision</option>
            <option value="ACCEPTE">✓ Accepter le thème</option>
            <option value="REFUSE">✗ Refuser le thème</option>
            <option value="A_REFORMULER">↺ Demander une reformulation</option>
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
            <p className="text-sm text-blue-800 mt-1">Cette décision sera notifiée à l'étudiant par email et dans l'application.</p>
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
