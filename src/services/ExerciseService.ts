// src/services/ExerciseService.ts
import apiClient from "./BaseService";

export interface ExerciseDTO {
  exerciseId: number;
  exerciseName: string;
  description?: string;
  muscleGroup?: string;
  difficultyLevel?: string;
}

export interface CreateExerciseRequest {
  exerciseName: string;
  description?: string;
  muscleGroup?: string;
  difficultyLevel?: string;
}

export interface UpdateExerciseRequest {
  exerciseId: number;
  exerciseName: string;
  description?: string;
  muscleGroup?: string;
  difficultyLevel?: string;
}

const ExerciseService = {
  getAllExercises: () => apiClient.get<ExerciseDTO[]>("Exercises"),
  getExerciseById: (id: number) =>
    apiClient.get<ExerciseDTO>(`Exercises/${id}`),
  createExercise: (data: CreateExerciseRequest) =>
    apiClient.post<ExerciseDTO>("Exercises", data),
  updateExercise: (id: number, data: UpdateExerciseRequest) =>
    apiClient.put<void>(`Exercises/${id}`, data),
  deleteExercise: (id: number) => apiClient.delete(`Exercises/${id}`),
};

export default ExerciseService;
