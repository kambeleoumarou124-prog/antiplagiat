import { NiveauAlerte } from "@/types/analyse.types";

export type ThemeStatut =
  | "EN_ATTENTE"
  | "ANALYSE"
  | "ACCEPTE"
  | "REFUSE"
  | "A_REFORMULER";

export interface ThemeStage {
  id: number;
  etudiant: number;
  etudiant_nom: string;
  session: number;
  intitule: string;
  fichier_path: string;
  version: number;
  theme_parent: number | null;
  statut: ThemeStatut;
  commentaire_chef: string;
  taux_similarite: number | null;
  niveau_alerte: NiveauAlerte | null;
  date_soumission: string;
  date_decision: string | null;
  decideur: number | null;
}

export interface SoumettreThemePayload {
  session: number;
  intitule: string;         // 50 ≤ len ≤ 300
  fichier?: File;           // PDF ou DOCX, ≤ 10 Mo
}

export interface DecisionThemePayload {
  decision: "ACCEPTE" | "REFUSE" | "A_REFORMULER";
  commentaire: string;      // ≥ 50 caractères
}
