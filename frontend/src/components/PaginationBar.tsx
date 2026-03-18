'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from '@/types';
import { cn } from '@/lib/utils';

interface PaginationBarProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export default function PaginationBar({ pagination, onPageChange }: PaginationBarProps) {
  const { page, totalPages, total, limit, hasPrev, hasNext } = pagination;

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Generate page numbers
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-sm text-gray-500">
        Showing <span className="text-gray-300">{start}–{end}</span> of{' '}
        <span className="text-gray-300">{total}</span> tasks
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="btn-secondary p-2 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-gray-600 text-sm select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                p === page
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="btn-secondary p-2 disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
