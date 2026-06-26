// frontend/src/pages/DashboardPage.jsx

import { useState } from 'react';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';

export default function DashboardPage() {
  const {
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
  } = useTasks();

  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate(payload) {
    await createTask(payload);
    setIsCreating(false);
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Your tasks</h1>
            {stats && (
              <div className="mt-2 flex flex-wrap gap-3">
                <Stat label="Total" value={stats.total} />
                <Stat label="Pending" value={stats.pending} className="text-amber" />
                <Stat label="In progress" value={stats.in_progress} className="text-forest" />
                <Stat label="Completed" value={stats.completed} className="text-sage" />
                {stats.overdue > 0 && (
                  <Stat label="Overdue" value={stats.overdue} className="text-brick" />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isCreating && (
              <>
                <button
                  type="button"
                  onClick={exportCSV}
                  className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink-muted transition hover:text-ink"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="rounded-md bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-forest-dark"
                >
                  + New task
                </button>
              </>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface shadow-sm">
          {isCreating && (
            <div className="border-b border-line px-4 py-4">
              <TaskForm
                submitLabel="Add task"
                onSubmit={handleCreate}
                onCancel={() => setIsCreating(false)}
              />
            </div>
          )}

          <FilterBar
            filters={filters}
            sort={sort}
            onChange={setFilters}
            onSortChange={setSort}
          />

          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            error={error}
            onToggleComplete={toggleComplete}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, className = '' }) {
  return (
    <span className="flex items-baseline gap-1 text-xs">
      <span className="font-mono font-medium text-ink">{value}</span>
      <span className={`text-ink-muted ${className}`}>{label}</span>
    </span>
  );
}
