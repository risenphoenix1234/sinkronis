"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import DisputeModal from "./DisputeModal";
import { AttendanceLogItem } from "@/lib/api/types/employeeTypes";

interface AttendanceLogTableProps {
  logs?: AttendanceLogItem[];
  monthLabel?: string;
  onDisputeSubmitted?: (date: string) => void;
}

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function formatHours(minutes: number, active?: boolean): string {
  if (!minutes || minutes <= 0) return active ? "0m" : "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h > 0 ? `${h}h ` : ""}${m}m${active ? "+" : ""}`;
}

function getStatusBadgeStyle(status: string) {
  const norm = (status || "").toUpperCase();
  if (norm === "PRESENT") return "bg-[#E8F8F0] text-[#10B981]";
  if (norm === "LATE") return "bg-[#FEF6E6] text-[#D97706]";
  if (norm === "ABSENT") return "bg-[#FEECEC] text-[#EF4444]";
  return "bg-slate-100 text-slate-600";
}

function formatStatusText(status: string): string {
  const norm = (status || "").toUpperCase();
  if (norm === "PRESENT") return "Present";
  if (norm === "LATE") return "Late";
  if (norm === "ABSENT") return "Absent";
  return status;
}

export default function AttendanceLogTable({
  logs,
  monthLabel = "July 2026",
  onDisputeSubmitted,
}: AttendanceLogTableProps) {
  const [disputeTarget, setDisputeTarget] = useState<{
    id?: string;
    date: string;
    status: string;
  } | null>(null);

  const displayLogs = logs ?? [];

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {/* Table Title Header */}
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">
            Attendance Log · {monthLabel}
          </h2>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100/80 text-xs font-medium text-slate-400">
                <th className="px-6 py-4 font-normal">Date</th>
                <th className="px-6 py-4 font-normal">Clock In</th>
                <th className="px-6 py-4 font-normal">Clock Out</th>
                <th className="px-6 py-4 font-normal">Hours</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100/80 text-sm">
              {displayLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-slate-400"
                  >
                    No attendance records found for this period.
                  </td>
                </tr>
              ) : (
                displayLogs.map((item, index) => {
                  const zebra = index % 2 === 1 ? "bg-[#F8F9FC]" : "bg-white";

                  const dateDisplay = formatDateDisplay(item.date);
                  const clockInDisplay = formatTime(item.clockIn);
                  const clockOutDisplay = formatTime(item.clockOut);
                  const hoursDisplay =
                    typeof item.workHours === "number" && item.workHours > 0
                      ? formatHours(Math.round(item.workHours * 60))
                      : "—";
                  const status = item.status;
                  const canDispute = status === "LATE" || status === "ABSENT";
                  const statusText = formatStatusText(status);

                  return (
                    <tr
                      key={item.id || index}
                      className={`transition-colors hover:bg-slate-50/80 ${zebra}`}
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800">
                        {dateDisplay}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {clockInDisplay}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {clockOutDisplay}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {hoursDisplay}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 font-medium ${getStatusBadgeStyle(
                            status,
                          )}`}
                        >
                          {statusText}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        {canDispute ? (
                          <button
                            type="button"
                            onClick={() =>
                              setDisputeTarget({
                                id: item.id,
                                date: dateDisplay,
                                status: statusText,
                              })
                            }
                            className="inline-flex items-center gap-1.5 font-medium text-[#F59E0B] transition hover:text-[#D97706] hover:underline"
                          >
                            <AlertTriangle size={14} className="shrink-0" />
                            <span>Raise Dispute</span>
                          </button>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {disputeTarget && (
        <DisputeModal
          attendanceId={disputeTarget.id}
          date={disputeTarget.date}
          statusLabel={disputeTarget.status}
          onClose={() => setDisputeTarget(null)}
          onSubmitSuccess={() => {
            onDisputeSubmitted?.(disputeTarget.date);
            setDisputeTarget(null);
          }}
        />
      )}
    </>
  );
}
