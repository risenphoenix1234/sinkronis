// src/app/payroll/pay-runs/[id]/page.tsx
"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import StatusBadge from "@/components/payroll/pay-run/StatusBadge";
import {
  approvePayRun,
  cancelPayRun,
  exportPayRun,
  getApiErrorMessage,
  getPayRun,
  rejectPayRun,
} from "@/lib/api/payroll";
import type { PayrollPagination, PayrollPayRun, PayrollPayRunItem } from "@/lib/api/types/payroll.types";
import Loader from "@/components/ui/Loader";

const PAGE_SIZE = 20;
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;


function Overlay({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
      <div onMouseDown={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

type Modal = null | "approve" | "decline" | "cancel";

const blockedText = (code: string | null | undefined) => {
  if (!code) return null;
  if (code === "INDEPENDENT_APPROVER_REQUIRED") return "A different user must approve this. You created it, so you can't approve it yourself.";
  const t = code.replace(/_/g, " ").toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export default function PayRunDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [run, setRun] = useState<PayrollPayRun | null>(null);
  const [items, setItems] = useState<PayrollPayRunItem[]>([]);
  const [pagination, setPagination] = useState<PayrollPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [modal, setModal] = useState<Modal>(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPayRun(id, { page, limit: PAGE_SIZE });
      setRun(res.payRun);
      setItems(res.items);
      setPagination(res.pagination);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load this payroll."));
    } finally {
      setLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    load();
  }, [load]);

  const closeModal = () => {
    if (busy) return;
    setModal(null);
    setReason("");
    setReasonError(false);
    setActionError("");
  };

  const runAction = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    setActionError("");
    try {
      await fn();
      setNotice(done);
      setModal(null);
      setReason("");
      await load();
    } catch (e) {
      setActionError(getApiErrorMessage(e, "That did not go through. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    setNotice("");
    setError("");
    try {
      const blob = await exportPayRun(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${run?.periodLabel ?? "payroll"}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not export this payroll."));
    }
  };

  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const total = pagination?.total ?? 0;
  const start = (page - 1) * PAGE_SIZE;

  if (loading && !run) return <Loader variant="page" label="Loading payroll" />;
  if (!run) return <div className="p-6 text-sm text-red-600">{error || "Payroll not found."}</div>;

  const canApprove = run.canApprove ?? run.availableActions.includes("APPROVE");
  const canDecline = run.canReject ?? run.availableActions.includes("REJECT_FOR_REWORK");
  const blockedReason = run.status === "PENDING_APPROVAL" && !canApprove ? blockedText(run.approvalBlockedReason) : null;
  const cancellable = run.status === "DRAFT" || run.status === "REJECTED_FOR_REWORK";

  const stats = [
    { label: "Total Gross", value: naira(run.totals.gross) },
    { label: "Total Net Pay", value: naira(run.totals.netPay) },
    { label: "Total Employees", value: String(run.participantCount) },
    { label: "Total Tax", value: naira(run.totals.paye + run.totals.wht) },
    { label: "Total Pension", value: naira(run.totals.pension) },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">{run.periodLabel}</h1>
        <StatusBadge status={run.status} />
      </div>

      {notice && <p className="mt-2 text-xs text-green-600">{notice}</p>}
      {error && <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
      {run.status === "REJECTED_FOR_REWORK" && run.rejectionReason && (
        <p className="mt-2 text-xs text-red-500">Declined: {run.rejectionReason}</p>
      )}
      {run.status === "FAILED" && run.failureReason && <p className="mt-2 text-xs text-red-500">{run.failureReason}</p>}
      {blockedReason && <p className="mt-2 text-xs text-amber-600">{blockedReason}</p>}

      <div className="mt-4 flex flex-wrap items-stretch justify-between gap-4 rounded-lg border border-slate-200 bg-white">
        <div className="grid flex-1 grid-cols-2 divide-slate-200 sm:grid-cols-5 sm:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="p-4">
              <p className="text-[11px] text-slate-500">{s.label}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 px-4">
          <button onClick={download} className="text-xs font-medium text-[#2183C6] hover:underline">
            Export
          </button>
          {cancellable && (
            <button onClick={() => setModal("cancel")} className="text-xs font-medium text-red-500 hover:underline">
              Cancel Payroll
            </button>
          )}
          {canDecline && (
            <button onClick={() => setModal("decline")} className="text-xs font-medium text-red-500 hover:underline">
              Decline Payroll
            </button>
          )}
          {canApprove && (
            <button onClick={() => setModal("approve")} className="rounded bg-[#2183C6] px-4 py-2 text-xs font-medium text-white hover:opacity-90">
              Approve Payroll
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-slate-500">
            <tr>
              <th className="py-3 font-medium">Name</th>
              <th className="py-3 font-medium">Group</th>
              <th className="py-3 font-medium">Gross Salary</th>
              <th className="py-3 font-medium">Total Tax</th>
              <th className="py-3 font-medium">Total Pension</th>
              <th className="py-3 font-medium">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">No employees in this payroll.</td>
              </tr>
            )}
            {items.map((i, idx) => {
              const pending = i.netPay === null || i.netPay === undefined;
              const cell = (v: number) => (pending ? "Pending" : naira(v));
              return (
                <tr key={i.participantId ?? i.payeeId ?? i.employeeId ?? idx} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                  <td className="py-4 text-slate-800">{i.displayName ?? "-"}</td>
                  <td className="py-4 text-slate-700">{i.group?.name ?? "-"}</td>
                  <td className="py-4 text-slate-700">{pending ? naira(i.baseCompensation ?? 0) : naira(i.cashGross ?? 0)}</td>
                  <td className="py-4 text-slate-700">{cell((i.paye ?? 0) + (i.wht ?? 0))}</td>
                  <td className="py-4 text-slate-700">{cell(i.employeePension ?? 0)}</td>
                  <td className="py-4 text-slate-700">{cell(i.netPay ?? 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing {total === 0 ? 0 : start + 1} to {Math.min(start + PAGE_SIZE, total)} of {total} employees
        </span>
        <div className="flex items-center gap-1">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Previous page">
            <FiChevronLeft size={13} />
          </button>
          <span className="px-2">
            {page} / {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Next page">
            <FiChevronRight size={13} />
          </button>
        </div>
      </div>

      {modal === "approve" && (
        <Overlay onClose={closeModal}>
          <div className="w-80 rounded-lg bg-white p-6 text-center shadow-xl">
            <p className="text-sm font-medium text-slate-900">Are you sure you want to approve payroll?</p>
            {actionError && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{actionError}</p>}
            <div className="mt-5 flex justify-center gap-3">
              <button
                disabled={busy}
                onClick={() => {
                  setActionError("");
                  setModal("decline");
                }}
                className="rounded border border-red-400 px-4 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
              >
                Decline
              </button>
              <button
                disabled={busy}
                onClick={() => runAction(() => approvePayRun(id), "Payroll approved.")}
                className="rounded bg-green-500 px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Approving…" : "Approve"}
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {modal === "decline" && (
        <Overlay onClose={closeModal}>
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Justification for Payroll decline</h2>
            <p className="mt-1 text-[11px] text-slate-400">Add comments before declining this payroll</p>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setReasonError(false);
              }}
              placeholder="Write a comment..."
              className={`mt-4 h-32 w-full resize-none rounded-md border p-3 text-sm outline-none focus:border-[#2183C6] ${reasonError ? "border-red-400" : "border-slate-300"}`}
            />
            {reasonError && <p className="mt-1 text-xs text-red-500">Please write a comment.</p>}
            {actionError && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{actionError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button disabled={busy} onClick={closeModal} className="rounded-md bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50">
                Cancel
              </button>
              <button
                disabled={busy}
                onClick={() =>
                  reason.trim()
                    ? runAction(() => rejectPayRun(id, { reason: reason.trim() }), "Payroll declined.")
                    : setReasonError(true)
                }
                className="rounded-md bg-[#2183C6] px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {modal === "cancel" && (
        <Overlay onClose={closeModal}>
          <div className="w-80 rounded-lg bg-white p-6 text-center shadow-xl">
            <p className="text-sm font-medium text-slate-900">Cancel this payroll?</p>
            <p className="mt-1 text-xs text-slate-500">A cancelled payroll cannot be processed.</p>
            {actionError && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{actionError}</p>}
            <div className="mt-5 flex justify-center gap-3">
              <button disabled={busy} onClick={closeModal} className="rounded bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50">
                Keep
              </button>
              <button
                disabled={busy}
                onClick={() => runAction(() => cancelPayRun(id), "Payroll cancelled.")}
                className="rounded bg-red-500 px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Cancelling…" : "Cancel Payroll"}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}