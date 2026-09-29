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
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-normal text-gray-500">{title}</span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>

      <h2 className="mt-3 text-3xl font-bold text-gray-900">{value}</h2>
    </div>
  );
}
