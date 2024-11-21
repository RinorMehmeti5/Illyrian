// src/store/authStore.ts
import { create } from "zustand";
import { extractRolesFromToken } from "../utils/authHelpers";

interface AuthState {
  isAuthenticated: boolean;
  userRoles: string[];
  username: string;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUserRoles: (roles: string[]) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRoles: [],
  username: "",
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setUserRoles: (roles: string[]) => set({ userRoles: roles }),
  setToken: (token: string | null) => {
    if (token) {
      const { roles, username } = extractRolesFromToken(token);
      set({
        isAuthenticated: true,
        userRoles: roles,
        username,
      });
    } else {
      set({ isAuthenticated: false, userRoles: [], username: "" });
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false, userRoles: [], username: "" });
  },
}));

export default useAuthStore;
