import { useState } from "react";
import { Sparkles } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import TaskCard from "../components/TaskCard";
import ProgressBar from "../components/ProgressBar";
import { useToast } from "../components/Toast";
import { defaultOtherGoals, OTHER_CATEGORIES, clampPct, uid } from "../data/defaultData";

export default function Others() {
  const [goals, setGoals] = useLocalStorage("otherGoals", defaultOtherGoals);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(OTHER_CATEGORIES[0]);
  const [filter, setFilter] = useState("All");
  const toast = useToast();

  const addGoal = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setGoals((prev) => [...prev, { id: uid(), category, name: trimmed, completed: false }]);
    setName("");
    toast.show(`"${trimmed}" added to your goals`);
  };

  const toggleGoal = (id, goalName) => {
    let willBeDone = false;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        willBeDone = !g.completed;
        return { ...g, completed: willBeDone };
      })
    );
    toast.show(willBeDone ? `Goal completed: "${goalName}" 🎉` : `"${goalName}" marked as not done`, willBeDone ? "success" : "info");
  };

  const deleteGoal = (id, goalName) => {
    if (!window.confirm(`Remove "${goalName}"?`)) return;
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast.show(`"${goalName}" removed`, "danger");
  };

  const renameGoal = (id, newName) => setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, name: newName } : g)));

  const completed = goals.filter((g) => g.completed).length;
  const overall = goals.length ? clampPct((completed / goals.length) * 100) : 0;

  const visibleGoals = filter === "All" ? goals : goals.filter((g) => g.category === filter);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Other Improvements</h1>
        <p className="mt-1 text-sm text-ink/55">Health, reading, discipline, and the career admin that's easy to put off.</p>
      </header>

      <section className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink/60">{completed} of {goals.length} goals completed</span>
          <span className="font-mono font-semibold text-track-others">{overall}%</span>
        </div>
        <div className="mt-2">
          <ProgressBar value={overall} barClass="bg-track-others" />
        </div>
      </section>

      <section className="space-y-3 rounded-xl2 border border-line bg-surface p-5 shadow-card">
        <h2 className="font-display text-sm font-semibold text-ink">Add a goal</h2>
        <p className="text-xs text-ink/45">Write what you want to do, pick a category, then add it.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGoal()}
            placeholder="e.g. Meditate for 10 minutes"
            className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-track-others/30"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm text-ink/70 focus:outline-none focus:ring-2 focus:ring-track-others/30"
          >
            {OTHER_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={addGoal}
            className="shrink-0 rounded-lg bg-track-others px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Add goal
          </button>
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {["All", ...OTHER_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition
              ${filter === c ? "bg-track-others text-white" : "bg-canvas text-ink/55 hover:text-ink/80"}`}
          >
            {c}
          </button>
        ))}
      </section>

      <section className="space-y-3">
        {visibleGoals.length === 0 && (
          <div className="rounded-xl border border-dashed border-line p-8 text-center">
            <Sparkles size={28} className="mx-auto text-ink/25" />
            <p className="mt-2 text-sm text-ink/45">
              {goals.length === 0 ? "No goals yet. Add your first one above." : "No goals in this category yet."}
            </p>
          </div>
        )}
        {visibleGoals.map((goal) => (
          <TaskCard
            key={goal.id}
            title={goal.name}
            completed={goal.completed}
            onToggle={() => toggleGoal(goal.id, goal.name)}
            onDelete={() => deleteGoal(goal.id, goal.name)}
            onRename={(newName) => renameGoal(goal.id, newName)}
            accent="others"
            meta={
              <span className="inline-flex items-center rounded-full bg-track-othersTint px-2 py-0.5 text-[11px] font-medium text-track-others">
                {goal.category}
              </span>
            }
          />
        ))}
      </section>
    </div>
  );
}
