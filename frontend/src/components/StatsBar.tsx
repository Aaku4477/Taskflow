'use client';

import { CheckCircle2, Clock, Loader2, ListTodo } from 'lucide-react';
import { Task } from '@/types';

interface StatsBarProps {
  tasks: Task[];
  total: number;
}

export default function StatsBar({ tasks, total }: StatsBarProps) {
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const pending = tasks.filter((t) => t.status === 'PENDING').length;

  const stats = [
    { label: 'Total', value: total, icon: ListTodo, color: 'text-gray-400', bg: 'bg-gray-400/10' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'In Progress', value: inProgress, icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="card p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-white leading-none">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
