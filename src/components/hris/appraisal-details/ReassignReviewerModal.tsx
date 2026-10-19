// src/components/hris/appraisal-details/ReassignReviewerModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { getEmployees, reassignAppraisalManager } from "@/lib/api/hris";

interface ReassignReviewerModalProps {
  open: boolean;
  onClose: () => void;
  appraisalId: string;
  currentManagerName?: string | null;
  onReassigned?: () => void;
}

const MIN_REASON_LENGTH = 10;

export default function ReassignReviewerModal({
  open,
  onClose,
  appraisalId,
  currentManagerName,
  onReassigned,
}: ReassignReviewerModalProps) {
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [managerId, setManagerId] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setManagerId("");
    setReason("");
    setError(null);
    setLoadingEmployees(true);
    getEmployees({ limit: 100 })
      .then((list) =>
        setEmployees(list.map((e) => ({ id: e.id, name: e.name }))),
      )
      .catch(() => setEmployees([]))
      .finally(() => setLoadingEmployees(false));
  }, [open]);

  if (!open) return null;

  const reasonValid = reason.trim().length >= MIN_REASON_LENGTH;
  const canSubmit = Boolean(managerId) && reasonValid && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await reassignAppraisalManager(appraisalId, {
        managerId,
        reason: reason.trim(),
      });
      toast.success("Appraisal reviewer updated.");
      onReassigned?.();
      onClose();
    } catch (err: unknown) {
      const data = (
        err as {
          response?: {
            data?: {
              message?: string;
              validationErrors?: { field?: string; message?: string }[];
            };
          };
        }
      )?.response?.data;
      const validation = Array.isArray(data?.validationErrors)
        ? data?.validationErrors
            ?.map((v) => `${v.field ?? "Field"}: ${v.message ?? "Invalid"}`)
            .join("; ")
        : "";
      setError(
        validation || data?.message || "Failed to reassign the reviewer.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Change Appraisal Reviewer
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <p className="text-xs text-slate-500">
            Current reviewer:{" "}
            <span className="font-medium text-slate-700">
              {currentManagerName && currentManagerName !== "—"
                ? currentManagerName
                : "None assigned"}
            </span>
          </p>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              New reviewer
            </label>
            <select
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              disabled={submitting || loadingEmployees}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#2183C6] focus:ring-2 focus:ring-[#2183C6]/20"
            >
              <option value="">
                {loadingEmployees ? "Loading employees..." : "Select reviewer"}
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Reason
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={submitting}
              placeholder="e.g. Reporting relationship corrected after appraisal launch"
              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#2183C6] focus:ring-2 focus:ring-[#2183C6]/20"
            />
            <p
              className={`mt-1 text-[11px] ${
                reason.length > 0 && !reasonValid
                  ? "text-red-500"
                  : "text-slate-400"
              }`}
            >
              At least {MIN_REASON_LENGTH} characters.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2183C6] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1b6aa2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              Reassign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}