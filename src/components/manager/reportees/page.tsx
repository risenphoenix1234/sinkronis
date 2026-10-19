// src/app/manager/reportees/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getManagerReportees } from "@/lib/api/manager";
import { useManagerList } from "@/hooks/useManagerList";
import StatusBadge from "@/components/ui/StatusBadge";
import Pager from "@/components/manager/Pager";
import TableState from "@/components/manager/TableState";

export default function ManagerReporteesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { rows, pagination, page, setPage, loading, error, reload } =
    useManagerList(getManagerReportees, search ? { search } : {});

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Reportees</h1>
      <p className="mt-1 text-sm text-gray-500">
        Employees who report directly to you
      </p>

      <div className="mt-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or ID"
          className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        <TableState
          loading={loading}
          error={error}
          empty={rows.length === 0}
          emptyText="No direct reportees found."
          onRetry={reload}
        />
        {!loading && !error && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Job title</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Team</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Lifecycle</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.employeeId}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{r.jobTitle || "—"}</td>
                    <td className="px-5 py-3 text-gray-700">{r.department?.name || "—"}</td>
                    <td className="px-5 py-3 text-gray-700">{r.team?.name || "—"}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.status} variant="pill" />
                    </td>
                    <td className="px-5 py-3 text-gray-700">{r.lifecycleStatus || "—"}</td>
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