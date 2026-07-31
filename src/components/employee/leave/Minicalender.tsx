import { approvedDays, pendingDays } from "@/data/employee/leave";

export function MiniCalendar() {
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

  // July 2026 starts on Wednesday (index 2 in Mon-first grid)
  // Fill leading empty slots
  const leadingBlanks = 2; // Mon, Tue before Wed 1 Jul
  const daysInMonth = 31;

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const getDayClass = (day: number | null) => {
    if (!day) return "";
    if (pendingDays.has(day)) return "bg-yellow-400 text-white ";
    if (approvedDays.has(day)) return "bg-blue-500 text-white ";
    return "text-gray-600";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button className="text-gray-400 hover:text-gray-700 p-1 transition-colors">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-800">July 2026</span>
        <button className="text-gray-400 hover:text-gray-700 p-1 transition-colors">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekdays.map((d, i) => (
          <div
            key={i}
            className="text-center text-[11px] font-semibold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="space-y-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => (
              <div key={di} className="flex items-center justify-center h-8">
                {day && (
                  <span
                    className={`text-xs w-7 h-7 flex items-center justify-center ${getDayClass(day)}`}
                  >
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
          <span className="text-[11px] text-gray-500">Approved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400" />
          <span className="text-[11px] text-gray-500">Pending</span>
        </div>
      </div>
    </div>
  );
}
