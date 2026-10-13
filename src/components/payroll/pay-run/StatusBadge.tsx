// src/components/payroll/pay-run/StatusBadge.tsx
import type { PayrollPayRunStatus } from "@/lib/api/types/payroll.types";

const styles: Record<PayrollPayRunStatus, { label: string; chip: string; dot: string }> = {
  DRAFT: { label: "Draft", chip: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
  PROCESSING: { label: "Processing", chip: "bg-blue-50 text-[#2183C6]", dot: "bg-[#2183C6]" },
  PENDING_APPROVAL: { label: "Pending", chip: "bg-orange-50 text-orange-500", dot: "bg-orange-500" },
  APPROVED: { label: "Approved", chip: "bg-green-50 text-green-600", dot: "bg-green-500" },
  REJECTED_FOR_REWORK: { label: "Declined", chip: "bg-red-50 text-red-500", dot: "bg-red-500" },
  PENDING_DISBURSEMENT: { label: "Pending Disbursement", chip: "bg-orange-50 text-orange-500", dot: "bg-orange-500" },
  DISBURSING: { label: "Disbursing", chip: "bg-blue-50 text-[#2183C6]", dot: "bg-[#2183C6]" },
  DISBURSED: { label: "Paid", chip: "bg-green-50 text-green-600", dot: "bg-green-500" },
  FAILED: { label: "Failed", chip: "bg-red-50 text-red-500", dot: "bg-red-500" },
  PAID: { label: "Paid", chip: "bg-green-50 text-green-600", dot: "bg-green-500" },
  CANCELLED: { label: "Cancelled", chip: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

export const statusLabel = (status: PayrollPayRunStatus) => styles[status]?.label ?? status;

export default function StatusBadge({ status }: { status: PayrollPayRunStatus }) {
  const st = styles[status] ?? { label: status, chip: "bg-slate-100 text-slate-500", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${st.chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} /> {st.label}
    </span>
  );
}