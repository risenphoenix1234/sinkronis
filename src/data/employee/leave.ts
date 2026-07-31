import { LeaveBalance, LeaveRecord } from "@/types/employee/leave";

export const balances: LeaveBalance[] = [
  { type: "Annual",            used: 18, total: 24, color: "text-blue-500",   dotColor: "bg-blue-500",   barColor: "bg-blue-500"   },
  { type: "Sick",              used: 7,  total: 10, color: "text-green-500",  dotColor: "bg-green-500",  barColor: "bg-green-500"  },
  { type: "Casual",            used: 4,  total: 5,  color: "text-purple-500", dotColor: "bg-purple-400", barColor: "bg-purple-400" },
  { type: "Maternity/Paternity", used: 90, total: 90, color: "text-yellow-500", dotColor: "bg-yellow-400", barColor: "bg-yellow-400" },
];

export const leaveHistory: LeaveRecord[] = [
  { type: "Annual", start: "14 Apr 2026", end: "18 Apr 2026", days: 5, status: "Approved", comment: "Approved. Enjoy the break." },
  { type: "Sick",   start: "22 May 2026", end: "23 May 2026", days: 2, status: "Approved", comment: "Get well soon."            },
  { type: "Casual", start: "10 Jun 2026", end: "10 Jun 2026", days: 1, status: "Approved", comment: "—"                         },
  { type: "Annual", start: "20 Jul 2026", end: "25 Jul 2026", days: 5, status: "Pending",  comment: "—"                         },
  { type: "Annual", start: "01 Sep 2026", end: "05 Sep 2026", days: 5, status: "Pending",  comment: "—"                         },
];

// Days in July 2026 that have approved/pending leave (for calendar highlight)
export const approvedDays = new Set([20, 21, 22]); // within Jul that are approved
export const pendingDays  = new Set([20, 21, 22, 23, 24, 25]); // Jul 20-25 pending