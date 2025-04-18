// admin/AdminMembership/types.tsx

import {
  MembershipDTO,
  CreateMembershipRequest,
  UpdateMembershipRequest,
} from "../../../services/MembershipService";

export interface MembershipFormValues {
  userId: string;
  membershipTypeId: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  membershipId?: number;
}

export interface MembershipFormProps {
  initialValues: MembershipFormValues;
  onSubmit: (values: MembershipFormValues) => Promise<void>;
  membershipTypes: Array<{
    membershipTypeID: number;
    name: string;
    description: string;
    durationInDays: number;
    price: number;
    formattedDuration: string;
    formattedPrice: string;
  }>;
  isLoading: boolean;
  isEditing: boolean;
}

export interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
