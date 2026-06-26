// frontend/src/components/TaskForm.jsx
// Shared by "create a new task" and "edit an existing task" — same fields,
// different initial values and submit behavior.

import { useState } from 'react';

const EMPTY_TASK = {
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
};

export default function TaskForm({ initialValues = EMPTY_TASK, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [values, setValues] = useState({ ...EMPTY_TASK, ...initialValues });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!values.title.trim()) {
      setError('Give the task a title.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim() || null,
        priority: values.priority,
        due_date: values.due_date || null,
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save the task.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-brick">{error}</p>}

      <div>
        <label htmlFor="title" className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="What needs doing?"
          maxLength={200}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70"
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-muted">
          Notes (optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description || ''}
          onChange={handleChange}
          rows={2}
          placeholder="Any extra detail…"
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="priority" className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-muted">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="due_date" className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-muted">
            Due date
          </label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            value={values.due_date || ''}
            onChange={handleChange}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-ink"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-forest px-4 py-1.5 text-sm font-medium text-white transition hover:bg-forest-dark disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
