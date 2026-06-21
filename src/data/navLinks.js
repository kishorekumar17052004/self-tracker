import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  CalendarCheck2,
  Code2,
  MessagesSquare,
  Calculator,
  Sparkles,
} from "lucide-react";

export const NAV_LINKS = [
  { to: "/", label: "Dashboard", desc: "Your overall progress", icon: LayoutDashboard, end: true },
  { to: "/tasks", label: "Tasks", desc: "Add, edit & track tasks", icon: ClipboardList },
  { to: "/schedule", label: "Daily Schedule", desc: "Your hour-by-hour routine", icon: Clock },
  { to: "/consistency", label: "Consistency Checker", desc: "Daily habits & streaks", icon: CalendarCheck2 },
  { to: "/technical", label: "Technical Skills", desc: "Topics you're learning", icon: Code2 },
  { to: "/communication", label: "Communication Skills", desc: "Speaking & grammar practice", icon: MessagesSquare },
  { to: "/aptitude", label: "Aptitude Practice", desc: "Practice questions & accuracy", icon: Calculator },
  { to: "/others", label: "Others", desc: "Health, reading & goals", icon: Sparkles },
];
