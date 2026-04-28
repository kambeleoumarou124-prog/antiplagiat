import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import { toast } from "sonner";
import type { NotificationWSMessage } from "@/types/notification.types";

const WS_BASE = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080";

export function useWebSocket() {
  const user   = useAuthStore((s) => s.user);
  const addNotif = useNotificationsStore((s) => s.addNotification);
  const wsRef  = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(`${WS_BASE}/ws/notifications/${user.id}/`);
    wsRef.current = ws;

    ws.onopen    = () => console.info("[WS] Connecté — notifications IBAM");
    ws.onclose   = () => console.info("[WS] Déconnecté");
    ws.onerror   = (e) => console.error("[WS] Erreur", e);

    ws.onmessage = (event) => {
      const msg: NotificationWSMessage = JSON.parse(event.data);
      addNotif(msg);
      
      const isAlerte = msg.type.includes("ALERTE");
      if (isAlerte) {
        toast.error(msg.titre, { description: msg.contenu, duration: 8000 });
      } else {
        toast.info(msg.titre, { description: msg.contenu, duration: 5000 });
      }
    };

    return () => ws.close();
  }, [user?.id, addNotif]);

  return wsRef;
}
