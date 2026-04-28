import { apiClient, uploadClient } from "./client";
import type { ThemeStage, SoumettreThemePayload, DecisionThemePayload } from "@/types/theme.types";
import type { AutoAnalyseResult } from "@/types/analyse.types";

export const themesApi = {
  lister: (params?: { session?: number; statut?: string }) =>
    apiClient.get<ThemeStage[]>("/themes/", { params }),

  detail: (id: number) =>
    apiClient.get<ThemeStage>(`/themes/${id}/`),

  soumettre: (payload: SoumettreThemePayload, onProgress?: (pct: number) => void) => {
    const fd = new FormData();
    fd.append("session", String(payload.session));
    fd.append("intitule", payload.intitule);
    if (payload.fichier) fd.append("fichier", payload.fichier);
    return uploadClient(onProgress).post<ThemeStage>("/themes/", fd);
  },

  autoAnalyse: (fichier: File, intitule: string, onProgress?: (pct: number) => void) => {
    const fd = new FormData();
    fd.append("fichier", fichier);
    fd.append("intitule", intitule);
    return uploadClient(onProgress).post<AutoAnalyseResult>("/themes/auto-analyse/", fd);
  },

  resubmettre: (id: number, payload: SoumettreThemePayload) => {
    const fd = new FormData();
    fd.append("intitule", payload.intitule);
    if (payload.fichier) fd.append("fichier", payload.fichier);
    return uploadClient().put<ThemeStage>(`/themes/${id}/resubmit/`, fd);
  },

  lancerAnalyse: (id: number) =>
    apiClient.post<{ task_id: string }>(`/themes/${id}/analyse/`),

  attribuerDecision: (id: number, payload: DecisionThemePayload) =>
    apiClient.post<ThemeStage>(`/themes/${id}/decision/`, payload),

  historique: (id: number) =>
    apiClient.get<ThemeStage[]>(`/themes/${id}/history/`),
};
