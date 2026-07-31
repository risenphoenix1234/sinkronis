import { stats } from "@/data/employee/dashboard";
import StatsCard from "./statsCard";

export default function StatsGrid() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      {stats.map((stat) => (
        <StatsCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          unit={stat.unit}
          icon={stat.icon}
          iconBg={stat.iconBg}
        />
      ))}
    </section>
  );
}
