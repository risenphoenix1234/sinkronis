"use client";

import {
  createEmployeeLeaveRequest,
  getEmployeeRelievers,
} from "@/lib/api/employee";
import {
  LeaveBalanceItem,
  EmployeeRelieverItem,
  CreateEmployeeLeaveRequestPayload,
} from "@/lib/api/types/employeeTypes";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface ApplyModalProps {
  onClose: () => void;
  balances?: LeaveBalanceItem[];
  onSubmitted?: () => void;
}

export function ApplyModal({
  onClose,
  balances,
  onSubmitted,
}: ApplyModalProps) {
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [relieverEmployeeId, setRelieverEmployeeId] = useState("");
  const [relievers, setRelievers] = useState<EmployeeRelieverItem[]>([]);
  const [loadingRelievers, setLoadingRelievers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingRelievers(true);
    getEmployeeRelievers()
      .then((items) => {
        if (isMounted) setRelievers(items);
      })
      .catch((err) => {
        console.error("Failed to load relievers:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingRelievers(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  // Derive leave options ensuring requested types are always present:
  // [sick, annual, maternity/paternity, emergency]
  const leaveOptions = useMemo(() => {
    const requiredTypes = [
      {
        slug: "SICK_LEAVE",
        label: "Sick",
        matches: ["sick"],
      },
      {
        slug: "ANNUAL_LEAVE",
        label: "Annual",
        matches: ["annual"],
      },
      {
        slug: "MATERNITY_LEAVE",
        label: "Maternity/Paternity",
        matches: ["maternity", "paternity"],
      },
      {
        slug: "COMPASSIONATE_LEAVE",
        label: "Emergency",
        matches: ["emergency", "compassionate"],
      },
    ];

    const matchedBalanceIds = new Set<string>();

    const options = requiredTypes.map((req) => {
      // Find matching live balance if present
      const match = balances?.find((b) => {
        const text = `${b.leaveTypeName || ""} ${b.name || ""} ${b.code || ""}`.toLowerCase();
        return req.matches.some((m) => text.includes(m));
      });

      if (match) {
        const typeId =
          match.leaveTypeId || match.code || match.id || req.slug;
        if (match.leaveTypeId || match.code || match.id) {
          matchedBalanceIds.add(
            match.leaveTypeId || match.code || match.id || "",
          );
        }
        const remaining = match.remainingDays;
        const remainingText =
          remaining !== undefined ? ` (${remaining} days left)` : "";
        return {
          id: req.slug,
          label: `${match.leaveTypeName || match.name || req.label}${remainingText}`,
          value: typeId,
        };
      }

      return {
        id: req.slug,
        label: req.label,
        value: req.slug,
      };
    });

    // Also include any other live balances that don't match the 4 standard types
    if (balances && balances.length > 0) {
      balances.forEach((b) => {
        const typeId = b.leaveTypeId || b.id;
        if (typeId && !matchedBalanceIds.has(typeId)) {
          const name = b.leaveTypeName || b.name || "Leave";
          const remainingText =
            b.remainingDays !== undefined ? ` (${b.remainingDays} days left)` : "";
          options.push({
            id: typeId,
            label: `${name}${remainingText}`,
            value: typeId,
          });
        }
      });
    }

    return options;
  }, [balances]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!leaveTypeId) {
      toast.error("Please select a leave type");
      return;
    }
    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }
    if (!endDate) {
      toast.error("Please select an end date");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be earlier than start date");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for leave");
      return;
    }

    const payload: CreateEmployeeLeaveRequestPayload = {
      leaveTypeId,
      startDate,
      endDate,
      reason: reason.trim(),
    };
    if (relieverEmployeeId.trim()) {
      payload.relieverEmployeeId = relieverEmployeeId.trim();
    }

    setSubmitting(true);
    try {
      const res = await createEmployeeLeaveRequest(payload);
      toast.success(
        res?.message || "Pending leave request created successfully",
      );
      onSubmitted?.();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        "Failed to submit leave request. Please check your details.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            Apply for Leave
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                Leave Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={leaveTypeId}
                  onChange={(e) => setLeaveTypeId(e.target.value)}
                  className={inputClass + " appearance-none"}
                >
                  <option value="">
                    Select type
                  </option>
                  {leaveOptions.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief reason for leave..."
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>

            <div>
              <label className={labelClass}>
                Reliever{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <select
                  value={relieverEmployeeId}
                  onChange={(e) => setRelieverEmployeeId(e.target.value)}
                  className={inputClass + " appearance-none"}
                >
                  <option value="">
                    {loadingRelievers
                      ? "Loading eligible relievers..."
                      : "Select a colleague to cover duties"}
                  </option>
                  {relievers.map((r) => {
                    const roleText = r.role ? ` (${r.role})` : "";
                    const deptText = r.department?.name
                      ? ` · ${r.department.name}`
                      : "";
                    return (
                      <option key={r.id} value={r.id}>
                        {r.name}
                        {roleText}
                        {deptText} ({r.employeeId})
                      </option>
                    );
                  })}
                </select>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
