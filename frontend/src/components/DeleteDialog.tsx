'use client';

import { Trash2, X } from 'lucide-react';
import { Task } from '@/types';

interface DeleteDialogProps {
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteDialog({ task, onConfirm, onCancel, loading }: DeleteDialogProps) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-surface-1 rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/60 p-6 animate-scale-in">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">Delete Task</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="text-gray-200 font-medium">&quot;{task.title}&quot;</span>? This action
              cannot be undone.
            </p>
          </div>
          <button onClick={onCancel} className="btn-ghost p-1 -mt-1 -mr-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger flex-1">
            {loading ? (
              <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
