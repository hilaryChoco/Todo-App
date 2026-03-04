import type { Task } from "../types/task";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);

  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.status}`);
  }

  return res.json();
}