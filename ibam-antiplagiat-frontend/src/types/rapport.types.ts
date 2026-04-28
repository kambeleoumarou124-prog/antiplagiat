export type RapportStatut =
  | "SOUMIS"
  | "ANALYSE_CHEF"
  | "DECISION_CHEF"
  | "VALIDE_DEF"
  | "REFUSE_DEF"
  | "EN_REVISION"
  | "ERREUR_EXTRACTION";

export type DecisionChef    = "VALIDE" | "REFUSE" | "CORRECTIONS";
export type DecisionFinale  = "VALIDE_DEF" | "REFUSE_DEF" | "EN_REVISION";

export interface Signature {
  hash_sha256: string;
  date_signature: string;
  signataire: number;
  fichier_signe_path: string;
  valide: boolean;
}

export interface RapportStage {
  id: number;
  etudiant: number;
  etudiant_nom?: string;
  session: number;
  titre: string;
  fichier_path: string;
  statut: RapportStatut;
  taux_similarite_global: number | null;
  decision_chef: DecisionChef | "";
  commentaire_chef: string;
  decideur_chef: number | null;
  decision_finale: DecisionFinale | "";
  commentaire_final: string;
  decideur_final: number | null;
  date_soumission: string;
  date_decision_chef: string | null;
  date_decision_finale: string | null;
  signature?: Signature;
}

export interface DeposerRapportPayload {
  session: number;
  theme: number;
  titre: string;
  fichier: File;   // PDF ou DOCX, ≤ 50 Mo
}

export interface DecisionChefPayload {
  decision: DecisionChef;
  commentaire: string;   // ≥ 50 caractères
}

export interface DecisionFinalePayload {
  decision: DecisionFinale;
  commentaire: string;   // ≥ 50 caractères
}
