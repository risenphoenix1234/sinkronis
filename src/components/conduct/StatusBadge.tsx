import { QueryStatus } from "@/types/conduct";

type Suspension = {
  id: string;
  name: string;
  role: string;
  department: string;
  type: string;
  from: string;
  to: string;
  status: "Open" | "In Progress" | "Resolved";
};


export function StatusBadge({ status }: { status: QueryStatus }) {
  if (status === "Open") {
    return <span className="text-sm font-medium text-red-500">Open</span>;
  }

  if (status === "In Progress") {
    return (
      <span className="text-sm font-medium text-amber-500">In Progress</span>
    );
  }

  return <span className="text-sm font-medium text-green-500">Resolved</span>;
}
export function StatusBadgeConduct({ status }: { status: Suspension["status"] }) {
  const styles = {
    Open: "text-red-500",
    "In Progress": "text-yellow-500",
    Resolved: "text-green-500",
  };

  return (
    <span className={`text-sm font-medium ${styles[status]}`}>{status}</span>
  );
}