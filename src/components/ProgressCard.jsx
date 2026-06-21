import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { ACCENTS } from "../data/accents";

/**
 * Reusable card showing a percentage of completion for a given track
 * (Technical, Communication, Aptitude, Consistency, Others).
 *
 * Props:
 *  - accent: one of the keys in ACCENTS
 *  - title: heading text
 *  - subtitle: small supporting line, e.g. "2 of 4 topics completed"
 *  - percent: 0-100
 *  - icon: lucide-react icon component
 *  - to: route to link the card to
 */
export default function ProgressCard({ accent = "technical", title, subtitle, percent = 0, icon: Icon, to }) {
  const a = ACCENTS[accent];
  const pct = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <Link
      to={to}
      className="group block rounded-xl2 border border-line bg-surface p-5 shadow-card transition hover:shadow-pop hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${a.tint}`}>
          {Icon ? <Icon size={20} className={a.text} /> : null}
        </div>
        <span className={`font-mono text-xl font-semibold ${a.text}`}>{pct}%</span>
      </div>

      <h3 className="mt-4 font-display text-base font-semibold text-ink">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-ink/55">{subtitle}</p> : null}

      <div className="mt-4">
        <ProgressBar value={pct} barClass={a.bg} trackClass="bg-canvas" />
      </div>
    </Link>
  );
}
