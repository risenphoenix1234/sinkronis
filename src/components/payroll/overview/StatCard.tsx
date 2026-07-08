import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: string;
  change: string;
  percentage: string;
  positive?: boolean;
}

export default function StatCard({
  title,
  amount,
  change,
  percentage,
  positive = true,
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-[#EAECF0]">
      {/* Card Title */}
      <p className="text-sm font-medium text-[#667085]">{title}</p>

      {/* Main Value */}
      <h2 className="mt-3 text-3xl font-bold text-[#101828]">{amount}</h2>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-[#667085]">{change}</p>

        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            positive
              ? "bg-[#ECFDF3] text-[#12B76A]"
              : "bg-[#FEF3F2] text-[#F04438]"
          }`}
        >
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}

          {percentage}
        </div>
      </div>
    </div>
  );
}
