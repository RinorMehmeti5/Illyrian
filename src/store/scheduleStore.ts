// src/store/scheduleStore.ts
import { create } from "zustand";
import ScheduleService, {
  ScheduleDTO,
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from "../services/ScheduleService";

interface ScheduleState {
  schedules: ScheduleDTO[];
  isLoading: boolean;
  error: string | null;
  selectedSchedule: ScheduleDTO | null;

  fetchSchedules: () => Promise<void>;
  getScheduleById: (id: number) => Promise<void>;
  createSchedule: (scheduleData: CreateScheduleRequest) => Promise<boolean>;
  updateSchedule: (
    id: number,
    scheduleData: UpdateScheduleRequest
  ) => Promise<boolean>;
  deleteSchedule: (id: number) => Promise<boolean>;
  setSelectedSchedule: (schedule: ScheduleDTO | null) => void;
  clearError: () => void;
}

const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: [],
  isLoading: false,
  error: null,
  selectedSchedule: null,

  fetchSchedules: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await ScheduleService.getAllSchedules();
      set({ schedules: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching schedules:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch schedules",
        isLoading: false,
      });
    }
  },

  getScheduleById: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await ScheduleService.getScheduleById(id);
      set({ selectedSchedule: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching schedule:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch schedule",
        isLoading: false,
      });
    }
  },

  createSchedule: async (scheduleData: CreateScheduleRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await ScheduleService.createSchedule(scheduleData);
      set((state) => ({
        schedules: [...state.schedules, response.data],
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error("Error creating schedule:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to create schedule",
        isLoading: false,
      });
      return false;
    }
  },

  updateSchedule: async (id: number, scheduleData: UpdateScheduleRequest) => {
    set({ isLoading: true, error: null });

    try {
      await ScheduleService.updateSchedule(id, scheduleData);

      // Since API doesn't return updated object, fetch it again to get updated values
      const response = await ScheduleService.getScheduleById(id);

      set((state) => ({
        schedules: state.schedules.map((schedule) =>
          schedule.scheduleId === id ? response.data : schedule
        ),
        selectedSchedule:
          state.selectedSchedule?.scheduleId === id
            ? response.data
            : state.selectedSchedule,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error("Error updating schedule:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to update schedule",
        isLoading: false,
      });
      return false;
    }
  },

  deleteSchedule: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      await ScheduleService.deleteSchedule(id);
      set((state) => ({
        schedules: state.schedules.filter(
          (schedule) => schedule.scheduleId !== id
        ),
        selectedSchedule:
          state.selectedSchedule?.scheduleId === id
            ? null
            : state.selectedSchedule,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete schedule",
        isLoading: false,
      });
      return false;
    }
  },

  setSelectedSchedule: (schedule: ScheduleDTO | null) =>
    set({ selectedSchedule: schedule }),

  clearError: () => set({ error: null }),
}));

export default useScheduleStore;
