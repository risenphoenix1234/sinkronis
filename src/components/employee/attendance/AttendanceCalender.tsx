"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { calendarDays } from "@/data/employee/attendance";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AttendanceCalendar() {
  const getDotColor = (status?: string) => {
    switch (status) {
      case "Present":
        return "bg-green-500";

      case "Late":
        return "bg-yellow-500";

      case "Absent":
        return "bg-red-500";

      default:
        return "bg-transparent";
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6">
      {/* Header */}

      <div className="mb-8 flex items-center gap-5">
        <button className="rounded border p-2 hover:bg-gray-50">
          <ChevronLeft size={16} />
        </button>

        <h2 className="font-semibold">July 2026</h2>

        <button className="rounded border p-2 hover:bg-gray-50">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Week Days */}

      <div className="mb-3 grid grid-cols-7 text-center text-xs font-medium text-slate-500">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar */}

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => (
          <div
            key={day.day}
            className="flex h-16 flex-col items-center justify-center rounded border"
          >
            <span className="text-sm">{day.day}</span>

            {day.status && (
              <div
                className={`mt-2 h-2 w-2 rounded-full ${getDotColor(
                  day.status,
                )}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Legend */}

      <div className="mt-8 flex flex-wrap gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Present
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          Late
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          Absent
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gray-300" />
          Weekend
        </div>
      </div>
    </div>
  );
}
