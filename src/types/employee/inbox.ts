export type InboxStatus = "Pending" | "Done";

export interface InboxItem {
  id: number;
  type: "goal" | "assessment" | "leave" | "payslip" | "dispute";
  title: string;
  description: string;
  date: string;
  status: InboxStatus;
}