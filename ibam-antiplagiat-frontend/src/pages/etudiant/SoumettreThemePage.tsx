import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { themesApi } from "@/api/themes.api";
import { sessionsApi } from "@/api/sessions.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import type { NiveauAlerte } from "@/types/analyse.types";
import "@/styles/student-theme.css";

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
  const queryClient = useQueryClient();
  const [uploadPct, setUploadPct] = useState(0);
  const [autoAnalyseResult, setAutoAnalyseResult] = useState<any>(null);
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const autoAnalyseMutation = useMutation({
    mutationFn: async (data: { fichier: File; intitule: string }) => {
      setIsAutoAnalyzing(true);
      try {
        const res = await themesApi.autoAnalyse(data.fichier, data.intitule);
        return res.data;
      } finally {
        setIsAutoAnalyzing(false);
      }
    },
    onSuccess: (result) => {
      setAutoAnalyseResult(result);
      toast.success("Auto-analyse terminée");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Erreur lors de l'auto-analyse");
      setIsAutoAnalyzing(false);
    },
  });

  const getNiveauAlerte = (taux: number): NiveauAlerte => {
    if (taux >= 60) return "CRITIQUE";
    if (taux >= 40) return "ROUGE";
    if (taux >= 25) return "ORANGE";
    return "VERT";
  };

  const handleAutoAnalyse = () => {
    const fichier = form.getValues("fichier");
    const intitule = form.getValues("intitule");
    if (!fichier || !fichier[0]) {
      toast.error("Veuillez d'abord sélectionner un fichier");
      return;
    }
    if (!intitule || intitule.length < 50) {
      toast.error("Veuillez d'abord saisir un intitulé valide (au moins 50 caractères)");
      return;
    }
    autoAnalyseMutation.mutate({ fichier: fichier[0], intitule });
  };

  const soumissionMutation = useMutation({
    mutationFn: (data: any) => themesApi.soumettre(data, setUploadPct),
    onSuccess: () => {
      toast.success("Thème soumis avec succès");
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
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
    <div className="student-page">
      <div className="student-page-header">
        <div className="student-page-title">Soumettre un thème</div>
        <div className="student-page-sub">Remplissez le formulaire ci-dessous pour soumettre votre thème de stage</div>
      </div>

      <div className="student-two-col">
        <div className="student-col-card">
          <div className="student-section-title" style={{ marginBottom: '16px' }}>Informations du thème</div>
          
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="student-form-group">
              <label className="student-form-label">Session *</label>
              <select className="student-form-select" disabled={!sessionOuverte}>
                <option value="">Sélectionner une session</option>
                {sessionOuverte && <option value={sessionOuverte.id} selected>Session Thème S3 2024-2025</option>}
              </select>
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Intitulé du thème *</label>
              <textarea 
                className="student-form-textarea"
                placeholder="Décrivez votre thème de stage (50-300 caractères)..."
                maxLength={300}
                {...form.register("intitule")}
              />
              <div className="student-char-counter">
                {intituleVal.length} / 50 caractères minimum
              </div>
              <div className="student-form-hint">Le thème doit être suffisamment détaillé (minimum 50 caractères)</div>
              {form.formState.errors.intitule && (
                <div style={{ fontSize: '11px', color: 'var(--rouge)', marginTop: '4px' }}>
                  {form.formState.errors.intitule.message as string}
                </div>
              )}
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Document *</label>
              <div className="student-file-upload">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...form.register("fichier")}
                  onChange={(e) => {
                    form.register("fichier").onChange(e);
                    setSelectedFile(e.target.files?.[0] || null);
                  }}
                  style={{ display: 'none' }}
                  id="theme-file"
                />
                <label htmlFor="theme-file" style={{ cursor: 'pointer' }}>
                  {selectedFile ? (
                    <>
                      <div className="student-file-upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div className="student-file-upload-text">{selectedFile.name}</div>
                      <div className="student-file-upload-hint">{(selectedFile.size / 1024 / 1024).toFixed(2)} Mo</div>
                    </>
                  ) : (
                    <>
                      <div className="student-file-upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <div className="student-file-upload-text">Glissez votre fichier ici ou cliquez pour parcourir</div>
                      <div className="student-file-upload-hint">PDF ou DOCX · Max 10 Mo</div>
                    </>
                  )}
                </label>
              </div>
              {form.formState.errors.fichier && (
                <div style={{ fontSize: '11px', color: 'var(--rouge)', marginTop: '4px' }}>
                  {form.formState.errors.fichier.message as string}
                </div>
              )}
            </div>

            {uploadPct > 0 && uploadPct < 100 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>
                  <span>Téléchargement en cours...</span>
                  <span>{uploadPct}%</span>
                </div>
                <div style={{ background: 'var(--border)', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadPct}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px', transition: 'all 0.3s' }}></div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                className="student-btn student-btn-outline"
                onClick={handleAutoAnalyse}
                disabled={isAutoAnalyzing || soumissionMutation.isPending}
              >
                {isAutoAnalyzing ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyse en cours...
                  </span>
                ) : (
                  <>
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="4"/><path d="M6 4v2l1.5 1.5"/></svg>
                    Tester avec auto-analyse
                  </>
                )}
              </button>
              <button
                type="submit"
                className="student-btn student-btn-primary"
                disabled={soumissionMutation.isPending || !sessionOuverte}
              >
                {soumissionMutation.isPending ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Soumission en cours...
                  </span>
                ) : (
                  <>
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l3 3 6-6"/></svg>
                    Soumettre le thème
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="student-col-card">
          <div className="student-section-title" style={{ marginBottom: '16px' }}>Aperçu auto-analyse</div>
          {isAutoAnalyzing && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', background: 'var(--bg)', borderRadius: '8px' }}>
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>Auto-analyse en cours...</div>
            </div>
          )}
          {autoAnalyseResult && (
            <>
              <div className="student-progress-ring-container">
                <div className="student-progress-ring">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle className="student-progress-ring-bg" cx="60" cy="60" r="50"/>
                    <circle 
                      className={`student-progress-ring-fill ${autoAnalyseResult.taux_similarite_global > 30 ? 'pr-rouge' : 'pr-vert'}`} 
                      cx="60" cy="60" r="50" 
                      strokeDasharray="314" 
                      strokeDashoffset={314 - (314 * (autoAnalyseResult.taux_similarite_global || 0) / 100)}
                    />
                  </svg>
                  <div className="student-progress-ring-text">
                    <div className="student-pr-value">{autoAnalyseResult.taux_similarite_global || 0}%</div>
                    <div className="student-pr-label">Similarité</div>
                  </div>
                </div>
                <div className="student-progress-legend">
                  <div className="student-legend-item">
                    <div className="student-legend-dot" style={{ background: 'var(--vert)' }}></div>
                    <span className="student-legend-text">Original</span>
                    <span className="student-legend-value">{100 - (autoAnalyseResult.taux_similarite_global || 0)}%</span>
                  </div>
                  <div className="student-legend-item">
                    <div className="student-legend-dot" style={{ background: 'var(--orange)' }}></div>
                    <span className="student-legend-text">Modéré</span>
                    <span className="student-legend-value">~20%</span>
                  </div>
                  <div className="student-legend-item">
                    <div className="student-legend-dot" style={{ background: 'var(--rouge)' }}></div>
                    <span className="student-legend-text">Fort</span>
                    <span className="student-legend-value">~10%</span>
                  </div>
                </div>
              </div>
              <div className={`student-alert ${autoAnalyseResult.taux_similarite_global > 30 ? 'student-alert-warning' : 'student-alert-success'}`} style={{ marginTop: '16px' }}>
                {autoAnalyseResult.taux_similarite_global > 30 ? (
                  <AlertTriangle className="w-4.5 h-4.5" />
                ) : (
                  <CheckCircle className="w-4.5 h-4.5" />
                )}
                <div className="student-alert-text">
                  <strong>{autoAnalyseResult.taux_similarite_global > 30 ? 'Taux de similarité élevé' : 'Taux acceptable'}</strong> — {autoAnalyseResult.taux_similarite_global > 30
                    ? "Nous vous recommandons de revoir les passages similaires avant de soumettre votre document."
                    : "Votre thème présente un taux de similarité acceptable. Vous pouvez soumettre en toute confiance."}
                </div>
              </div>
            </>
          )}
          {!autoAnalyseResult && !isAutoAnalyzing && (
            <div className="student-empty-state">
              <div className="student-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div className="student-empty-title">Aucune analyse</div>
              <div className="student-empty-text">Cliquez sur "Tester avec auto-analyse" pour vérifier votre thème avant soumission</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
