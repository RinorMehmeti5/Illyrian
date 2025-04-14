// src/services/AdminUserService.ts
import apiClient from "./BaseService";

export interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  username?: string;
  roles?: string[];
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  roles?: string[];
  isActive?: boolean;
}

const AdminUserService = {
  getAllUsers: () => apiClient.get<User[]>("admin/users"),

  getUserById: (id: string) => apiClient.get<User>(`admin/users/${id}`),

  createUser: (userData: CreateUserRequest) =>
    apiClient.post<User>("admin/users", userData),

  updateUser: (id: string, userData: UpdateUserRequest) =>
    apiClient.put<User>(`admin/users/${id}`, userData),

  deleteUser: (id: string) => apiClient.delete(`admin/users/${id}`),

  resetUserPassword: (id: string) =>
    apiClient.post(`admin/users/${id}/reset-password`),
};

export default AdminUserService;
