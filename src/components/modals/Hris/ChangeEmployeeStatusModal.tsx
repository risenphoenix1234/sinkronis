"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiX, FiAlertTriangle, FiCheck, FiCalendar, FiClock } from "react-icons/fi";
import { updateEmployeeStatus } from "@/lib/api/hris";
import type { EmployeeStatus } from "@/lib/api/types/hrisTypes";
import Button from "@/components/ui/Button";

export interface ChangeEmployeeStatusModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  currentStatus?: string;
  initialStatus?: EmployeeStatus;
  onSuccess?: () => void;
}

interface StatusOption {
  value: EmployeeStatus;
  label: string;
  description: string;
  isDestructive?: boolean;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Employee is in active service and performing duties.",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    description: "Permanent employment confirmed after successful probation.",
  },
  {
    value: "PROBATION",
    label: "Probation",
    description: "Employee is serving an active probationary period.",
  },
  {
    value: "ON_LEAVE",
    label: "On Leave",
    description: "Employee is on an approved temporary leave of absence.",
  },
  {
    value: "SUSPENDED",
    label: "Suspended",
    description: "Employee is temporarily suspended from active duties.",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Deactivated status. Linked user portal access will be revoked.",
    isDestructive: true,
  },
  {
    value: "EXITED",
    label: "Exited",
    description: "Separated from organization. Linked user portal access will be revoked.",
    isDestructive: true,
  },
];

const STATUS_PILL_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PROBATION: "bg-amber-50 text-amber-700 border-amber-200",
  ON_LEAVE: "bg-blue-50 text-blue-700 border-blue-200",
  SUSPENDED: "bg-orange-50 text-orange-700 border-orange-200",
  INACTIVE: "bg-slate-100 text-slate-600 border-slate-200",
  EXITED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function ChangeEmployeeStatusModal({
  open,
  onClose,
  employeeId,
  employeeName,
  currentStatus,
  initialStatus,
  onSuccess,
}: ChangeEmployeeStatusModalProps) {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus>(
    initialStatus || (currentStatus as EmployeeStatus) || "ACTIVE"
  );
  const [effectiveDate, setEffectiveDate] = useState<string>(getTodayDate());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (initialStatus) {
        setSelectedStatus(initialStatus);
      } else if (
        currentStatus &&
        STATUS_OPTIONS.some((opt) => opt.value === currentStatus)
      ) {
        setSelectedStatus(currentStatus as EmployeeStatus);
      }
      setEffectiveDate(getTodayDate());
      setError(null);
    }
  }, [open, initialStatus, currentStatus]);

  if (!open) return null;

  const currentOption = STATUS_OPTIONS.find((opt) => opt.value === selectedStatus);
  const isDestructive = currentOption?.isDestructive;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) {
      setError("Please select a status.");
      return;
    }
    if (!effectiveDate) {
      setError("Please provide an effective date (required by backend).");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateEmployeeStatus(employeeId, {
        status: selectedStatus,
        effectiveDate,
      });

      toast.success(
        `Employee status updated to ${currentOption?.label || selectedStatus} successfully!`
      );
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      console.error("updateEmployeeStatus failed:", err);
      let errMsg = "Failed to update employee status. Please try again.";
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        if (resData?.validationErrors && Array.isArray(resData.validationErrors)) {
          errMsg = resData.validationErrors
            .map((v: { field?: string; message?: string }) => v.message || v.field)
            .join(", ");
        } else if (resData?.message) {
          errMsg = resData.message;
        }
      }
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-status-title"
    >
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden border border-slate-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2
              id="change-status-title"
              className="text-lg font-semibold text-slate-900"
            >
              Change Employee Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Updating status for <span className="font-medium text-slate-800">{employeeName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50"
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current Status display */}
          {currentStatus && (
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-xs font-medium text-slate-500">
                Current Status
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  STATUS_PILL_STYLES[currentStatus] ||
                  "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {currentStatus.replace("_", " ")}
              </span>
            </div>
          )}

          {/* Status Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="new-status-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              New Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
              {STATUS_OPTIONS.map((option) => {
                const isSelected = selectedStatus === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${
                      isSelected
                        ? "border-sky-500 bg-sky-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="employee-status"
                      value={option.value}
                      checked={isSelected}
                      disabled={submitting}
                      onChange={() => setSelectedStatus(option.value)}
                      className="mt-0.5 h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? "text-sky-900" : "text-slate-800"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            STATUS_PILL_STYLES[option.value] ||
                            "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {option.value}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Destructive Warning */}
          {isDestructive && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 text-xs">
              <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">Security Access Revocation Notice</p>
                <p className="mt-0.5 text-amber-700 leading-relaxed">
                  Changing status to <strong>{selectedStatus}</strong> will immediately revoke this employee&apos;s linked login credentials and access to the employee portal.
                </p>
              </div>
            </div>
          )}

          {/* Effective Date Picker */}
          <div className="space-y-1.5">
            <label
              htmlFor="effective-date"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Effective Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="effective-date"
                type="date"
                required
                value={effectiveDate}
                disabled={submitting}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50"
              />
              <FiCalendar className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              The date when this status transition takes effect.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={submitting}
              className={isDestructive ? "bg-rose-600 hover:bg-rose-700" : ""}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <FiClock className="animate-spin h-4 w-4" />
                  Updating...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <FiCheck className="h-4 w-4" />
                  Save Status Change
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
