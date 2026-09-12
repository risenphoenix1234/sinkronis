// components/CycleCard.tsx
"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import StatusBadge from "../../ui/StatusBadge";
import {
  deleteAppraisalCycle,
  launchAppraisalCycle,
  completeAppraisalCycle,
} from "@/lib/api/hris";
import { AppraisalCycleSummary } from "@/lib/api/types/hrisTypes";

interface Props {
  cycle: AppraisalCycleSummary;
  onDeleted?: (cycleId: string) => void;
  onChanged?: () => void; // called after launch/complete so the parent can refetch
}

const STATUS_LABELS: Record<AppraisalCycleSummary["status"], string> = {
  DRAFT: "Draft", // no matching key in StatusBadge → falls through to its gray default
  ACTIVE: "Active", // matches StatusBadge's green "Active" style
  COMPLETED: "Completed", // matches StatusBadge's existing gray "Completed" style
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CycleCard({ cycle, onDeleted, onChanged }: Props) {
  const [busy, setBusy] = useState<"delete" | "launch" | "complete" | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${cycle.name}"? This can't be undone.`))
      return;
    setBusy("delete");
    setActionError(null);
    try {
      await deleteAppraisalCycle(cycle.id);
      onDeleted?.(cycle.id);
    } catch (err) {
      console.error(
        "Cycle delete failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
      setActionError("Couldn't delete this cycle.");
    } finally {
      setBusy(null);
    }
  };

  const handleLaunch = async () => {
    if (
      !window.confirm(
        `Launch "${cycle.name}"? Employees will be enrolled immediately.`,
      )
    )
      return;
    setBusy("launch");
    setActionError(null);
    try {
      await launchAppraisalCycle(cycle.id);
      onChanged?.();
    } catch (err) {
      console.error(
        "Cycle launch failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
      setActionError("Couldn't launch this cycle.");
    } finally {
      setBusy(null);
    }
  };

  const handleComplete = async () => {
    setBusy("complete");
    setActionError(null);
    try {
      await completeAppraisalCycle(cycle.id);
      onChanged?.();
    } catch (err) {
      // The 409 case has a specific, user-facing message from the API —
      // surface it directly rather than a generic failure string.
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Couldn't complete this cycle.")
        : "Couldn't complete this cycle.";
      console.error(
        "Cycle complete failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
      setActionError(message);
    } finally {
      setBusy(null);
    }
  };

  const isDraft = cycle.status === "DRAFT";
  const isActive = cycle.status === "ACTIVE";

  return (
    <div className="bg-white border border-[#EAECF0] rounded-md p-5 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-[#101828]">{cycle.name}</h3>
              <StatusBadge status={STATUS_LABELS[cycle.status]} />
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600">
                Template: {cycle.template.name}
              </span>
            </div>
          </div>

          {cycle.description && (
            <p className="text-sm text-[#667085]">{cycle.description}</p>
          )}

          <p className="text-xs text-[#98A2B3]">
            {formatDate(cycle.periodFrom)} – {formatDate(cycle.periodTo)} · Due{" "}
            {formatDate(cycle.submissionDeadline)} ·{" "}
            {cycle.progress.totalEmployees} enrolled
          </p>

          {isActive && (
            <>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600"
                  style={{ width: `${cycle.progress.percentage}%` }}
                />
              </div>
              <p className="text-xs text-[#667085]">
                {cycle.progress.acknowledged}/{cycle.progress.totalEmployees}{" "}
                acknowledged ({cycle.progress.percentage}%)
              </p>
            </>
          )}

          {actionError && <p className="text-xs text-red-600">{actionError}</p>}
        </div>

        <div className="flex items-center gap-3 ml-6">
          {isDraft && (
            <button
              onClick={handleLaunch}
              disabled={busy !== null}
              className="px-4 py-2 bg-[#EFF8FF] text-[#1570EF] rounded-md text-sm font-medium disabled:opacity-50"
            >
              {busy === "launch" ? "Launching…" : "Launch"}
            </button>
          )}

          {isActive && (
            <>
              <button className="px-4 py-2 bg-[#EFF8FF] text-[#1570EF] rounded-md text-sm font-medium">
                View Reviews
              </button>
              <button
                onClick={handleComplete}
                disabled={busy !== null}
                className="px-4 py-2 bg-[#ECFDF3] text-[#027A48] rounded-md text-sm font-medium disabled:opacity-50"
                title="Requires every appraisal in the cycle to be acknowledged first"
              >
                {busy === "complete" ? "Completing…" : "Complete"}
              </button>
            </>
          )}

          <button
            onClick={handleDelete}
            disabled={busy !== null}
            title="Delete cycle"
          >
            <Trash2
              size={16}
              className={
                busy === "delete" ? "text-[#D0D5DD]" : "text-[#98A2B3]"
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
}
