// src/app/hris/bank-requests/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import {
  approveBankUpdateRequest,
  getBankUpdateRequests,
  rejectBankUpdateRequest,
} from "@/lib/api/hris";
import type {
  BankUpdateRequestBank,
  BankUpdateRequestFilter,
  BankUpdateRequestItem,
  BankUpdateRequestsResponse,
} from "@/lib/api/hris";
import Loader from "@/components/ui/Loader";

const PAGE_SIZE = 10;

const FILTERS: { value: BankUpdateRequestFilter; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "ALL", label: "All" },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

type ReviewAction = { type: "approve" | "reject"; request: BankUpdateRequestItem };

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (Array.isArray(data?.validationErrors) && data.validationErrors.length > 0) {
      const joined = data.validationErrors
        .map((v: { message?: string }) => v.message)
        .filter(Boolean)
        .join(", ");
      if (joined) return joined;
    }
    if (data?.message) return data.message;
  }
  return fallback;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function BankSummary({ bank }: { bank: BankUpdateRequestBank | null }) {
  if (!bank || !bank.bankName) {
    return <span className="text-sm text-slate-400">Not set</span>;
  }
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-medium text-slate-800">{bank.bankName}</p>
      <p className="text-xs text-slate-500">
        {bank.accountNumberMasked || "—"}
        {bank.accountType ? ` · ${bank.accountType}` : ""}
      </p>
      {bank.accountName && (
        <p className="text-xs text-slate-500">{bank.accountName}</p>
      )}
    </div>
  );
}

export default function BankRequestsPage() {
  const [filter, setFilter] = useState<BankUpdateRequestFilter>("PENDING");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<BankUpdateRequestsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [action, setAction] = useState<ReviewAction | null>(null);
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBankUpdateRequests({
        status: filter,
        page,
        limit: PAGE_SIZE,
      });
      setResult(res);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load bank update requests."));
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const changeFilter = (value: BankUpdateRequestFilter) => {
    setFilter(value);
    setPage(1);
  };

  const openAction = (type: ReviewAction["type"], request: BankUpdateRequestItem) => {
    setAction({ type, request });
    setNote("");
    setNoteError(null);
  };

  const closeAction = () => {
    if (submitting) return;
    setAction(null);
    setNote("");
    setNoteError(null);
  };

  const handleConfirm = async () => {
    if (!action) return;
    const trimmed = note.trim();

    if (action.type === "reject" && !trimmed) {
      setNoteError("A review note is required to reject a request.");
      return;
    }

    setSubmitting(true);
    try {
      if (action.type === "approve") {
        await approveBankUpdateRequest(action.request.id, trimmed || undefined);
        toast.success(`Bank details updated for ${action.request.employee.name}.`);
      } else {
        await rejectBankUpdateRequest(action.request.id, trimmed);
        toast.success("Request rejected.");
      }
      setAction(null);
      setNote("");
      await load();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.info("This request was already reviewed. Refreshing the list.");
        setAction(null);
        setNote("");
        await load();
      } else {
        const message = getErrorMessage(
          err,
          action.type === "approve"
            ? "Could not approve this request."
            : "Could not reject this request.",
        );
        setNoteError(message);
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const rows = result?.data ?? [];
  const pagination = result?.pagination;

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">
                Bank Update Requests
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Review changes employees have requested to their bank details.
                Approving applies the new details immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => changeFilter(item.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  filter === item.value
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
            <table className="w-full min-w-[960px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-left text-xs font-medium text-slate-500">
                  <th className="px-4 py-4">Employee</th>
                  <th className="px-4 py-4">Current bank</th>
                  <th className="px-4 py-4">Requested bank</th>
                  <th className="px-4 py-4">Reason</th>
                  <th className="px-4 py-4">Submitted</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody>
                {loading && !result ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-slate-500"><Loader variant="inline" label="Loading requests" /></td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <p className="text-sm font-medium text-red-600">{error}</p>
                      <button
                        type="button"
                        onClick={load}
                        className="mt-2 text-sm font-medium text-sky-600 underline"
                      >
                        Try again
                      </button>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                      {filter === "PENDING"
                        ? "No pending bank update requests."
                        : "No requests found for this filter."}
                    </td>
                  </tr>
                ) : (
                  rows.map((req) => (
                    <tr key={req.id} className="border-b border-slate-100 align-top last:border-0">
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {req.employee.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {req.employee.employeeId}
                          {req.employee.department?.name
                            ? ` · ${req.employee.department.name}`
                            : ""}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <BankSummary bank={req.currentBank} />
                      </td>
                      <td className="px-4 py-4">
                        <BankSummary bank={req.proposedBank} />
                      </td>
                      <td className="max-w-[220px] px-4 py-4 text-sm text-slate-600">
                        {req.reason || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatDate(req.submittedAt)}
                        {req.reviewedAt && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            Reviewed {formatDate(req.reviewedAt)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            STATUS_STYLES[req.status] ?? STATUS_STYLES.CANCELLED
                          }`}
                        >
                          {req.status.charAt(0) + req.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {req.status === "PENDING" && (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openAction("reject", req)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => openAction("approve", req)}
                              className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-sky-700"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} requests
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPreviousPage || loading}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {action.type === "approve" ? "Approve bank update" : "Reject bank update"}
              </h3>
              <button
                type="button"
                onClick={closeAction}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mb-4 text-sm text-slate-500">
              {action.type === "approve"
                ? `This replaces ${action.request.employee.name}'s bank details with the requested ones straight away.`
                : `${action.request.employee.name}'s current bank details stay unchanged.`}
            </p>

            <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current
                </p>
                <BankSummary bank={action.request.currentBank} />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Requested
                </p>
                <BankSummary bank={action.request.proposedBank} />
              </div>
            </div>

            <label className="text-xs font-medium text-slate-500">
              {action.type === "approve" ? "Review note (optional)" : "Review note (required)"}
            </label>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setNoteError(null);
              }}
              rows={3}
              disabled={submitting}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:bg-slate-50"
            />

            {noteError && <p className="mt-2 text-sm text-red-600">{noteError}</p>}

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeAction}
                disabled={submitting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                  action.type === "approve"
                    ? "bg-sky-600 hover:bg-sky-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {submitting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                {action.type === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}