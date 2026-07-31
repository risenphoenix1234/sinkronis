// lib/audit-log-data.ts
export type ActionType = "Login" | "Update" | "Invite" | "Create" | "Approve";
export type ModuleType = "Auth" | "Admin" | "HRIS" | "Accounting";

export type AuditLogEntry = {
  id: string;
  timestamp: string; // ISO-ish for sorting, displayed pre-formatted below
  displayTimestamp: string;
  userName: string;
  userInitials: string;
  action: ActionType;
  module: ModuleType;
  details: string;
  ipAddress: string;
};

export const actionStyles: Record<ActionType, string> = {
  Login: "bg-emerald-50 text-emerald-700",
  Update: "bg-amber-50 text-amber-700",
  Invite: "bg-violet-50 text-violet-700",
  Create: "bg-sky-50 text-sky-700",
  Approve: "bg-emerald-50 text-emerald-700",
};

export const moduleStyles: Record<ModuleType, string> = {
  Auth: "bg-slate-100 text-slate-400",
  Admin: "bg-fuchsia-50 text-fuchsia-600",
  HRIS: "bg-emerald-50 text-emerald-600",
  Accounting: "bg-sky-50 text-sky-600",
};

export const avatarColors: Record<string, string> = {
  CO: "bg-sky-100 text-sky-700",
  AN: "bg-violet-100 text-violet-700",
  TA: "bg-amber-100 text-amber-700",
  FB: "bg-rose-100 text-rose-700",
};

export const auditLogEntries: AuditLogEntry[] = [
  { id: "log-020", timestamp: "2026-06-08T09:41:02", displayTimestamp: "Jun 8, 2026 09:41:02", userName: "Chukwuemeka Obi", userInitials: "CO", action: "Login", module: "Auth", details: "Logged in successfully", ipAddress: "197.210.45.12" },
  { id: "log-019", timestamp: "2026-06-08T09:43:18", displayTimestamp: "Jun 8, 2026 09:43:18", userName: "Chukwuemeka Obi", userInitials: "CO", action: "Update", module: "Admin", details: "Updated password policy — min length changed to 8", ipAddress: "197.210.45.12" },
  { id: "log-018", timestamp: "2026-06-08T09:45:55", displayTimestamp: "Jun 8, 2026 09:45:55", userName: "Chukwuemeka Obi", userInitials: "CO", action: "Invite", module: "Admin", details: "Invited k.adewale@sinkronis.com as Manager", ipAddress: "197.210.45.12" },
  { id: "log-017", timestamp: "2026-06-08T08:15:30", displayTimestamp: "Jun 8, 2026 08:15:30", userName: "Amara Nwosu", userInitials: "AN", action: "Login", module: "Auth", details: "Logged in successfully", ipAddress: "105.112.89.34" },
  { id: "log-016", timestamp: "2026-06-08T08:18:12", displayTimestamp: "Jun 8, 2026 08:18:12", userName: "Amara Nwosu", userInitials: "AN", action: "Create", module: "HRIS", details: "Created employee record — Oluwaseun Adebayo", ipAddress: "105.112.89.34" },
  { id: "log-015", timestamp: "2026-06-08T08:22:44", displayTimestamp: "Jun 8, 2026 08:22:44", userName: "Amara Nwosu", userInitials: "AN", action: "Approve", module: "HRIS", details: "Approved leave request for Ngozi Eze (Annual Leave, 5 days)", ipAddress: "105.112.89.34" },
  { id: "log-014", timestamp: "2026-06-07T17:02:11", displayTimestamp: "Jun 7, 2026 17:02:11", userName: "Tunde Adeyemi", userInitials: "TA", action: "Update", module: "HRIS", details: "Updated attendance record — Emeka Okeke (Late → On Time)", ipAddress: "41.184.67.123" },
  { id: "log-013", timestamp: "2026-06-07T16:45:00", displayTimestamp: "Jun 7, 2026 16:45:00", userName: "Fatima Bello", userInitials: "FB", action: "Create", module: "Accounting", details: "Created invoice INV-2026-0005 for Nexus Media Ltd", ipAddress: "197.210.45.55" },
  { id: "log-012", timestamp: "2026-06-07T15:30:22", displayTimestamp: "Jun 7, 2026 15:30:22", userName: "Fatima Bello", userInitials: "FB", action: "Approve", module: "Accounting", details: "Approved payment request PR-2026-003 — ₦180,000", ipAddress: "197.210.45.55" },
  { id: "log-011", timestamp: "2026-06-07T14:11:08", displayTimestamp: "Jun 7, 2026 14:11:08", userName: "Chukwuemeka Obi", userInitials: "CO", action: "Update", module: "Admin", details: "Changed Emeka Okeke role from Employee to Manager", ipAddress: "197.210.45.12" },
  { id: "log-010", timestamp: "2026-06-06T11:20:00", displayTimestamp: "Jun 6, 2026 11:20:00", userName: "Amara Nwosu", userInitials: "AN", action: "Login", module: "Auth", details: "Logged in successfully", ipAddress: "105.112.89.34" },
  { id: "log-009", timestamp: "2026-06-06T11:25:41", displayTimestamp: "Jun 6, 2026 11:25:41", userName: "Amara Nwosu", userInitials: "AN", action: "Create", module: "HRIS", details: "Created employee record — Blessing Eze", ipAddress: "105.112.89.34" },
  { id: "log-008", timestamp: "2026-06-06T10:05:15", displayTimestamp: "Jun 6, 2026 10:05:15", userName: "Tunde Adeyemi", userInitials: "TA", action: "Login", module: "Auth", details: "Logged in successfully", ipAddress: "41.184.67.123" },
  { id: "log-007", timestamp: "2026-06-06T10:12:39", displayTimestamp: "Jun 6, 2026 10:12:39", userName: "Tunde Adeyemi", userInitials: "TA", action: "Update", module: "HRIS", details: "Updated attendance record — Sade Williams (Absent → Present)", ipAddress: "41.184.67.123" },
  { id: "log-006", timestamp: "2026-06-05T16:48:02", displayTimestamp: "Jun 5, 2026 16:48:02", userName: "Fatima Bello", userInitials: "FB", action: "Create", module: "Accounting", details: "Created expense entry — Software & Subscriptions, ₦12,000", ipAddress: "197.210.45.55" },
  { id: "log-005", timestamp: "2026-06-05T09:30:51", displayTimestamp: "Jun 5, 2026 09:30:51", userName: "Chukwuemeka Obi", userInitials: "CO", action: "Login", module: "Auth", details: "Logged in successfully", ipAddress: "197.210.45.12" },
  { id: "log-004", timestamp: "2026-06-05T09:35:10", displayTimestamp: "Jun 5, 2026 09:35:10", userName: "Chukwuemeka Obi", userInitials: "CO", action: "Invite", module: "Admin", details: "Invited f.bello@sinkronis.com as Accountant", ipAddress: "197.210.45.12" },
  { id: "log-003", timestamp: "2026-06-04T14:02:18", displayTimestamp: "Jun 4, 2026 14:02:18", userName: "Amara Nwosu", userInitials: "AN", action: "Approve", module: "HRIS", details: "Approved leave request for Tunde Adeyemi (Sick Leave, 2 days)", ipAddress: "105.112.89.34" },
  { id: "log-002", timestamp: "2026-06-04T08:50:44", displayTimestamp: "Jun 4, 2026 08:50:44", userName: "Fatima Bello", userInitials: "FB", action: "Update", module: "Accounting", details: "Edited invoice INV-2026-0003 — due date extended", ipAddress: "197.210.45.55" },
  { id: "log-001", timestamp: "2026-06-03T12:15:00", displayTimestamp: "Jun 3, 2026 12:15:00", userName: "Chukwuemeka Obi", userInitials: "CO", action: "Login", module: "Auth", details: "Logged in successfully", ipAddress: "197.210.45.12" },
];

export const uniqueUsers = Array.from(new Set(auditLogEntries.map((e) => e.userName)));
export const uniqueActions: ActionType[] = ["Login", "Create", "Update", "Approve", "Invite"];
export const uniqueModules: ModuleType[] = ["Auth", "Admin", "HRIS", "Accounting"];