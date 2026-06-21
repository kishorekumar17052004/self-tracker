import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { ACCENTS } from "../data/accents";

/**
 * Generic task/habit/goal row.
 *
 * Props:
 *  - title: task label
 *  - completed: boolean checked state
 *  - onToggle(): fired when the checkbox/circle is clicked
 *  - onDelete(): fired when the delete button is clicked
 *  - onRename(newTitle): optional — enables inline rename via the edit (pencil) action
 *  - onEdit(): optional — alternative to onRename; opens an external editor (e.g. a modal)
 *  - meta: optional ReactNode rendered under the title (badges, streak, etc.)
 *  - accent: ACCENTS key used to color the checkbox + accents
 */
export default function TaskCard({ title, completed, onToggle, onDelete, onRename, onEdit, meta, accent = "consistency" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const a = ACCENTS[accent];

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (trimmed && onRename) onRename(trimmed);
    setEditing(false);
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-card">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={completed}
        aria-label={completed ? "Mark as not done" : "Mark as done"}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition
          ${completed ? `${a.bg} border-transparent text-white` : "border-line text-transparent hover:border-ink/30"}`}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-full rounded-md border border-line bg-canvas px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <button onClick={saveEdit} className="text-brand hover:text-brand-dark" aria-label="Save">
              <Check size={16} />
            </button>
            <button onClick={() => setEditing(false)} className="text-ink/40 hover:text-ink/70" aria-label="Cancel">
              <X size={16} />
            </button>
          </div>
        ) : (
          <p className={`truncate text-sm font-medium ${completed ? "text-ink/40 line-through" : "text-ink"}`}>
            {title}
          </p>
        )}
        {meta ? <div className="mt-1.5">{meta}</div> : null}
      </div>

      {!editing && (
        <div className="flex shrink-0 items-center gap-1">
          {onRename && (
            <button
              onClick={() => {
                setDraft(title);
                setEditing(true);
              }}
              className="rounded-md p-1.5 text-ink/35 hover:bg-canvas hover:text-ink"
              aria-label="Edit"
              title="Edit"
            >
              <Pencil size={15} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-md p-1.5 text-ink/35 hover:bg-canvas hover:text-ink"
              aria-label="Edit task"
              title="Edit task"
            >
              <Pencil size={15} />
            </button>
          )}
          <button onClick={onDelete} className="rounded-md p-1.5 text-ink/35 hover:bg-track-communicationTint hover:text-track-communication" aria-label="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
