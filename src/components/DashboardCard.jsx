export default function DashboardCard({ label, value, suffix = "", icon: Icon, tone = "text-ink" }) {
  return (
    <div className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink/45">{label}</span>
        {Icon ? <Icon size={16} className="text-ink/30" /> : null}
      </div>
      <p className={`mt-2.5 font-mono text-2xl font-semibold ${tone}`}>
        {value}
        {suffix}
      </p>
    </div>
  );
}
