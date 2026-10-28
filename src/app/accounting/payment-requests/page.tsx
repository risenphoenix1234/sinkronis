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
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  DECLINED: "bg-rose-50 text-rose-700",
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
    <section className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payment Requests</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
        >
          + New Request
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Pending Approval</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{summary.pendingApproval}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Total Completed</p>
         <p className="mt-1 text-3xl font-semibold text-slate-900">{naira(summary.totalCompleted)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Declined</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{summary.declined}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              filter === f
                ? "border-sky-200 bg-sky-50 font-medium text-sky-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f === "All" ? "All" : statusLabels[f]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Request</th>
              <th className="px-6 py-3 font-medium">Requested By</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Raised</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400"><Loader variant="inline" label="Loading requests" /></td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-red-500">{error}</td>
              </tr>
            )}

            {!loading && !error && filtered.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50">
                <td className="px-6 py-3">
  <p className="text-sm font-medium text-sky-600">{req.title}</p>
  {req.vendorName && <p className="text-xs text-slate-500">{req.vendorName}</p>}
</td>
                <td className="px-6 py-3 text-base text-slate-800 whitespace-nowrap">{req.requestedBy}</td>
              <td className="px-6 py-3 text-base tabular-nums font-medium text-slate-800 whitespace-nowrap">
  {naira(req.amount)}
</td>
                <td className="px-6 py-3 text-sm text-slate-500 max-w-xs">{req.description ?? "—"}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[req.status]}`}>
                    {statusLabels[req.status]}
                  </span>
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{formatDate(req.createdAt)}</td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
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
                            className="mr-2 rounded-md bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
                          >
                            Approve
                          </button>
                        )}
                        {canDecline && (
                          <button
                            onClick={() => handleDecline(req.id)}
                            disabled={actionLoading === req.id}
                            className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-500 hover:bg-rose-50 disabled:opacity-60"
                          >
                            Decline
                          </button>
                        )}
                        {canDisburse && (
                          <button
                            onClick={() => handleDisburse(req.id)}
                            disabled={actionLoading === req.id}
                            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {actionLoading === req.id ? "Disbursing..." : "Disburse"}
                          </button>
                        )}
                        {blockedReason && (
                          <span className="ml-auto block max-w-[220px] whitespace-normal text-right text-xs text-amber-600">
                            {blockedReason}
                          </span>
                        )}
                        {!canApprove && !canDecline && !canDisburse && !blockedReason && (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </>
                    );
                  })()}
                </td>
              </tr>
            ))}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400">No payment requests yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreatePaymentRequestModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </section>
  );
}