// src/store/membershipStore.ts
import { create } from "zustand";
import MembershipService, {
  MembershipDTO,
  CreateMembershipRequest,
  UpdateMembershipRequest,
} from "../services/MembershipService";

interface MembershipType {
  id: number;
  name: string;
  durationInDays: number;
  price: number;
}

interface MembershipState {
  memberships: MembershipDTO[];
  membershipTypes: MembershipType[];
  isLoading: boolean;
  error: string | null;
  selectedMembership: MembershipDTO | null;

  fetchMemberships: () => Promise<void>;
  fetchMembershipTypes: () => Promise<void>;
  getMembershipById: (id: number) => Promise<void>;
  createMembership: (
    membershipData: CreateMembershipRequest
  ) => Promise<boolean>;
  updateMembership: (
    id: number,
    membershipData: UpdateMembershipRequest
  ) => Promise<boolean>;
  deleteMembership: (id: number) => Promise<boolean>;
  setSelectedMembership: (membership: MembershipDTO | null) => void;
  clearError: () => void;
}

const useMembershipStore = create<MembershipState>((set, get) => ({
  memberships: [],
  membershipTypes: [],
  isLoading: false,
  error: null,
  selectedMembership: null,

  fetchMemberships: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await MembershipService.getAllMemberships();
      set({ memberships: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching memberships:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch memberships",
        isLoading: false,
      });
    }
  },

  fetchMembershipTypes: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await MembershipService.getMembershipTypes();
      set({ membershipTypes: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching membership types:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch membership types",
        isLoading: false,
      });
    }
  },

  getMembershipById: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await MembershipService.getMembershipById(id);
      set({ selectedMembership: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching membership:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch membership",
        isLoading: false,
      });
    }
  },

  createMembership: async (membershipData: CreateMembershipRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await MembershipService.createMembership(membershipData);
      set((state) => ({
        memberships: [...state.memberships, response.data],
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error("Error creating membership:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create membership",
        isLoading: false,
      });
      return false;
    }
  },

  updateMembership: async (
    id: number,
    membershipData: UpdateMembershipRequest
  ) => {
    set({ isLoading: true, error: null });

    try {
      await MembershipService.updateMembership(id, membershipData);

      // Since API doesn't return updated object, fetch it again to get updated values
      const response = await MembershipService.getMembershipById(id);

      set((state) => ({
        memberships: state.memberships.map((membership) =>
          membership.membershipId === id ? response.data : membership
        ),
        selectedMembership:
          state.selectedMembership?.membershipId === id
            ? response.data
            : state.selectedMembership,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error("Error updating membership:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update membership",
        isLoading: false,
      });
      return false;
    }
  },

  deleteMembership: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      await MembershipService.deleteMembership(id);
      set((state) => ({
        memberships: state.memberships.filter(
          (membership) => membership.membershipId !== id
        ),
        selectedMembership:
          state.selectedMembership?.membershipId === id
            ? null
            : state.selectedMembership,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error("Error deleting membership:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete membership",
        isLoading: false,
      });
      return false;
    }
  },

  setSelectedMembership: (membership: MembershipDTO | null) =>
    set({ selectedMembership: membership }),

  clearError: () => set({ error: null }),
}));

export default useMembershipStore;
