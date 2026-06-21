// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

// Returns YYYY-MM-DD for a given Date (defaults to today), in local time.
export const dateKey = (d = new Date()) => {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${yr}-${mo}-${day}`;
};

export const todayKey = () => dateKey(new Date());

// Returns an array of the last n date keys, oldest first, ending today.
export const lastNDateKeys = (n) => {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(dateKey(d));
  }
  return out;
};

export const shortDayLabel = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

export const niceDate = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Given a task's history map { 'YYYY-MM-DD': true }, compute current streak
// (consecutive completed days counting back from today/yesterday).
export const computeStreak = (history = {}) => {
  let streak = 0;
  let cursor = new Date();

  // If today isn't done yet, start counting from yesterday so an unbroken
  // streak isn't reset to 0 the moment the clock ticks past midnight-ish.
  if (!history[dateKey(cursor)]) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (history[dateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const clampPct = (n) => Math.max(0, Math.min(100, Math.round(n)));

export const daysSince = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const now = new Date();
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diff = Math.round((now - start) / 86400000);
  return Math.max(1, diff + 1);
};

export const friendlyDate = (key) => {
  if (!key) return "No due date";
  if (key === todayKey()) return "Today";
  const [y, m, d] = key.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / 86400000);
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return `${niceDate(key)} (overdue)`;
  return niceDate(key);
};

// ---------------------------------------------------------------------------
// Motivational quotes
// ---------------------------------------------------------------------------

export const motivationalQuotes = [
  "Small daily wins compound into skills no one can take from you.",
  "Discipline is choosing what you want most over what you want now.",
  "You don't need to feel ready. You just need to begin.",
  "Consistency turns ordinary effort into extraordinary results.",
  "Every topic you revise today is an interview question you won't fear tomorrow.",
  "Progress hides in the days that feel boring.",
  "Speak today, even if it's only to yourself. Fluency is built, not born.",
  "One percent better, repeated daily, is unstoppable.",
  "Your streak is proof you kept a promise to yourself.",
  "The version of you who gets the offer is built in sessions like this one.",
  "Skipping one day is an accident. Skipping two is a habit forming.",
  "Practice doesn't make perfect. Practice makes prepared.",
  "Confidence is just competence you've rehearsed.",
  "Show up for the boring middle — that's where mastery lives.",
  "Future you is watching what you do today.",
];

export const quoteForToday = () => {
  // Deterministic per day so the dashboard quote stays stable until midnight.
  const seed = todayKey().split("-").join("");
  const idx = Number(seed) % motivationalQuotes.length;
  return motivationalQuotes[idx];
};

// ---------------------------------------------------------------------------
// Tasks (the central task manager used by the Tasks page & Dashboard)
// ---------------------------------------------------------------------------

export const TASK_CATEGORIES = ["Technical", "Communication", "Aptitude", "Consistency", "Others"];
export const TASK_PRIORITIES = ["Low", "Medium", "High"];
export const TASK_STATUSES = ["Pending", "Completed"];

const inDays = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return dateKey(d);
};

export const defaultTasks = [
  {
    id: uid(),
    title: "Revise JavaScript array methods",
    category: "Technical",
    priority: "High",
    status: "Pending",
    dueDate: inDays(0),
    createdAt: todayKey(),
  },
  {
    id: uid(),
    title: "Practice self-introduction out loud",
    category: "Communication",
    priority: "Medium",
    status: "Pending",
    dueDate: inDays(0),
    createdAt: todayKey(),
  },
  {
    id: uid(),
    title: "Solve 10 Percentage questions",
    category: "Aptitude",
    priority: "Medium",
    status: "Pending",
    dueDate: inDays(1),
    createdAt: todayKey(),
  },
  {
    id: uid(),
    title: "Update resume with latest project",
    category: "Others",
    priority: "Low",
    status: "Pending",
    dueDate: inDays(3),
    createdAt: todayKey(),
  },
];

export const emptyTask = {
  title: "",
  category: TASK_CATEGORIES[0],
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

// ---------------------------------------------------------------------------
// Time helpers (used by the Daily Schedule)
// ---------------------------------------------------------------------------

// "10:00" -> "10:00 AM", "13:30" -> "1:30 PM"
export const formatTime12 = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

export const minutesSinceMidnight = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const minutesBetween = (start, end) => {
  const diff = minutesSinceMidnight(end) - minutesSinceMidnight(start);
  return diff < 0 ? diff + 24 * 60 : diff;
};

export const hoursLabel = (totalMinutes) => {
  const hrs = totalMinutes / 60;
  const rounded = Math.round(hrs * 10) / 10;
  return `${rounded} ${rounded === 1 ? "Hour" : "Hours"}`;
};


export const defaultConsistencyTasks = [
  { id: uid(), name: "Wake up by 6:30 AM", history: {}, createdAt: todayKey() },
  { id: uid(), name: "30 minutes of focused study", history: {}, createdAt: todayKey() },
  { id: uid(), name: "No social media before noon", history: {}, createdAt: todayKey() },
];

// ---------------------------------------------------------------------------
// Technical Skills
// ---------------------------------------------------------------------------

export const TECH_STATUSES = ["Not Started", "Learning", "Completed"];

export const defaultTechnicalTopics = [
  { id: uid(), name: "JavaScript", status: "Learning", notes: "", practiceCount: 0 },
  { id: uid(), name: "React", status: "Not Started", notes: "", practiceCount: 0 },
  { id: uid(), name: "Node.js", status: "Not Started", notes: "", practiceCount: 0 },
  { id: uid(), name: "MongoDB", status: "Not Started", notes: "", practiceCount: 0 },
];

// ---------------------------------------------------------------------------
// Communication Skills
// ---------------------------------------------------------------------------

export const COMM_TYPES = ["Speaking", "Grammar", "Self-Intro"];

export const defaultCommunicationData = {
  confidenceLevel: 5,
  entries: [],
};

// ---------------------------------------------------------------------------
// Aptitude Practice
// ---------------------------------------------------------------------------

export const defaultAptitudeTopics = [
  { id: uid(), name: "Percentage", questionsPracticed: 0, correct: 0, wrong: 0 },
  { id: uid(), name: "Profit & Loss", questionsPracticed: 0, correct: 0, wrong: 0 },
  { id: uid(), name: "Time & Work", questionsPracticed: 0, correct: 0, wrong: 0 },
];

// ---------------------------------------------------------------------------
// Other Improvements
// ---------------------------------------------------------------------------

export const OTHER_CATEGORIES = [
  "Health",
  "Reading",
  "Discipline",
  "Resume",
  "LinkedIn",
  "Custom",
];

export const defaultOtherGoals = [
  { id: uid(), category: "Resume", name: "Update resume with latest project", completed: false },
  { id: uid(), category: "LinkedIn", name: "Refresh LinkedIn headline & summary", completed: false },
  { id: uid(), category: "Reading", name: "Read 10 pages today", completed: false },
  { id: uid(), category: "Health", name: "30 minutes of exercise", completed: false },
];

// ---------------------------------------------------------------------------
// Daily Schedule
// ---------------------------------------------------------------------------

export const SCHEDULE_TRACKER_META = {
  technical: { title: "Technical Tracker", accent: "technical" },
  communication: { title: "Communication Tracker", accent: "communication" },
  aptitude: { title: "Aptitude Tracker", accent: "aptitude" },
};

export const defaultScheduleItems = [
  // Technical Tracker
  { id: uid(), trackerKey: "technical", task: "React Learning", start: "10:00", end: "11:00", history: {} },
  { id: uid(), trackerKey: "technical", task: "React Assignments", start: "11:00", end: "12:00", history: {} },
  { id: uid(), trackerKey: "technical", task: "JavaScript Interview Topics", start: "13:00", end: "14:00", history: {} },
  { id: uid(), trackerKey: "technical", task: "DSA Practice", start: "18:30", end: "19:30", history: {} },
  { id: uid(), trackerKey: "technical", task: "Project Development", start: "19:30", end: "20:30", history: {} },
  { id: uid(), trackerKey: "technical", task: "GitHub / Resume / LinkedIn", start: "20:30", end: "21:30", history: {} },

  // Communication Tracker
  { id: uid(), trackerKey: "communication", task: "English Speaking", start: "06:00", end: "06:15", history: {} },
  { id: uid(), trackerKey: "communication", task: "Self Introduction", start: "06:15", end: "06:25", history: {} },
  { id: uid(), trackerKey: "communication", task: "Technical Topic Explanation", start: "06:25", end: "06:35", history: {} },
  { id: uid(), trackerKey: "communication", task: "Reading English Article", start: "06:35", end: "06:50", history: {} },
  { id: uid(), trackerKey: "communication", task: "Vocabulary Learning", start: "06:50", end: "06:55", history: {} },
  { id: uid(), trackerKey: "communication", task: "Sentence Writing", start: "06:55", end: "07:00", history: {} },

  // Aptitude Tracker
  { id: uid(), trackerKey: "aptitude", task: "Percentage", start: "07:00", end: "07:20", history: {} },
  { id: uid(), trackerKey: "aptitude", task: "Profit & Loss", start: "07:20", end: "07:40", history: {} },
  { id: uid(), trackerKey: "aptitude", task: "Ratio & Proportion", start: "07:40", end: "08:00", history: {} },
  { id: uid(), trackerKey: "aptitude", task: "Time & Work", start: "08:00", end: "08:20", history: {} },
  { id: uid(), trackerKey: "aptitude", task: "Time, Speed & Distance", start: "08:20", end: "08:40", history: {} },
  { id: uid(), trackerKey: "aptitude", task: "Reasoning", start: "08:40", end: "09:00", history: {} },
  { id: uid(), trackerKey: "aptitude", task: "Revision / Mock Practice", start: "09:00", end: "10:00", history: {} },
];

// The consolidated "Dashboard Summary" view — one row per continuous block of the day.
export const SCHEDULE_TIMELINE = [
  { trackerKey: "communication", label: "Communication", start: "06:00", end: "07:00" },
  { trackerKey: "aptitude", label: "Aptitude", start: "07:00", end: "10:00" },
  { trackerKey: "technical", label: "Technical", start: "10:00", end: "14:00" },
  { trackerKey: "classes", label: "Classes", start: "15:00", end: "18:00" },
  { trackerKey: "technical", label: "Technical (Continued)", start: "18:30", end: "21:30" },
];
