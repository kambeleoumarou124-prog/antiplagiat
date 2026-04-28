export type NiveauAlerte = "VERT" | "ORANGE" | "ROUGE" | "CRITIQUE";

export interface PassageSimilaire {
  phrase_soumise: string;
  phrase_reference: string;
  source_url: string;
  source_titre: string;
  score: number;          // 0.0 – 1.0
}

export interface SourceAnalyse {
  url: string;
  titre: string;
  nb_passages: number;
  contribution_pct: number;
}

export interface Analyse {
  id: number;
  rapport: number | null;
  theme: number | null;
  lanceur: number;
  type_lanceur: "ETUDIANT" | "CHEF_DEPT" | "DIR_ADJOINT";
  est_officielle: boolean;
  taux_global: number;         // arrondi 1 décimale
  niveau_alerte: NiveauAlerte;
  passages: PassageSimilaire[];
  sources: SourceAnalyse[];
  rapport_pdf_path: string;
  date_analyse: string;
  duree_ms: number;
}

// Auto-analyse (non enregistrée en base)
export interface AutoAnalyseResult {
  taux: number;
  niveau: NiveauAlerte;
  passages: PassageSimilaire[];
  sources: SourceAnalyse[];
}

// Statut polling progression Celery
export interface AnalyseProgression {
  task_id: string;
  statut: "PENDING" | "STARTED" | "SUCCESS" | "FAILURE";
  progression_pct: number;   // 0–100
  message: string;
}
