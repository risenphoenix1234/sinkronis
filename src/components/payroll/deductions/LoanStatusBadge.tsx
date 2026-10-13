// src/components/payroll/deductions/LoanStatusBadge.tsx
const styles: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CLOSED_EARLY: "bg-slate-200 text-slate-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function LoanStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-slate-400">-</span>;
  const label = status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>
      {label}
    </span>
  );
}