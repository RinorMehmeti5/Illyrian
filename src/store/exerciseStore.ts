// src/store/exerciseStore.ts
import { create } from "zustand";
import ExerciseService, {
  ExerciseDTO,
  CreateExerciseRequest,
  UpdateExerciseRequest,
} from "../services/ExerciseService";

interface ExerciseState {
  exercises: ExerciseDTO[];
  isLoading: boolean;
  error: string | null;
  selectedExercise: ExerciseDTO | null;

  fetchExercises: () => Promise<void>;
  getExerciseById: (id: number) => Promise<void>;
  createExercise: (data: CreateExerciseRequest) => Promise<boolean>;
  updateExercise: (id: number, data: UpdateExerciseRequest) => Promise<boolean>;
  deleteExercise: (id: number) => Promise<boolean>;
  setSelectedExercise: (exercise: ExerciseDTO | null) => void;
  clearError: () => void;
}

const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  isLoading: false,
  error: null,
  selectedExercise: null,

  fetchExercises: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ExerciseService.getAllExercises();
      set({ exercises: response.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch exercises",
        isLoading: false,
      });
    }
  },

  getExerciseById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ExerciseService.getExerciseById(id);
      set({ selectedExercise: response.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch exercise",
        isLoading: false,
      });
    }
  },

  createExercise: async (data: CreateExerciseRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ExerciseService.createExercise(data);
      set((state) => ({
        exercises: [...state.exercises, response.data],
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create exercise",
        isLoading: false,
      });
      return false;
    }
  },

  updateExercise: async (id: number, data: UpdateExerciseRequest) => {
    set({ isLoading: true, error: null });
    try {
      await ExerciseService.updateExercise(id, data);
      const response = await ExerciseService.getExerciseById(id);
      set((state) => ({
        exercises: state.exercises.map((ex) =>
          ex.exerciseId === id ? response.data : ex
        ),
        selectedExercise:
          state.selectedExercise?.exerciseId === id
            ? response.data
            : state.selectedExercise,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update exercise",
        isLoading: false,
      });
      return false;
    }
  },

  deleteExercise: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await ExerciseService.deleteExercise(id);
      set((state) => ({
        exercises: state.exercises.filter((ex) => ex.exerciseId !== id),
        selectedExercise:
          state.selectedExercise?.exerciseId === id
            ? null
            : state.selectedExercise,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete exercise",
        isLoading: false,
      });
      return false;
    }
  },

  setSelectedExercise: (exercise: ExerciseDTO | null) =>
    set({ selectedExercise: exercise }),

  clearError: () => set({ error: null }),
}));

export default useExerciseStore;
