// app/payroll/payees/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Download,
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { naira } from "@/types/payroll/payee-data";
import {
  getPayeeDetail,
  getPayeePaymentHistory,
  exportPayeePaymentHistoryCsv,
  PayeeDetail,
  PayeeApiType,
  PayeeApiStatus,
  PayeePaymentSnapshot,
  PayeePaymentStatus,
  PaginationMeta,
} from "@/lib/api/payroll";
import Documents from "@/components/payroll/payee/Documents";
import EditPayeeModal from "@/components/payroll/payee/EditPayeeModal";
import RemovePayeeModal from "@/components/payroll/payee/RemovePayeeModal";

const typeStyles: Record<PayeeApiType, string> = {
  DIRECTOR: "bg-[#f3e8ff] text-[#9333ea]",
  VENDOR: "bg-[#dbeafe] text-[#1d4ed8]",
  BOARD_MEMBER: "bg-[#fef3c7] text-[#a16207]",
  CONTRACTOR: "bg-[#dcfce7] text-[#15803d]",
};

const typeLabels: Record<PayeeApiType, string> = {
  DIRECTOR: "Director",
  VENDOR: "Vendor",
  BOARD_MEMBER: "Board Member",
  CONTRACTOR: "Contractor",
};

const statusBadgeStyles: Record<PayeeApiStatus, string> = {
  ACTIVE: "bg-[#dcfce7] text-[#15803d]",
  INACTIVE: "bg-[#f3f4f6] text-[#6b7280]",
};

const statusLabels: Record<PayeeApiStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

const paymentStatusStyles: Record<PayeePaymentStatus, string> = {
  PAID: "bg-[#dcfce7] text-[#15803d]",
  PENDING: "bg-[#fef3c7] text-[#a16207]",
  FAILED: "bg-[#fee2e2] text-[#dc2626]",
  CANCELLED: "bg-[#f3f4f6] text-[#6b7280]",
};

const paymentStatusLabels: Record<PayeePaymentStatus, string> = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

const tabs = ["Payment History", "Documents"];

export default function PayeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("Payment History");

  const [payee, setPayee] = useState<PayeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  // Payment History state
  const [historyRecords, setHistoryRecords] = useState<PayeePaymentSnapshot[]>(
    [],
  );
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyPagination, setHistoryPagination] =
    useState<PaginationMeta | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historySortOrder, setHistorySortOrder] = useState<"asc" | "desc">(
    "desc",
  );
  const [exportingHistory, setExportingHistory] = useState(false);

  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const fetchPaymentHistory = useCallback(async () => {
    if (!idParam) return;
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await getPayeePaymentHistory(idParam as string, {
        page: historyPage,
        limit: 10,
        sortOrder: historySortOrder,
      });
      setHistoryRecords(res.data);
      setHistoryPagination(res.pagination);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setHistoryError(
        axiosErr?.response?.data?.message ||
          "Failed to load payment history records. Please try again.",
      );
    } finally {
      setHistoryLoading(false);
    }
  }, [idParam, historyPage, historySortOrder]);

  useEffect(() => {
    if (activeTab === "Payment History" && idParam) {
      fetchPaymentHistory();
    }
  }, [activeTab, idParam, fetchPaymentHistory]);

  const handleExportHistory = async () => {
    if (!idParam) return;
    if (exportingHistory) return;
    setExportingHistory(true);
    try {
      const blob = await exportPayeePaymentHistoryCsv(idParam as string);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payment-history-${payee?.name || idParam}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Payment history exported successfully");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } | string | Blob };
      };
      let msg = "Failed to export payment history CSV. Please try again.";
      if (axiosErr?.response?.data instanceof Blob) {
        try {
          const text = await axiosErr.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed?.message) msg = parsed.message;
        } catch {
          // ignore
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
      setExportingHistory(false);
    }
  };

  const fetchPayeeDetail = async () => {
    if (!idParam) return;
    try {
      const data = await getPayeeDetail(idParam as string);
      setPayee(data);
      setError(null);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (
        axiosErr?.response?.status === 404 ||
        axiosErr?.response?.status === 400
      ) {
        setNotFound(true);
      } else {
        setError(
          axiosErr?.response?.data?.message ||
            "Failed to load payee details. Please try again.",
        );
      }
    }
  };

  useEffect(() => {
    if (!idParam) return;
    let isMounted = true;
    setLoading(true);
    setError(null);
    setNotFound(false);

    getPayeeDetail(idParam as string)
      .then((data) => {
        if (isMounted) setPayee(data);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const axiosErr = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (
          axiosErr?.response?.status === 404 ||
          axiosErr?.response?.status === 400
        ) {
          setNotFound(true);
        } else {
          setError(
            axiosErr?.response?.data?.message ||
              "Failed to load payee details. Please try again.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [idParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-4">
        <button
          type="button"
          onClick={() => router.push("/payroll/payees")}
          className="mb-5 flex items-center gap-2 text-sm text-[#667085] transition hover:text-[#1683d8]"
        >
          <ChevronLeft size={16} />
          Back to Payees
        </button>
        <div className="flex items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-6 py-12 text-sm text-[#6b7280]">
          <Loader2 size={18} className="animate-spin" />
          Loading payee details…
        </div>
      </div>
    );
  }

  if (notFound || !payee) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-4">
        <button
          type="button"
          onClick={() => router.push("/payroll/payees")}
          className="mb-5 flex items-center gap-2 text-sm text-[#667085] transition hover:text-[#1683d8]"
        >
          <ChevronLeft size={16} />
          Back to Payees
        </button>
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-8 text-center text-sm text-[#9ca3af]">
          Payee not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.push("/payroll/payees")}
        className="mb-5 flex items-center gap-2 text-sm text-[#667085] transition hover:text-[#1683d8]"
      >
        <ChevronLeft size={16} />
        Back to Payees
      </button>

      {/* Error banner if any */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Header card */}
      <section className="rounded-lg border border-[#e5e7eb] bg-white px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f3e8ff] text-lg font-semibold text-[#9333ea]">
              {payee.name ? payee.name.charAt(0).toUpperCase() : "P"}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-semibold text-[#1f2937]">
                  {payee.name}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    typeStyles[payee.type] ?? "bg-[#f3f4f6] text-[#6b7280]"
                  }`}
                >
                  {typeLabels[payee.type] ?? payee.type}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    statusBadgeStyles[payee.status] ??
                    "bg-[#f3f4f6] text-[#6b7280]"
                  }`}
                >
                  {statusLabels[payee.status] ?? payee.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-[#6b7280]">
                {payee.email || "No email"}
                {payee.phone ? ` · ${payee.phone}` : ""}
                {payee.bank?.bankName ? ` · ${payee.bank.bankName}` : ""}
                {payee.bank?.accountNumber
                  ? ` (${payee.bank.accountNumber})`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#98a2b3]">
                Monthly Payment
              </p>
              <p className="mt-1 text-lg font-bold text-[#1683d8]">
                {naira(payee.monthlyAmount)}
              </p>
              {payee.isTaxable && (
                <span className="mt-1 inline-block rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[11px] font-medium text-[#a16207]">
                  Taxable
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-[#d0d5dd] bg-white px-3.5 py-2 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#f9fafb]"
            >
              <Edit size={14} />
              Edit
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-6 border-b border-[#e5e7eb]">
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-3 text-sm font-medium transition ${
                  isActive
                    ? "text-[#1683d8]"
                    : "text-[#6b7280] hover:text-[#1f2937]"
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#1683d8]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "Payment History" && (
        <section className="mt-6 rounded-lg border border-[#e5e7eb] bg-white">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
            <h2 className="text-base font-semibold text-[#1f2937]">
              Payment History
            </h2>
            <button
              type="button"
              onClick={handleExportHistory}
              disabled={exportingHistory}
              className="flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exportingHistory ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {exportingHistory ? "Exporting..." : "Export"}
            </button>
          </div>

          {historyError && (
            <div className="m-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{historyError}</span>
              </div>
              <button
                type="button"
                onClick={fetchPaymentHistory}
                className="text-xs font-semibold text-red-700 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#f0f0f0] bg-[#fafafa] text-xs font-medium text-[#667085]">
                <tr>
                  <th className="px-6 py-3.5">Period</th>
                  <th className="px-6 py-3.5">Reference</th>
                  <th className="px-6 py-3.5">Gross Amount</th>
                  <th className="px-6 py-3.5">PAYE Tax</th>
                  <th className="px-6 py-3.5">Net Amount</th>
                  <th className="px-6 py-3.5">Payment Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {historyLoading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-[#6b7280]">
                        <Loader2 size={16} className="animate-spin" />
                        Loading payment history…
                      </div>
                    </td>
                  </tr>
                )}

                {!historyLoading && historyRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-sm text-[#9ca3af]"
                    >
                      No payment history yet.
                    </td>
                  </tr>
                )}

                {!historyLoading &&
                  historyRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-[#f9fafb]">
                      <td className="px-6 py-4 font-medium text-[#1f2937]">
                        {record.period}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#6b7280]">
                        {record.reference || "—"}
                      </td>
                      <td className="px-6 py-4 text-[#1f2937]">
                        {record.grossAmount != null
                          ? naira(record.grossAmount)
                          : naira(record.amount)}
                      </td>
                      <td className="px-6 py-4 text-[#6b7280]">
                        {record.payeTax != null ? naira(record.payeTax) : "₦0"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#1683d8]">
                        {naira(record.amount)}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#6b7280]">
                        {record.paymentDate
                          ? new Date(record.paymentDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            paymentStatusStyles[record.status] ||
                            "bg-[#f3f4f6] text-[#6b7280]"
                          }`}
                        >
                          {paymentStatusLabels[record.status] || record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* History Pagination */}
          {historyPagination && historyPagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#f0f0f0] px-6 py-3.5 text-xs text-[#6b7280]">
              <span>
                Showing page {historyPagination.page} of{" "}
                {historyPagination.totalPages} ({historyPagination.total} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={historyPagination.page <= 1 || historyLoading}
                  onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                  className="rounded border border-[#e5e7eb] bg-white px-3 py-1.5 font-medium text-[#374151] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={
                    historyPagination.page >= historyPagination.totalPages ||
                    historyLoading
                  }
                  onClick={() => setHistoryPage((p) => p + 1)}
                  className="rounded border border-[#e5e7eb] bg-white px-3 py-1.5 font-medium text-[#374151] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "Documents" && (
        <div className="mt-6 ">
          <Documents payeeId={idParam as string} />
        </div>
      )}

      <EditPayeeModal
        open={editOpen}
        payee={payee}
        onClose={() => setEditOpen(false)}
        onSuccess={() => {
          fetchPayeeDetail();
        }}
      />

      <RemovePayeeModal
        open={removeOpen}
        payee={payee}
        onCancel={() => setRemoveOpen(false)}
        onSuccess={() => {
          setRemoveOpen(false);
          router.push("/payroll/payees");
        }}
      />
    </div>
  );
}
