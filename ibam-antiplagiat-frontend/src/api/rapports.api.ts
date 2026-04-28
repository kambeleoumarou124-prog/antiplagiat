import { apiClient, uploadClient } from "./client";
import type {
  RapportStage, DeposerRapportPayload,
  DecisionChefPayload, DecisionFinalePayload
} from "@/types/rapport.types";
import type { AutoAnalyseResult } from "@/types/analyse.types";

export const rapportsApi = {
  lister: (params?: { session?: number; statut?: string }) =>
    apiClient.get<RapportStage[]>("/rapports/", { params }),

  detail: (id: number) =>
    apiClient.get<RapportStage>(`/rapports/${id}/`),

  deposer: (payload: DeposerRapportPayload, onProgress?: (pct: number) => void) => {
    const fd = new FormData();
    fd.append("session", String(payload.session));
    fd.append("theme", String(payload.theme));
    fd.append("titre", payload.titre);
    fd.append("fichier", payload.fichier);
    return uploadClient(onProgress).post<RapportStage>("/rapports/", fd);
  },

  autoAnalyse: (fichier: File, titre: string, onProgress?: (pct: number) => void) => {
    const fd = new FormData();
    fd.append("fichier", fichier);
    fd.append("titre", titre);
    return uploadClient(onProgress).post<AutoAnalyseResult>("/rapports/auto-analyse/", fd);
  },

  lancerAnalyse: (id: number) =>
    apiClient.post<{ task_id: string }>(`/rapports/${id}/analyse/`),

  decisionChef: (id: number, payload: DecisionChefPayload) =>
    apiClient.post<RapportStage>(`/rapports/${id}/decision-chef/`, payload),

  getDossierComplet: (id: number) =>
    apiClient.get<RapportStage>(`/rapports/${id}/dossier/`),

  decisionFinale: (id: number, payload: DecisionFinalePayload) =>
    apiClient.post<RapportStage>(`/rapports/${id}/decision-finale/`, payload),

  signer: (id: number, motDePasse: string) =>
    apiClient.post(`/rapports/${id}/signer/`, { mot_de_passe: motDePasse }),

  downloadSigne: (id: number) =>
    apiClient.get(`/rapports/${id}/download-signe/`, { responseType: "blob" }),
};
