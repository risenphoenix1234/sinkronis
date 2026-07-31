// src/components/modals/ViewReminderModal.tsx

"use client";

import { IoClose } from "react-icons/io5";
import { Reminder, statusStyles } from "@/types/reminder";

type ViewReminderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reminder: Reminder | null;
  onMarkRead?: (id: string) => void;
};

export default function ViewReminderModal({
  isOpen,
  onClose,
  reminder,
  onMarkRead,
}: ViewReminderModalProps) {
  if (!isOpen || !reminder) return null;

  const handleMarkRead = () => {
    onMarkRead?.(reminder.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Reminder Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Invoice</span>
            <span className="text-sm font-medium text-sky-600">
              {reminder.invoice}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Client</span>
            <span className="text-sm font-medium text-slate-800">
              {reminder.client}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Amount</span>
            <span className="text-sm font-medium tabular-nums text-slate-800">
              {reminder.amount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Status</span>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[reminder.status]}`}
            >
              {reminder.statusLabel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Channel</span>
            <span className="text-sm text-slate-600">{reminder.channel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Sent</span>
            <span className="text-sm text-slate-600">{reminder.sent}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          {!reminder.read && (
            <button
              onClick={handleMarkRead}
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}