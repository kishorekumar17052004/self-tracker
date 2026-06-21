import { useState } from "react";
import { X } from "lucide-react";
import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES, emptyTask } from "../data/defaultData";

/**
 * Props:
 *  - onClose(): close without saving
 *  - onSave(taskData): called with the form values when the user saves
 *  - initialTask: optional task object to pre-fill (edit mode). Omit for "add" mode.
 *
 * Render this conditionally from the parent (e.g. `{open && <AddTaskModal ... />}`)
 * so each time it opens it mounts fresh with the right initial values.
 */
export default function AddTaskModal({ onClose, onSave, initialTask }) {
  const [form, setForm] = useState(() => (initialTask ? { ...emptyTask, ...initialTask } : emptyTask));
  const [error, setError] = useState("");

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    const title = form.title.trim();
    if (!title) {
      setError("Give your task a title before saving.");
      return;
    }
    onSave({ ...form, title });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md animate-fadeIn rounded-xl2 bg-surface p-6 shadow-pop">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            {initialTask ? "Edit task" : "Add a new task"}
          </h2>
          <button onClick={onClose} className="rounded-md p-1.5 text-ink/40 hover:bg-canvas hover:text-ink" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink/55">Task title</label>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => {
                update({ title: e.target.value });
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="e.g. Revise React hooks"
              className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            {error && <p className="mt-1 text-xs text-track-communication">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/55">Category</label>
              <select
                value={form.category}
                onChange={(e) => update({ category: e.target.value })}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {TASK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/55">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => update({ priority: e.target.value })}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/55">Due date</label>
              <input
                type="date"
                value={form.dueDate || ""}
                onChange={(e) => update({ dueDate: e.target.value })}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/55">Status</label>
              <select
                value={form.status}
                onChange={(e) => update({ status: e.target.value })}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink/60 hover:bg-canvas"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark"
          >
            {initialTask ? "Save changes" : "Add task"}
          </button>
        </div>
      </div>
    </div>
  );
}
