"use client";

import { AttendanceToday } from "@/lib/api/types/employeeTypes";

interface Props {
  attendance: AttendanceToday;
  onClockIn?: () => void;
  onClockOut?: () => void;
}

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatWorked(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export default function AttendanceHeader({
  attendance,
  onClockIn,
  onClockOut,
}: Props) {
  const {
    status,
    clockInAt,
    clockOutAt,
    workedMinutes,
    canClockIn,
    canClockOut,
  } = attendance;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-5">
        {status === "CLOCKED_OUT" ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">
                Clocked Out • {formatTime(clockOutAt)}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Today&apos;s summary: Total {formatWorked(workedMinutes)} worked
              </p>
            </div>
            <div className="rounded-lg border border-green-500 px-4 py-2 text-xs font-medium text-green-600 transition-colors hover:bg-green-50">
              See you tomorrow!
            </div>
          </div>
        ) : status === "CLOCKED_IN" ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">
                Currently Clocked In • since {formatTime(clockInAt)}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Today&apos;s summary: {formatWorked(workedMinutes)} worked so
                far
              </p>
            </div>
            <button
              onClick={onClockOut}
              disabled={!canClockOut}
              className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              Clock Out
            </button>
          </div>
        ) : (
          // NOT_CLOCKED_IN
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">
                Not clocked in yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Start your day when you&apos;re ready
              </p>
            </div>
            <button
              onClick={onClockIn}
              disabled={!canClockIn}
              className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              Clock In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
