// frontend/src/components/FilterBar.jsx

export default function FilterBar({ filters, sort, onChange, onSortChange }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChange((prev) => ({ ...prev, [name]: value }));
  }

  function handleSortChange(e) {
    const { name, value } = e.target;
    onSortChange((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface px-4 py-3">
      <input
        type="search"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search tasks…"
        className="min-w-[160px] flex-1 rounded-md border border-line bg-paper px-3 py-1.5 text-sm text-ink placeholder:text-ink-muted/70"
      />

      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="rounded-md border border-line bg-paper px-3 py-1.5 text-sm text-ink"
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        className="rounded-md border border-line bg-paper px-3 py-1.5 text-sm text-ink"
      >
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <span className="hidden h-5 w-px bg-line sm:block" />

      <select
        name="sort_by"
        value={sort.sort_by}
        onChange={handleSortChange}
        className="rounded-md border border-line bg-paper px-3 py-1.5 text-sm text-ink"
      >
        <option value="created_at">Sort by created</option>
        <option value="due_date">Sort by due date</option>
        <option value="priority">Sort by priority</option>
        <option value="title">Sort by title</option>
        <option value="status">Sort by status</option>
      </select>

      <select
        name="sort_order"
        value={sort.sort_order}
        onChange={handleSortChange}
        className="rounded-md border border-line bg-paper px-3 py-1.5 text-sm text-ink"
      >
        <option value="desc">Newest first</option>
        <option value="asc">Oldest first</option>
      </select>
    </div>
  );
}
