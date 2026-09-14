import { DashboardStat } from "@/types/employee/dashboard";

export const stats: DashboardStat[] = [
  {
    id: 1,
    title: "Annual Leave Remaining",
    value: "18",
    unit: "days",
    icon: "calendar",
    iconBg: "bg-blue-100",
  },
  {
    id: 2,
    title: "Attendance This Month",
    value: "18/22",
    unit: "days",
    icon: "check",
    iconBg: "bg-purple-100",
  },
];