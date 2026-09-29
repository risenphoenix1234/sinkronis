"use client";

import { useEffect, useState } from "react";
import { IoCheckmarkDone, IoSettingsOutline } from "react-icons/io5";
import ConfigureRemindersModal from "@/components/modals/ConfigureRemindersModal";
import ViewReminderModal from "@/components/modals/ViewReminderModal";
import { Reminder, mapReminderItem, statusStyles, RemindersSummary, ReminderFilter } from "@/types/reminder";
import { getReminders, markReminderRead, markAllRemindersRead } from "@/lib/api/accounting";

type Filter = "All" | "Unread" | "Upcoming" | "Overdue";

const filterToApi: Record<Filter, ReminderFilter> = {
  All: "ALL",
  Unread: "UNREAD",
  Upcoming: "UPCOMING",
  Overdue: "OVERDUE",
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
    <section className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reminders</h1>
          <p className="mt-1 text-sm text-slate-500">Upcoming and overdue invoice payment alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <IoCheckmarkDone size={16} />
            Mark all read
          </button>
          <button onClick={() => setIsConfigureOpen(true)} className="flex items-center gap-1.5 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
            <IoSettingsOutline size={16} />
            Configure Reminders
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700">
          Unread <span className="font-semibold">{summary.unread}</span>
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-1.5 text-sm font-medium text-rose-600">
          Overdue <span className="font-semibold">{summary.overdue}</span>
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
          Upcoming <span className="font-semibold">{summary.upcoming}</span>
        </span>
      </div>

    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
  {filters.map((f) => {
    const isActive = filter === f.label;

    return (
      <button
        key={f.label}
        onClick={() => setFilter(f.label)}
        className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
          isActive
            ? "bg-sky-50 text-sky-700"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        }`}
      >
        {f.label}

        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
            isActive
              ? "bg-sky-100 text-sky-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {f.count}
        </span>
      </button>
    );
  })}
</div>

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
            {loading && <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400">Loading reminders...</td></tr>}
            {!loading && error && <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-red-500">{error}</td></tr>}
            {!loading && !error && reminders.map((rem) => (
              <tr key={rem.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    {!rem.read && <span className="h-2 w-2 rounded-full bg-sky-500" />}
                    {rem.invoice}
                  </span>
                </td>
                <td className="px-6 py-3 text-base text-slate-800 whitespace-nowrap">{rem.client}</td>
                <td className="px-6 py-3 text-base tabular-nums font-medium text-slate-800 whitespace-nowrap">{rem.amount}</td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[rem.status]}`}>
                    {rem.statusLabel}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">{rem.channel}</td>
                <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">{rem.sent}</td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  {!rem.read && (
                    <button onClick={() => handleMarkRead(rem.id)} className="mr-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                      Mark read
                    </button>
                  )}
                  <button onClick={() => handleViewReminder(rem)} className="rounded-md bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-100">
                    View →
                  </button>
                </td>
              </tr>
            ))}
            {!loading && !error && reminders.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400">No reminders to show.</td></tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
          <p className="text-sm text-slate-500">
            Showing {reminders.length === 0 ? 0 : 1}–{reminders.length} of {reminders.length}
          </p>
          <div className="flex items-center gap-1">
            <button className="rounded px-2 py-1 text-sm text-slate-400 hover:bg-slate-100">‹</button>
            <button className="rounded bg-sky-600 px-3 py-1 text-sm font-medium text-white">1</button>
            <button className="rounded px-2 py-1 text-sm text-slate-400 hover:bg-slate-100">›</button>
          </div>
        </div>
      </div>

      <ConfigureRemindersModal isOpen={isConfigureOpen} onClose={() => setIsConfigureOpen(false)} />
      <ViewReminderModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} reminder={selectedReminder} onMarkRead={handleMarkRead} />
    </section>
  );
}