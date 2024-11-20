// src/store/authStore.ts
import { create } from "zustand";
import { extractRolesFromToken } from "../utils/authHelpers";

interface AuthState {
  isAuthenticated: boolean;
  userRoles: string[];
  token: string | null;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUserRoles: (roles: string[]) => void;
  setToken: (token: string | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRoles: [],
  token: null,
  setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setUserRoles: (roles: string[]) => set({ userRoles: roles }),
  setToken: (token: string | null) => {
    set({ token });
    if (token) {
      const roles = extractRolesFromToken(token);
      set({ isAuthenticated: true, userRoles: roles });
    } else {
      set({ isAuthenticated: false, userRoles: [] });
    }
  },
}));

export default useAuthStore;
