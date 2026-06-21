import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  CalendarDays,
  Code2,
  MessagesSquare,
  Calculator,
  CalendarCheck2,
  Sparkles,
  Plus,
  ClipboardList,
  X,
} from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import DashboardCard from "../components/DashboardCard";
import QuoteCard from "../components/QuoteCard";
import ProgressCard from "../components/ProgressCard";
import ProgressBar from "../components/ProgressBar";
import AddTaskModal from "../components/AddTaskModal";
import StatusBadge from "../components/StatusBadge";
import InfoTip from "../components/InfoTip";
import { useToast } from "../components/Toast";
import { ACCENTS } from "../data/accents";
import {
  defaultTasks,
  TASK_CATEGORIES,
  todayKey,
  lastNDateKeys,
  friendlyDate,
  quoteForToday,
  clampPct,
  uid,
} from "../data/defaultData";

const CATEGORY_META = {
  Technical: { icon: Code2, to: "/technical" },
  Communication: { icon: MessagesSquare, to: "/communication" },
  Aptitude: { icon: Calculator, to: "/aptitude" },
  Consistency: { icon: CalendarCheck2, to: "/consistency" },
  Others: { icon: Sparkles, to: "/others" },
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export default function Dashboard() {
  const [tasks, setTasks] = useLocalStorage("tasks", defaultTasks);
  const [welcomeDismissed, setWelcomeDismissed] = useLocalStorage("welcomeDismissed", false);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  const today = todayKey();
  const last7 = lastNDateKeys(7);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = total - completed;

  const dueToday = tasks.filter((t) => t.dueDate === today);
  const todayProgress = dueToday.length ? clampPct((dueToday.filter((t) => t.status === "Completed").length / dueToday.length) * 100) : 0;

  const dueThisWeek = tasks.filter((t) => t.dueDate && last7.includes(t.dueDate));
  const weeklyProgress = dueThisWeek.length
    ? clampPct((dueThisWeek.filter((t) => t.status === "Completed").length / dueThisWeek.length) * 100)
    : 0;

  const recentTasks = [...tasks]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 5);

  const quickAddTask = (formData) => {
    setTasks((prev) => [{ id: uid(), ...formData, createdAt: today }, ...prev]);
    toast.show(`"${formData.title}" added to your tasks`);
    setModalOpen(false);
  };

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{greeting()} 👋</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/55">
            <CalendarDays size={14} />
            {todayLabel}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-card transition hover:bg-brand-dark"
        >
          <Plus size={16} />
          Quick add task
        </button>
      </header>

      {!welcomeDismissed && (
        <section className="relative rounded-xl2 border border-brand/20 bg-brand-light p-5">
          <button
            onClick={() => setWelcomeDismissed(true)}
            className="absolute right-3 top-3 rounded-md p-1 text-brand-dark/50 hover:bg-white/40 hover:text-brand-dark"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
          <h2 className="font-display text-sm font-semibold text-brand-dark">New here? Here's how to start</h2>
          <ul className="mt-2 space-y-1 text-sm text-brand-dark/80">
            <li>1. Add a task above, or open the <span className="font-medium">Tasks</span> page to add a few.</li>
            <li>2. Visit a skill page — <span className="font-medium">Technical</span>, <span className="font-medium">Communication</span>, or <span className="font-medium">Aptitude</span> — to track deeper progress.</li>
            <li>3. This dashboard updates automatically as you go.</li>
          </ul>
        </section>
      )}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Total tasks" value={total} icon={ClipboardList} />
        <DashboardCard label="Completed" value={completed} icon={CheckCircle2} tone="text-track-consistency" />
        <DashboardCard label="Pending" value={pending} icon={Circle} tone="text-track-communication" />
        <DashboardCard label="Today's progress" value={todayProgress} suffix="%" icon={TrendingUp} tone="text-brand" />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuoteCard quote={quoteForToday()} />
        </div>

        <div className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
          <h2 className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink">
            Weekly progress
            <InfoTip text="The share of tasks due in the last 7 days that you've completed. Tasks without a due date aren't counted." />
          </h2>
          <p className="mt-3 font-mono text-3xl font-semibold text-gold">{weeklyProgress}%</p>
          <div className="mt-3">
            <ProgressBar value={weeklyProgress} barClass="bg-gold" />
          </div>
          <p className="mt-2 text-xs text-ink/45">
            {dueThisWeek.length
              ? `${dueThisWeek.filter((t) => t.status === "Completed").length} of ${dueThisWeek.length} tasks due this week`
              : "No tasks due this week yet."}
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold text-ink">Category progress</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TASK_CATEGORIES.map((cat) => {
            const catTasks = tasks.filter((t) => t.category === cat);
            const catCompleted = catTasks.filter((t) => t.status === "Completed").length;
            const pct = catTasks.length ? clampPct((catCompleted / catTasks.length) * 100) : 0;
            const meta = CATEGORY_META[cat];
            return (
              <ProgressCard
                key={cat}
                accent={cat.toLowerCase()}
                title={cat}
                subtitle={`${catCompleted} of ${catTasks.length} tasks completed`}
                percent={pct}
                icon={meta.icon}
                to={meta.to}
              />
            );
          })}
        </div>
      </section>

      <section className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-ink">Recent tasks</h2>
          <Link to="/tasks" className="text-xs font-medium text-brand hover:underline">
            View all tasks
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {recentTasks.length === 0 && (
            <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-ink/45">
              No tasks yet. Use "Quick add task" above to create your first one.
            </p>
          )}
          {recentTasks.map((task) => {
            const a = ACCENTS[task.category.toLowerCase()];
            return (
              <div key={task.id} className="flex items-center gap-3 rounded-lg border border-line p-3">
                <span className={`h-2 w-2 shrink-0 rounded-full ${a.dot}`} />
                <p className={`min-w-0 flex-1 truncate text-sm ${task.status === "Completed" ? "text-ink/40 line-through" : "text-ink"}`}>
                  {task.title}
                </p>
                <span className="shrink-0 text-xs text-ink/40">{friendlyDate(task.dueDate)}</span>
                <StatusBadge status={task.status} />
              </div>
            );
          })}
        </div>
      </section>

      {modalOpen && <AddTaskModal onClose={() => setModalOpen(false)} onSave={quickAddTask} />}
    </div>
  );
}
