import { apiClient } from "./client";
import type { Notification } from "@/types/notification.types";

export const notificationsApi = {
  lister: () =>
    apiClient.get<Notification[]>("/notifications/"),

  marquerLue: (id: number) =>
    apiClient.put(`/notifications/${id}/read/`),

  marquerToutesLues: () =>
    apiClient.put("/notifications/read-all/"),

  nombreNonLues: () =>
    apiClient.get<{ unread_count: number }>("/notifications/unread-count/"),
};
