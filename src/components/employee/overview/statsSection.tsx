import { stats } from "@/data/employee/overview";

export function StatsSection() {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded border border-[#E5E7EB] bg-white">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className={`p-8 ${
            index !== stats.length - 1 ? "border-r border-[#E5E7EB]" : ""
          }`}
        >
          <p className="text-sm text-[#9CA3AF]">{stat.title}</p>

          <h3 className="mt-3 text-4xl font-semibold text-[#1F2937]">
            {stat.value}
          </h3>

          <div className="mt-2 flex gap-2 text-sm">
            <span className="text-[#6B7280]">{stat.subtitle}</span>

            <span className={stat.positive ? "text-green-500" : "text-red-500"}>
              {stat.positive ? "↗" : "↙"} {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
