"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Ban, Check, CornerDownRight } from "lucide-react";
import type { AttendanceDispute } from "@/lib/api/types/hrisTypes";
import ApproveDisputeModal from "../../modals/Hris/ApproveDisputeModal";
import DisputeDetailModal from "../../modals/Hris/DisputeDetailModal";
import { resolveDispute } from "@/lib/api/hris";

interface CardProps {
  dispute: AttendanceDispute;
  onResolved?: () => void;
}

function formatTime(val?: string | null): string {
  if (!val) return "";
  if (/^\d{1,2}:\d{2}$/.test(val)) return val;
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  } catch {}
  return val;
}

function formatDate(val?: string | null): string {
  if (!val) return "—";
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  } catch {}
  return val;
}

function formatDateTime(val?: string | null): string {
  if (!val) return "";
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const datePart = d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const timePart = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return `${datePart} • ${timePart}`;
    }
  } catch {}
  return val;
}

export function DisputeCard({ dispute, onResolved }: CardProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"Approved" | "Rejected">(
    "Approved",
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResolve = async (data: {
    action: "Approved" | "Rejected";
    resolution: string;
  }) => {
    setError(null);
    try {
      await resolveDispute(dispute.id, {
        status: data.action === "Approved" ? "APPROVED" : "REJECTED",
        resolutionNote: data.resolution,
      });
      setShowModal(false);
      onResolved?.();
    } catch (err) {
      console.error(
        "Resolve failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
      const msg =
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Couldn't resolve this dispute.")
          : "Couldn't resolve this dispute.";
      setError(msg);
      toast.error(msg);
    }
  };

  const anyDispute = dispute as any;
  const displayId = anyDispute.disputeId || anyDispute.disputeNo || dispute.id;
  const employeeName =
    anyDispute.employee?.name ||
    dispute.employeeName ||
    (anyDispute.employee?.firstName && anyDispute.employee?.lastName
      ? `${anyDispute.employee.firstName} ${anyDispute.employee.lastName}`
      : "—");
  const employeeCode =
    anyDispute.employee?.employeeId ||
    anyDispute.employee?.employeeNo ||
    dispute.employeeId ||
    "—";
  const departmentName =
    (typeof anyDispute.employee?.department === "string"
      ? anyDispute.employee.department
      : anyDispute.employee?.department?.name) ||
    dispute.department ||
    "—";
  const issue = (anyDispute.issueType || dispute.issue || "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
  const disputeDate = formatDate(dispute.date || dispute.createdAt);
  const timestamp = formatDateTime(dispute.createdAt || dispute.date);
  const resolution = anyDispute.resolutionNote || dispute.resolution;
  const isPending = dispute.status?.toUpperCase() === "PENDING";
  const isApproved = dispute.status?.toUpperCase() === "APPROVED";
  const isRejected = dispute.status?.toUpperCase() === "REJECTED";

  const claimedIn = formatTime(dispute.claimedClockIn);
  const claimedOut = formatTime(dispute.claimedClockOut);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex-1">
          {/* Top row: ID, Status, Issue Type, Date */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDetailModal(true)}
              className="text-left font-bold text-slate-800 transition hover:text-blue-600 hover:underline"
            >
              {displayId}
            </button>

            {/* Status Pill */}
            {isPending && (
              <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-medium text-[#92400E]">
                Pending
              </span>
            )}
            {isApproved && (
              <span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-medium text-[#166534]">
                Approved
              </span>
            )}
            {isRejected && (
              <span className="rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-xs font-medium text-[#991B1B]">
                Rejected
              </span>
            )}

            {/* Issue Pill */}
            {issue && (
              <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {issue}
              </span>
            )}

            {/* Date Pill */}
            <span className="rounded-md bg-[#E0F2FE] px-2.5 py-0.5 text-xs font-medium text-[#0369A1]">
              {disputeDate}
            </span>
          </div>

          {/* Employee row */}
          <p className="mt-2.5 text-sm font-semibold text-slate-900">
            {employeeName}
            <span className="ml-1 text-xs font-normal text-slate-500">
              ({employeeCode} · {departmentName})
            </span>
          </p>

          {/* Description */}
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            {dispute.description}
          </p>

          {/* Claimed Times */}
          {(claimedIn || claimedOut) && (
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium">
              {claimedIn && (
                <span className="flex items-center gap-1 text-[#16A34A]">
                  <CornerDownRight size={13} className="stroke-[2.5]" />
                  Claimed In: {claimedIn}
                </span>
              )}
              {claimedOut && (
                <span className="flex items-center gap-1 text-[#DC2626]">
                  <CornerDownRight size={13} className="stroke-[2.5]" />
                  Claimed Out: {claimedOut}
                </span>
              )}
            </div>
          )}

          {/* Resolution block */}
          {resolution && (
            <div className="mt-3 border-t border-slate-100 pt-2.5 text-xs text-slate-600">
              <p>
                <strong className="font-semibold text-slate-700">
                  Resolution:
                </strong>{" "}
                {resolution}
              </p>
              {anyDispute.resolvedAt && (
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {formatDateTime(anyDispute.resolvedAt)}
                </p>
              )}
            </div>
          )}

          {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
        </div>

        {/* Right side: Timestamp & Action Buttons */}
        <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end sm:justify-between">
          <p className="text-xs text-slate-400">{timestamp}</p>

          {isPending && (
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setModalAction("Rejected");
                  setShowModal(true);
                }}
                className="flex items-center gap-1 rounded-lg border border-red-200 bg-[#FEE2E2]/60 px-3.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-[#FEE2E2]"
              >
                <Ban size={13} />
                Reject
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalAction("Approved");
                  setShowModal(true);
                }}
                className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-[#DCFCE7]/70 px-3.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-[#DCFCE7]"
              >
                <Check size={14} className="stroke-[2.5]" />
                Approve
              </button>
            </div>
          )}
        </div>
      </div>

      <ApproveDisputeModal
        isOpen={showModal}
        dispute={dispute}
        initialAction={modalAction}
        onClose={() => setShowModal(false)}
        onSubmit={handleResolve}
      />

      <DisputeDetailModal
        isOpen={showDetailModal}
        disputeId={dispute.id}
        onClose={() => setShowDetailModal(false)}
        onResolved={onResolved}
      />
    </div>
  );
}
