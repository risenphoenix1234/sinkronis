export type ActionStatus =
  | "Action Required"
  | "Approved"
  | "Upcoming";

export interface DashboardStat {
  id: number;
  title: string;
  value: string;
  unit: string;
  icon: string;
  iconBg: string;
}
// Re-export the API-authoritative ActionItem so legacy imports keep working
export type { ActionItem } from "@/lib/api/types/employeeTypes";
