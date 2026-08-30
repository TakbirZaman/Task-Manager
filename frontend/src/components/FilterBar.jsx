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

  const inputClass = "input-glow rounded-lg border border-mist/40 bg-deep/80 px-3 py-2 text-sm text-snow placeholder:text-ghost/50 transition-all duration-300 focus:bg-deep focus:border-aurora/50";
  const selectClass = "input-glow rounded-lg border border-mist/40 bg-deep/80 px-3 py-2 text-sm text-snow transition-all duration-300 focus:bg-deep focus:border-aurora/50 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat pr-7";

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-aurora/5 bg-deep/30 px-6 py-4">
      <div className="relative min-w-[180px] flex-1">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ghost/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search tasks..."
          className={`${inputClass} w-full pl-9`}
        />
      </div>

      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className={selectClass}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        className={selectClass}
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <div className="hidden h-6 w-px bg-mist/40 sm:block" />

      <select
        name="sort_by"
        value={sort.sort_by}
        onChange={handleSortChange}
        className={selectClass}
      >
        <option value="created_at">Created</option>
        <option value="due_date">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
        <option value="status">Status</option>
      </select>

      <select
        name="sort_order"
        value={sort.sort_order}
        onChange={handleSortChange}
        className={selectClass}
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  );
}
