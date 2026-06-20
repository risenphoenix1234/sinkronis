import { AttendanceDispute } from "@/types/attendance";

export function StatusBadge({
  status,
}: {
  status: AttendanceDispute["status"];
}) {
  const styles = {
    Pending:
      "bg-yellow-100 text-yellow-700",
    Approved:
      "bg-green-100 text-green-700",
    Rejected:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}