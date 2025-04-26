// admin/AdminExercises/types.ts
export interface ExerciseFormValues {
  exerciseId?: number;
  exerciseName: string;
  description?: string;
  muscleGroup?: string;
  difficultyLevel?: string;
}

export interface ExerciseFormProps {
  initialValues: ExerciseFormValues;
  onSubmit: (values: ExerciseFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  isEditing: boolean;
}

export interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
