export interface Notification {
  id: number;
  type_notif: string;
  titre: string;
  contenu: string;
  lue: boolean;
  rapport: number | null;
  theme: number | null;
  date_envoi: string;
  email_envoye: boolean;
}

export interface NotificationWSMessage {
  type: string;
  titre: string;
  contenu: string;
  date: string;
}
