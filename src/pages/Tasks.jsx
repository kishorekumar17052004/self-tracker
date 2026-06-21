import { useState } from "react";
import { Plus, ClipboardList, CalendarDays } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import TaskCard from "../components/TaskCard";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import AddTaskModal from "../components/AddTaskModal";
import { useToast } from "../components/Toast";
import { ACCENTS, PRIORITY_STYLES } from "../data/accents";
import { defaultTasks, TASK_CATEGORIES, TASK_STATUSES, friendlyDate, todayKey, uid } from "../data/defaultData";

const accentForCategory = (category) => ACCENTS[category.toLowerCase()] || ACCENTS.others;

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

const sortTasks = (list) =>
  [...list].sort((a, b) => {
    if (a.status !== b.status) return a.status === "Completed" ? 1 : -1;
    const aDate = a.dueDate || "9999-12-31";
    const bDate = b.dueDate || "9999-12-31";
    if (aDate !== bDate) return aDate < bDate ? -1 : 1;
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  });

export default function Tasks() {
  const [tasks, setTasks] = useLocalStorage("tasks", defaultTasks);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const toast = useToast();

  const openAddModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const saveTask = (formData) => {
    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...t, ...formData } : t)));
      toast.show(`"${formData.title}" updated`);
    } else {
      setTasks((prev) => [
        { id: uid(), ...formData, createdAt: todayKey() },
        ...prev,
      ]);
      toast.show(`"${formData.title}" added to your tasks`);
    }
    setModalOpen(false);
  };

  const toggleStatus = (task) => {
    const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    toast.show(
      nextStatus === "Completed" ? `Marked "${task.title}" as completed 🎉` : `"${task.title}" moved back to pending`,
      nextStatus === "Completed" ? "success" : "info"
    );
  };

  const deleteTask = (task) => {
    if (!window.confirm(`Delete "${task.title}"? This can't be undone.`)) return;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    toast.show(`"${task.title}" deleted`, "danger");
  };

  const visibleTasks = sortTasks(
    tasks.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (status !== "All" && t.status !== status) return false;
      if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    })
  );

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Tasks</h1>
          <p className="mt-1 text-sm text-ink/55">
            {total === 0 ? "Add your first task to get started." : `${completed} of ${total} tasks completed`}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-card transition hover:bg-brand-dark"
        >
          <Plus size={16} />
          Add task
        </button>
      </header>

      <section className="space-y-3 rounded-xl2 border border-line bg-surface p-4 shadow-card sm:flex sm:items-center sm:justify-between sm:gap-4 sm:space-y-0">
        <SearchBar value={query} onChange={setQuery} placeholder="Search tasks by title..." />
        <FilterBar
          categoryOptions={["All", ...TASK_CATEGORIES]}
          category={category}
          onCategoryChange={setCategory}
          statusOptions={["All", ...TASK_STATUSES]}
          status={status}
          onStatusChange={setStatus}
        />
      </section>

      <section className="space-y-3">
        {visibleTasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-line p-8 text-center">
            <ClipboardList size={28} className="mx-auto text-ink/25" />
            <p className="mt-2 text-sm text-ink/45">
              {total === 0
                ? 'No tasks yet. Click "Add task" above to create your first one.'
                : "No tasks match your search or filters. Try clearing them."}
            </p>
          </div>
        )}
        {visibleTasks.map((task) => {
          const a = accentForCategory(task.category);
          return (
            <TaskCard
              key={task.id}
              title={task.title}
              completed={task.status === "Completed"}
              onToggle={() => toggleStatus(task)}
              onDelete={() => deleteTask(task)}
              onEdit={() => openEditModal(task)}
              accent={task.category.toLowerCase()}
              meta={
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${a.tint} ${a.text}`}>
                    {task.category}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[task.priority]}`}>
                    {task.priority} priority
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium text-ink/55">
                    <CalendarDays size={11} />
                    {friendlyDate(task.dueDate)}
                  </span>
                  <StatusBadge status={task.status} />
                </div>
              }
            />
          );
        })}
      </section>

      {modalOpen && (
        <AddTaskModal onClose={() => setModalOpen(false)} onSave={saveTask} initialTask={editingTask} />
      )}
    </div>
  );
}
