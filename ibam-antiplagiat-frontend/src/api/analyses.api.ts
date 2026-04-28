import { apiClient } from "./client";
import type { Analyse, AnalyseProgression } from "@/types/analyse.types";

export const analysesApi = {
  detail: (id: number) =>
    apiClient.get<Analyse>(`/analyses/${id}/`),

  downloadPdf: (id: number) =>
    apiClient.get(`/analyses/${id}/pdf/`, { responseType: "blob" }),

  parRapport: (rapportId: number) =>
    apiClient.get<Analyse[]>(`/analyses/rapport/${rapportId}/`),

  progression: (taskId: string) =>
    apiClient.get<AnalyseProgression>(`/analyses/progression/${taskId}/`),
};
