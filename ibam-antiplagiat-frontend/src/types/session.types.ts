export type SessionType   = "SESSION_THEME" | "SESSION_RAPPORT";
export type SessionStatut = "OUVERTE" | "FERMEE";

export interface SessionAcademique {
  id: number;
  type: SessionType;
  statut: SessionStatut;
  date_ouverture: string;
  date_fermeture: string;
  promotion: string;
  description: string;
  createur: number;
  date_creation: string;
}

export interface OuvrirSessionPayload {
  type: SessionType;
  date_ouverture: string;
  date_fermeture: string;
  promotion: string;
  description?: string;
}

export interface RecapSession {
  session: SessionAcademique;
  total_soumissions: number;
  total_acceptes: number;
  total_refuses: number;
  taux_moyen_plagiat: number;
}
