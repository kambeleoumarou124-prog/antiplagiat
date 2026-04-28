import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setUser:   (user: User) => void;
  setTokens: (access: string, refresh: string) => void;
  logout:    () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setUser: (user) => {
        console.log('Setting user:', user);
        set({ user });
      },

      setTokens: (access, refresh) => {
        console.log('Setting tokens:', { access: access?.substring(0, 20) + '...', refresh: refresh?.substring(0, 20) + '...' });
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
      },

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null,
              isAuthenticated: false }),
    }),
    {
      name: "ibam-auth",
      partialize: (s) => ({
        accessToken:  s.accessToken,
        refreshToken: s.refreshToken,
        user:         s.user,
      }),
    }
  )
);
