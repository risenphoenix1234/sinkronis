// src/app/manager/leave-tracking/page.tsx
"use client";

import { useMemo, useState } from "react";
import { getManagerLeaveRequests } from "@/lib/api/manager";
import { useManagerList } from "@/hooks/useManagerList";
import StatusBadge from "@/components/ui/StatusBadge";
import Pager from "@/components/manager/Pager";
import TableState from "@/components/manager/TableState";

const STATUS_OPTIONS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;

function formatLeaveType(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ManagerLeaveTrackingPage() {
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const params = useMemo(
    () => ({
      ...(status !== "ALL" ? { status } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    }),
    [status, from, to],
  );

  const { rows, pagination, page, setPage, loading, error, reload } =
    useManagerList(getManagerLeaveRequests, params);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Leave Tracking</h1>
      <p className="mt-1 text-sm text-gray-500">
        Leave requests from your direct reportees. Approvals are handled by HR.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : formatLeaveType(s)}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-500">
          From
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-500">
          To
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        <TableState
          loading={loading}
          error={error}
          empty={rows.length === 0}
          emptyText="No leave requests found."
          onRetry={reload}
        />
        {!loading && !error && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Leave type</th>
                  <th className="px-5 py-3 font-medium">From</th>
                  <th className="px-5 py-3 font-medium">To</th>
                  <th className="px-5 py-3 font-medium">Days</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{r.employee.name}</p>
                      <p className="text-xs text-gray-400">
                        {r.employee.employeeId}
                        {r.employee.department ? ` · ${r.employee.department.name}` : ""}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{formatLeaveType(r.leaveType)}</td>
                    <td className="px-5 py-3 text-gray-700">{formatDate(r.from)}</td>
                    <td className="px-5 py-3 text-gray-700">{formatDate(r.to)}</td>
                    <td className="px-5 py-3 text-gray-700">{r.days}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.status} variant="pill" />
                    </td>
                    <td className="max-w-xs truncate px-5 py-3 text-gray-500">
                      {r.rejectionReason || r.managerComment || r.reason || "—"}
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