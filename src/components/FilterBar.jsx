export default function FilterBar({
  categoryOptions,
  category,
  onCategoryChange,
  statusOptions,
  status,
  onStatusChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-ink/50">Category</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-ink/50">Status</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
