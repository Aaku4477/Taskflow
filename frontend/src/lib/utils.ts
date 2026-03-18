import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TaskPriority, TaskStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function isOverdue(dueDate: string | null | undefined, status: TaskStatus): boolean {
  if (!dueDate || status === 'COMPLETED') return false;
  return new Date(dueDate) < new Date();
}

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string; dot: string }> = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
    dot: 'bg-amber-400',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
    dot: 'bg-blue-400',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  LOW: { label: 'Low', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
  MEDIUM: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  HIGH: { label: 'High', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
};

export function getApiErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: { error?: string; details?: { message: string }[] } };
    message?: string;
  };

  if (err?.response?.data?.details?.length) {
    return err.response.data.details.map((d) => d.message).join(', ');
  }
  return err?.response?.data?.error || err?.message || 'Something went wrong';
}
