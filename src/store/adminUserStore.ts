// src/store/adminUserStore.ts
import { create } from "zustand";
import AdminUserService, {
  UserDTO,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  RoleDTO,
} from "../services/AdminUserService";

interface AdminUserState {
  users: UserDTO[];
  roles: RoleDTO[];
  isLoading: boolean;
  error: string | null;
  selectedUser: UserDTO | null;

  fetchUsers: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<boolean>;
  updateUser: (id: string, userData: UpdateUserRequest) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  resetUserPassword: (
    id: string,
    request: ResetPasswordRequest
  ) => Promise<boolean>;
  setSelectedUser: (user: UserDTO | null) => void;
  clearError: () => void;
}

const useAdminUserStore = create<AdminUserState>((set, get) => ({
  users: [],
  roles: [],
  isLoading: false,
  error: null,
  selectedUser: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await AdminUserService.getAllUsers();
      set({ users: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch users",
        isLoading: false,
      });
    }
  },

  fetchRoles: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await AdminUserService.getRoles();
      set({ roles: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching roles:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch roles",
        isLoading: false,
      });
    }
  },

  getUserById: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await AdminUserService.getUserById(id);
      set({ selectedUser: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch user",
        isLoading: false,
      });
    }
  },

  createUser: async (userData: CreateUserRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await AdminUserService.createUser(userData);
      set((state) => ({
        users: [...state.users, response.data],
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to create user",
        isLoading: false,
      });
      return false;
    }
  },

  updateUser: async (id: string, userData: UpdateUserRequest) => {
    set({ isLoading: true, error: null });

    try {
      await AdminUserService.updateUser(id, userData);

      // Fetch the updated user to get the latest data
      const response = await AdminUserService.getUserById(id);

      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? response.data : user
        ),
        selectedUser:
          state.selectedUser?.id === id ? response.data : state.selectedUser,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to update user",
        isLoading: false,
      });
      return false;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await AdminUserService.deleteUser(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to delete user",
        isLoading: false,
      });
      return false;
    }
  },

  resetUserPassword: async (id: string, request: ResetPasswordRequest) => {
    set({ isLoading: true, error: null });

    try {
      await AdminUserService.resetUserPassword(id, request);
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error("Error resetting password:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to reset password",
        isLoading: false,
      });
      return false;
    }
  },

  setSelectedUser: (user: UserDTO | null) => set({ selectedUser: user }),

  clearError: () => set({ error: null }),
}));

export default useAdminUserStore;
