// src/services/AuthService.ts
import apiClient from "./BaseService";

interface LoginResponse {
  token: string;
  userid: string;
  userrole: string;
}

const AuthService = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>("auth/login", { email, password }),

  register: (email: string, password: string) =>
    apiClient.post("auth/register", { email, password }),

  logout: () => apiClient.post("auth/logout"),

  getUsername: () => apiClient.get<{ username: string }>("auth/username"),
};

export default AuthService;
