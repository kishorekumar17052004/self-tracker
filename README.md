# Self Tracker

A personal self-improvement tracker built with React + Vite + Tailwind CSS. It helps a student or fresher stay consistent and manage tasks across technical skills, communication skills, aptitude preparation, daily habits, and other personal goals — all saved locally in the browser.

## Features

- **Dashboard** — a welcome message, today's date, a motivational quote, total/completed/pending task counts, today's & weekly progress, category-wise progress cards, a recent tasks list, and a quick-add-task button.
- **Tasks** — a full task manager: add tasks with a category, priority, status, and due date; edit or delete any task; mark tasks complete; filter by category and status; search by title.
- **Consistency Checker** — add daily habits, mark them done, track streaks and missed days, and see a simple weekly calendar view.
- **Technical Skills** — add topics (JavaScript, React, Node.js, MongoDB, ...), set status (Not Started / Learning / Completed), keep notes, and log practice sessions.
- **Communication Skills** — log speaking practice topics, grammar sessions, self-introduction practice, and track a 1–10 confidence level.
- **Aptitude Practice** — add topics (Percentage, Profit & Loss, Time & Work, ...), log correct/wrong answers per session, and see accuracy.
- **Others** — track health, reading, discipline, resume/LinkedIn updates, or any custom goal, organized by category.

All data is stored in your browser's `localStorage` — nothing is sent to a server.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`) in your browser.

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
 ├── components/
 │   ├── Navbar.jsx          Top bar — date display + mobile menu
 │   ├── Sidebar.jsx         Persistent desktop navigation
 │   ├── DashboardCard.jsx   Small stat tile (used on Dashboard, Aptitude, Communication)
 │   ├── ProgressCard.jsx    Category progress card with a link, icon, and progress bar
 │   ├── TaskCard.jsx        Generic row with complete/edit/delete (tasks, habits, goals)
 │   ├── AddTaskModal.jsx    Modal form to create or edit a task
 │   ├── FilterBar.jsx       Category + status filter dropdowns
 │   ├── SearchBar.jsx       Search input with clear button
 │   ├── ProgressBar.jsx     Reusable progress bar
 │   ├── QuoteCard.jsx       Daily motivational quote
 │   ├── StatusBadge.jsx     Small status pill (Pending/Completed/Not Started/...)
 │   ├── QuickAddInput.jsx   Inline add-item input (habits, topics)
 │   ├── InfoTip.jsx         Tappable "i" icon with a plain-language explanation
 │   └── Toast.jsx           Toast notification provider + hook
 ├── pages/
 │   ├── Dashboard.jsx
 │   ├── Tasks.jsx
 │   ├── Consistency.jsx
 │   ├── Technical.jsx
 │   ├── Communication.jsx
 │   ├── Aptitude.jsx
 │   └── Others.jsx
 ├── data/
 │   ├── defaultData.js   Seed data, task model, and date/streak helpers
 │   ├── accents.js       Category color tokens + priority badge styles
 │   └── navLinks.js      Shared nav link list (used by Sidebar and Navbar)
 ├── hooks/
 │   └── useLocalStorage.js
 ├── App.jsx              Routes + layout
 └── main.jsx             Entry point
```

## Resetting your data

Each section stores its own key in `localStorage` (prefixed with `selftracker:`). To start fresh, open your browser's dev tools → Application → Local Storage, and remove the relevant keys (or clear all of them).
