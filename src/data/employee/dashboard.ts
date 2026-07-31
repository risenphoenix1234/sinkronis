import { DashboardStat, ActionItem } from "@/types/employee/dashboard";

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

export const actionItems: ActionItem[] = [
  {
    id: 1,
    title: "Confirm your Q2 2026 goals",
    description: "Due: 15 July 2026",
    status: "Action Required",
  },
  {
    id: 2,
    title: "Leave application approved",
    description:
      "Approved by Chukwuemeka Obi • Annual Leave 20–25 Jul",
    status: "Approved",
  },
  {
    id: 3,
    title: "Self-assessment period opens 20 July",
    description:
      "Q2 2026 Review • Deadline: 31 July 2026",
    status: "Upcoming",
  },
];