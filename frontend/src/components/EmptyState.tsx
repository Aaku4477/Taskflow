import { ClipboardList, Plus } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onNewTask: () => void;
}

export default function EmptyState({ hasFilters, onNewTask }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center mb-5">
        <ClipboardList className="w-8 h-8 text-brand-400" />
      </div>
      {hasFilters ? (
        <>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No tasks match your filters</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No tasks yet</h3>
          <p className="text-gray-500 text-sm max-w-xs mb-6">
            Create your first task to get started with TaskFlow.
          </p>
          <button onClick={onNewTask} className="btn-primary">
            <Plus className="w-4 h-4" />
            Create First Task
          </button>
        </>
      )}
    </div>
  );
}
