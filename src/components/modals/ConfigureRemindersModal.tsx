"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { getReminderConfiguration, updateReminderConfiguration } from "@/lib/api/accounting";
import { ReminderConfiguration, OverdueReminderFrequency } from "@/types/reminder";
import Loader from "@/components/ui/Loader";

type ConfigureRemindersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

const FREQUENCY_OPTIONS: { value: OverdueReminderFrequency; label: string }[] = [
  { value: "EVERY_1_DAY", label: "Every day" },
  { value: "EVERY_3_DAYS", label: "Every 3 days" },
  { value: "EVERY_7_DAYS", label: "Every 7 days" },
  { value: "EVERY_14_DAYS", label: "Every 14 days" },
  { value: "EVERY_30_DAYS", label: "Every 30 days" },
];

export default function ConfigureRemindersModal({ isOpen, onClose, onSaved }: ConfigureRemindersModalProps) {
  const [config, setConfig] = useState<ReminderConfiguration | null>(null);
  const [upcomingDaysText, setUpcomingDaysText] = useState("");
  const [overdueIntervalsText, setOverdueIntervalsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    getReminderConfiguration()
      .then((res) => {
        setConfig(res.data);
        setUpcomingDaysText(res.data.upcomingDays.join(", "));
        setOverdueIntervalsText(res.data.overdueIntervals.join(", "));
      })
      .catch(() => setError("Failed to load reminder configuration."))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const parseDays = (text: string) =>
    text.split(",").map((v) => Number(v.trim())).filter((v) => !Number.isNaN(v) && v >= 0);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setError(null);
    try {
      await updateReminderConfiguration({
        ...config,
        upcomingDays: parseDays(upcomingDaysText),
        overdueIntervals: parseDays(overdueIntervalsText),
      });
      onSaved?.();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save reminder configuration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Configure Reminders</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <IoClose size={20} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {loading && <Loader variant="section" label="Loading current settings" />}
          {error && <p className="text-sm text-rose-600">{error}</p>}

          {config && !loading && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Upcoming-due reminders (days before due, comma-separated)
                </label>
                <input
                  value={upcomingDaysText}
                  onChange={(e) => setUpcomingDaysText(e.target.value)}
                  placeholder="7, 3, 1, 0"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Overdue reminder intervals (days after due, comma-separated)
                </label>
                <input
                  value={overdueIntervalsText}
                  onChange={(e) => setOverdueIntervalsText(e.target.value)}
                  placeholder="1, 3, 7, 14, 30"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  First reminder (days before due)
                </label>
                <input
                  type="number"
                  min={0}
                  value={config.firstReminderDaysBeforeDue}
                  onChange={(e) => setConfig({ ...config, firstReminderDaysBeforeDue: Number(e.target.value) })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Overdue reminder frequency
                </label>
                <select
                  value={config.overdueReminderFrequency}
                  onChange={(e) => setConfig({ ...config, overdueReminderFrequency: e.target.value as OverdueReminderFrequency })}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                >
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Enable automatic reminders
                </span>

                <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                  <input
                    type="checkbox"
                    checked={config.automaticRemindersEnabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        automaticRemindersEnabled: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />

                  <span className="h-6 w-11 shrink-0 rounded-full bg-slate-200 transition-colors peer-checked:bg-sky-600 peer-focus-visible:ring-2 peer-focus-visible:ring-sky-400 peer-focus-visible:ring-offset-2" />

                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </span>
              </label>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Notification channels</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={config.inAppEnabled}
                      onChange={(e) => setConfig({ ...config, inAppEnabled: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                    />
                    In-app
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={config.emailEnabled}
                      onChange={(e) => setConfig({ ...config, emailEnabled: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                    />
                    Email
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading || !config}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}