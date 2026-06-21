/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

const TONE = {
  success: "bg-brand",
  info: "bg-sidebar",
  danger: "bg-track-communication",
};

const ICONS = { success: CheckCircle2, info: Info, danger: XCircle };

function ToastItem({ message, type }) {
  const Icon = ICONS[type] || CheckCircle2;
  return (
    <div
      className={`flex animate-fadeIn items-center gap-2 rounded-lg ${TONE[type]} px-4 py-2.5 text-sm font-medium text-white shadow-pop`}
    >
      <Icon size={16} className="shrink-0" />
      {message}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Friendly fallback so a page never crashes if used outside the provider.
export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx || { show: () => {} };
}
