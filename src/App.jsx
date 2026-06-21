import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ToastProvider } from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Consistency from "./pages/Consistency";
import Technical from "./pages/Technical";
import Communication from "./pages/Communication";
import Aptitude from "./pages/Aptitude";
import Others from "./pages/Others";

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas font-body text-ink">
        <Sidebar />
        <div className="md:pl-64">
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/consistency" element={<Consistency />} />
              <Route path="/technical" element={<Technical />} />
              <Route path="/communication" element={<Communication />} />
              <Route path="/aptitude" element={<Aptitude />} />
              <Route path="/others" element={<Others />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
