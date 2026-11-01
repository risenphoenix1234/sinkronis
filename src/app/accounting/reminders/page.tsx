// src/app/accounting/reminders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { IoCheckmarkDone, IoSettingsOutline } from "react-icons/io5";
import ConfigureRemindersModal from "@/components/modals/ConfigureRemindersModal";
import ViewReminderModal from "@/components/modals/ViewReminderModal";
import { Reminder, mapReminderItem, RemindersSummary, ReminderFilter } from "@/types/reminder";
import { getReminders, markReminderRead, markAllRemindersRead } from "@/lib/api/accounting";
import Loader from "@/components/ui/Loader";

type Filter = "All" | "Unread" | "Upcoming" | "Overdue";

const filterToApi: Record<Filter, ReminderFilter> = {
  All: "ALL",
  Unread: "UNREAD",
  Upcoming: "UPCOMING",
  Overdue: "OVERDUE",
};

const pillStyles: Record<string, string> = {
  overdue: "bg-[#FFE5E5] text-[#FF3B30]",
  due: "bg-[#FFF3CD] text-[#856404]",
  upcoming: "bg-[#E3F2FD] text-[#2183C6]",
};

const emptySummary: RemindersSummary = { unread: 0, overdue: 0, upcoming: 0 };

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [summary, setSummary] = useState<RemindersSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  // NOTE: this call is not read-only — it can generate real reminders and
  // send real emails server-side. Only call it on mount and on deliberate
  // filter changes, never on an interval/poll.
  const fetchReminders = async (f: Filter) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReminders({ filter: filterToApi[f] });
      setReminders(res.data.reminders.map(mapReminderItem));
      setSummary(res.data.summary);
    } catch (err) {
      setError("Failed to load reminders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filters: { label: Filter; count: number }[] = [
    { label: "All", count: reminders.length },
    { label: "Unread", count: summary.unread },
    { label: "Upcoming", count: summary.upcoming },
    { label: "Overdue", count: summary.overdue },
  ];

  const handleMarkRead = async (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, read: true } : r)));
    try {
      await markReminderRead(id);
    } catch {
      fetchReminders(filter);
    }
  };

  const handleMarkAllRead = async () => {
    setReminders((prev) => prev.map((r) => ({ ...r, read: true })));
    try {
      await markAllRemindersRead();
    } catch {
      fetchReminders(filter);
    }
  };

  const handleViewReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsViewOpen(true);
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] space-y-6 bg-[#F4F6F8] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#212B36]">Reminders</h1>
          <p className="mt-2 text-sm text-[#637381]">Upcoming and overdue invoice payment alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 rounded-md border border-[#E5E8EB] bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-[#212B36] hover:bg-white"
          >
            <IoCheckmarkDone size={16} />
            Mark all read
          </button>
          <button
            onClick={() => setIsConfigureOpen(true)}
            className="flex items-center gap-2 rounded-md bg-[#2183C6] px-4 py-3 text-sm font-medium text-white hover:bg-[#1976B8]"
          >
            <IoSettingsOutline size={16} />
            Configure Reminders
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 rounded bg-[#E3F2FD] px-4 py-3 text-sm text-[#2183C6]">
          Unread <span className="text-base font-bold">{summary.unread}</span>
        </span>
        <span className="flex items-center gap-2 rounded bg-[#FFE5E5] px-4 py-3 text-sm text-[#FF3B30]">
          Overdue <span className="text-base font-bold">{summary.overdue}</span>
        </span>
        <span className="flex items-center gap-2 rounded bg-[#FFF3CD] px-4 py-3 text-sm text-[#856404]">
          Upcoming <span className="text-base font-bold">{summary.upcoming}</span>
        </span>
      </div>

      <div className="flex items-center gap-8 overflow-x-auto border-b border-[#E5E8EB]">
        {filters.map((f) => {
          const isActive = filter === f.label;
          return (
            <button
              key={f.label}
              onClick={() => setFilter(f.label)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-2 py-4 text-sm transition-colors ${
                isActive
                  ? "border-[#2183C6] font-medium text-[#2183C6]"
                  : "border-transparent text-[#637381] hover:text-[#212B36]"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 text-[11px] ${
                  isActive ? "bg-[#E3F2FD] text-[#2183C6]" : "text-[#919EAB]"
                }`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-md border border-[#F2F3F5] bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-dotted border-[#EBEEF0] text-[#637381]">
              <th className="py-3.5 pl-10 pr-3 font-normal">Invoice</th>
              <th className="px-3 py-3.5 font-normal">Client</th>
              <th className="px-3 py-3.5 font-normal">Amount</th>
              <th className="px-3 py-3.5 font-normal">Status</th>
              <th className="px-3 py-3.5 font-normal">Channel</th>
              <th className="px-3 py-3.5 font-normal">Sent</th>
              <th className="px-3 py-3.5 pr-4 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#919EAB]">
                  <Loader variant="inline" label="Loading reminders" />
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#FF3B30]">
                  {error}
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              reminders.map((rem) => (
                <tr key={rem.id} className={`even:bg-[#F2F2F7] ${rem.read ? "text-[#919EAB]" : "text-[#212B36]"}`}>
                  <td className="relative whitespace-nowrap py-3.5 pl-10 pr-3 font-medium text-[#2183C6]">
                    {!rem.read && <span className="absolute left-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#2183C6]" />}
                    {rem.invoice}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5">{rem.client}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 font-medium tabular-nums text-[#212B36]">{rem.amount}</td>
                  <td className="whitespace-nowrap px-3 py-3.5">
                    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${pillStyles[rem.status]}`}>
                      {rem.statusLabel}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{rem.channel}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-[#919EAB]">{rem.sent}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 pr-4 text-right">
                    {!rem.read && (
                      <button
                        onClick={() => handleMarkRead(rem.id)}
                        className="mr-2 rounded bg-[#F4F6F8] px-3 py-1.5 text-xs font-medium text-[#212B36] hover:bg-[#E5E8EB]"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => handleViewReminder(rem)}
                      className="rounded bg-[#E3F2FD] px-3 py-1.5 text-xs font-medium text-[#2183C6] hover:bg-[#D2E9FB]"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && !error && reminders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#919EAB]">
                  No reminders to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfigureRemindersModal isOpen={isConfigureOpen} onClose={() => setIsConfigureOpen(false)} />
      <ViewReminderModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} reminder={selectedReminder} onMarkRead={handleMarkRead} />
    </section>
  );
}