'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Save } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Max 200 characters'),
  description: z.string().max(2000).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface TaskModalProps {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

export default function TaskModal({ open, task, onClose, onSubmit, loading }: TaskModalProps) {
  const isEdit = !!task;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      status: 'PENDING',
      priority: 'MEDIUM',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (task) {
        reset({
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        });
      } else {
        reset({ title: '', description: '', status: 'PENDING', priority: 'MEDIUM', dueDate: '' });
      }
    }
  }, [open, task, reset]);

  if (!open) return null;

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface-1 rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/60 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="label">Task Title *</label>
            <input
              {...register('title')}
              placeholder="What needs to be done?"
              className="input"
              autoFocus
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              {...register('description')}
              placeholder="Add more details (optional)..."
              rows={3}
              className="input resize-none"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input">
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select {...register('priority')} className="input">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="label">Due Date</label>
            <input
              {...register('dueDate')}
              type="date"
              className={cn('input', '[color-scheme:dark]')}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isEdit ? (
                <><Save className="w-4 h-4" /> Save Changes</>
              ) : (
                <><Plus className="w-4 h-4" /> Create Task</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
