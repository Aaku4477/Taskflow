'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';
import { TaskFilters } from '@/types';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priority' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'title', label: 'Title' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const hasActiveFilters = filters.status || filters.priority || filters.search;

  const clearFilters = () => {
    onChange({ ...filters, status: '', priority: '', search: '', page: 1 });
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          className="input pl-9 pr-9"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '', page: 1 })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-gray-500 flex-shrink-0" />

        <select
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value as TaskFilters['status'], page: 1 })}
          className={cn('input w-auto text-sm py-1.5', filters.status && 'border-brand-500/50 text-brand-300')}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={filters.priority || ''}
          onChange={(e) => onChange({ ...filters, priority: e.target.value as TaskFilters['priority'], page: 1 })}
          className={cn('input w-auto text-sm py-1.5', filters.priority && 'border-brand-500/50 text-brand-300')}
        >
          {PRIORITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value, page: 1 })}
          className="input w-auto text-sm py-1.5"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>Sort: {o.label}</option>
          ))}
        </select>

        <button
          onClick={() => onChange({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc', page: 1 })}
          className="btn-secondary py-1.5 px-3 text-sm"
        >
          {filters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="btn-ghost text-xs text-gray-500 hover:text-red-400 flex items-center gap-1">
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
