// app/payroll/deductions/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Loader2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  amortizationSchedule,
  initials,
  monthsRemaining,
  repaid,
  repaidPercent,
  termMonths,
} from "@/types/payroll/deduction-data";

import { useDeductions } from "@/context/payroll/DeductionContext";
import { naira } from "@/types/payroll/payee-data";
import {
  adjustLoanRepayment,
  closeEarlyTenantLoan,
  exportTenantLoanScheduleCsv,
  getTenantLoanDetail,
  pauseTenantLoan,
  resumeTenantLoan,
  TenantLoanItem,
} from "@/lib/api/payroll";

/* =========================================================
   HELPERS & CONSTANTS
========================================================= */

const statusStyles: Record<string, string> = {
  Active: "bg-[#ebf8ee] text-[#1e7e34] border border-[#d1f2d9]",
  ACTIVE: "bg-[#ebf8ee] text-[#1e7e34] border border-[#d1f2d9]",
  Paused: "bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]",
  PAUSED: "bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]",
  Completed: "bg-[#f1f5f9] text-[#475467] border border-[#e2e8f0]",
  COMPLETED: "bg-[#f1f5f9] text-[#475467] border border-[#e2e8f0]",
  Closed: "bg-[#f1f5f9] text-[#475467] border border-[#e2e8f0]",
  CLOSED: "bg-[#f1f5f9] text-[#475467] border border-[#e2e8f0]",
  CLOSED_EARLY: "bg-[#f1f5f9] text-[#475467] border border-[#e2e8f0]",
  CANCELLED: "bg-[#f1f5f9] text-[#475467] border border-[#e2e8f0]",
};

function formatScheduleDate(dateStr: string): string {
  if (!dateStr) return "";
  if (/^[A-Za-z]{3,4}\s+\d{4}$/.test(dateStr.trim())) return dateStr.trim();
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const monthName = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${monthName} ${year}`;
}

/* =========================================================
   PAGE
========================================================= */

export default function LoanDetailPage() {
  const router = useRouter();
  const params = useParams();

  const { getLoanById, setLoanStatus, updateLoan } = useDeductions();

  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const mockLoan = getLoanById(idParam ?? "");

  const [apiLoan, setApiLoan] = useState<TenantLoanItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Actions state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustedRepaymentInput, setAdjustedRepaymentInput] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  const [isClosingEarly, setIsClosingEarly] = useState(false);

  const [isTogglingPause, setIsTogglingPause] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  /* =======================================================
     FETCH LIVE LOAN DATA
  ======================================================= */

  useEffect(() => {
    let isMounted = true;
    if (!idParam) {
      setLoading(false);
      return;
    }

    // If it's a known mock loan ID and not a backend cuid, use mock immediately
    if (mockLoan && !idParam.startsWith("c")) {
      setLoading(false);
      return;
    }

    const fetchLoan = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getTenantLoanDetail(idParam);
        if (isMounted) {
          setApiLoan(res.data);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const axiosErr = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (mockLoan) {
          setLoading(false);
          return;
        }
        if (axiosErr.response?.status === 404) {
          setError("Tenant loan not found.");
        } else {
          setError(
            axiosErr.response?.data?.message || "Failed to load loan details.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLoan();

    return () => {
      isMounted = false;
    };
  }, [idParam, mockLoan]);

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const employeeName = apiLoan
    ? apiLoan.employee.fullName
    : (mockLoan?.employee ?? "Tunde Babatunde");
  const employeeInitials = initials(employeeName) || "TB";
  const purpose = apiLoan ? apiLoan.purpose : (mockLoan?.purpose ?? "Personal Loan");
  const rawStatus = apiLoan ? apiLoan.status : (mockLoan?.status ?? "Active");

  const isClosed =
    rawStatus.toUpperCase() === "CLOSED" ||
    rawStatus.toUpperCase() === "COMPLETED" ||
    rawStatus.toUpperCase() === "CLOSED_EARLY" ||
    rawStatus.toUpperCase() === "CANCELLED" ||
    mockLoan?.status === "Closed";

  const isPaused =
    !isClosed &&
    (rawStatus.toUpperCase() === "PAUSED" || mockLoan?.status === "Paused");

  const displayStatus = isClosed
    ? "Completed"
    : isPaused
      ? "Paused"
      : "Active";

  const principalAmount = apiLoan
    ? apiLoan.principalAmount
    : (mockLoan?.principal ?? 500000);

  const outstandingAmount = isClosed
    ? 0
    : apiLoan
      ? apiLoan.outstandingAmount
      : (mockLoan?.outstanding ?? 250000);

  const repaidAmount = isClosed
    ? principalAmount
    : apiLoan
      ? apiLoan.repaidAmount
      : mockLoan
        ? repaid(mockLoan)
        : 250000;

  const monthlyRepayment = apiLoan
    ? apiLoan.monthlyRepayment
    : (mockLoan?.monthly ?? 30000);

  const percent = isClosed
    ? 100
    : apiLoan
      ? Math.min(100, Math.max(0, Math.round(apiLoan.repaymentProgressPercent)))
      : mockLoan
        ? repaidPercent(mockLoan)
        : 50;

  const remainingMonths = apiLoan
    ? apiLoan.remainingInstallments
    : mockLoan
      ? monthsRemaining(mockLoan)
      : 17;

  const startDate = apiLoan?.startDate
    ? apiLoan.startDate.slice(0, 10)
    : (mockLoan?.startDate ?? "2025-12-01");

  const caption = `${percent}% repaid · ${remainingMonths} months remaining${
    startDate ? ` · Started ${startDate}` : ""
  }`;

  const scheduleRows =
    apiLoan && Array.isArray(apiLoan.schedule)
      ? apiLoan.schedule.map((row) => ({
          month: row.month,
          date: formatScheduleDate(row.date ? row.date.slice(0, 10) : ""),
          opening: row.openingBalance,
          repayment: row.repayment,
          closing: row.closingBalance,
          isCurrent: Boolean(row.isCurrent),
        }))
      : mockLoan
        ? amortizationSchedule(mockLoan).map((row) => ({
            month: row.month,
            date: formatScheduleDate(row.date),
            opening: row.opening,
            repayment: row.repayment,
            closing: row.closing,
            isCurrent: row.isCurrent,
          }))
        : [];

  /* =======================================================
     ACTIONS
  ======================================================= */

  const handleOpenAdjustModal = () => {
    setAdjustedRepaymentInput(String(monthlyRepayment));
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = adjustedRepaymentInput.replace(/,/g, "").trim();
    const amount = parseFloat(raw);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid monthly repayment greater than 0.");
      return;
    }

    if (apiLoan) {
      try {
        setIsAdjusting(true);
        const res = await adjustLoanRepayment(apiLoan.id, {
          monthlyRepayment: amount,
        });
        toast.success(res.message || "Loan repayment adjusted successfully.");
        setApiLoan(res.data);
        setIsAdjustModalOpen(false);
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (axiosErr.response?.status === 409) {
          toast.error("Loan state does not allow adjustment.");
        } else {
          toast.error(
            axiosErr.response?.data?.message ||
              "Failed to adjust loan repayment.",
          );
        }
      } finally {
        setIsAdjusting(false);
      }
    } else if (mockLoan) {
      updateLoan(mockLoan.id, { monthly: amount });
      toast.success("Repayment adjusted successfully.");
      setIsAdjustModalOpen(false);
    }
  };

  const handleTogglePause = async () => {
    if (apiLoan) {
      try {
        setIsTogglingPause(true);
        if (isPaused) {
          const res = await resumeTenantLoan(apiLoan.id);
          toast.success(res.message || "Loan repayments resumed successfully.");
          if (res.data) {
            setApiLoan(res.data);
          } else {
            setApiLoan((prev) => (prev ? { ...prev, status: "ACTIVE" } : null));
          }
        } else {
          const res = await pauseTenantLoan(apiLoan.id);
          toast.success(res.message || "Loan repayments paused successfully.");
          if (res.data) {
            setApiLoan(res.data);
          } else {
            setApiLoan((prev) => (prev ? { ...prev, status: "PAUSED" } : null));
          }
        }
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        const actionLabel = isPaused ? "resuming" : "pausing";
        const actionVerb = isPaused ? "resume" : "pause";
        if (axiosErr.response?.status === 409) {
          toast.error(
            axiosErr.response?.data?.message ||
              `Loan state does not allow ${actionLabel}.`,
          );
        } else {
          toast.error(
            axiosErr.response?.data?.message ||
              `Failed to ${actionVerb} loan repayment.`,
          );
        }
      } finally {
        setIsTogglingPause(false);
      }
    } else if (mockLoan) {
      const nextStatus = isPaused ? "Active" : "Paused";
      setLoanStatus(mockLoan.id, nextStatus);
      toast.success(
        isPaused
          ? "Loan repayments resumed successfully."
          : "Loan repayments paused successfully.",
      );
    }
  };

  const handleCloseEarly = async () => {
    if (isClosingEarly) return;
    if (apiLoan) {
      try {
        setIsClosingEarly(true);
        const res = await closeEarlyTenantLoan(apiLoan.id, {
          reason: "Closed early from loan detail page",
        });
        toast.success(res.message || "Loan closed early successfully.");
        if (res.data) {
          setApiLoan(res.data);
        } else {
          setApiLoan((prev) =>
            prev
              ? {
                  ...prev,
                  status: "COMPLETED",
                  outstandingAmount: 0,
                  repaidAmount: prev.principalAmount,
                  repaymentProgressPercent: 100,
                }
              : null,
          );
        }
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (axiosErr.response?.status === 409) {
          toast.error(
            axiosErr.response?.data?.message || "Loan is already closed.",
          );
        } else {
          toast.error(
            axiosErr.response?.data?.message || "Failed to close loan early.",
          );
        }
      } finally {
        setIsClosingEarly(false);
      }
    } else if (mockLoan) {
      setLoanStatus(mockLoan.id, "Closed");
      toast.success("Loan closed early successfully.");
    }
  };

  const handleExportSchedule = async () => {
    if (isExporting) return;
    if (apiLoan) {
      try {
        setIsExporting(true);
        const blob = await exportTenantLoanScheduleCsv(apiLoan.id);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `loan-schedule-${apiLoan.id}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Loan schedule exported successfully.");
      } catch {
        toast.error("Failed to export loan schedule. Please try again.");
      } finally {
        setIsExporting(false);
      }
    } else if (mockLoan) {
      try {
        setIsExporting(true);
        const schedule = amortizationSchedule(mockLoan);
        const csv = [
          "Installment,Month,Date,OpeningBalance,Repayment,ClosingBalance,Status",
          ...schedule.map(
            (r) =>
              `"${r.month}","${r.month}","${r.date}","${r.opening}","${r.repayment}","${r.closing}","${r.isCurrent ? "CURRENT" : "SCHEDULED"}"`,
          ),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `loan-schedule-${mockLoan.id}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Loan schedule exported successfully.");
      } finally {
        setIsExporting(false);
      }
    }
  };

  /* =======================================================
     LOADING & NOT FOUND
  ======================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6 text-[#263447]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#1683d8]" />
          <p className="text-sm font-medium text-[#718096]">
            Loading loan details...
          </p>
        </div>
      </main>
    );
  }

  if (!apiLoan && !mockLoan) {
    return (
      <main className="min-h-screen bg-[#f8fafc] p-6 text-[#263447]">
        <BackLink onClick={() => router.push("/payroll/deductions")} />
        <p className="mt-4 text-[15px] text-[#8994a3]">
          {error || "Loan not found."}
        </p>
      </main>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-6 text-[#263447] lg:px-8">
      {/* Back Link */}
      <BackLink onClick={() => router.push("/payroll/deductions")} />

      {/* ===================================================
          EMPLOYEE CARD (Dashed border)
      ================================================== */}
      <section className="rounded-xl border border-dashed border-[#d9dee5] bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-[#dce9f5] text-[15px] font-bold text-[#1c4b79]">
              {employeeInitials}
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg sm:text-xl font-bold tracking-tight text-[#102a43]">
                {employeeName}
              </h1>

              <p className="mt-0.5 text-xs sm:text-sm text-[#64748b]">
                {purpose}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center rounded-full px-3.5 py-1 text-xs font-semibold ${
              statusStyles[displayStatus] ||
              statusStyles[rawStatus] ||
              "bg-[#f1f5f9] text-[#475467] border border-[#e2e8f0]"
            }`}
          >
            {displayStatus}
          </span>
        </div>
      </section>

      {/* ===================================================
          METRIC / STAT CARDS (4 cards, dashed border)
      ================================================== */}
      <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Principal" value={naira(principalAmount)} />

        <StatCard
          label="Outstanding"
          value={naira(outstandingAmount)}
          valueClass="text-[#dc2626]"
        />

        <StatCard
          label="Repaid"
          value={naira(repaidAmount)}
          valueClass="text-[#15803d]"
        />

        <StatCard
          label="Monthly Repay"
          value={naira(monthlyRepayment)}
          valueClass="text-[#1683d8]"
        />
      </section>

      {/* ===================================================
          PROGRESS BAR
      ================================================== */}
      <section className="mt-5">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
          <div
            className="h-full rounded-full bg-[#15803d] transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="mt-2 text-xs sm:text-sm text-[#64748b]">{caption}</p>
      </section>

      {/* ===================================================
          ACTION BUTTONS
      ================================================== */}
      <section className="mt-5 flex flex-wrap items-center gap-3">
        {isClosed ? (
          /* When Closed / Completed: ONLY Export Schedule button */
          <button
            type="button"
            onClick={handleExportSchedule}
            disabled={isExporting}
            className="rounded-lg border border-dashed border-[#d9dee5] bg-white px-4 py-2 text-sm font-medium text-[#475467] transition hover:bg-[#f8fafc] disabled:opacity-60"
          >
            {isExporting ? "Exporting..." : "Export Schedule"}
          </button>
        ) : isPaused ? (
          /* When Paused: Resume Repayment + Export Schedule */
          <>
            <button
              type="button"
              onClick={handleTogglePause}
              disabled={isTogglingPause}
              className="flex items-center gap-2 rounded-lg border border-[#bbf7d0] bg-[#dcfce7] px-4 py-2 text-sm font-semibold text-[#15803d] transition hover:bg-[#bbf7d0] disabled:opacity-60"
            >
              {isTogglingPause ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Resuming...
                </>
              ) : (
                "Resume Repayment"
              )}
            </button>

            <button
              type="button"
              onClick={handleExportSchedule}
              disabled={isExporting}
              className="rounded-lg border border-dashed border-[#d9dee5] bg-white px-4 py-2 text-sm font-medium text-[#475467] transition hover:bg-[#f8fafc] disabled:opacity-60"
            >
              {isExporting ? "Exporting..." : "Export Schedule"}
            </button>
          </>
        ) : (
          /* When Active: Adjust Repayment, Pause Deductions, Close Early, Export Schedule */
          <>
            <button
              type="button"
              onClick={handleOpenAdjustModal}
              className="rounded-lg border border-[#b9e6fe] bg-[#eff8ff] px-4 py-2 text-sm font-semibold text-[#1683d8] transition hover:bg-[#e0f2fe]"
            >
              Adjust Repayment
            </button>

            <button
              type="button"
              onClick={handleTogglePause}
              disabled={isTogglingPause}
              className="flex items-center gap-2 rounded-lg border border-dashed border-[#FDE68A] bg-[#FEF9C3] px-4 py-2 text-sm font-medium text-[#854D0E] transition hover:bg-[#f8fafc] disabled:opacity-60"
            >
              {isTogglingPause ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Pausing...
                </>
              ) : (
                "Pause Deductions"
              )}
            </button>

            <button
              type="button"
              onClick={handleCloseEarly}
              disabled={isClosingEarly}
              className="flex items-center gap-2 rounded-lg border border-dashed border-[FECACA] bg-[#FEE2E2] px-4 py-2 text-sm font-medium text-[#DC2626] transition hover:bg-[#fef2f2] disabled:opacity-60"
            >
              {isClosingEarly ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Closing...
                </>
              ) : (
                "Close Early"
              )}
            </button>

            <button
              type="button"
              onClick={handleExportSchedule}
              disabled={isExporting}
              className="rounded-lg border border-dashed border-[#d9dee5] bg-white px-4 py-2 text-sm font-medium text-[#475467] transition hover:bg-[#f8fafc] disabled:opacity-60"
            >
              {isExporting ? "Exporting..." : "Export Schedule"}
            </button>
          </>
        )}
      </section>

      {/* ===================================================
          AMORTIZATION SCHEDULE (Dashed border card)
      ================================================== */}
      <section className="mt-6 overflow-hidden rounded-xl border border-dashed border-[#d9dee5] bg-white shadow-sm">
        <header className="border-b border-[#f1f5f9] px-6 py-4">
          <h2 className="text-base font-bold text-[#102a43]">
            Amortization Schedule
          </h2>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#f1f5f9] text-xs font-semibold text-[#64748b]">
                <th className="px-6 py-3.5">Month</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Opening Balance</th>
                <th className="px-6 py-3.5">Repayment</th>
                <th className="px-6 py-3.5">Closing Balance</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f1f5f9] text-sm">
              {scheduleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-[#8994a3]"
                  >
                    No repayment schedule for this loan.
                  </td>
                </tr>
              ) : (
                scheduleRows.map((row) => (
                  <tr
                    key={row.month}
                    className={`transition-colors ${
                      row.isCurrent
                        ? "bg-[#eff8ff]"
                        : "bg-white hover:bg-[#f8fafc]/60"
                    }`}
                  >
                    <td
                      className={`px-6 py-3.5 ${
                        row.isCurrent
                          ? "font-bold text-[#1683d8]"
                          : "text-[#344054] font-medium"
                      }`}
                    >
                      {row.month}
                      {row.isCurrent && " ← Current"}
                    </td>

                    <td className="px-6 py-3.5 text-[#64748b]">{row.date}</td>

                    <td className="px-6 py-3.5 text-[#344054] font-medium">
                      {naira(row.opening)}
                    </td>

                    <td className="px-6 py-3.5 font-bold text-[#1683d8]">
                      {naira(row.repayment)}
                    </td>

                    <td className="px-6 py-3.5 font-bold">
                      {row.closing === 0 ? (
                        <span className="text-[#16a34a]">₦0</span>
                      ) : (
                        <span className="text-[#dc2626]">
                          {naira(row.closing)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================================================
          ADJUST REPAYMENT MODAL
      ================================================== */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-[420px] rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#102a43]">
                Adjust Repayment
              </h3>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                disabled={isAdjusting}
                aria-label="Close"
                className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Amount Subtitle */}
            <p className="mt-1 text-xs text-[#64748b]">
              Current:{" "}
              <strong className="font-semibold text-[#102a43]">
                {naira(monthlyRepayment)}/month
              </strong>
            </p>

            {/* Form */}
            <form onSubmit={handleSaveAdjustment} className="mt-5">
              <div>
                <label
                  htmlFor="newMonthlyRepayment"
                  className="mb-1.5 block text-xs font-medium text-[#475467]"
                >
                  New Monthly Repayment (₦)
                </label>
                <input
                  id="newMonthlyRepayment"
                  type="number"
                  value={adjustedRepaymentInput}
                  onChange={(e) => setAdjustedRepaymentInput(e.target.value)}
                  placeholder="50000"
                  disabled={isAdjusting}
                  className="h-10 w-full rounded-lg border border-[#d0d5dd] bg-white px-3.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#1683d8] focus:ring-1 focus:ring-[#1683d8] disabled:bg-gray-50"
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  disabled={isAdjusting}
                  className="h-10 rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm font-medium text-[#344054] transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAdjusting || !adjustedRepaymentInput.trim()}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1683d8] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1274c2] disabled:opacity-50"
                >
                  {isAdjusting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </main>
  );
}

/* =========================================================
   BACK LINK
========================================================= */

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e293b] transition hover:text-[#1683d8]"
    >
      <ChevronLeft size={18} strokeWidth={2} />
      Back to Deductions
    </button>
  );
}

/* =========================================================
   STAT CARD (Dashed border)
========================================================= */

type StatCardProps = {
  label: string;
  value: string;
  valueClass?: string;
};

function StatCard({
  label,
  value,
  valueClass = "text-[#102a43]",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-dashed border-[#d9dee5] bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-[#64748b]">{label}</p>

      <p
        className={`mt-2 text-2xl font-bold leading-none tracking-tight ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}
