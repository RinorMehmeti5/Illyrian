// src/views/admin/AdminUsers/types.ts

import { UserDTO, RoleDTO } from "../../../services/AdminUserService";

export interface UserFormValues {
  id?: string;
  email: string;
  password?: string;
  userName?: string;
  personalNumber?: string;
  firstname?: string;
  lastname?: string;
  birthdate?: string;
  address?: string;
  phoneNumber?: string;
  active: boolean;
  roles: string[];
}

export interface UserFormProps {
  initialValues: UserFormValues;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
  roles: RoleDTO[];
  isLoading: boolean;
  isEditing: boolean;
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  onSubmit: (values: ResetPasswordFormValues) => Promise<void>;
  isLoading: boolean;
}
