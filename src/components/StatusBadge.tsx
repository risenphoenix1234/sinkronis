interface Props {
  status: string;
}

const statusStyles: Record<string, string> = {
  // Review statuses
  Acknowledged: "bg-green-100 text-green-700",
  "Pending HR Approval": "bg-yellow-100 text-yellow-700",
  "Under Manager Review": "bg-purple-100 text-purple-700",
  "Self-Assessment Submitted": "bg-blue-100 text-blue-700",
  "Goals Proposed": "bg-orange-100 text-orange-700",
  "Not Started": "bg-gray-100 text-gray-500",

  // Cycle statuses
  Active: "bg-green-100 text-green-700",
  Completed: "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${
        statusStyles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}