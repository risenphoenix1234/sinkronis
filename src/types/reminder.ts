// src/types/reminder.ts

export type ReminderStatus = "overdue" | "due" | "upcoming";

export type Reminder = {
  id: string;
  invoice: string;
  client: string;
  amount: string;
  status: ReminderStatus;
  statusLabel: string;
  channel: string;
  sent: string;
  read: boolean;
};

export const statusStyles: Record<ReminderStatus, string> = {
  overdue: "bg-rose-50 text-rose-600",
  due: "bg-amber-50 text-amber-700",
  upcoming: "bg-sky-50 text-sky-700",
};