"use client";

import { useState } from "react";
import { attendanceLog } from "@/data/employee/attendance";
import DisputeModal from "./DisputeModal";

type AttendanceStatus = "Present" | "Late" | "Absent" | "weekend" | null;

const statusConfig: Record<
  Exclude<AttendanceStatus, null>,
  { label: string; color: string }
> = {
  Present: {
    label: "Present",
    color: "text-green-600",
  },
  Late: {
    label: "Late",
    color: "text-amber-500",
  },
  Absent: {
    label: "Absent",
    color: "text-red-500",
  },
  weekend: {
    label: "Weekend",
    color: "text-gray-400",
  },
};

export default function AttendanceLogTable() {
  const [disputeTarget, setDisputeTarget] = useState<{
    date: string;
    status: string;
  } | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}

        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Attendance Log - July 2026
          </h2>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Clock In</th>
                <th className="px-6 py-4">Clock Out</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {attendanceLog.map((entry) => {
                const status =
                  entry.status === null
                    ? {
                        label: "-",
                        color: "text-gray-400",
                      }
                    : statusConfig[entry.status];

                return (
                  <tr
                    key={entry.date}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {entry.date}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {entry.clockIn}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {entry.clockOut}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {entry.hoursWorked}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          setDisputeTarget({
                            date: entry.date,
                            status: status.label,
                          })
                        }
                        className="text-sm font-medium text-orange-500 transition hover:text-orange-600 hover:underline"
                      >
                        Raise Dispute
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {disputeTarget && (
        <DisputeModal
          date={disputeTarget.date}
          statusLabel={disputeTarget.status}
          onClose={() => setDisputeTarget(null)}
        />
      )}
    </>
  );
}
