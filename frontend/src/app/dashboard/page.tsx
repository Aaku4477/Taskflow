'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, RefreshCw } from 'lucide-react';
import { Task, TaskFilters } from '@/types';
import { taskService } from '@/lib/taskService';
import { getApiErrorMessage } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import DeleteDialog from '@/components/DeleteDialog';
import FilterBar from '@/components/FilterBar';
import PaginationBar from '@/components/PaginationBar';
import StatsBar from '@/components/StatsBar';
import EmptyState from '@/components/EmptyState';
import { useAuthStore } from '@/store/authStore';

const DEFAULT_FILTERS: TaskFilters = {
  status: '',
  priority: '',
  search: '',
  page: 1,
  limit: 9,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState({
    total: 0, page: 1, limit: 9, totalPages: 0, hasNext: false, hasPrev: false,
  });
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await taskService.getTasks(filters);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => { fetchTasks(); }, filters.search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [filters.search]); // eslint-disable-line

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (task: Task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  const handleSubmit = async (formData: {
    title: string;
    description?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
  }) => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate || undefined,
      };
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask.id, payload);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        toast.success('Task updated!');
      } else {
        await taskService.createTask(payload);
        toast.success('Task created!');
        await fetchTasks(true);
      }
      closeModal();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      const updated = await taskService.toggleTask(task.id);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      toast.success(`Status → ${updated.status.replace('_', ' ')}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setDeleting(true);
    try {
      await taskService.deleteTask(deletingTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      setPagination((p) => ({ ...p, total: p.total - 1 }));
      toast.success('Task deleted');
      setDeletingTask(null);
      // Refetch if page is now empty
      if (tasks.length === 1 && filters.page! > 1) {
        setFilters((f) => ({ ...f, page: f.page! - 1 }));
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = !!(filters.status || filters.priority || filters.search);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {pagination.total === 0
                ? "You have no tasks. Let's create one!"
                : `You have ${pagination.total} task${pagination.total !== 1 ? 's' : ''} in total`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTasks(true)}
              disabled={refreshing}
              className="btn-secondary"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={openCreate} className="btn-primary">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar tasks={tasks} total={pagination.total} />

        {/* Filters */}
        <div className="card p-4">
          <FilterBar filters={filters} onChange={handleFiltersChange} />
        </div>

        {/* Tasks grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4 h-36 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-3 rounded w-3/4" />
                    <div className="h-3 bg-surface-3 rounded w-1/2" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-5 w-16 bg-surface-3 rounded-full" />
                      <div className="h-5 w-12 bg-surface-3 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onNewTask={openCreate} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={(t) => setDeletingTask(t)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && tasks.length > 0 && (
          <PaginationBar
            pagination={pagination}
            onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          />
        )}
      </main>

      {/* Modals */}
      <TaskModal
        open={modalOpen}
        task={editingTask}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={submitting}
      />
      <DeleteDialog
        task={deletingTask}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
        loading={deleting}
      />
    </div>
  );
}
