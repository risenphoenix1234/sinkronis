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

// ---- Real API shapes (confirmed by backend dev, 2026-09-25) ----
//
// IMPORTANT: GET /accounting/reminders is NOT read-only. Calling it finds
// eligible invoices, creates deduplicated reminder records, and sends/queues
// real email notifications. Do not poll this endpoint or call it more than
// once per page load — every call can trigger real emails going out.

export type ReminderFilter = "ALL" | "UNREAD" | "UPCOMING" | "OVERDUE";

export interface ReminderMetadata {
  invoiceId: string;
  invoiceReference: string;
  customer: string;
  amount: number;
  dueDate: string;
  reminderType: "UPCOMING" | "OVERDUE";
  intervalDays: number;
}

export interface ReminderApiItem {
  id: string;
  organizationId: string;
  recipientUserId: string;
  categoryId: string;
  eventKey: string;
  type: "INVOICE_UPCOMING" | "INVOICE_OVERDUE";
  title: string;
  message: string;
  metadata: ReminderMetadata;
  inAppStatus: string;
  emailStatus: string;
  emailError: string | null;
  readAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  reminderType: "UPCOMING" | "OVERDUE";
  unread: boolean;
  channel: "IN_APP" | "EMAIL" | "IN_APP_EMAIL";
}

export interface RemindersSummary {
  unread: number;
  overdue: number;
  upcoming: number;
}

export interface RemindersListResponse {
  success: boolean;
  message: string;
  data: {
    summary: RemindersSummary;
    reminders: ReminderApiItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

// ---- Configuration (confirmed live) ----

export type OverdueReminderFrequency =
  | "EVERY_1_DAY"
  | "EVERY_3_DAYS"
  | "EVERY_7_DAYS"
  | "EVERY_14_DAYS"
  | "EVERY_30_DAYS";

export interface ReminderConfiguration {
  upcomingDays: number[];
  overdueIntervals: number[];
  inAppEnabled: boolean;
  emailEnabled: boolean;
  automaticRemindersEnabled: boolean;
  firstReminderDaysBeforeDue: number;
  overdueReminderFrequency: OverdueReminderFrequency;
}

export interface ReminderConfigurationResponse {
  success: boolean;
  message: string;
  data: ReminderConfiguration;
}

export type UpdateReminderConfigurationPayload = ReminderConfiguration;

// ---- Mapper: API item -> display shape used by the page/modals ----

function channelLabel(channel: ReminderApiItem["channel"]): string {
  if (channel === "IN_APP_EMAIL") return "In-app + Email";
  if (channel === "EMAIL") return "Email";
  return "In-app";
}

function statusFromApi(item: ReminderApiItem): ReminderStatus {
  if (item.reminderType === "OVERDUE") return "overdue";
  if (item.metadata.intervalDays === 0) return "due";
  return "upcoming";
}

function statusLabelFromApi(item: ReminderApiItem): string {
  const days = item.metadata.intervalDays;
  if (item.reminderType === "OVERDUE") {
    return `${days} day${days === 1 ? "" : "s"} overdue`;
  }
  if (days === 0) return "Due today";
  return `Due in ${days} day${days === 1 ? "" : "s"}`;
}

function formatSent(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapReminderItem(item: ReminderApiItem): Reminder {
  return {
    id: item.id,
    invoice: item.metadata.invoiceReference,
    client: item.metadata.customer,
    amount: `₦${Number(item.metadata.amount).toLocaleString()}`,
    status: statusFromApi(item),
    statusLabel: statusLabelFromApi(item),
    channel: channelLabel(item.channel),
    sent: formatSent(item.deliveredAt ?? item.createdAt),
    read: !item.unread,
  };
}