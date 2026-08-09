// src/lib/platform-support-data.ts
// Support ticket data — kept separate from other platform-admin data files.

export type TicketPriority = "Low" | "Medium" | "High" | "Critical";
export type TicketStatus = "Open" | "In Progress" | "Resolved";

export interface SupportTicket {
  id: string;
  tenant: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  updated: string;
  opened: string;
  description: string;
  resolutionNotes: string;
}

export const priorityStyles: Record<TicketPriority, string> = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-orange-50 text-orange-700",
  Critical: "bg-red-50 text-red-700",
};

export const statusStyles: Record<TicketStatus, string> = {
  Open: "bg-amber-50 text-amber-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Resolved: "bg-emerald-50 text-emerald-700",
};

export const initialTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    tenant: "Bravo Group",
    subject: "Payroll run fails on PAYE calculation",
    priority: "High",
    status: "In Progress",
    assignedTo: "Tunde Dada",
    updated: "6 Jul 2026",
    opened: "5 Jul 2026",
    description: "PAYE deductions are not computing correctly for employees on the ₦500k+ band.",
    resolutionNotes: "",
  },
  {
    id: "TKT-002",
    tenant: "Zenith Ventures",
    subject: "Cannot upload employee documents",
    priority: "Medium",
    status: "Open",
    assignedTo: "Unassigned",
    updated: "6 Jul 2026",
    opened: "6 Jul 2026",
    description: "Document uploads fail silently on the employee profile page.",
    resolutionNotes: "",
  },
  {
    id: "TKT-003",
    tenant: "Kainos Technologies",
    subject: "Invoice PDF download blank",
    priority: "High",
    status: "Open",
    assignedTo: "Aisha Suleiman",
    updated: "7 Jul 2026",
    opened: "6 Jul 2026",
    description: "Downloaded invoice PDFs render as blank pages for the Jul 2026 billing period.",
    resolutionNotes: "",
  },
  {
    id: "TKT-004",
    tenant: "Nova Healthcare",
    subject: "Bulk import of employees failing",
    priority: "Critical",
    status: "In Progress",
    assignedTo: "Tunde Dada",
    updated: "7 Jul 2026",
    opened: "6 Jul 2026",
    description: "CSV import for new employees errors out after row 40, no clear validation message.",
    resolutionNotes: "",
  },
  {
    id: "TKT-005",
    tenant: "Pinnacle Foods",
    subject: "Leave approval emails not sending",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Aisha Suleiman",
    updated: "3 Jul 2026",
    opened: "1 Jul 2026",
    description: "Managers were not receiving email notifications for pending leave approvals.",
    resolutionNotes: "Fixed a misconfigured email template trigger. Confirmed with tenant on 3 Jul.",
  },
];