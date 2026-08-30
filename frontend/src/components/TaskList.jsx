// frontend/src/components/TaskList.jsx

import TaskItem from './TaskItem';

export default function TaskList({ tasks, isLoading, error, onToggleComplete, onUpdate, onDelete }) {
  if (isLoading) {
    return (
      <div className="px-6 py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-10 w-10 rounded-full border-2 border-aurora/20 border-t-aurora animate-spin" />
          </div>
          <p className="font-mono text-sm text-ghost animate-pulse">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-12 animate-fade-in-up">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose/10">
            <svg className="h-6 w-6 text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-rose">{error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="px-6 py-16 animate-fade-in-up">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative animate-float">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-aurora/10 border border-aurora/20">
              <svg className="h-10 w-10 text-aurora/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-snow">Nothing here yet</p>
            <p className="mt-1 text-sm text-ghost">Create your first task to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ul>
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-slide-in-right"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <TaskItem
            task={task}
            onToggleComplete={onToggleComplete}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      ))}
    </ul>
  );
}
