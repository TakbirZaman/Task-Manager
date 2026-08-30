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
    <div className="min-h-screen bg-void bg-aurora-subtle">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-display text-3xl font-bold text-white">Your Tasks</h1>
          <p className="mt-1 text-sm text-ghost">Manage and track your progress</p>

          {stats && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              <StatCard label="Total" value={stats.total} color="aurora" delay={1} />
              <StatCard label="Pending" value={stats.pending} color="amber" delay={2} />
              <StatCard label="In Progress" value={stats.in_progress} color="cyan" delay={3} />
              <StatCard label="Completed" value={stats.completed} color="emerald" delay={4} />
              {stats.overdue > 0 && (
                <StatCard label="Overdue" value={stats.overdue} color="rose" delay={5} />
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mb-4 animate-fade-in-up delay-3">
          {!isCreating && (
            <>
              <button
                type="button"
                onClick={exportCSV}
                className="rounded-lg border border-mist/50 bg-deep/60 px-4 py-2 text-sm font-medium text-ghost transition-all duration-300 hover:border-aurora/30 hover:text-silver hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="btn-glow rounded-lg bg-aurora-gradient px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-aurora/20"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  New Task
                </span>
              </button>
            </>
          )}
        </div>

        <div className="glass rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-up delay-4">
          {isCreating && (
            <div className="border-b border-aurora/10 px-6 py-5 animate-scale-in">
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

const COLOR_MAP = {
  aurora: {
    bg: 'bg-aurora/10',
    border: 'border-aurora/20',
    text: 'text-aurora-light',
    glow: 'shadow-aurora/10',
  },
  amber: {
    bg: 'bg-amber/10',
    border: 'border-amber/20',
    text: 'text-amber',
    glow: 'shadow-amber/10',
  },
  cyan: {
    bg: 'bg-cyan/10',
    border: 'border-cyan/20',
    text: 'text-cyan',
    glow: 'shadow-cyan/10',
  },
  emerald: {
    bg: 'bg-emerald/10',
    border: 'border-emerald/20',
    text: 'text-emerald',
    glow: 'shadow-emerald/10',
  },
  rose: {
    bg: 'bg-rose/10',
    border: 'border-rose/20',
    text: 'text-rose',
    glow: 'shadow-rose/10',
  },
};

function StatCard({ label, value, color = 'aurora', delay = 0 }) {
  const c = COLOR_MAP[color];
  return (
    <div
      className={`animate-fade-in-up card-glow rounded-xl border ${c.border} ${c.bg} px-4 py-3 transition-all duration-300 hover:shadow-lg ${c.glow}`}
      style={{ animationDelay: `${delay * 0.08}s` }}
    >
      <div className={`font-display text-2xl font-bold ${c.text}`}>{value}</div>
      <div className="text-xs font-medium text-ghost mt-0.5">{label}</div>
    </div>
  );
}
