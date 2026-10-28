"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  RefreshCw,
  User,
  X,
} from "lucide-react";
import { getAttendanceDisputeId, resolveDispute } from "@/lib/api/hris";
import type { AttendanceDisputeDetail } from "@/lib/api/types/hrisTypes";
import StatusBadge from "@/components/ui/StatusBadge";
import Loader from "@/components/ui/Loader";

interface DisputeDetailModalProps {
  isOpen: boolean;
  disputeId: string | null;
  onClose: () => void;
  onResolved?: () => void;
}

export default function DisputeDetailModal({
  isOpen,
  disputeId,
  onClose,
  onResolved,
}: DisputeDetailModalProps) {
  const [detail, setDetail] = useState<AttendanceDisputeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolution state for pending disputes
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [resolutionNote, setResolutionNote] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const fetchDetail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAttendanceDisputeId(id);
      setDetail(res.data);
    } catch (err) {
      console.error("Failed to load dispute detail:", err);
      const msg =
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Failed to load dispute details.")
          : "Failed to load dispute details.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && disputeId) {
      setResolutionNote("");
      setDecision("APPROVED");
      setResolveError(null);
      fetchDetail(disputeId);
    } else {
      setDetail(null);
      setError(null);
    }
  }, [isOpen, disputeId]);

  if (!isOpen) return null;

  const handleResolve = async () => {
    if (!detail?.id || !resolutionNote.trim()) {
      setResolveError("A resolution note is required.");
      return;
    }

    setResolving(true);
    setResolveError(null);
    try {
      await resolveDispute(detail.id, {
        status: decision,
        resolutionNote: resolutionNote.trim(),
      });
      toast.success(
        `Dispute ${decision === "APPROVED" ? "approved" : "rejected"} successfully.`,
      );
      await fetchDetail(detail.id);
      onResolved?.();
    } catch (err) {
      const msg =
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Failed to resolve dispute.")
          : "Failed to resolve dispute.";
      setResolveError(msg);
      toast.error(msg);
    } finally {
      setResolving(false);
    }
  };

  const employeeName = detail?.employee
    ? `${detail.employee.firstName ?? ""} ${detail.employee.lastName ?? ""}`.trim() ||
      detail.employee.employeeNo ||
      "Employee"
    : "Employee";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 text-left">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dispute-detail-title"
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2183C6]">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2
                id="dispute-detail-title"
                className="text-base font-semibold text-slate-900"
              >
                {detail?.disputeNo || detail?.id || "Attendance Dispute"}
              </h2>
              <p className="text-xs text-slate-500">
                {detail?.createdAt
                  ? `Raised on ${new Date(detail.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}`
                  : "Dispute details"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {detail?.status && (
              <StatusBadge status={detail.status} variant="pill" />
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="-mr-1 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
          {loading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <Loader variant="section" label="Loading dispute details" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <AlertCircle className="text-red-500" size={28} />
              <p className="text-sm font-medium text-red-700">{error}</p>
              {disputeId && (
                <button
                  type="button"
                  onClick={() => fetchDetail(disputeId)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700"
                >
                  <RefreshCw size={13} />
                  Retry
                </button>
              )}
            </div>
          ) : detail ? (
            <>
              {/* Employee Summary Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                    <User size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-900">
                      {employeeName}
                    </h3>
                    <p className="truncate text-xs text-slate-500">
                      {detail.employee?.employeeNo || detail.employeeId} ·{" "}
                      {detail.employee?.department?.name || "General"} ·{" "}
                      {detail.employee?.jobTitle || "Employee"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendance & Time Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="text-xs font-medium text-slate-500">
                    Attendance Date
                  </span>
                  <p className="mt-1 font-semibold text-slate-800">
                    {detail.attendance?.attendanceDate ||
                      (detail.createdAt ? detail.createdAt.slice(0, 10) : "—")}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="text-xs font-medium text-slate-500">
                    Issue Type
                  </span>
                  <p className="mt-1 font-semibold text-slate-800">
                    {detail.issueType.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              {/* Recorded vs Claimed Times */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Clock size={14} /> Time Comparison
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-400">
                      System Clock In
                    </span>
                    <p className="mt-0.5 font-medium text-slate-700">
                      {detail.attendance?.clockInAt
                        ? new Date(
                            detail.attendance.clockInAt,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">
                      System Clock Out
                    </span>
                    <p className="mt-0.5 font-medium text-slate-700">
                      {detail.attendance?.clockOutAt
                        ? new Date(
                            detail.attendance.clockOutAt,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 pt-2">
                    <span className="text-xs text-slate-400">
                      Claimed Clock In
                    </span>
                    <p className="mt-0.5 font-semibold text-emerald-600">
                      {detail.claimedClockIn
                        ? detail.claimedClockIn.includes("T")
                          ? new Date(detail.claimedClockIn).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : detail.claimedClockIn
                        : "—"}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 pt-2">
                    <span className="text-xs text-slate-400">
                      Claimed Clock Out
                    </span>
                    <p className="mt-0.5 font-semibold text-rose-600">
                      {detail.claimedClockOut
                        ? detail.claimedClockOut.includes("T")
                          ? new Date(detail.claimedClockOut).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : detail.claimedClockOut
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Dispute Description
                </span>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {detail.description}
                </p>
              </div>

              {/* Resolution Info or Action */}
              {detail.status === "PENDING" ? (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Resolve Dispute
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDecision("APPROVED")}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                        decision === "APPROVED"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecision("REJECTED")}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                        decision === "REJECTED"
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Ban size={16} />
                      Reject
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="resolution-note"
                      className="mb-1.5 block text-xs font-medium text-slate-700"
                    >
                      Resolution Note <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="resolution-note"
                      rows={3}
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="Explain the reason for this decision..."
                      className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                    />
                  </div>

                  {resolveError && (
                    <p className="text-xs font-medium text-rose-600">
                      {resolveError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleResolve}
                    disabled={resolving || !resolutionNote.trim()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2183C6] py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b6aa2] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resolving && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    Submit Decision
                  </button>
                </div>
              ) : (
                detail.resolutionNote && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Resolution Note
                    </span>
                    <p className="mt-1 text-sm text-slate-800">
                      {detail.resolutionNote}
                    </p>
                    {detail.resolvedAt && (
                      <p className="mt-2 text-xs text-slate-400">
                        Resolved on{" "}
                        {new Date(detail.resolvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
