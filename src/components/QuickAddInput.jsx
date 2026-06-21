import { useState } from "react";
import { Plus } from "lucide-react";
import { ACCENTS } from "../data/accents";

export default function QuickAddInput({ placeholder = "Add new item...", onAdd, accent = "consistency", buttonLabel = "Add" }) {
  const [value, setValue] = useState("");
  const a = ACCENTS[accent];

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm shadow-card placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
      <button
        onClick={submit}
        className={`flex shrink-0 items-center gap-1.5 rounded-lg ${a.bg} px-3.5 py-2.5 text-sm font-medium text-white transition hover:opacity-90`}
      >
        <Plus size={16} />
        {buttonLabel}
      </button>
    </div>
  );
}
