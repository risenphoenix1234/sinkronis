import type { InboxItem as ApiInboxItem } from "@/lib/api/types/employeeTypes";

export type InboxStatus = "Pending" | "Done" | "PENDING" | "DONE" | string;

export interface LegacyInboxItem {
  id: number | string;
  type: string;
  title: string;
  description: string;
  date?: string;
  status: InboxStatus;
}

export type InboxItem = ApiInboxItem | LegacyInboxItem;

export type {
  EmployeeInboxData,
  EmployeeInboxResponse,
  GetEmployeeInboxParams,
  InboxCategory,
  InboxCounts,
  InboxItemNavigation,
  InboxItemSource,
  InboxPagination,
} from "@/lib/api/types/employeeTypes";
