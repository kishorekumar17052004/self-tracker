import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Target, Calculator } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import QuickAddInput from "../components/QuickAddInput";
import ProgressBar from "../components/ProgressBar";
import DashboardCard from "../components/DashboardCard";
import InfoTip from "../components/InfoTip";
import { useToast } from "../components/Toast";
import { defaultAptitudeTopics, clampPct, uid } from "../data/defaultData";

const accuracyOf = (t) => (t.correct + t.wrong > 0 ? clampPct((t.correct / (t.correct + t.wrong)) * 100) : 0);

function AptitudeTopicCard({ topic, onLog, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  const accuracy = accuracyOf(topic);

  const submitLog = () => {
    const c = Math.max(0, parseInt(correct, 10) || 0);
    const w = Math.max(0, parseInt(wrong, 10) || 0);
    if (c === 0 && w === 0) return;
    onLog(c, w);
    setCorrect("");
    setWrong("");
    setExpanded(false);
  };

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => setExpanded((v) => !v)} className="flex flex-1 items-center gap-2 text-left">
          {expanded ? <ChevronUp size={16} className="text-ink/40" /> : <ChevronDown size={16} className="text-ink/40" />}
          <span className="font-display text-sm font-semibold text-ink">{topic.name}</span>
        </button>

        <span className="font-mono text-xs text-ink/50">{topic.questionsPracticed} questions answered</span>
        <span className={`font-mono text-sm font-semibold ${accuracy >= 70 ? "text-track-consistency" : accuracy >= 40 ? "text-track-aptitude" : "text-track-communication"}`}>
          {accuracy}%
        </span>

        <button onClick={onDelete} className="rounded-md p-1.5 text-ink/30 hover:bg-track-communicationTint hover:text-track-communication" aria-label="Delete topic" title="Delete topic">
          <Trash2 size={15} />
        </button>
      </div>

      <div className="mt-3">
        <ProgressBar value={accuracy} barClass="bg-track-aptitude" />
      </div>

      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 text-xs font-medium text-track-aptitude hover:underline"
        >
          + Log a practice session
        </button>
      )}

      {expanded && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="mb-2 text-xs font-medium text-ink/50">
            How many questions did you get right and wrong this session?
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              min={0}
              value={correct}
              onChange={(e) => setCorrect(e.target.value)}
              placeholder="Correct"
              className="w-24 rounded-lg border border-line bg-canvas px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-track-consistency/30"
            />
            <input
              type="number"
              min={0}
              value={wrong}
              onChange={(e) => setWrong(e.target.value)}
              placeholder="Wrong"
              className="w-24 rounded-lg border border-line bg-canvas px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-track-communication/30"
            />
            <button
              onClick={submitLog}
              className="rounded-lg bg-track-aptitude px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Save session
            </button>
          </div>
          <p className="mt-2 text-xs text-ink/40">
            So far: {topic.correct} correct, {topic.wrong} wrong, in total.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Aptitude() {
  const [topics, setTopics] = useLocalStorage("aptitudeTopics", defaultAptitudeTopics);
  const toast = useToast();

  const addTopic = (name) => {
    setTopics((prev) => [...prev, { id: uid(), name, questionsPracticed: 0, correct: 0, wrong: 0 }]);
    toast.show(`"${name}" added to your topics`);
  };

  const logSession = (id, c, w, name) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, correct: t.correct + c, wrong: t.wrong + w, questionsPracticed: t.questionsPracticed + c + w }
          : t
      )
    );
    toast.show(`Session saved for "${name}" — accuracy updated`);
  };

  const deleteTopic = (id, name) => {
    if (!window.confirm(`Remove "${name}"? All its practice history will be deleted too.`)) return;
    setTopics((prev) => prev.filter((t) => t.id !== id));
    toast.show(`"${name}" removed`, "danger");
  };

  const totalQuestions = topics.reduce((sum, t) => sum + t.questionsPracticed, 0);
  const totalCorrect = topics.reduce((sum, t) => sum + t.correct, 0);
  const totalWrong = topics.reduce((sum, t) => sum + t.wrong, 0);
  const overallAccuracy = totalCorrect + totalWrong > 0 ? clampPct((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Aptitude Practice</h1>
        <p className="mt-1 text-sm text-ink/55">Log every set you attempt and watch your accuracy sharpen.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard label="Questions answered" value={totalQuestions} icon={Target} />
        <DashboardCard
          label="Overall accuracy"
          value={overallAccuracy}
          suffix="%"
          tone="text-track-aptitude"
        />
        <DashboardCard label="Correct vs wrong" value={`${totalCorrect} / ${totalWrong}`} tone="text-track-consistency" />
      </section>

      <section className="space-y-3">
        <QuickAddInput placeholder="e.g. Time, Speed & Distance" onAdd={addTopic} accent="aptitude" buttonLabel="Add topic" />
      </section>

      <section className="space-y-3">
        <p className="flex items-center gap-1.5 text-xs text-ink/45">
          Accuracy = correct answers ÷ total questions attempted.
          <InfoTip text="Green (70%+) means you're doing well. Amber (40-69%) means keep practicing. Red (below 40%) means this topic needs more review." />
        </p>
        {topics.length === 0 && (
          <div className="rounded-xl border border-dashed border-line p-8 text-center">
            <Calculator size={28} className="mx-auto text-ink/25" />
            <p className="mt-2 text-sm text-ink/45">
              No topics yet. Add one above — try Percentage, Time & Work, or whatever you're revising.
            </p>
          </div>
        )}
        {topics.map((topic) => (
          <AptitudeTopicCard
            key={topic.id}
            topic={topic}
            onLog={(c, w) => logSession(topic.id, c, w, topic.name)}
            onDelete={() => deleteTopic(topic.id, topic.name)}
          />
        ))}
      </section>
    </div>
  );
}
