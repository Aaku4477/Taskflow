'use client';

import { useState } from 'react';
import { Calendar, MoreHorizontal, Pencil, Trash2, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { Task } from '@/types';
import { STATUS_CONFIG, PRIORITY_CONFIG, formatDate, formatRelativeTime, isOverdue, cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className={cn(
      'card p-4 group hover:border-white/10 transition-all duration-200 hover:bg-surface-2 animate-slide-up',
      task.status === 'COMPLETED' && 'opacity-70'
    )}>
      <div className="flex items-start justify-between gap-3">
        {/* Left: toggle button + content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Status toggle circle */}
          <button
            onClick={() => onToggle(task)}
            title="Toggle status"
            className={cn(
              'mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-200 hover:scale-110',
              task.status === 'COMPLETED'
                ? 'bg-emerald-500 border-emerald-500'
                : task.status === 'IN_PROGRESS'
                ? 'border-blue-400 bg-blue-400/20'
                : 'border-gray-600 hover:border-gray-400'
            )}
          >
            {task.status === 'COMPLETED' && (
              <svg className="w-full h-full text-white p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className={cn(
              'font-medium text-gray-100 text-sm leading-snug mb-1.5 break-words',
              task.status === 'COMPLETED' && 'line-through text-gray-500'
            )}>
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-gray-500 mb-2.5 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Status badge */}
              <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium', status.bg, status.color)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                {status.label}
              </span>

              {/* Priority badge */}
              <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', priority.bg, priority.color)}>
                {priority.label}
              </span>

              {/* Due date */}
              {task.dueDate && (
                <span className={cn(
                  'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border',
                  overdue
                    ? 'text-red-400 bg-red-400/10 border-red-400/20'
                    : 'text-gray-400 bg-white/5 border-white/10'
                )}>
                  {overdue && <AlertCircle className="w-3 h-3" />}
                  <Calendar className="w-3 h-3" />
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>

            {/* Updated time */}
            <p className="text-[11px] text-gray-600 mt-2">
              Updated {formatRelativeTime(task.updatedAt)}
            </p>
          </div>
        </div>

        {/* Actions menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="btn-ghost opacity-0 group-hover:opacity-100 p-1.5 rounded-lg"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-44 rounded-xl bg-surface-3 border border-white/10 shadow-xl shadow-black/40 py-1 animate-scale-in">
                <button
                  onClick={() => { onToggle(task); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Toggle Status
                </button>
                <button
                  onClick={() => { onEdit(task); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Task
                </button>
                <div className="my-1 border-t border-white/[0.06]" />
                <button
                  onClick={() => { onDelete(task); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Task
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
