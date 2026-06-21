import { Flame, ListChecks, CalendarCheck2, Check, Minus } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import QuickAddInput from "../components/QuickAddInput";
import TaskCard from "../components/TaskCard";
import ProgressBar from "../components/ProgressBar";
import InfoTip from "../components/InfoTip";
import { useToast } from "../components/Toast";
import { ACCENTS } from "../data/accents";
import {
  defaultConsistencyTasks,
  todayKey,
  lastNDateKeys,
  shortDayLabel,
  niceDate,
  computeStreak,
  daysSince,
  clampPct,
  uid,
} from "../data/defaultData";

function WeekRow({ history, accent = "consistency" }) {
  const a = ACCENTS[accent];
  const days = lastNDateKeys(7);
  return (
    <div className="flex gap-2">
      {days.map((key) => {
        const done = !!history[key];
        const isToday = key === todayKey();
        return (
          <div key={key} className="flex flex-col items-center gap-1">
            <span className={`text-[10px] font-medium ${isToday ? "text-ink" : "text-ink/40"}`}>{shortDayLabel(key)}</span>
            <div
              title={`${niceDate(key)}: ${done ? "Done" : "Missed"}`}
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition
                ${done ? `${a.bg} border-transparent text-white` : isToday ? "border-line text-ink/25" : "border-line/70 text-ink/15"}`}
            >
              {done ? <Check size={13} strokeWidth={3} /> : <Minus size={12} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Consistency() {
  const [tasks, setTasks] = useLocalStorage("consistencyTasks", defaultConsistencyTasks);
  const toast = useToast();

  const addTask = (name) => {
    setTasks((prev) => [...prev, { id: uid(), name, history: {}, createdAt: todayKey() }]);
    toast.show(`"${name}" added to your habits`);
  };

  const toggleToday = (id, name) => {
    const key = todayKey();
    let willBeDone = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        willBeDone = !t.history[key];
        return { ...t, history: { ...t.history, [key]: willBeDone } };
      })
    );
    toast.show(willBeDone ? `Nice! "${name}" done for today` : `"${name}" unmarked`, willBeDone ? "success" : "info");
  };

  const deleteTask = (id, name) => {
    if (!window.confirm(`Remove "${name}"? This will also delete its history.`)) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.show(`"${name}" removed`, "danger");
  };

  const renameTask = (id, name) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));

  const today = todayKey();
  const completedToday = tasks.filter((t) => t.history[today]).length;
  const overallToday = tasks.length ? clampPct((completedToday / tasks.length) * 100) : 0;

  const last7 = lastNDateKeys(7);
  const weekOverview = last7.map((key) => {
    const total = tasks.length || 1;
    const done = tasks.filter((t) => t.history[key]).length;
    return { key, done, total: tasks.length, pct: clampPct((done / total) * 100) };
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Consistency Checker</h1>
        <p className="mt-1 text-sm text-ink/55">
          Daily habits compound. Tap a habit's circle below to mark today done.
        </p>
      </header>

      <section className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink">
            This week at a glance
            <InfoTip text="For each day, this shows what share of your habits you completed. A taller, fuller bar means a better day." />
          </h2>
          <div className="flex items-center gap-2 rounded-full bg-track-consistencyTint px-3 py-1.5 text-track-consistency">
            <ListChecks size={15} />
            <span className="text-sm font-medium">
              {completedToday}/{tasks.length} done today
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-2">
          {weekOverview.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-16 w-full items-end overflow-hidden rounded-md bg-canvas">
                <div
                  className="w-full rounded-md bg-track-consistency transition-all duration-500"
                  style={{ height: `${Math.max(6, d.pct)}%` }}
                />
              </div>
              <span className="text-[10px] text-ink/40">{shortDayLabel(d.key)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-ink/50">
            <span>Today's overall progress</span>
            <span className="font-mono">{overallToday}%</span>
          </div>
          <ProgressBar value={overallToday} barClass="bg-track-consistency" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold text-ink">Add a daily habit</h2>
        <QuickAddInput
          placeholder="e.g. Read for 20 minutes"
          onAdd={addTask}
          accent="consistency"
          buttonLabel="Add habit"
        />
      </section>

      <section className="space-y-3">
        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-line p-8 text-center">
            <CalendarCheck2 size={28} className="mx-auto text-ink/25" />
            <p className="mt-2 text-sm text-ink/45">
              No habits yet. Add your first one above — try something small, like "drink water after waking up".
            </p>
          </div>
        )}
        {tasks.map((task) => {
          const streak = computeStreak(task.history);
          const since = daysSince(task.createdAt || today);
          const window = Math.min(30, since);
          const completedRecently = lastNDateKeys(window).filter((k) => task.history[k]).length;
          const pct = clampPct((completedRecently / window) * 100);
          const missedLast7 = 7 - last7.filter((k) => task.history[k]).length;

          return (
            <TaskCard
              key={task.id}
              title={task.name}
              completed={!!task.history[today]}
              onToggle={() => toggleToday(task.id, task.name)}
              onDelete={() => deleteTask(task.id, task.name)}
              onRename={(name) => renameTask(task.id, name)}
              accent="consistency"
              meta={
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink/50">
                    <span className="inline-flex items-center gap-1 font-medium text-gold">
                      <Flame size={13} />
                      {streak}-day streak
                    </span>
                    <span>{missedLast7} missed this week</span>
                    <span>{pct}% complete (last {window}d)</span>
                  </div>
                  <WeekRow history={task.history} accent="consistency" />
                </div>
              }
            />
          );
        })}
      </section>
    </div>
  );
}
