import { Quote } from "lucide-react";

export default function QuoteCard({ quote }) {
  return (
    <div className="relative overflow-hidden rounded-xl2 bg-sidebar p-6 text-white shadow-pop">
      <Quote className="absolute -right-2 -top-2 text-white/10" size={96} strokeWidth={1} />
      <span className="relative font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
        Today's motivation
      </span>
      <p className="relative mt-3 max-w-md font-display text-lg leading-snug text-white/95">
        "{quote}"
      </p>
    </div>
  );
}
