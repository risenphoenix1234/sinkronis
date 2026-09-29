"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AttendanceCalendarDayItem {
  date: string;
  attendanceStatus?: string | null;
  dayType?: string;
  [key: string]: unknown;
}

export interface AttendanceCalendarData {
  days?: AttendanceCalendarDayItem[];
  [key: string]: unknown;
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface AttendanceCalendarProps {
  calendar?: AttendanceCalendarData | null;
  selectedMonth: string; // "YYYY-MM"
  onMonthChange: (month: string) => void;
}

export default function AttendanceCalendar({
  calendar,
  selectedMonth,
  onMonthChange,
}: AttendanceCalendarProps) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1; // 1-indexed
  const todayDate = today.getDate();
  const currentMonthStr = `${todayYear}-${String(todayMonth).padStart(2, "0")}`;

  const [yearStr, monthStr] = (selectedMonth || currentMonthStr).split("-");
  const year = parseInt(yearStr, 10) || todayYear;
  const month = parseInt(monthStr, 10) || todayMonth;

  const currentMonthDate = new Date(year, month - 1, 1);
  const formattedMonth = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth = year === todayYear && month === todayMonth;

  const handlePrevMonth = () => {
    const prevDate = new Date(year, month - 2, 1);
    const m = String(prevDate.getMonth() + 1).padStart(2, "0");
    onMonthChange(`${prevDate.getFullYear()}-${m}`);
  };

  const handleNextMonth = () => {
    const nextDate = new Date(year, month, 1);
    const m = String(nextDate.getMonth() + 1).padStart(2, "0");
    onMonthChange(`${nextDate.getFullYear()}-${m}`);
  };

  const handleToday = () => {
    onMonthChange(currentMonthStr);
  };

  // Day 1 offset (0 for Mon, 1 for Tue, ..., 6 for Sun)
  const firstDaySunZero = currentMonthDate.getDay(); // 0 = Sun
  const startOffset = (firstDaySunZero + 6) % 7;
  const emptyLeadingSlots = Array.from({ length: startOffset });

  const getDotClass = (status?: string | null, dayType?: string) => {
    const normalized = (status || "").toUpperCase();
    if (normalized === "PRESENT") return "bg-[#10B981]";
    if (normalized === "LATE") return "bg-[#B45309]";
    if (normalized === "ABSENT") return "bg-[#EF4444]";
    if (dayType === "WEEKEND") return "bg-[#CBD5E1]";
    return null;
  };

  // Total days in the active month
  const totalDaysInMonth = new Date(year, month, 0).getDate();

  // Index any existing days data from backend calendar
  const daysMap = new Map<
    number,
    { attendanceStatus?: string | null; dayType?: string }
  >();
  if (calendar?.days && Array.isArray(calendar.days)) {
    calendar.days.forEach((item: AttendanceCalendarDayItem) => {
      if (item && item.date) {
        const parts = item.date.split("-");
        const d = parseInt(parts[2], 10);
        if (!isNaN(d)) {
          daysMap.set(d, item);
        }
      }
    });
  }

  // Generate full month days (1..totalDaysInMonth)
  const days = Array.from({ length: totalDaysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const dayOfWeek = new Date(year, month - 1, dayNum).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const existing = daysMap.get(dayNum);
    const isToday = isCurrentMonth && dayNum === todayDate;

    return {
      date: dateStr,
      dayNum,
      attendanceStatus: existing?.attendanceStatus ?? null,
      dayType: existing?.dayType ?? (isWeekend ? "WEEKEND" : "WORKDAY"),
      isToday,
      isWeekend,
    };
  });

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      {/* Header with Prev/Next Controls and Today */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>

          <h2 className="text-base font-bold text-slate-900">
            {formattedMonth}
          </h2>

          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next Month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 active:scale-95"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!isCurrentMonth ? (
            <button
              type="button"
              onClick={handleToday}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 active:scale-95 shadow-xs"
            >
              Jump to Today
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-600 animate-pulse" />
              Today:{" "}
              {today.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Weekday Names */}
      <div className="mb-3 grid grid-cols-7 text-center text-xs font-medium text-slate-500">
        {weekDays.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2.5">
        {/* Leading empty slots for calendar offset */}
        {emptyLeadingSlots.map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[58px]" />
        ))}

        {/* Calendar Days */}
        {days.map((item) => {
          const dotClass = getDotClass(item.attendanceStatus, item.dayType);
          const isAbsent =
            (item.attendanceStatus || "").toUpperCase() === "ABSENT";
          const isWeekend = item.isWeekend;

          return (
            <div
              key={item.date}
              className={`relative flex min-h-[62px] flex-col items-center justify-center rounded-xl p-2 transition ${
                item.isToday
                  ? "border-2 border-sky-500 bg-sky-50/70 shadow-sm ring-2 ring-sky-500/20"
                  : "border border-slate-100/90 bg-[#F9FAFB] hover:bg-slate-100/60"
              }`}
            >
              {item.isToday ? (
                <div className="flex flex-col items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white shadow-xs">
                    {item.dayNum}
                  </span>
                  <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-600">
                    Today
                  </span>
                </div>
              ) : (
                <span
                  className={`text-xs font-semibold ${
                    isAbsent
                      ? "text-[#EF4444]"
                      : isWeekend
                        ? "text-slate-400"
                        : "text-slate-700"
                  }`}
                >
                  {item.dayNum}
                </span>
              )}

              {dotClass ? (
                <div className={`mt-1 h-1.5 w-1.5 rounded-full ${dotClass}`} />
              ) : (
                <div className="mt-1 h-1.5 w-1.5 opacity-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-600 ring-2 ring-sky-300" />
          <span className="font-semibold text-slate-800">Today</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#10B981]" />
          <span>Present</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#B45309]" />
          <span>Late</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#EF4444]" />
          <span>Absent</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#CBD5E1]" />
          <span>Weekend</span>
        </div>
      </div>
    </div>
  );
}
