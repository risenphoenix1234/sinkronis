// src/app/accounting/payment-requests/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CreatePaymentRequestModal from "@/components/modals/CreatePaymentRequestModal";
import {
  getPaymentRequests,
  createPaymentRequest,
  approvePaymentRequest,
  declinePaymentRequest,
  disbursePaymentRequest,
} from "@/lib/api/accounting";
import { PaymentRequestItem, PaymentRequestSummary } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";

const statusStyles: Record<string, string> = {
  PENDING: "bg-[#FFF3CD] text-[#856404]",
  APPROVED: "bg-[#E3F2FD] text-[#2183C6]",
  COMPLETED: "bg-[#D8F3DC] text-[#1B7A34]",
  DECLINED: "bg-[#FFE5E5] text-[#FF3B30]",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  COMPLETED: "Completed",
  DECLINED: "Declined",
};

type Filter = "All" | "PENDING" | "APPROVED" | "COMPLETED" | "DECLINED";

const blockedText = (code: string | null | undefined) => {
  if (!code) return null;
  if (code === "INDEPENDENT_APPROVER_REQUIRED") return "A different user must approve this. You created it, so you can't approve it yourself.";
  const t = code.replace(/_/g, " ").toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function PaymentRequestsPage() {
  const [requests, setRequests] = useState<PaymentRequestItem[]>([]);
  const [summary, setSummary] = useState<PaymentRequestSummary>({ pendingApproval: 0, totalCompleted: 0, declined: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPaymentRequests();
      setRequests(res.data.requests);
      setSummary(res.data.summary);
    } catch (err) {
      setError("Failed to load payment requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filters: Filter[] = ["All", "PENDING", "APPROVED", "COMPLETED", "DECLINED"];

  const filtered = filter === "All" ? requests : requests.filter((r) => r.status === filter);

  const handleCreate = async (input: { title: string; description?: string; amount: string }) => {
    try {
      await createPaymentRequest(input);
      setModalOpen(false);
      await fetchRequests();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create payment request.");
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await approvePaymentRequest(id);
      await fetchRequests();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to approve request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (id: string) => {
    setActionLoading(id);
    try {
      await declinePaymentRequest(id);
      await fetchRequests();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to decline request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisburse = async (id: string) => {
    setActionLoading(id);
    try {
      await disbursePaymentRequest(id);
      await fetchRequests();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to disburse request.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] space-y-6 bg-[#F4F6F8] p-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-4xl font-bold text-[#212B36]">Payment Requests</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="whitespace-nowrap rounded-md bg-[#2183C6] px-4 py-3 text-sm font-medium text-white hover:bg-[#1976B8]"
        >
          + New Request
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-md border border-[#F2F3F5] bg-white p-6">
          <p className="text-sm text-[#637381]">Pending Approval</p>
          <p className="mt-4 text-3xl font-bold text-[#856404]">{summary.pendingApproval}</p>
        </div>
        <div className="rounded-md border border-[#F2F3F5] bg-white p-6">
          <p className="text-sm text-[#637381]">Total Completed</p>
          <p className="mt-4 text-3xl font-bold text-[#1B7A34]">{naira(summary.totalCompleted)}</p>
        </div>
        <div className="rounded-md border border-[#F2F3F5] bg-white p-6">
          <p className="text-sm text-[#637381]">Declined</p>
          <p className="mt-4 text-3xl font-bold text-[#FF3B30]">{summary.declined}</p>
        </div>
      </div>

      <div className="flex items-center gap-8 overflow-x-auto border-b border-[#E5E8EB]">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`-mb-px border-b-2 px-3 py-4 text-sm transition-colors ${
              filter === f
                ? "border-[#2183C6] font-medium text-[#2183C6]"
                : "border-transparent text-[#637381] hover:text-[#212B36]"
            }`}
          >
            {f === "All" ? "All" : statusLabels[f]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-md border border-[#F2F3F5] bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-dotted border-[#EBEEF0] text-[#637381] [&>th:first-child]:pl-4 [&>th:last-child]:pr-4">
              <th className="px-3 py-3.5 font-normal">Request</th>
              <th className="px-3 py-3.5 font-normal">Requested By</th>
              <th className="px-3 py-3.5 font-normal">Amount</th>
              <th className="px-3 py-3.5 font-normal">Description</th>
              <th className="px-3 py-3.5 font-normal">Status</th>
              <th className="px-3 py-3.5 font-normal">Raised</th>
              <th className="px-3 py-3.5 text-right font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#919EAB]">
                  <Loader variant="inline" label="Loading requests" />
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#FF3B30]">{error}</td>
              </tr>
            )}

            {!loading &&
              !error &&
              filtered.map((req) => (
                <tr
                  key={req.id}
                  className="text-[#212B36] even:bg-[#F2F2F7] [&>td:first-child]:pl-4 [&>td:last-child]:pr-4"
                >
                  <td className="px-3 py-3.5">
                    <p className="font-medium text-[#2183C6]">{req.title}</p>
                    {req.vendorName && <p className="text-xs text-[#919EAB]">{req.vendorName}</p>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5">{req.requestedBy}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 font-semibold tabular-nums">{naira(req.amount)}</td>
                  <td className="max-w-xs px-3 py-3.5 text-[#637381]">{req.description ?? "—"}</td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyles[req.status]}`}
                    >
                      {statusLabels[req.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{formatDate(req.createdAt)}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-right">
                    {(() => {
                      const canApprove = req.canApprove ?? req.status === "PENDING";
                      const canDecline = req.canReject ?? req.status === "PENDING";
                      const canDisburse = req.canInitiatePayment ?? req.status === "APPROVED";
                      const blockedReason =
                        (req.status === "PENDING" && !canApprove) || (req.status === "APPROVED" && !canDisburse)
                          ? blockedText(req.approvalBlockedReason)
                          : null;
                      return (
                        <>
                          {canApprove && (
                            <button
                              onClick={() => handleApprove(req.id)}
                              disabled={actionLoading === req.id}
                              className="mr-2 whitespace-nowrap rounded bg-[#2183C6] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1976B8] disabled:opacity-60"
                            >
                              Approve
                            </button>
                          )}
                          {canDecline && (
                            <button
                              onClick={() => handleDecline(req.id)}
                              disabled={actionLoading === req.id}
                              className="whitespace-nowrap rounded border border-[#FFC9C5] bg-white px-3 py-1.5 text-xs font-medium text-[#FF3B30] hover:bg-[#FFF5F5] disabled:opacity-60"
                            >
                              Decline
                            </button>
                          )}
                          {canDisburse && (
                            <button
                              onClick={() => handleDisburse(req.id)}
                              disabled={actionLoading === req.id}
                              className="whitespace-nowrap rounded bg-[#1B7A34] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#166A2C] disabled:opacity-60"
                            >
                              {actionLoading === req.id ? "Disbursing..." : "Disburse"}
                            </button>
                          )}
                          {blockedReason && (
                            <span className="ml-auto block max-w-[220px] whitespace-normal text-right text-xs text-[#856404]">
                              {blockedReason}
                            </span>
                          )}
                          {!canApprove && !canDecline && !canDisburse && !blockedReason && (
                            <span className="text-sm text-[#919EAB]">—</span>
                          )}
                        </>
                      );
                    })()}
                  </td>
                </tr>
              ))}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#919EAB]">No payment requests yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-[#637381]">
        Showing {filtered.length === 0 ? 0 : 1}–{filtered.length} of {filtered.length}
      </p>

      <CreatePaymentRequestModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </section>
  );
}