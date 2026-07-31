// src/app/reminders/page.tsx

"use client";

import { useState } from "react";
import { IoCheckmarkDone, IoSettingsOutline } from "react-icons/io5";
import ConfigureRemindersModal, {
  ReminderSettings,
} from "@/components/modals/ConfigureRemindersModal";
import ViewReminderModal from "@/components/modals/ViewReminderModal";
import { Reminder, statusStyles } from "@/types/reminder";

const initialReminders: Reminder[] = [
  {
    id: "REM-001",
    invoice: "INV-003",
    client: "BlueStar Logistics",
    amount: "₦129,000",
    status: "overdue",
    statusLabel: "19 days overdue",
    channel: "In-app + Email",
    sent: "19 May 2026, 09:00",
    read: false,
  },
  {
    id: "REM-002",
    invoice: "INV-002",
    client: "Prestige Global Services",
    amount: "₦15,250",
    status: "due",
    statusLabel: "Due in 1 day",
    channel: "In-app + Email",
    sent: "19 May 2026, 08:00",
    read: false,
  },
  {
    id: "REM-003",
    invoice: "INV-003",
    client: "BlueStar Logistics",
    amount: "₦129,000",
    status: "overdue",
    statusLabel: "12 days overdue",
    channel: "Email",
    sent: "12 May 2026, 09:00",
    read: true,
  },
  {
    id: "REM-004",
    invoice: "INV-002",
    client: "Prestige Global Services",
    amount: "₦15,250",
    status: "upcoming",
    statusLabel: "Due in 5 days",
    channel: "In-app",
    sent: "15 May 2026, 08:00",
    read: true,
  },
  {
    id: "REM-005",
    invoice: "INV-001",
    client: "Zenith Technologies Ltd",
    amount: "₦526,750",
    status: "upcoming",
    statusLabel: "Due in 3 days",
    channel: "In-app + Email",
    sent: "12 Apr 2026, 09:00",
    read: true,
  },
];

type Filter = "All" | "Unread" | "Upcoming" | "Overdue";

export default function RemindersPage() {
  const [reminders, setReminders] = useState(initialReminders);
  const [filter, setFilter] = useState<Filter>("All");

  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null
  );

  const unreadCount = reminders.filter((r) => !r.read).length;
  const overdueCount = reminders.filter((r) => r.status === "overdue").length;
  const upcomingCount = reminders.filter((r) => r.status === "upcoming").length;

  const filters: { label: Filter; count: number | null }[] = [
    { label: "All", count: reminders.length },
    { label: "Unread", count: unreadCount },
    { label: "Upcoming", count: upcomingCount },
    { label: "Overdue", count: overdueCount },
  ];

  const filtered = reminders.filter((r) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !r.read;
    if (filter === "Upcoming") return r.status === "upcoming";
    if (filter === "Overdue") return r.status === "overdue";
    return true;
  });

  const handleMarkRead = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, read: true } : r))
    );
  };

  const handleMarkAllRead = () => {
    setReminders((prev) => prev.map((r) => ({ ...r, read: true })));
  };

  const handleViewReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsViewOpen(true);
  };

  const handleSaveSettings = (settings: ReminderSettings) => {
    console.log("Reminder settings saved:", settings);
  };

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reminders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Upcoming and overdue invoice payment alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <IoCheckmarkDone size={16} />
            Mark all read
          </button>
          <button
            onClick={() => setIsConfigureOpen(true)}
            className="flex items-center gap-1.5 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            <IoSettingsOutline size={16} />
            Configure Reminders
          </button>
        </div>
      </div>

      {/* Filter pills (Unread / Overdue / Upcoming summary) */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700">
          Unread <span className="font-semibold">{unreadCount}</span>
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-1.5 text-sm font-medium text-rose-600">
          Overdue <span className="font-semibold">{overdueCount}</span>
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
          Upcoming <span className="font-semibold">{upcomingCount}</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.label)}
            className={`flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors ${
              filter === f.label
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 text-xs ${
                filter === f.label
                  ? "bg-sky-50 text-sky-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Invoice</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Channel</th>
              <th className="px-6 py-3 font-medium">Sent</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((rem) => (
              <tr key={rem.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    {!rem.read && (
                      <span className="h-2 w-2 rounded-full bg-sky-500" />
                    )}
                    {rem.invoice}
                  </span>
                </td>
                <td className="px-6 py-3 text-base text-slate-800 whitespace-nowrap">
                  {rem.client}
                </td>
                <td className="px-6 py-3 text-base tabular-nums font-medium text-slate-800 whitespace-nowrap">
                  {rem.amount}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[rem.status]}`}
                  >
                    {rem.statusLabel}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">
                  {rem.channel}
                </td>
                <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">
                  {rem.sent}
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  {!rem.read && (
                    <button
                      onClick={() => handleMarkRead(rem.id)}
                      className="mr-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleViewReminder(rem)}
                    className="rounded-md bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-100"
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
          <p className="text-sm text-slate-500">
            Showing 1–{filtered.length} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button className="rounded px-2 py-1 text-sm text-slate-400 hover:bg-slate-100">
              ‹
            </button>
            <button className="rounded bg-sky-600 px-3 py-1 text-sm font-medium text-white">
              1
            </button>
            <button className="rounded px-2 py-1 text-sm text-slate-400 hover:bg-slate-100">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfigureRemindersModal
        isOpen={isConfigureOpen}
        onClose={() => setIsConfigureOpen(false)}
        onSave={handleSaveSettings}
      />
      <ViewReminderModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        reminder={selectedReminder}
        onMarkRead={handleMarkRead}
      />
    </section>
  );
}