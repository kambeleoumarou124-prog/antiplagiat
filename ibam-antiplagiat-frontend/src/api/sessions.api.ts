import { apiClient } from "./client";
import type { SessionAcademique } from "@/types/session.types";

export const sessionsApi = {
  lister: (params?: { type?: string; statut?: string }) =>
    apiClient.get<SessionAcademique[]>("/sessions/", { params }),

  detail: (id: number) =>
    apiClient.get<SessionAcademique>(`/sessions/${id}/`),

  creer: (payload: Partial<SessionAcademique>) =>
    apiClient.post<SessionAcademique>("/sessions/", payload),

  modifier: (id: number, payload: Partial<SessionAcademique>) =>
    apiClient.put<SessionAcademique>(`/sessions/${id}/`, payload),

  supprimer: (id: number) =>
    apiClient.delete(`/sessions/${id}/`),
};
