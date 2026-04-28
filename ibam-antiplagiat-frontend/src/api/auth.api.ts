import { apiClient } from "./client";
import type { LoginPayload, LoginResponse, DashboardStats, User } from "@/types/auth.types";

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>("/auth/login/", payload),

  logout: (refresh: string) =>
    apiClient.post("/auth/logout/", { refresh }),

  refreshToken: (refresh: string) =>
    apiClient.post<{ access: string }>("/auth/token/refresh/", { refresh }),

  getMe: () =>
    apiClient.get<User>("/auth/me/"),

  getDashboard: () =>
    apiClient.get<DashboardStats>("/auth/dashboard/"),

  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password/", { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post("/auth/reset-password/", { token, password }),
};
