import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { rapportsApi } from "@/api/rapports.api";
import { analysesApi } from "@/api/analyses.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JaugePlagiat } from "@/components/analyses/JaugePlagiat";
import { PassagesSimilaires } from "@/components/analyses/PassagesSimilaires";
import { AnalyseEnCours } from "@/components/analyses/AnalyseEnCours";

export default function DetailRapportChefPage() {
  const { id } = useParams();
  const rapportId = Number(id);
  const [activeTab, setActiveTab] = useState("analyse");
  const [taskId, setTaskId] = useState<string | null>(null);

  const { data: rapport, refetch: refetchRapport } = useQuery({
    queryKey: ["rapport", rapportId],
    queryFn: () => rapportsApi.detail(rapportId),
    select: res => res.data,
  });

  const { data: analyses, refetch: refetchAnalyses } = useQuery({
    queryKey: ["analyses", rapportId],
    queryFn: () => analysesApi.parRapport(rapportId),
    select: res => res.data,
    enabled: !!rapportId,
  });

  // Pour cet exemple on simule un appel d'analyse (mock) car on ne gère pas import analysesApi complet
  // L'appel serait : analysesApi.parRapport
  const derniereAnalyse = analyses?.[0];

  const lanceAnalyse = useMutation({
    mutationFn: () => rapportsApi.lancerAnalyse(rapportId),
    onSuccess: (res) => {
      setTaskId(res.data.task_id);
    }
  });

  if (!rapport) return <div className="p-12 text-center text-muted-foreground flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p>Chargement...</p>
    </div>
  </div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-primary tracking-tight">{rapport.titre}</h1>
          <p className="text-muted-foreground">
            Soumis le {new Date(rapport.date_soumission).toLocaleDateString()}
          </p>
        </div>
        <Badge className="text-sm py-1.5 px-4 shadow-sm">{rapport.statut}</Badge>
      </div>

      {rapport.taux_similarite_global && rapport.taux_similarite_global > 50 && (
        <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-600 text-red-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold">ALERTE CRITIQUE</p>
              <p className="text-sm mt-1">Taux de similarité {rapport.taux_similarite_global}% — Refus ou corrections recommandés.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-1 border-b border-border">
        {["document", "analyse", "historique"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 border-b-2 font-medium capitalize transition-colors ${
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "analyse" && (
        <div className="space-y-8">
          {!derniereAnalyse && !taskId && (
            <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-border/50">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary font-serif">Aucune analyse NLP officielle</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">Lancez l'analyse anti-plagiat pour examiner ce document.</p>
              <Button 
                onClick={() => lanceAnalyse.mutate()} 
                disabled={lanceAnalyse.isPending}
                className="bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-primary/30 transition-all duration-200 font-medium"
              >
                {lanceAnalyse.isPending ? "Lancement en cours..." : "Lancer l'analyse"}
              </Button>
            </div>
          )}

          {taskId && (
            <AnalyseEnCours 
              taskId={taskId} 
              onComplete={() => {
                setTaskId(null);
                refetchRapport();
                refetchAnalyses();
              }} 
            />
          )}

          {derniereAnalyse && !taskId && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-border/50 shadow-md flex items-center justify-center p-6">
                  <JaugePlagiat taux={derniereAnalyse.taux_global} niveau={derniereAnalyse.niveau_alerte} />
                </div>
                <div className="lg:col-span-2 bg-white rounded-2xl border border-border/50 shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-6 text-primary font-serif">Informations d'Analyse</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{new Date(derniereAnalyse.date_analyse).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Durée traitement</span>
                      <span className="font-medium">{(derniereAnalyse.duree_ms / 1000).toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Sources identifiées</span>
                      <span className="font-medium">{derniereAnalyse.sources.length}</span>
                    </div>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <Button variant="outline" className="hover:bg-slate-50 hover:border-primary hover:text-primary transition-all">Télécharger rapport d'analyse (PDF)</Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border/50 shadow-md p-6">
                <PassagesSimilaires passages={derniereAnalyse.passages} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
