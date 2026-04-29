import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { sessionsApi } from "@/api/sessions.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";

export default function OuvrirSessionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: "" as "SESSION_THEME" | "SESSION_RAPPORT",
    promotion: "",
    date_ouverture: "",
    date_fermeture: "",
    description: "",
  });

  const createMutation = useMutation({
    mutationFn: sessionsApi.creer,
    onSuccess: () => {
      toast.success("Session créée avec succès");
      navigate("/dir-adjoint/sessions");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Erreur lors de la création de la session");
    },
  });

  const handleCreate = () => {
    if (!formData.type || !formData.date_ouverture || !formData.date_fermeture || !formData.promotion) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    createMutation.mutate(formData);
  };

  const getPreviewType = () => {
    if (formData.type === "SESSION_THEME") return "Session Thème";
    if (formData.type === "SESSION_RAPPORT") return "Session Rapport";
    return "Session";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-bold text-primary-dark">Ouvrir une session</h1>
        <p className="text-sm text-muted-foreground">Créez une nouvelle session académique</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <Card className="border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-primary-dark mb-4">Paramètres de la session</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Type de session *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "SESSION_THEME" | "SESSION_RAPPORT") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SESSION_THEME">Session Thème de stage</SelectItem>
                    <SelectItem value="SESSION_RAPPORT">Session Rapport de stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Promotion *</Label>
                <Input
                  placeholder="Sélectionner la promotion"
                  value={formData.promotion}
                  onChange={(e) => setFormData({ ...formData, promotion: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date d'ouverture *</Label>
                  <Input
                    type="date"
                    value={formData.date_ouverture}
                    onChange={(e) => setFormData({ ...formData, date_ouverture: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Date de fermeture *</Label>
                  <Input
                    type="date"
                    value={formData.date_fermeture}
                    onChange={(e) => setFormData({ ...formData, date_fermeture: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description (optionnel)</Label>
                <Textarea
                  placeholder="Informations complémentaires..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1.5 min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  <Check className="w-4 h-4 mr-1" />
                  {createMutation.isPending ? "Création..." : "Créer la session"}
                </Button>
                <Button variant="outline" onClick={() => navigate("/dir-adjoint/sessions")}>
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-1">
          <Card className="border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-primary-dark mb-4">Aperçu</h3>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0 mt-0.5"></div>
                <div className="text-xs text-blue-800">
                  <strong>Prévisualisation</strong><br />
                  Remplissez le formulaire pour voir l'aperçu de la session.
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm font-semibold mb-3">
                {formData.promotion ? `${getPreviewType()} ${formData.promotion}` : "Session"}
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Ouverture:</span>
                  <span className="text-foreground">
                    {formData.date_ouverture ? new Date(formData.date_ouverture).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fermeture:</span>
                  <span className="text-foreground">
                    {formData.date_fermeture ? new Date(formData.date_fermeture).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Statut:</span>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                    Non créée
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
