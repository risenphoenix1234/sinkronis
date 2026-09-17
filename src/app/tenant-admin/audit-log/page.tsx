// app/tenant-admin/audit-log/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getAuditLog, exportAuditLogCsv } from "@/lib/api/admin";
import { AuditLogRecord, AuditLogFilters } from "@/lib/api/types/admin.types";

const badgePalette = [
  "bg-sky-50 text-sky-700",
  "bg-violet-50 text-violet-700",
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-700",
  "bg-rose-50 text-rose-700",
  "bg-indigo-50 text-indigo-700",
];

function colorFor(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return badgePalette[Math.abs(hash) % badgePalette.length];
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatTimestamp(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AuditLogPage() {
  const [records, setRecords] = useState<AuditLogRecord[]>([]);
  const [filters, setFilters] = useState<AuditLogFilters | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const fetchLog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAuditLog({
        page,
        limit: 10,
        search: search || undefined,
        userId: userFilter !== "ALL" ? userFilter : undefined,
        action: actionFilter !== "ALL" ? actionFilter : undefined,
        module: moduleFilter !== "ALL" ? moduleFilter : undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      });
      setRecords(res.records);
      setFilters(res.filters);
      setPagination({
        currentPage: res.pagination.currentPage,
        totalPages: res.pagination.totalPages,
        totalRecords: res.pagination.totalRecords,
        pageSize: res.pagination.pageSize,
      });
    } catch (err) {
      setError("Failed to load audit log.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchLog, 400);
    return () => clearTimeout(debounce);
  }, [search, userFilter, actionFilter, moduleFilter, dateFrom, dateTo, page]);

  const handleReset = () => {
    setSearch("");
    setUserFilter("ALL");
    setActionFilter("ALL");
    setModuleFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportAuditLogCsv({
        search: search || undefined,
        userId: userFilter !== "ALL" ? userFilter : undefined,
        action: actionFilter !== "ALL" ? actionFilter : undefined,
        module: moduleFilter !== "ALL" ? moduleFilter : undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to export CSV.");
    } finally {
      setExporting(false);
    }
  };

  const rangeStart =
    pagination.totalRecords === 0 ? 0 : (pagination.currentPage - 1) * pagination.pageSize + 1;
  const rangeEnd = Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords);

  const goToPage = (p: number) => {
    setPage(Math.min(Math.max(1, p), pagination.totalPages));
  };

  return (
    <section className="space-y-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Audit Log</h1>
          <p className="mt-1 text-sm text-slate-500">
            A tamper-evident trail of every action taken on this platform.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60"
        >
          <FiDownload size={14} /> {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

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
          {(filters?.users ?? [{ value: "ALL", label: "All Users" }]).map((u) => (
            <option key={u.value} value={u.value}>
              {u.value === "ALL" ? "User: All" : u.label}
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
          {(filters?.actions ?? [{ value: "ALL", label: "All Actions" }]).map((a) => (
            <option key={a.value} value={a.value}>
              {a.value === "ALL" ? "Action: All" : a.label}
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
          {(filters?.modules ?? [{ value: "ALL", label: "All Modules" }]).map((m) => (
            <option key={m.value} value={m.value}>
              {m.value === "ALL" ? "Module: All" : m.label}
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
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                  Loading audit log...
                </td>
              </tr>
            )}

            {!loading &&
              records.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-3 font-mono text-xs text-slate-500">
                    {formatTimestamp(entry.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${colorFor(entry.user.name)}`}
                      >
                        {initialsFor(entry.user.name)}
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {entry.user.name}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${colorFor(entry.action)}`}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${colorFor(entry.module)}`}
                    >
                      {entry.module}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{entry.details}</td>
                  <td className="whitespace-nowrap px-6 py-3 font-mono text-xs text-slate-400">
                    {entry.ipAddress}
                  </td>
                </tr>
              ))}

            {!loading && records.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                  No entries match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {rangeStart}–{rangeEnd} of {pagination.totalRecords} entries
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft size={14} />
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${
                p === pagination.currentPage
                  ? "bg-sky-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}