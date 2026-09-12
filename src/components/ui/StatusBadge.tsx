// components/StatusBadge.tsx

import { AppraisalCycle } from "@/lib/api/types/hrisTypes";

interface StatusBadgeProps {
  status: string;
  variant?: "text" | "pill";
}

export const STATUS_LABELS: Record<AppraisalCycle["status"], string> = {
  DRAFT: "Draft", // no matching key in StatusBadge → falls through to its gray default, fine as-is
  ACTIVE: "Active", // matches StatusBadge's green "Active" style
  COMPLETED: "Completed", // reuses StatusBadge's existing gray "Completed" style
};

const statusStyles: Record<
  string,
  {
    text: string;
    pill: string;
  }
> = {
  // Conduct / Query statuses
  Open: {
    text: "text-red-500",
    pill: "bg-red-100 text-red-700",
  },

  "In Progress": {
    text: "text-yellow-500",
    pill: "bg-yellow-100 text-yellow-700",
  },

  Resolved: {
    text: "text-green-500",
    pill: "bg-green-100 text-green-700",
  },

  // Attendance statuses
  Pending: {
    text: "text-yellow-500",
    pill: "bg-yellow-100 text-yellow-700",
  },

  Approved: {
    text: "text-green-500",
    pill: "bg-green-100 text-green-700",
  },

  Rejected: {
    text: "text-red-500",
    pill: "bg-red-100 text-red-700",
  },

  // Review statuses
  Acknowledged: {
    text: "text-green-500",
    pill: "bg-green-100 text-green-700",
  },

  "Pending HR Approval": {
    text: "text-yellow-500",
    pill: "bg-yellow-100 text-yellow-700",
  },

  "Under Manager Review": {
    text: "text-purple-500",
    pill: "bg-purple-100 text-purple-700",
  },

  "Self-Assessment Submitted": {
    text: "text-blue-500",
    pill: "bg-blue-100 text-blue-700",
  },

  "Goals Proposed": {
    text: "text-orange-500",
    pill: "bg-orange-100 text-orange-700",
  },

  "Goal Setting": {
    text: "text-amber-600",
    pill: "bg-amber-50 text-amber-700 border border-amber-200/60",
  },

  "Self Assessment": {
    text: "text-sky-600",
    pill: "bg-sky-50 text-sky-700 border border-sky-200/60",
  },

  "Manager Review": {
    text: "text-indigo-600",
    pill: "bg-indigo-50 text-indigo-700 border border-indigo-200/60",
  },

  "HR Approval": {
    text: "text-purple-600",
    pill: "bg-purple-50 text-purple-700 border border-purple-200/60",
  },

  Acknowledgment: {
    text: "text-emerald-600",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  },
};

export default function StatusBadge({
  status,
  variant = "pill",
}: StatusBadgeProps) {
  const style = statusStyles[status];

  if (!style) {
    return (
      <span
        className={
          variant === "text"
            ? "text-sm font-medium text-gray-500"
            : "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600"
        }
      >
        {status}
      </span>
    );
  }

  if (variant === "text") {
    return (
      <span className={`text-sm font-medium ${style.text}`}>{status}</span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${style.pill}`}
    >
      {status}
    </span>
  );
}
