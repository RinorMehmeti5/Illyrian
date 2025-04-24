// admin/AdminSchedule/types.ts
export interface ScheduleDTO {
  scheduleId: number;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  formattedStartTime: string;
  formattedEndTime: string;
  formattedDayOfWeek: string;
}

export interface ScheduleFormValues {
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  scheduleId?: number;
}

export interface ScheduleFormProps {
  initialValues: ScheduleFormValues;
  onSubmit: (values: ScheduleFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  isEditing: boolean;
}

export interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
