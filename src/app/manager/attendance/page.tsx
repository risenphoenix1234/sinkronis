// src/app/manager/attendance/page.tsx
"use client";

import { useState } from "react";
import { getManagerAttendance } from "@/lib/api/manager";
import { useManagerList } from "@/hooks/useManagerList";
import Pager from "@/components/manager/Pager";
import TableState from "@/components/manager/TableState";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "ON_TIME", label: "On time" },
  { value: "LATE", label: "Late" },
  { value: "ABSENT", label: "Absent" },
  { value: "ON_LEAVE", label: "On leave" },
  { value: "EARLY_DEPARTURE", label: "Early departure" },
  { value: "NO_CLOCK_OUT", label: "No clock-out" },
  { value: "OVERTIME", label: "Overtime" },
];

const STATUS_STYLES: Record<string, string> = {
  ON_TIME: "bg-emerald-50 text-emerald-700",
  LATE: "bg-amber-50 text-amber-700",
  ABSENT: "bg-rose-50 text-rose-700",
  ON_LEAVE: "bg-sky-50 text-sky-700",
  EARLY_DEPARTURE: "bg-amber-50 text-amber-700",
  NO_CLOCK_OUT: "bg-rose-50 text-rose-700",
  OVERTIME: "bg-violet-50 text-violet-700",
};

function statusLabel(value: string): string {
  const known = STATUS_OPTIONS.find((o) => o.value === value);
  if (known) return known.label;
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function todayYmd(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatHours(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(2)}h`;
}

export default function ManagerAttendancePage() {
  const [date, setDate] = useState(todayYmd);
  const [status, setStatus] = useState("ALL");

  const { rows, pagination, page, setPage, loading, error, reload } =
    useManagerList(getManagerAttendance, {
      ...(date ? { date } : {}),
      status,
    });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Team Attendance</h1>
      <p className="mt-1 text-sm text-gray-500">
        Attendance records for your direct reportees.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {date && (
          <button
            type="button"
            onClick={() => setDate("")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Show all dates
          </button>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        <TableState
          loading={loading}
          error={error}
          empty={rows.length === 0}
          emptyText="No attendance records for this selection."
          onRetry={reload}
        />
        {!loading && !error && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Clock in</th>
                  <th className="px-5 py-3 font-medium">Clock out</th>
                  <th className="px-5 py-3 font-medium">Hours</th>
                  <th className="px-5 py-3 font-medium">Overtime</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.employeeId}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{r.department || "—"}</td>
                    <td className="px-5 py-3 text-gray-700">{r.date}</td>
                    <td className="px-5 py-3 text-gray-700">{formatTime(r.clockIn)}</td>
                    <td className="px-5 py-3 text-gray-700">{formatTime(r.clockOut)}</td>
                    <td className="px-5 py-3 text-gray-700">{formatHours(r.hours)}</td>
                    <td className="px-5 py-3 text-gray-700">{formatHours(r.overtime)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          STATUS_STYLES[r.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {statusLabel(r.status)}
                      </span>
                      {r.flags?.length > 0 && (
                        <p className="mt-1 text-xs text-gray-400">
                          {r.flags.join(", ")}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager pagination={pagination} page={page} onPageChange={setPage} loading={loading} />
      </div>
    </div>
  );
}