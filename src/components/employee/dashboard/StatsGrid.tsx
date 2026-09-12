import { DashboardSummary } from "@/lib/api/types/employeeTypes";
import StatsCard from "./StatsCard";

interface Props {
  summary: DashboardSummary;
}

export default function StatsGrid({ summary }: Props) {
  const stats = [
    {
      id: "leave",
      title: summary.annualLeaveRemaining.leaveType || "Annual Leave Remaining",
      value: String(summary.annualLeaveRemaining.remainingDays),
      unit: `of ${summary.annualLeaveRemaining.totalDays} days`,
      icon: "calendar" as const,
      iconBg: "bg-sky-100",
    },
    {
      id: "attendance",
      title: "Attendance This Month",
      value: `${summary.attendanceThisMonth.attendanceRate}%`,
      unit: `${summary.attendanceThisMonth.presentDays} of ${summary.attendanceThisMonth.expectedWorkingDays} days`,
      icon: "check" as const,
      iconBg: "bg-purple-100",
    },
  ];

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
