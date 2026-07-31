import { CalendarDays, CircleCheckBig } from "lucide-react";

interface Props {
  title: string;
  value: string;
  unit: string;
  icon: string;
  iconBg: string;
}

export default function StatsCard({ title, value, unit, icon, iconBg }: Props) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}
        >
          {icon === "calendar" ? (
            <CalendarDays className="h-5 w-5 text-sky-600" />
          ) : (
            <CircleCheckBig className="h-5 w-5 text-purple-600" />
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">{value}</h2>

          <p className="mt-1 text-sm text-gray-400">{unit}</p>
        </div>
      </div>
    </div>
  );
}
