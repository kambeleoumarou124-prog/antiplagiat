import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rapportsApi } from "@/api/rapports.api";
import { themesApi } from "@/api/themes.api";
import { sessionsApi } from "@/api/sessions.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FileText, Loader2, AlertTriangle, CheckCircle, UploadCloud } from "lucide-react";
import type { NiveauAlerte } from "@/types/analyse.types";
import "@/styles/student-theme.css";

const rapportSchema = z.object({
  theme_id: z.string().min(1, "Veuillez sélectionner un thème validé"),
  titre: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  fichier: z.any()
    .refine((file) => file?.length === 1, "Le rapport (PDF/DOCX) est obligatoire.")
    .refine((file) => file[0]?.size <= 10 * 1024 * 1024, "La taille max est de 10MB."),
});

type FormValues = z.infer<typeof rapportSchema>;

export default function DeposerRapportPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [autoAnalyseResult, setAutoAnalyseResult] = useState<any>(null);
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(false);

  // Récupérer la session de rapport ouverte
  const { data: sessions } = useQuery({
    queryKey: ["sessions_rapport"],
    queryFn: async () => {
      const res = await sessionsApi.lister();
      const data = (res.data as any);
      const items = Array.isArray(data) ? data : (data?.results || []);
      return items.filter((s: any) => s.type === "SESSION_RAPPORT" && s.statut === "OUVERTE");
    },
  });

  const sessionOuverte = sessions && sessions.length > 0 ? sessions[0] : null;

  // Fetch only accepted themes for this student (mocked for now)
  const { data: themes } = useQuery({
    queryKey: ["my_accepted_themes"],
    queryFn: async () => {
      const res = await themesApi.lister();
      const data = (res.data as any);
      const items = Array.isArray(data) ? data : (data?.results || []);
      return items.filter((t: any) => t.statut === "ACCEPTE");
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(rapportSchema),
    defaultValues: {
      titre: "",
    }
  });

  const titreWatch = watch("titre");

  const autoAnalyseMutation = useMutation({
    mutationFn: async (data: { fichier: File; titre: string }) => {
      setIsAutoAnalyzing(true);
      try {
        const res = await rapportsApi.autoAnalyse(data.fichier, data.titre);
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
    const fichier = selectedFile;
    const titre = titreWatch;
    if (!fichier) {
      toast.error("Veuillez d'abord sélectionner un fichier");
      return;
    }
    if (!titre || titre.length < 5) {
      toast.error("Veuillez d'abord saisir un titre valide (au moins 5 caractères)");
      return;
    }
    autoAnalyseMutation.mutate({ fichier, titre });
  };

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!sessionOuverte) {
        throw new Error("Aucune session de dépôt de rapport n'est ouverte");
      }
      return rapportsApi.deposer({
        session: sessionOuverte.id,
        theme: parseInt(data.theme_id),
        titre: data.titre,
        fichier: data.fichier[0]
      });
    },
    onSuccess: () => {
      toast.success("Rapport déposé avec succès ! L'analyse anti-plagiat a démarré.");
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      navigate("/etudiant/rapports");
    },
    onError: (err: any) => {
      toast.error(err.message || "Erreur lors du dépôt du rapport.");
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="student-page">
      <div className="student-page-header">
        <div className="student-page-title">Déposer un rapport</div>
        <div className="student-page-sub">Soumettez votre rapport de stage pour analyse anti-plagiat</div>
      </div>

      {!sessionOuverte || !themes || themes.length === 0 ? (
        <>
          <div className="student-alert student-alert-warning">
            <AlertTriangle className="w-4.5 h-4.5" />
            <div className="student-alert-text">
              <strong>Prérequis non remplis</strong> — {!sessionOuverte 
                ? "Aucune session de dépôt de rapport n'est ouverte." 
                : "Vous devez d'abord obtenir la validation de votre thème par le Chef de Département avant de pouvoir déposer votre rapport de stage."}
            </div>
          </div>

          <div className="student-col-card" style={{ opacity: 0.6, pointerEvents: 'none' }}>
            <div className="student-section-title" style={{ marginBottom: '16px' }}>Informations du rapport</div>
            
            <div className="student-form-group">
              <label className="student-form-label">Session *</label>
              <select className="student-form-select" disabled>
                <option value="">Sélectionner une session</option>
              </select>
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Titre du rapport *</label>
              <input type="text" className="student-form-input" placeholder="Entrez le titre de votre rapport" disabled />
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Fichier du rapport *</label>
              <div className="student-file-upload" style={{ pointerEvents: 'none' }}>
                <div className="student-file-upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div className="student-file-upload-text">Glissez votre fichier ici ou cliquez pour parcourir</div>
                <div className="student-file-upload-hint">PDF ou DOCX · Max 50 Mo</div>
              </div>
            </div>

            <button className="student-btn student-btn-primary" disabled>Déposer le rapport</button>
          </div>
        </>
      ) : (
        <div className="student-two-col">
          <div className="student-col-card">
            <div className="student-section-title" style={{ marginBottom: '16px' }}>Informations du rapport</div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="student-form-group">
                <label className="student-form-label">Thème de stage validé *</label>
                <select className="student-form-select" {...register("theme_id")}>
                  <option value="">Sélectionnez un thème</option>
                  {themes.map((t: any) => (
                    <option key={t.id} value={t.id.toString()}>{t.intitule}</option>
                  ))}
                </select>
                {errors.theme_id && (
                  <div style={{ fontSize: '11px', color: 'var(--rouge)', marginTop: '4px' }}>
                    {errors.theme_id.message}
                  </div>
                )}
              </div>

              <div className="student-form-group">
                <label className="student-form-label">Titre du rapport *</label>
                <input 
                  type="text" 
                  className="student-form-input" 
                  placeholder="Entrez le titre de votre rapport"
                  {...register("titre")}
                />
                {errors.titre && (
                  <div style={{ fontSize: '11px', color: 'var(--rouge)', marginTop: '4px' }}>
                    {errors.titre.message}
                  </div>
                )}
              </div>

              <div className="student-form-group">
                <label className="student-form-label">Fichier du rapport *</label>
                <div className="student-file-upload">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    {...register("fichier", {
                      onChange: (e) => setSelectedFile(e.target.files[0]),
                    })}
                    style={{ display: 'none' }}
                    id="rapport-file"
                  />
                  <label htmlFor="rapport-file" style={{ cursor: 'pointer' }}>
                    {selectedFile ? (
                      <>
                        <div className="student-file-upload-icon">
                          <FileText className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                        </div>
                        <div className="student-file-upload-text">{selectedFile.name}</div>
                        <div className="student-file-upload-hint">{(selectedFile.size / 1024 / 1024).toFixed(2)} Mo</div>
                      </>
                    ) : (
                      <>
                        <div className="student-file-upload-icon">
                          <UploadCloud className="w-6 h-6" style={{ color: 'var(--muted)' }} />
                        </div>
                        <div className="student-file-upload-text">Glissez votre fichier ici ou cliquez pour parcourir</div>
                        <div className="student-file-upload-hint">PDF ou DOCX · Max 50 Mo</div>
                      </>
                    )}
                  </label>
                </div>
                {errors.fichier && (
                  <div style={{ fontSize: '11px', color: 'var(--rouge)', marginTop: '4px' }}>
                    {errors.fichier.message as string}
                  </div>
                )}
              </div>

              {isAutoAnalyzing && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', background: 'var(--bg)', borderRadius: '8px' }}>
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>Auto-analyse en cours...</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="student-btn student-btn-outline"
                  onClick={handleAutoAnalyse}
                  disabled={isAutoAnalyzing || mutation.isPending}
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
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Dépôt en cours...
                    </span>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      Déposer le rapport
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="student-col-card">
            <div className="student-section-title" style={{ marginBottom: '16px' }}>Résultat d'analyse</div>
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
                      : "Le taux de similarité est acceptable. Vous pouvez procéder à la soumission."}
                  </div>
                </div>
              </>
            )}
            {!autoAnalyseResult && !isAutoAnalyzing && (
              <div className="student-empty-state">
                <div className="student-empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div className="student-empty-title">Prêt pour l'analyse</div>
                <div className="student-empty-text">Téléchargez un fichier et lancez l'analyse pour voir les résultats ici</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
