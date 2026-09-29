"use client";

import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  Flag,
  CheckCircle2,
  Calendar,
  Bell,
} from "lucide-react";
import { InboxItem } from "@/lib/api/types/employeeTypes";

interface Props {
  item: InboxItem;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getTargetHref(target?: string): string {
  if (!target) return "/employee/dashboard";
  const normalized = target.toUpperCase();

  if (normalized.includes("APPRAISAL")) return "/employee/appraisal";
  if (normalized.includes("LEAVE")) return "/employee/leave";
  if (normalized.includes("ATTENDANCE")) return "/employee/attendance";
  if (normalized.includes("PAYSLIP")) return "/employee/payslip";
  if (normalized.includes("PROFILE")) return "/employee/profile";
  return "/employee/dashboard";
}

export default function InboxCard({ item }: Props) {
  const category = (item.category || item.type || "").toUpperCase();

  const renderIcon = () => {
    if (category.includes("APPRAISAL") || category.includes("GOAL")) {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Flag className="h-5 w-5" />
        </div>
      );
    }
    if (category.includes("ASSESSMENT")) {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
          <ClipboardCheck className="h-5 w-5" />
        </div>
      );
    }
    if (category.includes("LEAVE")) {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      );
    }
    if (category.includes("PAYSLIP")) {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
          <FileText className="h-5 w-5" />
        </div>
      );
    }
    if (category.includes("ATTENDANCE")) {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Calendar className="h-5 w-5" />
        </div>
      );
    }
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Bell className="h-5 w-5" />
      </div>
    );
  };

  const isPending = (item.status || "").toUpperCase() === "PENDING";
  const displayDate = item.dueDate
    ? `Due: ${formatDate(item.dueDate)}`
    : item.eventDate
      ? formatDate(item.eventDate)
      : formatDate(item.createdAt);

  const targetHref = getTargetHref(item.navigation?.target);
  const isNavAvailable = item.navigation?.available ?? true;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-5 transition hover:shadow-sm">
      <div className="flex items-start gap-4">
        {renderIcon()}

        <div>
          <h3 className="font-semibold text-gray-900">{item.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{item.description}</p>
          {displayDate && (
            <p className="mt-2 text-xs text-gray-400">{displayDate}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 shrink-0">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isPending
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isPending ? "Pending" : "Done"}
        </span>

        {isNavAvailable ? (
          <Link
            href={targetHref}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            {item.navigation?.action || "Go to"}
            <ArrowRight size={16} />
          </Link>
        ) : (
          <span className="text-xs text-gray-400">Action unavailable</span>
        )}
      </div>
    </div>
  );
}
