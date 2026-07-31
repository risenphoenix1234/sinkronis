// src/app/tenant-admin/notifications-alerts/announcements/page.tsx
"use client";

import { useMemo, useState } from "react";

type AnnouncementType = "Feature" | "Maintenance" | "Security" | "Update";

type Announcement = {
  id: string;
  type: AnnouncementType;
  date: string;
  title: string;
  body: string;
  learnMoreUrl: string;
  unread: boolean;
};

const typeBadgeColor: Record<AnnouncementType, string> = {
  Feature: "bg-sky-50 text-sky-700",
  Maintenance: "bg-amber-50 text-amber-700",
  Security: "bg-rose-50 text-rose-600",
  Update: "bg-emerald-50 text-emerald-700",
};

const initialAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    type: "Feature",
    date: "Jun 5, 2026",
    title: "Payroll Module — Coming Q3 2026",
    body: "We're excited to announce that the Payroll module is on track for Q3 2026. Expect automated PAYE, pension deductions, and payslip generation.",
    learnMoreUrl: "#",
    unread: true,
  },
  {
    id: "ann-2",
    type: "Maintenance",
    date: "Jun 3, 2026",
    title: "Scheduled Maintenance — Jun 12, 2026",
    body: "Sinkronis will undergo maintenance on June 12 from 2:00 AM – 4:00 AM WAT. The platform may be unavailable during this window.",
    learnMoreUrl: "#",
    unread: true,
  },
  {
    id: "ann-3",
    type: "Security",
    date: "May 28, 2026",
    title: "Security Patch — Session Handling",
    body: "A security patch improving session token handling has been deployed. No action required from administrators.",
    learnMoreUrl: "#",
    unread: false,
  },
  {
    id: "ann-4",
    type: "Update",
    date: "May 15, 2026",
    title: "Accounting v2.3 — New Reports Dashboard",
    body: "The Accounting module now includes an improved Reports dashboard with P&L trends and agent commission breakdowns.",
    learnMoreUrl: "#",
    unread: false,
  },
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    initialAnnouncements
  );

  const unreadCount = useMemo(
    () => announcements.filter((a) => a.unread).length,
    [announcements]
  );

  const markAsRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unread: false } : a))
    );
  };

  const markAllRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, unread: false })));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {unreadCount} unread announcement{unreadCount === 1 ? "" : "s"}.
        </p>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {announcements.map((a) => (
          <div
            key={a.id}
            className={`relative rounded-md border p-4 ${
              a.unread ? "border-sky-200 bg-sky-50/30" : "border-slate-100"
            }`}
          >
            {a.unread && (
              <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-sky-500" />
            )}

            <div className="flex items-center gap-2.5">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadgeColor[a.type]}`}
              >
                {a.type}
              </span>
              <span className="text-xs text-slate-400">{a.date}</span>
            </div>

            <p className="mt-2 font-medium text-slate-800">{a.title}</p>
            <p className="mt-1 text-sm text-slate-500">{a.body}</p>

            <div className="mt-3 flex items-center gap-4 text-sm">
              {a.unread && (
                <button
                  onClick={() => markAsRead(a.id)}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
                >
                  ✓ Mark as read
                </button>
              )}
              <a
                href={a.learnMoreUrl}
                className="flex items-center gap-1 text-sky-600 hover:underline"
              >
                Learn more ↗
              </a>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            No announcements.
          </p>
        )}
      </div>
    </div>
  );
}