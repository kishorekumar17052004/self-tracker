export default function ProgressBar({ value = 0, barClass = "bg-brand", trackClass = "bg-line", height = "h-2" }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full ${trackClass} rounded-full overflow-hidden ${height}`}>
      <div
        className={`${barClass} ${height} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
