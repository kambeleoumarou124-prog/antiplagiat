import axios, { AxiosInstance, AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ erreur: boolean; code: number; detail: string }>) => {
    const original = error.config as any;
    
    // Refresh token
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error("No refresh token");
        
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        useAuthStore.getState().setTokens(data.access, refreshToken);
        original.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // Gestion standard des erreurs pour UX
    const detail = error.response?.data?.detail;
    const code = error.response?.status;
    
    if (code === 403) toast.error("Accès refusé", { description: detail });
    else if (code === 404) toast.error("Ressource introuvable");
    else if (code === 409) toast.warning(detail ?? "Conflit détecté");
    else if (code === 413) toast.error("Fichier trop volumineux");
    else if (code === 500) toast.error("Erreur serveur — Réessayez dans quelques instants");
    
    return Promise.reject(error);
  }
);

export const uploadClient = (onProgress?: (pct: number) => void) =>
  axios.create({
    baseURL: BASE_URL,
    timeout: 120_000,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
