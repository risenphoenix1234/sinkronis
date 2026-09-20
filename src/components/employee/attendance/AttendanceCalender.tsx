"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AttendanceCalendarData } from "@/lib/api/types/employeeTypes";

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
  const [yearStr, monthStr] = (selectedMonth || "2026-07").split("-");
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 7;

  const currentMonthDate = new Date(year, month - 1, 1);
  const formattedMonth = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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

  const days = calendar?.days ?? [];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      {/* Header with Prev/Next Controls */}
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          aria-label="Previous Month"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>

        <h2 className="text-base font-bold text-slate-900">{formattedMonth}</h2>

        <button
          type="button"
          onClick={handleNextMonth}
          aria-label="Next Month"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 active:scale-95"
        >
          <ChevronRight size={16} />
        </button>
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
          const dayNum = parseInt(item.date.split("-")[2], 10);
          const isAbsent = (item.attendanceStatus || "").toUpperCase() === "ABSENT";
          const isWeekend = item.dayType === "WEEKEND";

          return (
            <div
              key={item.date}
              className="flex min-h-[58px] flex-col items-center justify-center rounded-xl border border-slate-100/90 bg-[#F9FAFB] p-2 transition hover:bg-slate-100/60"
            >
              <span
                className={`text-xs font-semibold ${
                  isAbsent
                    ? "text-[#EF4444]"
                    : isWeekend
                    ? "text-slate-400"
                    : "text-slate-700"
                }`}
              >
                {dayNum}
              </span>

              {dotClass ? (
                <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${dotClass}`} />
              ) : (
                <div className="mt-1.5 h-1.5 w-1.5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
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
