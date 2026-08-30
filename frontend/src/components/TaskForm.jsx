// frontend/src/components/TaskForm.jsx

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

  const inputClass = "w-full rounded-lg border border-mist/40 bg-deep/80 px-4 py-2.5 text-sm text-snow placeholder:text-ghost/50 transition-all duration-300 input-glow";
  const selectClass = "w-full rounded-lg border border-mist/40 bg-deep/80 px-4 py-2.5 text-sm text-snow transition-all duration-300 input-glow appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ghost";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose/20 bg-rose/10 px-3 py-2 text-sm text-rose animate-scale-in">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="animate-fade-in-up delay-1">
        <label htmlFor="title" className={labelClass}>Title</label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="What needs doing?"
          maxLength={200}
          className={inputClass}
          autoFocus
        />
      </div>

      <div className="animate-fade-in-up delay-2">
        <label htmlFor="description" className={labelClass}>Notes (optional)</label>
        <textarea
          id="description"
          name="description"
          value={values.description || ''}
          onChange={handleChange}
          rows={2}
          placeholder="Any extra detail..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex gap-4 animate-fade-in-up delay-3">
        <div className="flex-1">
          <label htmlFor="priority" className={labelClass}>Priority</label>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="due_date" className={labelClass}>Due Date</label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            value={values.due_date || ''}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 animate-fade-in-up delay-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-ghost transition-all duration-200 hover:bg-mist/20 hover:text-silver"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-glow rounded-lg bg-aurora-gradient px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-aurora/20 disabled:opacity-60 disabled:shadow-none"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
}
