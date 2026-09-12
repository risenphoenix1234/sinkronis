// components/AttendanceMetricCard.tsx
import type { AttendanceMetric } from "@/lib/api/types/hrisTypes";

interface Props {
  label: string;
  metric: AttendanceMetric;
}

export default function AttendanceMetricCard({ label, metric }: Props) {
  const isUp = metric.trend === "UP";

  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <h2 className="text-3xl font-semibold mt-1">{metric.count}</h2>
      <p className={`text-xs mt-1 ${isUp ? "text-green-600" : "text-red-600"}`}>
        {isUp ? "+" : "-"}
        {Math.abs(metric.difference)} vs Yesterday
      </p>
    </div>
  );
}