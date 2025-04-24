// src/services/ScheduleService.ts
import apiClient from "./BaseService";

export interface ScheduleDTO {
  scheduleId: number;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  formattedStartTime: string;
  formattedEndTime: string;
  formattedDayOfWeek: string;
}

export interface CreateScheduleRequest {
  startTime: string; // Format: "HH:MM" (24-hour format)
  endTime: string; // Format: "HH:MM" (24-hour format)
  dayOfWeek: string;
}

export interface UpdateScheduleRequest {
  scheduleId: number;
  startTime: string; // Format: "HH:MM" (24-hour format)
  endTime: string; // Format: "HH:MM" (24-hour format)
  dayOfWeek: string;
}

const ScheduleService = {
  getAllSchedules: () => apiClient.get<ScheduleDTO[]>("Schedule"),

  getScheduleById: (id: number) => apiClient.get<ScheduleDTO>(`Schedule/${id}`),

  createSchedule: (scheduleData: CreateScheduleRequest) =>
    apiClient.post<ScheduleDTO>("Schedule", scheduleData),

  updateSchedule: (id: number, scheduleData: UpdateScheduleRequest) =>
    apiClient.put<void>(`Schedule/${id}`, scheduleData),

  deleteSchedule: (id: number) => apiClient.delete(`Schedule/${id}`),
};

export default ScheduleService;
