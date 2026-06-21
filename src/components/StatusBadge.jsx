const TONE_CLASSES = {
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
  progress: "bg-gold-light text-gold border-gold/30",
  success: "bg-brand-light text-brand-dark border-brand/25",
  danger: "bg-track-communicationTint text-track-communication border-track-communication/25",
};

const STATUS_TONE = {
  "Not Started": "neutral",
  Learning: "progress",
  Completed: "success",
  Pending: "neutral",
};

export default function StatusBadge({ status, tone }) {
  const resolvedTone = tone || STATUS_TONE[status] || "neutral";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${TONE_CLASSES[resolvedTone]}`}
    >
      {status}
    </span>
  );
}
