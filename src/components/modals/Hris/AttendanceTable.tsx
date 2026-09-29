"use client";

import { useState } from "react";
import { AttendanceRecord } from "@/types/hris/attendance";
import RateBar from "../../hris/attendance/RateBar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AttendanceTableProps {
  data: AttendanceRecord[];
  onMonthChange?: (monthStr: string) => void;
}

const columns = [
  "Employee",
  "Department",
  "Present",
  "Absent",
  "On Leave",
  "Late",
  "Hours",
  "OT",
  "Rate",
];

function getWorkingDays(year: number, month: number): number {
  let count = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = new Date(year, month, day).getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return count;
}

export default function AttendanceTable({
  data,
  onMonthChange,
}: AttendanceTableProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const workingDays = getWorkingDays(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      const isoMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
      onMonthChange?.(isoMonth);
      return next;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      const isoMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
      onMonthChange?.(isoMonth);
      return next;
    });
  };

  return (
    <section className="mt-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Monthly Report — {monthYear} ({workingDays} working days)
        </h2>

        <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 shadow-xs">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="rounded p-1 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="select-none px-2 text-sm font-medium text-slate-700">
            {monthYear}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="rounded p-1 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-5 py-4 text-left text-xs font-medium text-slate-500"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                  >
                    {/* Employee */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {employee.employee}
                        </p>

                        <p className="text-xs text-slate-400">
                          {employee.employeeCode}
                        </p>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-4 text-slate-600">
                      {employee.department}
                    </td>

                    {/* Present */}
                    <td className="px-5 py-4 font-medium text-green-600">
                      {employee.present}
                    </td>

                    {/* Absent */}
                    <td className="px-5 py-4 font-medium text-red-500">
                      {employee.absent}
                    </td>

                    {/* Leave */}
                    <td className="px-5 py-4 text-slate-600">
                      {employee.leave}
                    </td>

                    {/* Late */}
                    <td className="px-5 py-4 font-medium text-amber-500">
                      {employee.late}
                    </td>

                    {/* Hours */}
                    <td className="px-5 py-4 text-slate-700">
                      {employee.hours}h
                    </td>

                    {/* Overtime */}
                    <td className="px-5 py-4 font-medium text-orange-500">
                      {employee.overtime}
                    </td>

                    {/* Rate */}
                    <td className="px-5 py-4 min-w-[160px]">
                      <RateBar value={employee.rate} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
