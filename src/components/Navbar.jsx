import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Target } from "lucide-react";
import { NAV_LINKS } from "../data/navLinks";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Top bar — always visible */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-sidebar px-4 py-3.5 md:bg-surface md:border-b md:border-line md:px-8 md:py-3">
        <div className="flex items-center gap-2.5 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-sidebar">
            <Target size={16} strokeWidth={2.5} />
          </div>
          <p className="font-display text-base font-semibold text-white">Self Tracker</p>
        </div>

        <p className="hidden text-sm font-medium text-ink/60 md:block">{todayLabel}</p>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-white/80 hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="sticky top-[57px] z-20 flex flex-col gap-1 bg-sidebar px-3 pb-3 pt-1 shadow-pop md:hidden">
          {NAV_LINKS.map(({ to, label, desc, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
                ${isActive ? "bg-white/10 text-white" : "text-sidebarmuted hover:bg-white/5 hover:text-white"}`
              }
            >
              <Icon size={18} strokeWidth={2} className="mt-0.5 shrink-0" />
              <span>
                {label}
                <span className="block text-[11px] font-normal text-sidebarmuted/70">{desc}</span>
              </span>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}
