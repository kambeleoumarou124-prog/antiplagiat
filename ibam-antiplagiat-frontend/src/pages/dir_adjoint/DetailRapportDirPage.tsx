import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rapportsApi } from "@/api/rapports.api";
import { toast } from "sonner";
import { ChevronLeft, Check, AlertTriangle, Download, FileText, Calendar, User, Clock } from "lucide-react";

export default function DetailRapportDirPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [decision, setDecision] = useState("");
  const [comment, setComment] = useState("");
  const [showSignButton, setShowSignButton] = useState(false);

  const { data: rapport, isLoading } = useQuery({
    queryKey: ["rapport_detail", id],
    queryFn: async () => {
      const res = await rapportsApi.detail(Number(id));
      return res.data;
    },
    enabled: !!id,
  });

  const handleDecisionChange = (value: string) => {
    setDecision(value);
    setShowSignButton(value === "VALIDE_DEF");
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmitDecision = () => {
    if (!decision) {
      toast.error("Veuillez sélectionner une décision");
      return;
    }
    if (comment.length < 50) {
      toast.error("Le commentaire doit contenir au moins 50 caractères");
      return;
    }
    toast.success("Décision soumise avec succès!");
    // TODO: Call API to submit decision
  };

  const handleSign = () => {
    toast.success("Rapport signé avec succès!");
    // TODO: Open signature modal
  };

  const getTauxColor = (taux: number) => {
    if (taux < 15) return { bg: 'bg-plagiat-vert', text: 'text-plagiat-vert', ring: 'stroke-[#22C55E]' };
    if (taux < 30) return { bg: 'bg-plagiat-orange', text: 'text-plagiat-orange', ring: 'stroke-[#F97316]' };
    if (taux < 50) return { bg: 'bg-plagiat-rouge', text: 'text-plagiat-rouge', ring: 'stroke-[#EF4444]' };
    return { bg: 'bg-plagiat-critique', text: 'text-plagiat-critique', ring: 'stroke-[#7F1D1D]' };
  };

  const getTauxLabel = (taux: number) => {
    if (taux < 15) return "Faible";
    if (taux < 30) return "Modéré";
    if (taux < 50) return "Élevé";
    return "Critique";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const taux = rapport?.taux_similarite_global || 0;
  const tauxColor = getTauxColor(taux);
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (taux / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" size="sm" onClick={() => navigate("/dir-adjoint/rapports")} className="mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Retour aux rapports
      </Button>

      {/* Detail Header */}
      <Card className="border rounded-xl p-5">
        <h2 className="text-lg font-serif font-semibold text-primary-dark mb-3">
          {rapport?.titre || "Titre du rapport"}
        </h2>
        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{rapport?.etudiant_nom || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Session {rapport?.session || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Soumis le {rapport?.date_soumission ? new Date(rapport.date_soumission).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}</span>
          </div>
          <Badge className="bg-purple-100 text-purple-700 border-none text-xs">
            <span className="w-1 h-1 rounded-full bg-purple-500 mr-1"></span>
            Validé par Chef
          </Badge>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="dossier">
        <TabsList className="bg-muted p-1 rounded-lg w-fit">
          <TabsTrigger value="dossier" className="rounded-md px-4 py-2 text-sm">Dossier complet</TabsTrigger>
          <TabsTrigger value="analyse" className="rounded-md px-4 py-2 text-sm">Analyse</TabsTrigger>
          <TabsTrigger value="historique" className="rounded-md px-4 py-2 text-sm">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="dossier" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Document Column */}
            <div className="lg:col-span-2">
              <Card className="border rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-primary-dark">Document du rapport</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger
                  </Button>
                </div>
                <div className="bg-muted p-12 text-center rounded-lg">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <div className="text-sm text-muted-foreground">Visionneuse PDF</div>
                  <Button className="mt-4">Ouvrir dans un nouvel onglet</Button>
                </div>

                {/* Chef Decision */}
                <div className="mt-5">
                  <h4 className="text-sm font-semibold text-primary-dark mb-3">Décision du Chef de Département</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-700">Rapport validé</span>
                    </div>
                    <div className="text-sm text-foreground">
                      "Le rapport présente une analyse cohérente des risques financiers. Le taux de plagiat de {taux}% est acceptable. Je recommande la validation."
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      — Prof. Dabiré · {rapport?.date_decision_chef ? new Date(rapport.date_decision_chef).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Analysis Result Column */}
            <div className="lg:col-span-1">
              <Card className="border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-primary-dark mb-4">Résultat d'analyse</h3>
                
                <div className="flex flex-col items-center">
                  <div className="relative w-[120px] h-[120px]">
                    <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="10"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className={tauxColor.ring}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="text-2xl font-bold text-primary-dark">{taux}%</div>
                      <div className="text-xs text-muted-foreground">Similarité</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge className="bg-purple-100 text-purple-700 border-none text-xs">
                      {getTauxLabel(taux)}
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-5">
                  <Download className="w-4 h-4 mr-1" />
                  Télécharger rapport d'analyse (PDF)
                </Button>
              </Card>
            </div>
          </div>

          {/* Decision Form */}
          <Card className="border rounded-xl p-4 mt-4">
            <h3 className="text-sm font-semibold text-primary-dark mb-4">Prendre une décision finale</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Décision *</Label>
                <Select value={decision} onValueChange={handleDecisionChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Sélectionner une décision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VALIDE_DEF">✓ Valider définitivement le rapport</SelectItem>
                    <SelectItem value="REFUSE_DEF">✗ Refuser le rapport</SelectItem>
                    <SelectItem value="EN_REVISION">↺ Envoyer en révision</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Commentaire</Label>
                <Textarea
                  placeholder="Entrez votre commentaire (minimum 50 caractères)..."
                  value={comment}
                  onChange={handleCommentChange}
                  className="mt-1.5 min-h-[100px]"
                />
                <div className={`text-xs mt-1 ${comment.length >= 50 ? 'text-plagiat-vert' : 'text-muted-foreground'}`}>
                  {comment.length} / 50 caractères minimum
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <strong>Attention</strong> — Après validation définitive, vous pourrez apposer votre signature électronique sur le rapport.
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSubmitDecision}>
                  <Check className="w-4 h-4 mr-1" />
                  Soumettre la décision
                </Button>
                {showSignButton && (
                  <Button variant="default" className="bg-accent hover:bg-accent-dark text-primary-dark" onClick={handleSign}>
                    Signer le rapport
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analyse" className="mt-4">
          <Card className="border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Détails de l'analyse de plagiat...</p>
          </Card>
        </TabsContent>

        <TabsContent value="historique" className="mt-4">
          <Card className="border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Historique des modifications...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
