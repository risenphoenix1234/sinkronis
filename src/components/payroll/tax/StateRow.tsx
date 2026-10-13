// src/components/payroll/tax/StateRow.tsx
import Link from "next/link";

export default function StateRow({
  name,
  initials,
  color,
  href,
  striped,
}: {
  name: string;
  initials: string;
  color: string;
  href: string;
  striped: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-4 py-5 ${striped ? "bg-slate-50" : ""}`}>
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ background: color }}
        >
          {initials}
        </span>
        <span className="text-sm font-medium text-slate-800">{name}</span>
      </div>
      <Link href={href} className="rounded bg-[#2183C6] px-5 py-1.5 text-xs font-medium text-white hover:opacity-90">
        View
      </Link>
    </div>
  );
}