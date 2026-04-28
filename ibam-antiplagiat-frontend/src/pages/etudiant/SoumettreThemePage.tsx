import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { themesApi } from "@/api/themes.api";
import { sessionsApi } from "@/api/sessions.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { JaugePlagiat } from "@/components/analyses/JaugePlagiat";
import { AnalyseEnCours } from "@/components/analyses/AnalyseEnCours";

const ACCEPTED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const themeSchema = z.object({
  intitule: z.string()
    .min(50, "L'intitulé doit contenir au moins 50 caractères")
    .max(300, "L'intitulé ne peut pas dépasser 300 caractères"),
  fichier: z.any()
    .refine((files) => files?.length > 0, "Fichier requis")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, "Taille max: 10 Mo")
    .refine((files) => ACCEPTED_MIME.includes(files?.[0]?.type), "Format non supporté (PDF/DOCX)"),
});

export default function SoumettreThemePage() {
  const navigate = useNavigate();
  const [uploadPct, setUploadPct] = useState(0);
  const [autoAnalyseResult, setAutoAnalyseResult] = useState<any>(null);

  // Récupérer la session de thème ouverte
  const { data: sessions } = useQuery({
    queryKey: ["sessions_theme"],
    queryFn: async () => {
      const res = await sessionsApi.lister();
      const data = (res.data as any);
      const items = Array.isArray(data) ? data : (data?.results || []);
      return items.filter((s: any) => s.type === "SESSION_THEME" && s.statut === "OUVERTE");
    },
  });

  const sessionOuverte = sessions && sessions.length > 0 ? sessions[0] : null;

  const form = useForm<z.infer<typeof themeSchema>>({
    resolver: zodResolver(themeSchema),
    defaultValues: { intitule: "" }
  });

  const intituleVal = form.watch("intitule");

  const soumissionMutation = useMutation({
    mutationFn: (data: any) => themesApi.soumettre(data, setUploadPct),
    onSuccess: () => {
      toast.success("Thème soumis avec succès");
      navigate("/etudiant/themes");
    },
    onError: (err: any) => toast.error(err.response?.data?.detail || "Erreur de soumission")
  });

  const onSubmit = (values: z.infer<typeof themeSchema>) => {
    if (!sessionOuverte) {
      toast.error("Aucune session de soumission de thème n'est ouverte");
      return;
    }
    soumissionMutation.mutate({ session: sessionOuverte.id, intitule: values.intitule, fichier: values.fichier[0] });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif text-primary tracking-tight">Soumettre un Thème de Stage</h1>
        <p className="text-muted-foreground">Proposez votre thème de stage pour validation par le chef de département.</p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border border-border/50 shadow-md">
        <div className="space-y-3">
          <label className="font-semibold text-sm text-foreground">Intitulé du thème</label>
          <Textarea 
            placeholder="Ex: Mise en place d'une plateforme d'intelligence artificielle pour..."
            className="border-slate-300 focus:border-primary focus:ring-primary/20 transition-all resize-none"
            {...form.register("intitule")}
            rows={5}
          />
          <div className="flex justify-between text-xs">
            <span className="text-red-600 flex items-center gap-1">{form.formState.errors.intitule?.message as string}</span>
            <span className={intituleVal.length < 50 || intituleVal.length > 300 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
              {intituleVal.length} / 300 caractères
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="font-semibold text-sm text-foreground">Document annexe (TDR / Protocole)</label>
          <Input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            className="border-slate-300 focus:border-primary focus:ring-primary/20 transition-all"
            {...form.register("fichier")} 
          />
          <p className="text-red-600 text-xs flex items-center gap-1">{form.formState.errors.fichier?.message as string}</p>
          <p className="text-muted-foreground text-xs">Formats acceptés : PDF, DOCX (Max 10 Mo)</p>
        </div>

        {uploadPct > 0 && uploadPct < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Téléchargement en cours...</span>
              <span>{uploadPct}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${uploadPct}%` }}></div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-6 border-t border-border/50">
          <Button 
            type="submit" 
            disabled={soumissionMutation.isPending} 
            className="bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-primary/30 transition-all duration-200 px-8 py-6 rounded-xl font-medium"
          >
            {soumissionMutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Soumission en cours...
              </span>
            ) : "Soumettre officiellement"}
          </Button>
        </div>
      </form>
    </div>
  );
}
