export default function InfoTip({ text, className = "" }) {
  return (
    <details className={`group relative inline-block ${className}`}>
      <summary
        className="flex h-4 w-4 cursor-pointer list-none items-center justify-center rounded-full bg-ink/10 text-[10px] font-bold text-ink/55 hover:bg-ink/15 [&::-webkit-details-marker]:hidden"
        aria-label="More info"
      >
        i
      </summary>
      <div className="absolute left-1/2 top-full z-20 mt-2 w-60 -translate-x-1/2 rounded-lg bg-sidebar p-3 text-xs leading-relaxed text-white shadow-pop">
        {text}
      </div>
    </details>
  );
}
