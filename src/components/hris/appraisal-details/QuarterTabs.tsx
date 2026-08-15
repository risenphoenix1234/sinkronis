interface QuarterTabsProps {
  active?: "Q1" | "Q2" | "Q3" | "Q4";
}

const quarters = ["Q1", "Q2", "Q3", "Q4"] as const;

export default function QuarterTabs({ active = "Q2" }: QuarterTabsProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-500">Quarter:</span>

      {quarters.map((quarter) => (
        <button
          key={quarter}
          className={`rounded-full px-4 py-1 text-xs font-semibold transition

          ${
            quarter === active
              ? "bg-[#1677C8] text-white"
              : "bg-[#EEF2F7] text-slate-500"
          }`}
        >
          {quarter}
        </button>
      ))}
    </div>
  );
}
