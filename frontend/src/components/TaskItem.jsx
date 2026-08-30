// frontend/src/components/TaskItem.jsx

import { useState } from 'react';
import TaskForm from './TaskForm';

const PRIORITY_STYLES = {
  high: 'text-rose border-rose/30 bg-rose/10 shadow-rose/5',
  medium: 'text-amber border-amber/30 bg-amber/10 shadow-amber/5',
  low: 'text-emerald border-emerald/30 bg-emerald/10 shadow-emerald/5',
};

const PRIORITY_DOT = {
  high: 'bg-rose',
  medium: 'bg-amber',
  low: 'bg-emerald',
};

function formatDueDate(dueDate) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const today = new Date();
  const isOverdue = date < new Date(today.toDateString());
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
      <li className="border-b border-aurora/5 bg-aurora/5 px-6 py-5 animate-scale-in">
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
    <li className="group flex items-start gap-4 border-b border-aurora/5 px-6 py-4 transition-all duration-300 hover:bg-aurora/5 animate-slide-in-right">
      {/* Custom Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={isComplete}
        aria-label={isComplete ? 'Mark task as not complete' : 'Mark task as complete'}
        onClick={() => onToggleComplete(task)}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${
          isComplete
            ? 'border-emerald bg-emerald/20 text-emerald shadow-[0_0_10px_-2px_rgba(16,185,129,0.3)]'
            : 'border-mist/60 text-transparent hover:border-aurora/50 hover:bg-aurora/10'
        }`}
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

      {/* Task Content */}
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium transition-all duration-300 ${
          isComplete ? 'text-ghost line-through' : 'text-snow'
        }`}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-1 text-sm text-ghost/70 leading-relaxed">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider shadow-sm ${PRIORITY_STYLES[task.priority]}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
            {task.priority}
          </span>
          {due && (
            <span className={`inline-flex items-center gap-1 font-mono text-[11px] ${
              due.isOverdue && !isComplete ? 'text-rose font-medium' : 'text-ghost'
            }`}>
              {due.isOverdue && !isComplete ? (
                <>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  overdue · {due.label}
                </>
              ) : (
                <>due {due.label}</>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-1 opacity-0 transition-all duration-300 group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-ghost transition-all duration-200 hover:bg-aurora/10 hover:text-aurora-light"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-ghost transition-all duration-200 hover:bg-rose/10 hover:text-rose disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  );
}
