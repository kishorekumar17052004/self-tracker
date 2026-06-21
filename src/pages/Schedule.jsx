import { Clock, Code2, MessagesSquare, Calculator, CheckCircle2, Hourglass, ListChecks } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import DashboardCard from "../components/DashboardCard";
import ProgressBar from "../components/ProgressBar";
import InfoTip from "../components/InfoTip";
import { useToast } from "../components/Toast";
import { ACCENTS } from "../data/accents";
import {
  defaultScheduleItems,
  SCHEDULE_TRACKER_META,
  SCHEDULE_TIMELINE,
  todayKey,
  clampPct,
  formatTime12,
  minutesSinceMidnight,
  minutesBetween,
  hoursLabel,
} from "../data/defaultData";

const TRACKER_ICONS = { technical: Code2, communication: MessagesSquare, aptitude: Calculator };

const DAY_START = minutesSinceMidnight("06:00");
const DAY_END = minutesSinceMidnight("21:30");
const DAY_SPAN = DAY_END - DAY_START;
const HOUR_MARKS = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];

function TrackerSection({ trackerKey, items, today, onToggle }) {
  const meta = SCHEDULE_TRACKER_META[trackerKey];
  const a = ACCENTS[meta.accent];
  const Icon = TRACKER_ICONS[trackerKey];

  const totalMinutes = items.reduce((sum, i) => sum + minutesBetween(i.start, i.end), 0);
  const doneCount = items.filter((i) => i.history[today]).length;
  const pct = items.length ? clampPct((doneCount / items.length) * 100) : 0;

  return (
    <div className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.tint}`}>
            <Icon size={18} className={a.text} />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold text-ink">{meta.title}</h2>
            <p className="text-xs text-ink/45">{hoursLabel(totalMinutes)} scheduled</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${a.tint} ${a.text}`}>
          {doneCount}/{items.length} done today
        </span>
      </div>

      <div className="mt-3">
        <ProgressBar value={pct} barClass={a.bg} />
      </div>

      <div className="mt-4 space-y-1.5">
        {items.map((item) => {
          const done = !!item.history[today];
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id, item.task)}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition hover:bg-canvas"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition
                  ${done ? `${a.bg} border-transparent text-white` : "border-line text-transparent"}`}
              >
                <CheckCircle2 size={13} strokeWidth={3} fill="none" />
              </span>
              <span className={`min-w-0 flex-1 truncate text-sm ${done ? "text-ink/40 line-through" : "text-ink"}`}>
                {item.task}
              </span>
              <span className="shrink-0 font-mono text-xs text-ink/45">
                {formatTime12(item.start)} – {formatTime12(item.end)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Schedule() {
  const [items, setItems] = useLocalStorage("scheduleItems", defaultScheduleItems);
  const toast = useToast();
  const today = todayKey();

  const toggleItem = (id, taskName) => {
    let willBeDone = false;
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        willBeDone = !i.history[today];
        return { ...i, history: { ...i.history, [today]: willBeDone } };
      })
    );
    toast.show(willBeDone ? `Nice! "${taskName}" done` : `"${taskName}" unmarked`, willBeDone ? "success" : "info");
  };

  const trackerKeys = ["technical", "communication", "aptitude"];

  const totalScheduledMinutes = items.reduce((sum, i) => sum + minutesBetween(i.start, i.end), 0);
  const completedTodayMinutes = items
    .filter((i) => i.history[today])
    .reduce((sum, i) => sum + minutesBetween(i.start, i.end), 0);
  const completedCount = items.filter((i) => i.history[today]).length;
  const overallPct = totalScheduledMinutes ? clampPct((completedTodayMinutes / totalScheduledMinutes) * 100) : 0;

  // Final breakdown: Technical/Communication/Aptitude from the detailed task lists,
  // Classes from the timeline (it has no detailed checklist of its own).
  const breakdownMinutes = { technical: 0, communication: 0, aptitude: 0, classes: 0 };
  items.forEach((i) => {
    breakdownMinutes[i.trackerKey] += minutesBetween(i.start, i.end);
  });
  const classesBlock = SCHEDULE_TIMELINE.find((b) => b.trackerKey === "classes");
  if (classesBlock) breakdownMinutes.classes = minutesBetween(classesBlock.start, classesBlock.end);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Daily Schedule</h1>
        <p className="mt-1 text-sm text-ink/55">
          Your hour-by-hour routine. Tap a task to check it off — this resets fresh every day.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Scheduled time" value={hoursLabel(totalScheduledMinutes)} icon={Hourglass} />
        <DashboardCard label="Completed today" value={hoursLabel(completedTodayMinutes)} icon={CheckCircle2} tone="text-track-consistency" />
        <DashboardCard label="Tasks done today" value={`${completedCount}/${items.length}`} icon={ListChecks} />
        <DashboardCard label="Completion" value={overallPct} suffix="%" icon={Clock} tone="text-brand" />
      </section>

      {trackerKeys.map((key) => (
        <TrackerSection
          key={key}
          trackerKey={key}
          items={items.filter((i) => i.trackerKey === key)}
          today={today}
          onToggle={toggleItem}
        />
      ))}

      <section className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
        <h2 className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink">
          Dashboard summary — your whole day at a glance
          <InfoTip text="This shows how your day is blocked out from 6 AM to 9:30 PM. Each colored segment is one continuous activity." />
        </h2>

        <div className="relative mt-5 h-10 rounded-lg bg-canvas">
          {SCHEDULE_TIMELINE.map((block, idx) => {
            const a = ACCENTS[block.trackerKey];
            const left = ((minutesSinceMidnight(block.start) - DAY_START) / DAY_SPAN) * 100;
            const width = (minutesBetween(block.start, block.end) / DAY_SPAN) * 100;
            return (
              <div
                key={idx}
                title={`${block.label}: ${formatTime12(block.start)} – ${formatTime12(block.end)}`}
                className={`absolute top-1 h-8 rounded-md ${a.bg} opacity-90`}
                style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
              />
            );
          })}
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-ink/35">
          {HOUR_MARKS.map((h) => (
            <span key={h}>{formatTime12(h)}</span>
          ))}
        </div>

        <div className="mt-5 space-y-1.5">
          {SCHEDULE_TIMELINE.map((block, idx) => {
            const a = ACCENTS[block.trackerKey];
            return (
              <div key={idx} className="flex items-center gap-2.5 text-sm">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${a.dot}`} />
                <span className="min-w-0 flex-1 text-ink/75">{block.label}</span>
                <span className="shrink-0 font-mono text-xs text-ink/45">
                  {formatTime12(block.start)} – {formatTime12(block.end)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <p className="mb-2 text-xs font-medium text-ink/50">This schedule gives you:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(breakdownMinutes).map(([key, mins]) => {
              const a = ACCENTS[key];
              return (
                <span key={key} className={`rounded-full px-3 py-1.5 text-xs font-medium ${a.tint} ${a.text}`}>
                  {a.label} → {hoursLabel(mins)}
                </span>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
