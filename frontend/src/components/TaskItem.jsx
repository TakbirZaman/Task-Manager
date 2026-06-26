// frontend/src/components/TaskItem.jsx
// Renders one task as a ledger row. The checkbox is the signature element:
// a hand-drawn checkmark that draws itself in via stroke-dashoffset rather
// than an instant native checkbox tick.

import { useState } from 'react';
import TaskForm from './TaskForm';

const PRIORITY_STYLES = {
  high: 'text-brick border-brick/30 bg-brick/5',
  medium: 'text-amber border-amber/30 bg-amber/5',
  low: 'text-sage border-sage/30 bg-sage/5',
};

function formatDueDate(dueDate) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const today = new Date();
  const isOverdue = date < new Date(today.toDateString()) ;
  const label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return { label, isOverdue };
}

export default function TaskItem({ task, onToggleComplete, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isComplete = task.status === 'completed';
  const due = formatDueDate(task.due_date);

  async function handleUpdate(payload) {
    await onUpdate(task.id, payload);
    setIsEditing(false);
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch {
      setIsDeleting(false);
    }
  }

  if (isEditing) {
    return (
      <li className="border-b border-line bg-paper/60 px-4 py-4">
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            due_date: task.due_date ? task.due_date.slice(0, 10) : '',
          }}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="group flex items-start gap-3 border-b border-line px-4 py-4 transition hover:bg-paper/60">
      <button
        type="button"
        role="checkbox"
        aria-checked={isComplete}
        aria-label={isComplete ? 'Mark task as not complete' : 'Mark task as complete'}
        onClick={() => onToggleComplete(task)}
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-forest/50 text-forest"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
          <path
            d="M4 12.5 L9.5 18 L20 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`check-stroke ${isComplete ? 'is-checked' : ''}`}
          />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${isComplete ? 'text-ink-muted line-through' : 'text-ink'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-sm text-ink-muted">{task.description}</p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${PRIORITY_STYLES[task.priority]}`}>
            {task.priority}
          </span>
          {due && (
            <span className={`font-mono text-[11px] ${due.isOverdue && !isComplete ? 'text-brick' : 'text-ink-muted'}`}>
              {due.isOverdue && !isComplete ? 'overdue · ' : 'due '}
              {due.label}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:text-forest"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:text-brick disabled:opacity-50"
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </li>
  );
}
