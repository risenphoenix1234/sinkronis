// app/payroll/pay-runs/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { naira } from "@/types/payroll/payee-data";
import { getPayRuns } from "@/lib/api/payroll";
import {
  PayRunListItem,
  PayRunStatus,
  PaginationMeta,
} from "@/lib/api/payroll";
import RunPayrollModal from "@/components/payroll/pay-run/RunPayrollModal";
import { CreatedPayRunData } from "@/lib/api/payroll";

// All 10 API-canonical status values mapped to badge styles
const statusStyles: Record<PayRunStatus, string> = {
  DRAFT: "bg-[#fef9c3] text-[#a16207]",
  PROCESSING: "bg-[#dbeafe] text-[#1d4ed8]",
  PENDING_APPROVAL: "bg-[#fef3c7] text-[#b45309]",
  APPROVED: "bg-[#ccfbf1] text-[#0f766e]",
  PENDING_DISBURSEMENT: "bg-[#e0e7ff] text-[#4338ca]",
  DISBURSING: "bg-[#ede9fe] text-[#7c3aed]",
  DISBURSED: "bg-[#dcfce7] text-[#15803d]",
  FAILED: "bg-[#fee2e2] text-[#b91c1c]",
  PAID: "bg-[#d1fae5] text-[#065f46]",
  CANCELLED: "bg-[#f3f4f6] text-[#6b7280]",
};

const statusLabels: Record<PayRunStatus, string> = {
  DRAFT: "Draft",
  PROCESSING: "Processing",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  PENDING_DISBURSEMENT: "Pending Disbursement",
  DISBURSING: "Disbursing",
  DISBURSED: "Disbursed",
  FAILED: "Failed",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};

/** Status values available as filter options (matches Swagger enum) */
const FILTER_STATUSES: PayRunStatus[] = [
  "DRAFT",
  "PROCESSING",
  "PENDING_APPROVAL",
  "APPROVED",
  "PENDING_DISBURSEMENT",
  "DISBURSING",
  "DISBURSED",
  "FAILED",
  "PAID",
  "CANCELLED",
];

export default function PayRunsPage() {
  const router = useRouter();

  const [payRuns, setPayRuns] = useState<PayRunListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PayRunStatus | "">("");
  const [runPayrollOpen, setRunPayrollOpen] = useState(false);

  // Debounce ref for search input
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Pending search value that will be sent after debounce
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const fetchPayRuns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPayRuns({
        page: 1,
        limit: 50,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(status ? { status } : {}),
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setPayRuns(result.data);
      setPagination(result.pagination ?? null);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr?.response?.data?.message ??
          "Failed to load pay runs. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status]);

  useEffect(() => {
    fetchPayRuns();
  }, [fetchPayRuns]);

  const handlePayRunSuccess = (_data: CreatedPayRunData) => {
    setRunPayrollOpen(false);
    // Re-fetch to pick up the newly queued PROCESSING run
    fetchPayRuns();
  };

  // Determine action button for a run
  const getActionLabel = (run: PayRunListItem) => {
    if (run.status === "PENDING_APPROVAL") return "Review";
    return "View";
  };

  const getActionStyle = (run: PayRunListItem) => {
    if (run.status === "PENDING_APPROVAL") {
      return "rounded-md bg-[#1683d8] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#0f74c2]";
    }
    return "rounded-md bg-[#e8f4fd] px-4 py-1.5 text-xs font-medium text-[#1683d8] hover:bg-[#d5eafb]";
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2937]">Pay Runs</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Create and manage monthly payroll runs.
            {pagination && pagination.total > 0 && (
              <span className="ml-2 text-[#9ca3af]">
                ({pagination.total} total)
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => setRunPayrollOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#1683d8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0f74c2]"
        >
          <Plus size={15} />
          Run Payroll
        </button>
      </div>

      {/* Search + filter */}
      <div className="mt-6 flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search period..."
          className="h-11 w-[225px] rounded-md border border-[#e5e7eb] bg-white px-4 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#1683d8]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PayRunStatus | "")}
          className="h-11 w-[180px] rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
        >
          <option value="">All Statuses</option>
          {FILTER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Error banner */}
      {error && !loading && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#dc2626]">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchPayRuns}
            className="ml-auto text-xs font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-xs text-[#6b7280]">
              <th className="px-6 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Period <ChevronDown size={12} />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Employees <ChevronUp size={12} />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">Gross</th>
              <th className="px-6 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Net Pay <ChevronUp size={12} />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">PAYE</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Loading skeleton */}
            {loading && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-[#6b7280]">
                    <Loader2 size={16} className="animate-spin" />
                    Loading pay runs…
                  </div>
                </td>
              </tr>
            )}

            {/* Empty state */}
            {!loading && !error && payRuns.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-[#9ca3af]"
                >
                  No pay runs found.
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading &&
              payRuns.map((run, index) => (
                <tr
                  key={run.id}
                  className={`border-b border-[#f0f0f0] last:border-b-0 ${
                    index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1f2937]">{run.period}</p>
                    <p className="mt-0.5 text-xs text-[#9ca3af]">
                      Created{" "}
                      {new Date(run.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-[#374151]">{run.employees}</td>
                  <td className="px-6 py-4 text-[#6b7280]">
                    {naira(run.gross)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#1f2937]">
                    {naira(run.netPay)}
                  </td>
                  <td className="px-6 py-4 text-[#ef4444]">
                    {naira(run.paye)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[run.status]}`}
                    >
                      {statusLabels[run.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => router.push(`/payroll/pay-runs/${run.id}`)}
                      className={getActionStyle(run)}
                    >
                      {getActionLabel(run)}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <RunPayrollModal
        open={runPayrollOpen}
        onClose={() => setRunPayrollOpen(false)}
        onSuccess={handlePayRunSuccess}
      />
    </div>
  );
}
