// frontend/src/components/TaskList.jsx

import TaskItem from './TaskItem';

export default function TaskList({ tasks, isLoading, error, onToggleComplete, onUpdate, onDelete }) {
  if (isLoading) {
    return <p className="px-4 py-10 text-center font-mono text-sm text-ink-muted">Loading tasks…</p>;
  }

  if (error) {
    return <p className="px-4 py-10 text-center text-sm text-brick">{error}</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="px-4 py-14 text-center">
        <p className="font-display text-lg text-ink">Nothing here yet.</p>
        <p className="mt-1 text-sm text-ink-muted">Add a task above to start your list.</p>
      </div>
    );
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
