// src/components/payroll/payslips/PayslipStatusBadge.tsx
const styles: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  READY: "bg-blue-100 text-blue-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
};

export default function PayslipStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-slate-400">-</span>;
  const label = status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>
      {label}
    </span>
  );
}