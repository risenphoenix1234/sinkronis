// app/payroll/pay-runs/[id]/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Download,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { naira } from "@/types/payroll/payee-data";
import {
  getPayRunDetail,
  approvePayRun,
  exportPayRunCsv,
} from "@/lib/api/payroll";
import {
  PayRunDetail,
  PayRunStatus,
  PayslipApiStatus,
  PaginationMeta,
  PayRunPayslipItem,
} from "@/lib/api/payroll";

// All 10 API-canonical run status values
const runStatusStyles: Record<PayRunStatus, string> = {
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

const runStatusLabels: Record<PayRunStatus, string> = {
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

const payslipStatusStyles: Record<PayslipApiStatus, string> = {
  PAID: "bg-[#dcfce7] text-[#15803d]",
  PENDING: "bg-[#fef9c3] text-[#a16207]",
  FAILED: "bg-[#fee2e2] text-[#b91c1c]",
};

const payslipStatusLabels: Record<PayslipApiStatus, string> = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
};

/** Derive initials from a full name */
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function PayRunDetailPage() {
  const router = useRouter();
  const params = useParams();
  const payRunId = Array.isArray(params?.id)
    ? params.id[0]
    : (params?.id ?? "");

  const [run, setRun] = useState<PayRunDetail | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);

  const [exporting, setExporting] = useState(false);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const fetchDetail = useCallback(async () => {
    if (!payRunId) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const result = await getPayRunDetail(payRunId, {
        page: 1,
        limit: 100,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      });
      setRun(result.data);
      setPagination(result.pagination ?? null);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = axiosErr?.response?.status;
      if (status === 404 || status === 400) {
        setNotFound(true);
      } else {
        setError(
          axiosErr?.response?.data?.message ??
            "Failed to load pay run. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [payRunId, debouncedSearch]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleApprovePayroll = async () => {
    if (!payRunId || approving) return;
    setApproving(true);
    setApproveError(null);
    try {
      const res = await approvePayRun(payRunId);
      toast.success(res.message || "Payroll approved successfully");
      setApproveModalOpen(false);
      await fetchDetail();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const msg =
        axiosErr?.response?.data?.message ||
        "Failed to approve payroll. Please try again.";
      setApproveError(msg);
      toast.error(msg);
    } finally {
      setApproving(false);
    }
  };

  const handleExportCsv = async () => {
    if (!payRunId || exporting) return;
    setExporting(true);
    try {
      const blob = await exportPayRunCsv(payRunId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const sanitizedPeriod = run?.period
        ? run.period.replace(/\s+/g, "_")
        : payRunId;
      link.download = `pay-run-${sanitizedPeriod}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Pay run exported successfully");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number;
          data?: { message?: string } | string | Blob;
        };
      };
      let msg = "Failed to export pay run CSV. Please try again.";
      if (axiosErr?.response?.data instanceof Blob) {
        try {
          const text = await axiosErr.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed?.message) msg = parsed.message;
        } catch {
          // ignore error parsing Blob
        }
      } else if (
        typeof axiosErr?.response?.data === "object" &&
        axiosErr?.response?.data &&
        "message" in axiosErr.response.data
      ) {
        msg = (axiosErr.response.data as { message: string }).message || msg;
      }
      toast.error(msg);
    } finally {
      setExporting(false);
    }
  };

  // ── Not found ──
  if (!loading && notFound) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-8">
        <button
          type="button"
          onClick={() => router.push("/payroll/pay-runs")}
          className="mb-5 flex items-center gap-2 text-sm text-[#667085] transition hover:text-[#1683d8]"
        >
          <ChevronLeft size={16} />
          Back to Pay Runs
        </button>
        <p className="text-sm text-[#9ca3af]">Pay run not found.</p>
      </div>
    );
  }

  // ── Error ──
  if (!loading && error) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-8">
        <button
          type="button"
          onClick={() => router.push("/payroll/pay-runs")}
          className="mb-5 flex items-center gap-2 text-sm text-[#667085] transition hover:text-[#1683d8]"
        >
          <ChevronLeft size={16} />
          Back to Pay Runs
        </button>
        <div className="flex items-center gap-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-5 py-4 text-sm text-[#dc2626]">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchDetail}
            className="ml-auto text-xs font-medium underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-8">
        <button
          type="button"
          onClick={() => router.push("/payroll/pay-runs")}
          className="mb-4 flex items-center gap-2 text-sm text-[#374151] transition hover:text-[#1683d8]"
        >
          <ChevronLeft size={16} />
          Back to Pay Runs
        </button>
        <div className="flex items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-6 py-12 text-sm text-[#6b7280]">
          <Loader2 size={18} className="animate-spin" />
          Loading pay run…
        </div>
      </div>
    );
  }

  if (!run) return null;

  const isProcessing = run.status === "PROCESSING";
  const isFailed = run.status === "FAILED";

  const timeline = [
    `${run.from} – ${run.to}`,
    `Created ${new Date(run.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`,
    run.payDate && `Pay date ${run.payDate}`,
  ].filter(Boolean) as string[];

  const payslips: PayRunPayslipItem[] = run.payslips ?? [];
  const total = pagination?.total ?? payslips.length;

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.push("/payroll/pay-runs")}
        className="mb-4 flex items-center gap-2 text-sm text-[#374151] transition hover:text-[#1683d8]"
      >
        <ChevronLeft size={16} />
        Back to Pay Runs
      </button>

      {/* PROCESSING progress banner */}
      {isProcessing && (
        <div className="mb-4 overflow-hidden rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4">
          <div className="flex items-center justify-between text-sm text-[#1d4ed8]">
            <span className="flex items-center gap-2 font-medium">
              <Clock size={14} className="animate-pulse" />
              Payroll calculation in progress…
            </span>
            <span className="text-xs font-semibold">
              {run.progress.percentage}%
            </span>
          </div>
          <div className="mt-2.5 h-2 w-full rounded-full bg-[#bfdbfe]">
            <div
              className="h-2 rounded-full bg-[#2563eb] transition-all duration-500"
              style={{ width: `${run.progress.percentage}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[#3b82f6]">
            {run.progress.processed} of {run.progress.expected} employees
            processed
            {run.progress.failed > 0 && (
              <span className="ml-2 text-[#dc2626]">
                · {run.progress.failed} failed
              </span>
            )}
          </p>
        </div>
      )}

      {/* FAILED reason banner */}
      {isFailed && run.failureReason && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-5 py-4 text-sm text-[#dc2626]">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{run.failureReason}</span>
        </div>
      )}

      {/* Summary card */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg border border-[#e5e7eb] bg-white px-6 py-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#1f2937]">
              {run.period} Payroll
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${runStatusStyles[run.status]}`}
            >
              {runStatusLabels[run.status]}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#6b7280]">{timeline.join(" · ")}</p>
        </div>

        <div className="flex items-center gap-7">
          <Stat label="Employees" value={String(run.employees)} />
          <Stat label="Gross" value={naira(run.gross)} />
          <Stat
            label="Net Pay"
            value={naira(run.netPay)}
            className="text-[#15803d]"
          />
          <Stat
            label="PAYE"
            value={naira(run.paye)}
            className="text-[#ef4444]"
          />

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting}
            className="ml-1 flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#f3f4f6] px-4 py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#e9ebee] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            {exporting ? "Exporting..." : "Export CSV"}
          </button>

          {run.status === "PENDING_APPROVAL" && (
            <button
              type="button"
              onClick={() => {
                setApproveError(null);
                setApproveModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-md bg-[#1683d8] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0f74c2]"
            >
              <CheckCircle2 size={16} />
              Approve Payroll
            </button>
          )}
        </div>
      </div>

      {/* Payslips table */}
      <div className="mt-5 rounded-lg border border-[#e5e7eb] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <h2 className="text-base font-bold text-[#1f2937]">
            Employee Payslips ({total})
          </h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee or dept..."
            className="h-10 w-[195px] rounded-md border border-[#e5e7eb] bg-white px-4 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#1683d8]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-xs text-[#6b7280]">
                <th className="px-6 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Dept</th>
                <th className="px-4 py-3 font-medium">Gross</th>
                <th className="px-4 py-3 font-medium">PAYE</th>
                <th className="px-4 py-3 font-medium">Pension</th>
                <th className="px-4 py-3 font-medium">NHF</th>
                <th className="px-4 py-3 font-medium">Net Pay</th>
                <th className="px-4 py-3 font-medium">Bank</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payslips.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-10 text-center text-sm text-[#9ca3af]"
                  >
                    {isProcessing
                      ? "Payslips will appear as processing completes."
                      : "No payslips found."}
                  </td>
                </tr>
              ) : (
                payslips.map((slip, index) => (
                  <tr
                    key={slip.id}
                    className={`border-b border-[#f0f0f0] transition last:border-b-0 hover:bg-[#f1f7fd] ${
                      index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e8f4fd] text-[11px] font-semibold text-[#1683d8]">
                          {initials(slip.employeeName)}
                        </span>
                        <div>
                          <p className="font-semibold text-[#1f2937]">
                            {slip.employeeName}
                          </p>
                          <p className="mt-0.5 text-xs text-[#9ca3af]">
                            {slip.jobTitle}
                            {slip.employeeCode && (
                              <span className="ml-1 text-[#d1d5db]">
                                · {slip.employeeCode}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[#6b7280]">
                      {slip.departmentName}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#1f2937]">
                      {naira(slip.gross)}
                    </td>
                    <td className="px-4 py-3.5 text-[#ef4444]">
                      {naira(slip.paye)}
                    </td>
                    <td className="px-4 py-3.5 text-[#b45309]">
                      {naira(slip.pension)}
                    </td>
                    <td className="px-4 py-3.5 text-[#374151]">
                      {naira(slip.nhf)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#15803d]">
                      {naira(slip.netPay)}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[#1f2937]">
                        {slip.bankName}
                      </p>
                      <p className="mt-0.5 text-xs text-[#9ca3af]">
                        {slip.bankAccount}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${payslipStatusStyles[slip.status]}`}
                      >
                        {payslipStatusLabels[slip.status]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#1683d8]">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1f2937]">
                  Approve Payroll
                </h3>
                <p className="text-xs text-[#6b7280]">
                  {run.period} Payroll Run
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-lg border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Employees:</span>
                <span className="font-semibold text-slate-800">
                  {run.employees}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Total:</span>
                <span className="font-semibold text-slate-800">
                  {naira(run.gross)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Net Pay:</span>
                <span className="font-semibold text-[#15803d]">
                  {naira(run.netPay)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PAYE Tax:</span>
                <span className="font-semibold text-[#ef4444]">
                  {naira(run.paye)}
                </span>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Approving this payroll confirms calculations and advances the run
              from <strong className="text-slate-700">Pending Approval</strong>{" "}
              to <strong className="text-emerald-700">Approved</strong>. Note:
              Approval does not trigger immediate disbursement.
            </p>

            {approveError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{approveError}</span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={approving}
                onClick={() => setApproveModalOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={approving}
                onClick={handleApprovePayroll}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1683d8] px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[#0f74c2] disabled:opacity-50"
              >
                {approving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Approving…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    Confirm Approval
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  className = "text-[#1f2937]",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-medium uppercase tracking-wide text-[#9ca3af]">
        {label}
      </p>
      <p className={`mt-1 text-[15px] font-bold ${className}`}>{value}</p>
    </div>
  );
}
