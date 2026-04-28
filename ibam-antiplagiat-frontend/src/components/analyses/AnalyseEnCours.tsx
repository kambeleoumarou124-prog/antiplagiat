import { useState, useEffect } from "react";
import { analysesApi } from "@/api/analyses.api";
import { Progress } from "@/components/ui/progress"; // Si on veut l'ajouter plus tard, sinon div native
import type { AnalyseProgression, Analyse, AutoAnalyseResult } from "@/types/analyse.types";
import { Loader2 } from "lucide-react";

interface AnalyseEnCoursProps {
  taskId: string;
  onComplete: () => void;
}

export function AnalyseEnCours({ taskId, onComplete }: AnalyseEnCoursProps) {
  const [progression, setProgression] = useState<AnalyseProgression | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await analysesApi.progression(taskId);
        setProgression(res.data);
        if (res.data.statut === "SUCCESS") {
          clearInterval(interval);
          onComplete();
        } else if (res.data.statut === "FAILURE") {
          clearInterval(interval);
          setError("L'analyse a échoué.");
        }
      } catch (e) {
        // Optionnel: log erreur
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [taskId, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border border-border/50 rounded-2xl shadow-md">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      <h3 className="text-xl font-semibold text-primary font-serif">Analyse NLP en cours...</h3>
      {progression && (
        <div className="w-full max-w-md mt-8 space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{progression.message || "Initialisation..."}</span>
            <span className="font-semibold text-primary">{progression.progression_pct}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary to-primary-light h-3 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${progression.progression_pct}%` }}
            ></div>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
