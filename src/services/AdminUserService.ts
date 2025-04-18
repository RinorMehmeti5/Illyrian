// src/services/AdminUserService.ts

import apiClient from "./BaseService";

export interface UserDTO {
  id: string;
  personalNumber?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  userName?: string;
  phoneNumber?: string;
  address?: string;
  birthdate?: string;
  active?: boolean;
  insertedDate: string;
  formattedBirthdate?: string;
  formattedInsertedDate?: string;
  fullName?: string;
  roles: string[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  userName?: string;
  personalNumber?: string;
  firstname?: string;
  lastname?: string;
  birthdate?: string;
  cityId?: number;
  settlementId?: number;
  address?: string;
  phoneNumber?: string;
  active?: boolean;
  roles?: string[];
}

export interface UpdateUserRequest {
  email?: string;
  userName?: string;
  personalNumber?: string;
  firstname?: string;
  lastname?: string;
  birthdate?: string;
  cityId?: number;
  settlementId?: number;
  address?: string;
  phoneNumber?: string;
  active?: boolean;
  roles?: string[];
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface RoleDTO {
  id: string;
  name?: string;
  nameSq: string;
  nameEn: string;
  description?: string;
}

const AdminUserService = {
  getAllUsers: () => apiClient.get<UserDTO[]>("User"),

  getUserById: (id: string) => apiClient.get<UserDTO>(`User/${id}`),

  createUser: (userData: CreateUserRequest) =>
    apiClient.post<UserDTO>("User", userData),

  updateUser: (id: string, userData: UpdateUserRequest) =>
    apiClient.put<void>(`User/${id}`, userData),

  deleteUser: (id: string) => apiClient.delete(`User/${id}`),

  resetUserPassword: (id: string, request: ResetPasswordRequest) =>
    apiClient.post(`User/${id}/reset-password`, request),

  getRoles: () => apiClient.get<RoleDTO[]>("User/roles"),
};

export default AdminUserService;
