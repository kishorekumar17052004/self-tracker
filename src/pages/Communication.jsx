import { useState } from "react";
import { Mic, BookOpenText, UserRound, Trash2, Smile, MessagesSquare } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import DashboardCard from "../components/DashboardCard";
import InfoTip from "../components/InfoTip";
import { useToast } from "../components/Toast";
import { defaultCommunicationData, COMM_TYPES, lastNDateKeys, niceDate, todayKey, uid } from "../data/defaultData";

const TYPE_META = {
  Speaking: { icon: Mic, accentText: "text-track-communication", accentBg: "bg-track-communicationTint" },
  Grammar: { icon: BookOpenText, accentText: "text-track-aptitude", accentBg: "bg-track-aptitudeTint" },
  "Self-Intro": { icon: UserRound, accentText: "text-track-technical", accentBg: "bg-track-technicalTint" },
};

const PLACEHOLDERS = {
  Speaking: "What did you speak about today? e.g. My weekend plans",
  Grammar: "What grammar topic did you revise? e.g. Tenses, Articles",
  "Self-Intro": "Notes on your self-introduction practice (optional)",
};

export default function Communication() {
  const [data, setData] = useLocalStorage("communicationData", defaultCommunicationData);
  const [type, setType] = useState("Speaking");
  const [text, setText] = useState("");
  const toast = useToast();

  const addEntry = () => {
    const trimmed = text.trim();
    if (type !== "Self-Intro" && !trimmed) return;
    setData((prev) => ({
      ...prev,
      entries: [{ id: uid(), date: todayKey(), type, topic: trimmed }, ...prev.entries],
    }));
    setText("");
    toast.show(`${type} practice logged — nice work!`);
  };

  const deleteEntry = (id) => {
    if (!window.confirm("Delete this practice entry?")) return;
    setData((prev) => ({ ...prev, entries: prev.entries.filter((e) => e.id !== id) }));
    toast.show("Entry removed", "danger");
  };

  const setConfidence = (v) => setData((prev) => ({ ...prev, confidenceLevel: Number(v) }));

  const last7 = lastNDateKeys(7);
  const countWeek = (t) => data.entries.filter((e) => e.type === t && last7.includes(e.date)).length;
  const countAll = (t) => data.entries.filter((e) => e.type === t).length;

  const confidenceLabel = ["", "Very low", "Low", "Building up", "Okay", "Steady", "Good", "Confident", "Strong", "Very strong", "Excellent"][
    data.confidenceLevel
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Communication Skills</h1>
        <p className="mt-1 text-sm text-ink/55">Log your speaking, grammar, and self-introduction practice.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COMM_TYPES.map((t) => {
          const meta = TYPE_META[t];
          return (
            <DashboardCard
              key={t}
              label={`${t} this week`}
              value={countWeek(t)}
              icon={meta.icon}
              tone={meta.accentText}
            />
          );
        })}
      </section>

      <section className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Smile size={17} className="text-gold" />
            <h2 className="font-display text-sm font-semibold text-ink">Speaking confidence level</h2>
            <InfoTip text="Rate how confident you feel speaking English today, from 1 (not confident at all) to 10 (very confident). Be honest — this is just for tracking your own growth over time." />
          </div>
          <span className="font-mono text-sm font-semibold text-gold">{data.confidenceLevel}/10 · {confidenceLabel}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={data.confidenceLevel}
          onChange={(e) => setConfidence(e.target.value)}
          className="mt-4 w-full accent-[#E89A3C]"
        />
        <div className="mt-1 flex justify-between text-[11px] text-ink/35">
          <span>1 · Not confident</span>
          <span>10 · Very confident</span>
        </div>
      </section>

      <section className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
        <h2 className="font-display text-sm font-semibold text-ink">Log practice</h2>
        <p className="mt-1 text-xs text-ink/45">Choose what you practiced, then describe it briefly.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {COMM_TYPES.map((t) => {
            const meta = TYPE_META[t];
            const active = type === t;
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition
                  ${active ? `${meta.accentBg} ${meta.accentText}` : "bg-canvas text-ink/50 hover:text-ink/80"}`}
              >
                <meta.icon size={14} />
                {t}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEntry()}
            placeholder={PLACEHOLDERS[type]}
            className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-track-communication/30"
          />
          <button
            onClick={addEntry}
            className="shrink-0 rounded-lg bg-track-communication px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Log session
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-sm font-semibold text-ink">
          Practice history
          <span className="ml-2 font-mono text-xs font-normal text-ink/40">
            {countAll("Speaking")} speaking · {countAll("Grammar")} grammar · {countAll("Self-Intro")} self-intro
          </span>
        </h2>
        {data.entries.length === 0 && (
          <div className="rounded-xl border border-dashed border-line p-8 text-center">
            <MessagesSquare size={28} className="mx-auto text-ink/25" />
            <p className="mt-2 text-sm text-ink/45">No sessions logged yet. Pick a type above and log your first one.</p>
          </div>
        )}
        <div className="space-y-2">
          {data.entries.map((e) => {
            const meta = TYPE_META[e.type];
            return (
              <div key={e.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-card">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.accentBg}`}>
                  <meta.icon size={15} className={meta.accentText} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{e.topic || `${e.type} practice`}</p>
                  <p className="text-xs text-ink/40">{niceDate(e.date)} · {e.type}</p>
                </div>
                <button onClick={() => deleteEntry(e.id)} className="rounded-md p-1.5 text-ink/30 hover:bg-track-communicationTint hover:text-track-communication" aria-label="Delete entry" title="Delete entry">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
