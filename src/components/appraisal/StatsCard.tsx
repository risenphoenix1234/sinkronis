// components/appraisal/StatsCard.tsx

import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}: Props) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="flex justify-between">
        <span className="text-sm text-slate-500">{title}</span>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-md ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>

      <h2 className="mt-4 text-4xl font-bold text-slate-800">{value}</h2>
    </div>
  );
}
