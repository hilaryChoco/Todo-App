import type { Task } from "../types/task";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);

  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.status}`);
  }

  return res.json();
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });

  if (!res.ok) {
    throw new Error(`Failed to create task: ${res.status}`);
  }

  return res.json();
}

export async function updateTask(
  id: number,
  updates: Partial<Task>
): Promise<Task> {

  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  });

  if (!res.ok) {
    throw new Error(`Failed to update task: ${res.status}`);
  }

  const data = await res.json();

  return {
    ...data,
    startDate: data.start_date,
    startTime: data.start_time,
    endDate: data.end_date,
    endTime: data.end_time
  };
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error(`Failed to delete task: ${res.status}`);
  }
}