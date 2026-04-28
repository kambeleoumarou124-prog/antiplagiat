import { create } from "zustand";
import type { Notification, NotificationWSMessage } from "@/types/notification.types";

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  
  setNotifications: (notifs: Notification[]) => void;
  addNotification: (msg: NotificationWSMessage) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifs) => set({ 
    notifications: notifs,
    unreadCount: notifs.filter(n => !n.lue).length
  }),

  addNotification: (msg) => set((state) => {
    const newNotif: Notification = {
      id: Date.now(), // Temporaire en attendant le refresh API
      type_notif: msg.type,
      titre: msg.titre,
      contenu: msg.contenu,
      date_envoi: msg.date,
      lue: false,
      rapport: null,
      theme: null,
      email_envoye: false
    };
    return {
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1
    };
  }),

  markAsRead: (id) => set((state) => {
    const notifs = state.notifications.map(n => 
      n.id === id ? { ...n, lue: true } : n
    );
    return {
      notifications: notifs,
      unreadCount: notifs.filter(n => !n.lue).length
    };
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, lue: true })),
    unreadCount: 0
  })),
}));
