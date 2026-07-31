// src/components/modals/ConfigureRemindersModal.tsx

"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";

type ConfigureRemindersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: ReminderSettings) => void;
};

export type ReminderSettings = {
  daysBeforeDue: number;
  daysAfterOverdue: number;
  channels: {
    inApp: boolean;
    email: boolean;
  };
};

const defaultSettings: ReminderSettings = {
  daysBeforeDue: 3,
  daysAfterOverdue: 1,
  channels: {
    inApp: true,
    email: true,
  },
};

export default function ConfigureRemindersModal({
  isOpen,
  onClose,
  onSave,
}: ConfigureRemindersModalProps) {
  const [settings, setSettings] = useState<ReminderSettings>(defaultSettings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave?.(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Configure Reminders
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Send reminder (days before due)
            </label>
            <input
              type="number"
              min={0}
              value={settings.daysBeforeDue}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  daysBeforeDue: Number(e.target.value),
                }))
              }
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Repeat reminder every (days overdue)
            </label>
            <input
              type="number"
              min={0}
              value={settings.daysAfterOverdue}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  daysAfterOverdue: Number(e.target.value),
                }))
              }
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Notification channels
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={settings.channels.inApp}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      channels: { ...prev.channels, inApp: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                />
                In-app
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={settings.channels.email}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      channels: { ...prev.channels, email: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                />
                Email
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}