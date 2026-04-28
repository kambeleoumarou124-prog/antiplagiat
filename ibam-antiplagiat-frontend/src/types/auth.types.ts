export type Role = "ETUDIANT" | "CHEF_DEPT" | "DIR_ADJOINT" | "ADMIN";

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  actif: boolean;
  eligibilite_rapport: boolean;
  date_creation: string;   // ISO 8601
  date_modification: string;
}

export interface AuthTokens {
  access: string;   // JWT access (8h)
  refresh: string;  // JWT refresh (7j)
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface DashboardStats {
  // Étudiant
  theme_statut?: string;
  rapport_statut?: string;
  eligibilite_rapport?: boolean;
  // Chef
  themes_en_attente?: number;
  rapports_a_analyser?: number;
  // Dir adjoint
  sessions_ouvertes?: number;
  rapports_a_valider?: number;
  // Admin
  total_users?: number;
  total_rapports?: number;
  taux_moyen_plagiat?: number;
}
