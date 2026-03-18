import { api } from './api';
import { Task, TaskFilters, TasksResponse } from '@/types';

export const taskService = {
  async getTasks(filters: TaskFilters = {}): Promise<TasksResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const { data } = await api.get(`/tasks?${params.toString()}`);
    return data.data;
  },

  async getTask(id: string): Promise<Task> {
    const { data } = await api.get(`/tasks/${id}`);
    return data.data.task;
  },

  async createTask(payload: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
  }): Promise<Task> {
    const { data } = await api.post('/tasks', payload);
    return data.data.task;
  },

  async updateTask(id: string, payload: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string | null;
  }>): Promise<Task> {
    const { data } = await api.patch(`/tasks/${id}`, payload);
    return data.data.task;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggleTask(id: string): Promise<Task> {
    const { data } = await api.patch(`/tasks/${id}/toggle`);
    return data.data.task;
  },
};
