import { useState } from "react";
import { ChevronDown, ChevronUp, Minus, Plus, Trash2, Code2 } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import QuickAddInput from "../components/QuickAddInput";
import ProgressBar from "../components/ProgressBar";
import InfoTip from "../components/InfoTip";
import { useToast } from "../components/Toast";
import { defaultTechnicalTopics, TECH_STATUSES, clampPct, uid } from "../data/defaultData";

const STATUS_STYLES = {
  "Not Started": "bg-surface text-ink/50",
  Learning: "bg-gold text-white",
  Completed: "bg-track-technical text-white",
};

function TopicCard({ topic, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          {expanded ? <ChevronUp size={16} className="text-ink/40" /> : <ChevronDown size={16} className="text-ink/40" />}
          <span className="font-display text-sm font-semibold text-ink">{topic.name}</span>
        </button>

        <div className="flex items-center gap-1 rounded-full bg-canvas p-1">
          {TECH_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onUpdate({ status: s })}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                topic.status === s ? STATUS_STYLES[s] : "text-ink/40 hover:text-ink/70"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-canvas px-1.5 py-1">
          <button
            onClick={() => onUpdate({ practiceCount: Math.max(0, topic.practiceCount - 1) })}
            className="rounded-full p-1 text-ink/50 hover:bg-surface"
            aria-label="Decrease practice count"
            title="One fewer practice session"
          >
            <Minus size={13} />
          </button>
          <span className="w-24 text-center font-mono text-xs text-ink/70">
            {topic.practiceCount} {topic.practiceCount === 1 ? "session" : "sessions"}
          </span>
          <button
            onClick={() => onUpdate({ practiceCount: topic.practiceCount + 1 })}
            className="rounded-full p-1 text-ink/50 hover:bg-surface"
            aria-label="Increase practice count"
            title="Add a practice session"
          >
            <Plus size={13} />
          </button>
        </div>

        <button onClick={onDelete} className="rounded-md p-1.5 text-ink/30 hover:bg-track-communicationTint hover:text-track-communication" aria-label="Delete topic" title="Delete topic">
          <Trash2 size={15} />
        </button>
      </div>

      {expanded && (
        <div className="mt-3 border-t border-line pt-3">
          <label className="mb-1.5 block text-xs font-medium text-ink/50">Notes — anything you want to remember</label>
          <textarea
            value={topic.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Key concepts, gotchas, things to revise..."
            rows={3}
            className="w-full resize-none rounded-lg border border-line bg-canvas p-3 text-sm placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-track-technical/30"
          />
        </div>
      )}
    </div>
  );
}

export default function Technical() {
  const [topics, setTopics] = useLocalStorage("technicalTopics", defaultTechnicalTopics);
  const [query, setQuery] = useState("");
  const toast = useToast();

  const addTopic = (name) => {
    setTopics((prev) => [...prev, { id: uid(), name, status: "Not Started", notes: "", practiceCount: 0 }]);
    toast.show(`"${name}" added to your topics`);
  };

  const updateTopic = (id, patch, name) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    if (patch.status === "Completed") toast.show(`Great work — "${name}" completed! 🎉`);
  };

  const deleteTopic = (id, name) => {
    if (!window.confirm(`Remove "${name}"? Its notes and progress will be deleted too.`)) return;
    setTopics((prev) => prev.filter((t) => t.id !== id));
    toast.show(`"${name}" removed`, "danger");
  };

  const completed = topics.filter((t) => t.status === "Completed").length;
  const overall = topics.length ? clampPct((completed / topics.length) * 100) : 0;

  const visibleTopics = topics.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Technical Skills</h1>
        <p className="mt-1 text-sm text-ink/55">
          Track what you're learning, what's done, and how much you've practiced. Tap a topic to add notes.
        </p>
      </header>

      <section className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink/60">
            {completed} of {topics.length} topics completed
          </span>
          <span className="font-mono font-semibold text-track-technical">{overall}%</span>
        </div>
        <div className="mt-2">
          <ProgressBar value={overall} barClass="bg-track-technical" />
        </div>
      </section>

      <section className="space-y-3">
        <QuickAddInput placeholder="e.g. TypeScript, System Design..." onAdd={addTopic} accent="technical" buttonLabel="Add topic" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your topics..."
          className="w-full rounded-lg border border-line bg-surface px-3.5 py-2 text-sm shadow-card placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-track-technical/30"
        />
      </section>

      <section className="space-y-3">
        <p className="flex items-center gap-1.5 text-xs text-ink/45">
          Click a status button to update a topic — Not Started, Learning, or Completed.
          <InfoTip text="Not Started: you haven't begun. Learning: you're actively studying it. Completed: you feel confident and have practiced it." />
        </p>
        {visibleTopics.length === 0 && (
          <div className="rounded-xl border border-dashed border-line p-8 text-center">
            <Code2 size={28} className="mx-auto text-ink/25" />
            <p className="mt-2 text-sm text-ink/45">
              {topics.length === 0
                ? "No topics yet. Add one above — try JavaScript, React, or whatever you're studying right now."
                : "No topics match your search. Try a different word or add a new topic."}
            </p>
          </div>
        )}
        {visibleTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onUpdate={(patch) => updateTopic(topic.id, patch, topic.name)}
            onDelete={() => deleteTopic(topic.id, topic.name)}
          />
        ))}
      </section>
    </div>
  );
}
