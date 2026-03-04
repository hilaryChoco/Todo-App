export type Priority = "urgent" | "high" | "medium" | "low";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  important: boolean;
  priority: Priority;
  startDate?: string | null;
  startTime?: string | null;
  endDate?: string | null;
  endTime?: string | null;
  createdAt?: string;
  updatedAt?: string;
}