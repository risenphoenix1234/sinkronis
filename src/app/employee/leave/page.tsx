"use client";

import { ApplyModal } from "@/components/employee/leave/ApplyModal";
import { MiniCalendar } from "@/components/employee/leave/Minicalender";
import { getEmployeeLeave } from "@/lib/api/employee";
import {
  EmployeeLeaveBalanceItem,
  EmployeeLeavePageData,
} from "@/lib/api/types/employeeTypes";
import { useCallback, useEffect, useState } from "react";

// ── Palette Themes for Dynamic Balances ────────────────────────────────────

const BALANCE_COLOR_THEMES = [
  { dotColor: "bg-blue-500", barColor: "bg-blue-500" },
  { dotColor: "bg-green-500", barColor: "bg-green-500" },
  { dotColor: "bg-purple-500", barColor: "bg-purple-400" },
  { dotColor: "bg-amber-500", barColor: "bg-amber-400" },
];

const DEFAULT_BALANCES: EmployeeLeaveBalanceItem[] = [
  {
    leaveTypeId: "default-annual",
    code: "ANNUAL",
    name: "Annual",
    totalDays: 0,
    usedDays: 0,
    remainingDays: 0,
    pendingDays: 0,
    entitlementYear: new Date().getFullYear(),
  },
  {
    leaveTypeId: "default-sick",
    code: "SICK",
    name: "Sick",
    totalDays: 0,
    usedDays: 0,
    remainingDays: 0,
    pendingDays: 0,
    entitlementYear: new Date().getFullYear(),
  },
  {
    leaveTypeId: "default-casual",
    code: "CASUAL",
    name: "Casual",
    totalDays: 0,
    usedDays: 0,
    remainingDays: 0,
    pendingDays: 0,
    entitlementYear: new Date().getFullYear(),
  },
  {
    leaveTypeId: "default-maternity",
    code: "MATERNITY",
    name: "Maternity/Paternity",
    totalDays: 0,
    usedDays: 0,
    remainingDays: 0,
    pendingDays: 0,
    entitlementYear: new Date().getFullYear(),
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function formatStatus(status: string): string {
  const s = (status || "").toUpperCase();
  if (s === "APPROVED") return "Approved";
  if (s === "PENDING") return "Pending";
  if (s === "REJECTED") return "Rejected";
  if (s === "CANCELLED") return "Cancelled";
  if (s === "DRAFT") return "Draft";
  return status;
}

function statusBadgeClass(status: string): string {
  const base = "text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center";
  const s = (status || "").toUpperCase();
  if (s === "APPROVED") return `${base} bg-green-100 text-green-700`;
  if (s === "PENDING") return `${base} bg-yellow-100 text-yellow-700`;
  if (s === "REJECTED") return `${base} bg-red-100 text-red-600`;
  if (s === "CANCELLED") return `${base} bg-gray-100 text-gray-700`;
  if (s === "DRAFT") return `${base} bg-slate-100 text-slate-700`;
  return `${base} bg-blue-50 text-blue-700`;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const cleanDateStr = dateStr.split("T")[0];
    const [y, m, d] = cleanDateStr.split("-").map(Number);
    if (!y || !m || !d) return dateStr;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function MyLeave() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState<EmployeeLeavePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Month navigation: default to current month in YYYY-MM format
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchLeaveData = useCallback(async (month: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEmployeeLeave({ month });
      setData(response);
    } catch (err: unknown) {
      console.error("Failed to load employee leave data:", err);
      setError("Failed to load leave records. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaveData(selectedMonth);
  }, [selectedMonth, fetchLeaveData]);

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
  };

  const pendingCount = data?.pendingRequestsCount ?? 0;
  const balances = data?.balances ?? [];
  const displayBalances = balances.length > 0 ? balances : DEFAULT_BALANCES;
  const history = data?.history ?? [];

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

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
          <span>{error}</span>
          <button
            onClick={() => fetchLeaveData(selectedMonth)}
            className="text-xs font-semibold underline hover:text-red-800 ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Pending banner ── */}
      {!loading && pendingCount > 0 && (
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
      {loading && !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 animate-pulse"
            >
              <div className="h-3 w-20 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-12 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-32 bg-gray-100 rounded mb-4" />
              <div className="h-1.5 w-full bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {displayBalances.map((b, idx) => {
            const theme = BALANCE_COLOR_THEMES[idx % BALANCE_COLOR_THEMES.length];
            const pct =
              b.totalDays > 0
                ? Math.min(100, Math.round((b.usedDays / b.totalDays) * 100))
                : 0;

            return (
              <div
                key={b.leaveTypeId || b.code || idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${theme.dotColor}`} />
                  <span className="text-xs font-medium text-gray-500 truncate" title={b.name}>
                    {b.name}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-0.5">
                  {b.remainingDays}
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  {b.remainingDays} of {b.totalDays} days remaining
                </p>
                {/* Progress bar */}
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${theme.barColor} rounded-full transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Body: History + Calendar ── */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Leave History */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 overflow-hidden">
          <h2 className="text-sm font-semibold text-gray-800 mb-5">
            Leave History
          </h2>

          {loading ? (
            <div className="space-y-4 animate-pulse py-2">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          ) : history.length > 0 ? (
            <div className="overflow-x-auto">
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
                  {history.map((row, i) => (
                    <tr
                      key={row.id || i}
                      className={`border-b border-gray-50 ${i % 2 === 1 ? "bg-gray-50/60" : ""}`}
                    >
                      <td className="py-3.5 pr-4 text-xs font-bold text-gray-800 whitespace-nowrap">
                        {row.leaveType?.name || row.leaveType?.code || "Leave"}
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(row.startDate)}
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(row.endDate)}
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-gray-700 font-medium">
                        {row.days}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={statusBadgeClass(row.status)}>
                          {formatStatus(row.status)}
                        </span>
                      </td>
                      <td className="py-3.5 text-xs text-gray-400 max-w-xs truncate" title={row.managerComment || ""}>
                        {row.managerComment || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">
              <svg
                className="w-10 h-10 mx-auto mb-3 text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p className="text-sm font-medium text-gray-600">No leave requests found</p>
              <p className="text-xs text-gray-400 mt-1">
                You have not submitted any leave requests for this period.
              </p>
            </div>
          )}
        </div>

        {/* Mini Calendar */}
        <div className="w-full lg:w-[260px] shrink-0">
          <MiniCalendar
            calendar={data?.calendar}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>

      {/* ── Apply Modal ── */}
      {showModal && (
        <ApplyModal
          onClose={() => setShowModal(false)}
          balances={balances}
          onSubmitted={() => fetchLeaveData(selectedMonth)}
        />
      )}
    </div>
  );
}
