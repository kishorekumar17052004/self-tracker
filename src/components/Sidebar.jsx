import { NavLink } from "react-router-dom";
import { Target } from "lucide-react";
import { NAV_LINKS } from "../data/navLinks";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:fixed md:inset-y-0 bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-sidebar">
          <Target size={19} strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-display text-base font-semibold text-white leading-none">Self Tracker</p>
          <p className="mt-1 text-[11px] text-sidebarmuted">Build the habit, build the skill</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_LINKS.map(({ to, label, desc, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
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
      </nav>

      <div className="px-5 py-5 text-[11px] text-sidebarmuted/70">Your data stays on this device.</div>
    </aside>
  );
}
