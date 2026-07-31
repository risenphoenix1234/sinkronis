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

export interface ActionItem {
  id: number;
  title: string;
  description: string;
  status: ActionStatus;
}