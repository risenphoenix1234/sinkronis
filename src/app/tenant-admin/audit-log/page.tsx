// app/tenant-admin/audit-log/page.tsx
"use client";

import { useMemo, useState } from "react";
import { FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  auditLogEntries,
  actionStyles,
  moduleStyles,
  avatarColors,
  uniqueUsers,
  uniqueActions,
  uniqueModules,
} from "@/lib/audit-log-data";

const PAGE_SIZE = 10;

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return auditLogEntries.filter((entry) => {
      if (userFilter !== "All" && entry.userName !== userFilter) return false;
      if (actionFilter !== "All" && entry.action !== actionFilter) return false;
      if (moduleFilter !== "All" && entry.module !== moduleFilter) return false;

      if (dateFrom && entry.timestamp < dateFrom) return false;
      if (dateTo && entry.timestamp > `${dateTo}T23:59:59`) return false;

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = `${entry.userName} ${entry.details}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [search, userFilter, actionFilter, moduleFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageEntries = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const handleReset = () => {
    setSearch("");
    setUserFilter("All");
    setActionFilter("All");
    setModuleFilter("All");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const handleExport = () => {
    // Hook up to actual CSV generation / download here.
    console.log("Exporting audit log as CSV:", filtered);
  };

  const goToPage = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
  };

  return (
    <section className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Audit Log</h1>
          <p className="mt-1 text-sm text-slate-500">
            A tamper-evident trail of every action taken on this platform.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 whitespace-nowrap"
        >
          <FiDownload size={14} /> Export CSV
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative min-w-[220px] flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by user or details..."
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
          />
        </div>

        <select
          value={userFilter}
          onChange={(e) => {
            setUserFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
        >
          <option value="All">User: All</option>
          {uniqueUsers.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
        >
          <option value="All">Action: All</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={moduleFilter}
          onChange={(e) => {
            setModuleFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
        >
          <option value="All">Module: All</option>
          {uniqueModules.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
        />

        <button
          onClick={handleReset}
          className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Timestamp</th>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium">Module</th>
              <th className="px-6 py-3 font-medium">Details</th>
              <th className="px-6 py-3 font-medium">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                  {entry.displayTimestamp}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                        avatarColors[entry.userInitials] ?? "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {entry.userInitials}
                    </span>
                    <span className="text-sm font-medium text-slate-800">{entry.userName}</span>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${actionStyles[entry.action]}`}
                  >
                    {entry.action}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${moduleStyles[entry.module]}`}
                  >
                    {entry.module}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-600">{entry.details}</td>
                <td className="px-6 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">
                  {entry.ipAddress}
                </td>
              </tr>
            ))}
            {pageEntries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                  No entries match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {rangeStart}–{rangeEnd} of {filtered.length} entries
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${
                p === currentPage
                  ? "bg-sky-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}