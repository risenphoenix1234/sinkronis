// components/StatusBadge.tsx

interface StatusBadgeProps {
  status: string;
  variant?: "text" | "pill";
}

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

  "Not Started": {
    text: "text-gray-500",
    pill: "bg-gray-100 text-gray-600",
  },

  // Cycle statuses
  Active: {
    text: "text-green-500",
    pill: "bg-green-100 text-green-700",
  },

  Completed: {
    text: "text-gray-500",
    pill: "bg-gray-100 text-gray-600",
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
