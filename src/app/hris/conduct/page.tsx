// src/app/hris/conduct/page.tsx
"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, Download, Plus, Filter, Pencil, RefreshCw } from "lucide-react";

import { getConductOverview, getConductRecords, normalizeConductRecord } from "@/lib/api/hris";
import { ConductOverviewData, ConductRecord } from "@/lib/api/types/hrisTypes";

import QueryDetailsDrawer from "@/components/hris/conduct/QueryDetailsDrawer";
import SuspensionDrawer from "@/components/hris/conduct/SuspensionDrawer";
import { TableHead } from "@/components/hris/conduct/TableHead";
import AddQueryModal from "@/components/modals/Hris/AddQueryModal";
import AddSuspensionModal from "@/components/modals/Hris/AddSuspensionModal";
import StatusBadge from "@/components/ui/StatusBadge";
import ConductSuspensionModal from "@/components/modals/Hris/ConductSuspensionModal";
import EmptyState from "@/components/shared/EmptyState";
import { resolveDepartmentName } from "@/utils/department";

function extractConductRecords(res: unknown): ConductRecord[] {
  let list: ConductRecord[] = [];
  if (Array.isArray(res)) {
    list = res as ConductRecord[];
  } else if (res && typeof res === "object") {
    const payload = (res as { data?: unknown }).data;
    if (Array.isArray(payload)) {
      list = payload as ConductRecord[];
    } else if (payload && typeof payload === "object") {
      const nested =
        (payload as { records?: unknown; items?: unknown }).records ??
        (payload as { items?: unknown }).items;
      if (Array.isArray(nested)) list = nested as ConductRecord[];
    }
  }
  return list.map(normalizeConductRecord);
}

export default function HRISConductPage() {
  const [activeTab, setActiveTab] = useState<"query" | "suspension">("query");
  const [search, setSearch] = useState("");
  const [isAddQueryOpen, setIsAddQueryOpen] = useState(false);
  const [isAddSuspensionOpen, setIsAddSuspensionOpen] = useState(false);

  // Overview metrics
  const [overview, setOverview] = useState<ConductOverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  // Query records
  const [queryRecords, setQueryRecords] = useState<ConductRecord[]>([]);
  const [queryLoading, setQueryLoading] = useState(true);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Suspension records
  const [suspensionRecords, setSuspensionRecords] = useState<ConductRecord[]>([]);
  const [suspensionLoading, setSuspensionLoading] = useState(true);
  const [suspensionError, setSuspensionError] = useState<string | null>(null);

  // Selected records for drawers
  const [selectedQuery, setSelectedQuery] = useState<ConductRecord | null>(null);
  const [selectedSuspension, setSelectedSuspension] = useState<ConductRecord | null>(null);

  const fetchOverview = useCallback(() => {
    setOverviewLoading(true);
    setOverviewError(null);
    getConductOverview()
      .then(setOverview)
      .catch((err) => {
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Failed to load conduct metrics.")
          : "Failed to load conduct metrics.";
        setOverviewError(msg);
        toast.error(msg);
      })
      .finally(() => setOverviewLoading(false));
  }, []);

  const fetchQueryRecords = useCallback(() => {
    setQueryLoading(true);
    setQueryError(null);
    getConductRecords({ type: "QUERY" })
      .then((res) => setQueryRecords(extractConductRecords(res)))
      .catch((err) => {
        console.error("Failed to load conduct queries:", err);
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Failed to load conduct queries.")
          : "Failed to load conduct queries.";
        setQueryError(msg);
        toast.error(msg);
      })
      .finally(() => setQueryLoading(false));
  }, []);

  const fetchSuspensionRecords = useCallback(() => {
    setSuspensionLoading(true);
    setSuspensionError(null);
    getConductRecords({ type: "SUSPENSION" })
      .then((res) => setSuspensionRecords(extractConductRecords(res)))
      .catch((err) => {
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Failed to load conduct suspensions.")
          : "Failed to load conduct suspensions.";
        setSuspensionError(msg);
        toast.error(msg);
      })
      .finally(() => setSuspensionLoading(false));
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchQueryRecords();
    fetchSuspensionRecords();
  }, [fetchOverview, fetchQueryRecords, fetchSuspensionRecords]);

  const filteredQueries = useMemo(() => {
    const searchValue = search.toLowerCase().trim();
    if (!searchValue) return queryRecords;
    return queryRecords.filter((item) => {
      const employeeName = (item.employeeName || "").toLowerCase();
      const employeeId = (item.employeeId || "").toLowerCase();
      const queryType = (item.queryType || "").toLowerCase();
      const department = resolveDepartmentName(item.department).toLowerCase();
      return (
        employeeName.includes(searchValue) ||
        employeeId.includes(searchValue) ||
        queryType.includes(searchValue) ||
        department.includes(searchValue)
      );
    });
  }, [queryRecords, search]);

  const filteredSuspensions = useMemo(() => {
    const searchValue = search.toLowerCase().trim();
    if (!searchValue) return suspensionRecords;
    return suspensionRecords.filter((item) => {
      const employeeName = (item.employeeName || "").toLowerCase();
      const employeeId = (item.employeeId || "").toLowerCase();
      const queryType = (item.queryType || "").toLowerCase();
      const department = resolveDepartmentName(item.department).toLowerCase();
      return (
        employeeName.includes(searchValue) ||
        employeeId.includes(searchValue) ||
        queryType.includes(searchValue) ||
        department.includes(searchValue)
      );
    });
  }, [suspensionRecords, search]);

  // Client-side CSV export
  const handleExportCsv = () => {
    const activeRecords = activeTab === "query" ? filteredQueries : filteredSuspensions;
    if (activeRecords.length === 0) {
      toast.info(`No ${activeTab} records available to export.`);
      return;
    }

    const headers = ["Employee ID", "Name", "Role", "Department", "Type", "Status", "Date"];
    const rows = activeRecords.map((r) => [
      `"${r.employeeId || ""}"`,
      `"${r.employeeName || ""}"`,
      `"${r.role || ""}"`,
      `"${resolveDepartmentName(r.department)}"`,
      `"${r.queryType || ""}"`,
      `"${r.status || ""}"`,
      `"${r.date || ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `conduct-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success(`${activeTab === "query" ? "Queries" : "Suspensions"} exported successfully.`);
  };

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Page Title */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Conduct</h1>
              <p className="mt-1 text-xs text-slate-500">
                Manage disciplinary actions, formal queries, and employee suspensions.
              </p>
            </div>
          </div>

          {/* Overview Metrics Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <p className="text-xs font-medium text-slate-500">Total Queries</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                {overviewLoading ? "…" : overview?.totalQueries ?? 0}
              </h2>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <p className="text-xs font-medium text-slate-500">Active Suspensions</p>
              <h2 className="mt-1 text-2xl font-bold text-amber-600">
                {overviewLoading ? "…" : overview?.activeSuspensions ?? 0}
              </h2>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <p className="text-xs font-medium text-slate-500">In Progress</p>
              <h2 className="mt-1 text-2xl font-bold text-blue-600">
                {overviewLoading ? "…" : overview?.inProgress ?? 0}
              </h2>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => {
                  setActiveTab("query");
                  setSelectedSuspension(null);
                }}
                className={`px-4 pb-3 text-sm font-medium transition-colors ${
                  activeTab === "query"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Queries ({queryRecords.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab("suspension");
                  setSelectedQuery(null);
                }}
                className={`px-4 pb-3 text-sm font-medium transition-colors ${
                  activeTab === "suspension"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Suspensions ({suspensionRecords.length})
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCsv}
                title="Export records to CSV"
                className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-600 shadow-xs hover:bg-slate-50 transition"
              >
                Export CSV
                <Download size={15} />
              </button>
              {activeTab === "query" ? (
                <button
                  onClick={() => setIsAddQueryOpen(true)}
                  className="flex h-10 items-center gap-2 rounded-lg bg-[#2183C6] px-4 text-sm font-medium text-white shadow-xs hover:bg-[#1b6aa2] transition"
                >
                  <Plus size={15} />
                  New Query
                </button>
              ) : (
                <button
                  onClick={() => setIsAddSuspensionOpen(true)}
                  className="flex h-10 items-center gap-2 rounded-lg bg-[#2183C6] px-4 text-sm font-medium text-white shadow-xs hover:bg-[#1b6aa2] transition"
                >
                  <Plus size={15} />
                  New Suspension
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-5 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search
                size={16}
                className="absolute left-3.5 top-3.5 text-slate-400"
              />
              <input
                placeholder={
                  activeTab === "query"
                    ? "Search queries by employee, ID, or type…"
                    : "Search suspensions by employee, ID, or type…"
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* QUERY TAB */}
          {activeTab === "query" && (
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <TableHead title="Employee ID" />
                    <TableHead title="Name" />
                    <TableHead title="Role" />
                    <TableHead title="Department" />
                    <TableHead title="Query Type" />
                    <TableHead title="Status" />
                    <TableHead title="" />
                  </tr>
                </thead>

                <tbody>
                  {queryLoading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-sm text-slate-500"
                      >
                        Loading records...
                      </td>
                    </tr>
                  ) : queryError ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <p className="text-sm font-medium text-red-600">{queryError}</p>
                        <button
                          onClick={fetchQueryRecords}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                        >
                          <RefreshCw size={12} />
                          Retry
                        </button>
                      </td>
                    </tr>
                  ) : filteredQueries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12">
                        <EmptyState
                          title="No conduct queries found"
                          subtitle="No queries match your search, or none have been issued yet."
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredQueries.map((query, index) => (
                      <tr
                        key={query.id}
                        onClick={() => setSelectedQuery(query)}
                        className={`cursor-pointer border-b border-slate-100 text-sm hover:bg-slate-50 transition ${
                          selectedQuery?.id === query.id
                            ? "bg-blue-50/60"
                            : index % 2 === 1
                              ? "bg-slate-50/40"
                              : ""
                        }`}
                      >
                        <td className="px-4 py-4 text-blue-600 font-medium">
                          {query.employeeId || query.employee?.employeeId || "—"}
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-800">
                          {query.employeeName || query.employee?.name || "—"}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {query.role || query.employee?.role || "—"}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {resolveDepartmentName(query.department)}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {query.queryType ? query.queryType.replace(/_/g, " ") : "—"}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={query.status} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuery(query);
                            }}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                          >
                            <Pencil size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* SUSPENSION TAB */}
          {activeTab === "suspension" && (
            <ConductSuspensionModal
              records={filteredSuspensions}
              loading={suspensionLoading}
              error={suspensionError}
              onRetry={fetchSuspensionRecords}
              selectedId={selectedSuspension?.id ?? null}
              onSelectRecord={(rec) => setSelectedSuspension(rec)}
            />
          )}
        </div>
      </div>

      {/* RIGHT DRAWERS */}
      {activeTab === "query" && selectedQuery && (
        <QueryDetailsDrawer
          open={Boolean(selectedQuery)}
          query={selectedQuery}
          onClose={() => setSelectedQuery(null)}
        />
      )}

      {activeTab === "suspension" && selectedSuspension && (
        <SuspensionDrawer
          open={Boolean(selectedSuspension)}
          suspension={selectedSuspension}
          onClose={() => setSelectedSuspension(null)}
        />
      )}

      {/* MODALS */}
      {isAddQueryOpen && (
        <AddQueryModal
          open={isAddQueryOpen}
          onClose={() => setIsAddQueryOpen(false)}
          onSuccess={() => {
            fetchQueryRecords();
            fetchOverview();
          }}
        />
      )}
      {isAddSuspensionOpen && (
        <AddSuspensionModal
          open={isAddSuspensionOpen}
          onClose={() => setIsAddSuspensionOpen(false)}
          onSuccess={() => {
            fetchSuspensionRecords();
            fetchOverview();
          }}
        />
      )}
    </div>
  );
}
