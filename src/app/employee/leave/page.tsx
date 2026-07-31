"use client";

import { ApplyModal } from "@/components/employee/leave/ApplyModal";
import { MiniCalendar } from "@/components/employee/leave/Minicalender";
import { balances, leaveHistory } from "@/data/employee/leave";
import { LeaveStatus } from "@/types/hris/leave";
import { useState } from "react";

// ── Helpers ────────────────────────────────────────────────────────────────

function statusBadge(status: LeaveStatus) {
  const base = "text-xs font-semibold px-3 py-1 rounded-full";
  if (status === "Approved") return `${base} bg-green-100 text-green-600`;
  if (status === "Pending") return `${base} bg-yellow-100 text-yellow-600`;
  return `${base} bg-red-100 text-red-500`;
}
// ── Main page ──────────────────────────────────────────────────────────────

export default function MyLeave() {
  const [showModal, setShowModal] = useState(false);

  const pendingCount = leaveHistory.filter(
    (r) => r.status === "Pending",
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans px-8 py-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Leave</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your leave balances and requests
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2.5}
            className="w-4 h-4"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Apply for Leave
        </button>
      </div>

      {/* ── Pending banner ── */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-2.5 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d97706"
            strokeWidth={2}
            className="w-4 h-4 shrink-0"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-sm font-medium text-yellow-700">
            {pendingCount} pending request{pendingCount > 1 ? "s" : ""} awaiting
            approval
          </span>
        </div>
      )}

      {/* ── Balance cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {balances.map((b) => {
          const pct = Math.round((b.used / b.total) * 100);
          return (
            <div
              key={b.type}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${b.dotColor}`} />
                <span className="text-xs font-medium text-gray-500">
                  {b.type}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-0.5">
                {b.used}
              </p>
              <p className="text-xs text-gray-400 mb-3">
                {b.used} of {b.total} days remaining
              </p>
              {/* Progress bar */}
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${b.barColor} rounded-full`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Body: History + Calendar ── */}
      <div className="flex gap-5">
        {/* Leave History */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-5">
            Leave History
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  "Type",
                  "Start",
                  "End",
                  "Days",
                  "Status",
                  "Manager Comment",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left pb-3 text-xs font-semibold text-gray-400 pr-4 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-50 ${i % 2 === 1 ? "bg-gray-50/60" : ""}`}
                >
                  <td className="py-3.5 pr-4 text-xs font-bold text-gray-800">
                    {row.type}
                  </td>
                  <td className="py-3.5 pr-4 text-xs text-gray-500 whitespace-nowrap">
                    {row.start}
                  </td>
                  <td className="py-3.5 pr-4 text-xs text-gray-500 whitespace-nowrap">
                    {row.end}
                  </td>
                  <td className="py-3.5 pr-4 text-xs text-gray-700 font-medium">
                    {row.days}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={statusBadge(row.status)}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-xs text-gray-400">
                    {row.comment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mini Calendar */}
        <div className="w-[260px] shrink-0">
          <MiniCalendar />
        </div>
      </div>

      {/* ── Apply Modal ── */}
      {showModal && <ApplyModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
