import type {
  EmployeeLeaveCalendarData,
  EmployeeLeaveCalendarEntry,
} from "@/lib/api/types/employeeTypes";

interface MiniCalendarProps {
  calendar?: EmployeeLeaveCalendarData | null;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

export function MiniCalendar({
  calendar,
  selectedMonth,
  onMonthChange,
}: MiniCalendarProps) {
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

  // Use provided selectedMonth, or calendar.month, or default to current date
  const activeMonthStr =
    selectedMonth || calendar?.month || new Date().toISOString().slice(0, 7);

  const [yearStr, monthStr] = activeMonthStr.split("-");
  const year = parseInt(yearStr, 10) || new Date().getFullYear();
  const month = parseInt(monthStr, 10) || new Date().getMonth() + 1; // 1-indexed

  // Month name display (e.g., "September 2026")
  const monthDate = new Date(year, month - 1, 1);
  const monthLabel = monthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Days count and offset for Monday-start grid
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7; // Mon=0, Sun=6

  const cells: (number | null)[] = [
    ...Array(firstDayWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // Pre-index approved and pending days from calendar entries
  const approvedDays = new Set<number>();
  const pendingDays = new Set<number>();

  if (calendar?.entries && Array.isArray(calendar.entries)) {
    calendar.entries.forEach((entry: EmployeeLeaveCalendarEntry) => {
      const statusUpper = (entry.status || "").toUpperCase();
      const datesToInspect: string[] = [];

      if (Array.isArray(entry.dates) && entry.dates.length > 0) {
        datesToInspect.push(...entry.dates);
      } else if (entry.startDate) {
        datesToInspect.push(entry.startDate);
      }

      datesToInspect.forEach((dStr) => {
        // dStr can be "YYYY-MM-DD" or ISO string
        const datePart = dStr.split("T")[0];
        const [dYear, dMonth, dDay] = datePart.split("-").map(Number);
        if (dYear === year && dMonth === month && dDay) {
          if (statusUpper === "APPROVED") {
            approvedDays.add(dDay);
          } else if (statusUpper === "PENDING") {
            pendingDays.add(dDay);
          }
        }
      });
    });
  }

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const isCurrentMonth = year === todayYear && month === todayMonth;
  const currentMonthStr = `${todayYear}-${String(todayMonth).padStart(2, "0")}`;

  const handlePrevMonth = () => {
    if (!onMonthChange) return;
    const prevDate = new Date(year, month - 2, 1);
    const prevStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
    onMonthChange(prevStr);
  };

  const handleNextMonth = () => {
    if (!onMonthChange) return;
    const nextDate = new Date(year, month, 1);
    const nextStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;
    onMonthChange(nextStr);
  };

  const handleToday = () => {
    if (!onMonthChange) return;
    onMonthChange(currentMonthStr);
  };

  const getDayClass = (day: number | null) => {
    if (!day) return "";
    const isToday = isCurrentMonth && day === todayDay;

    if (pendingDays.has(day)) {
      return isToday
        ? "bg-yellow-400 text-white rounded-md font-bold ring-2 ring-yellow-500 ring-offset-1"
        : "bg-yellow-400 text-white rounded-md font-semibold";
    }
    if (approvedDays.has(day)) {
      return isToday
        ? "bg-blue-500 text-white rounded-md font-bold ring-2 ring-blue-500 ring-offset-1"
        : "bg-blue-500 text-white rounded-md font-semibold";
    }
    if (isToday) {
      return "bg-sky-600 text-white rounded-full font-bold shadow-xs ring-2 ring-sky-500/30";
    }
    return "text-gray-600 hover:bg-gray-100 rounded-md";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">
            {monthLabel}
          </span>
          {!isCurrentMonth && onMonthChange && (
            <button
              type="button"
              onClick={handleToday}
              className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-600 hover:bg-sky-100 transition border border-sky-200"
              title="Jump to present day"
            >
              Today
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="text-gray-400 hover:text-gray-700 p-1 transition-colors rounded-lg hover:bg-gray-100"
          >
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
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="text-gray-400 hover:text-gray-700 p-1 transition-colors rounded-lg hover:bg-gray-100"
          >
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
      <div className="flex items-center flex-wrap gap-4 mt-4 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 ring-1 ring-sky-300" />
          <span className="text-[11px] font-medium text-gray-700">Today</span>
        </div>
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
