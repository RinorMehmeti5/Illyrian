// src/services/MembershipService.ts
import apiClient from "./BaseService";

export interface MembershipDTO {
  membershipId: number;
  userId: string;
  userFullName: string;
  membershipTypeId: number;
  membershipTypeName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  price: number;
  formattedPrice: string;
  formattedStartDate: string;
  formattedEndDate: string;
  durationInDays: number;
  formattedDuration: string;
}

export interface CreateMembershipRequest {
  userId: string;
  membershipTypeId: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UpdateMembershipRequest {
  membershipId: number;
  userId: string;
  membershipTypeId: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const MembershipService = {
  getAllMemberships: () => apiClient.get<MembershipDTO[]>("Membership"),

  getMembershipById: (id: number) =>
    apiClient.get<MembershipDTO>(`Membership/${id}`),

  createMembership: (membershipData: CreateMembershipRequest) =>
    apiClient.post<MembershipDTO>("Membership", membershipData),

  updateMembership: (id: number, membershipData: UpdateMembershipRequest) =>
    apiClient.put<void>(`Membership/${id}`, membershipData),

  deleteMembership: (id: number) => apiClient.delete(`Membership/${id}`),

  // Get membership types for dropdown options
  getMembershipTypes: () =>
    apiClient.get<
      { id: number; name: string; durationInDays: number; price: number }[]
    >("MembershipType"),
};

export default MembershipService;
