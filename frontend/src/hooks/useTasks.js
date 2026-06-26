// frontend/src/hooks/useTasks.js
// Centralizes task data + filter + sort + stats state so DashboardPage
// stays focused on layout, not API plumbing.

import { useCallback, useEffect, useState } from 'react';
import client from '../api/client';
import { getErrorMessage } from '../api/getErrorMessage';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [sort, setSort] = useState({ sort_by: 'created_at', sort_order: 'desc' });

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      params.sort_by = sort.sort_by;
      params.sort_order = sort.sort_order;

      const res = await client.get('/tasks', { params });
      setTasks(res.data.tasks);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await client.get('/tasks/stats');
      setStats(res.data.stats);
    } catch {
      // stats are supplemental — silence errors
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  async function createTask(payload) {
    await client.post('/tasks', payload);
    await fetchTasks();
    await fetchStats();
  }

  async function updateTask(id, payload) {
    await client.patch(`/tasks/${id}`, payload);
    await fetchTasks();
    await fetchStats();
  }

  async function deleteTask(id) {
    await client.delete(`/tasks/${id}`);
    await fetchTasks();
    await fetchStats();
  }

  async function toggleComplete(task) {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: nextStatus });
  }

  async function exportCSV() {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;

    const res = await client.get('/tasks/export', { params, responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return {
    tasks,
    isLoading,
    error,
    stats,
    filters,
    setFilters,
    sort,
    setSort,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    exportCSV,
    refetch: fetchTasks,
  };
}
