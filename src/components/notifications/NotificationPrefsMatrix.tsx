// src/components/notifications/NotificationPrefsMatrix.tsx
"use client";

import { useState } from "react";
import Toggle from "@/components/ui/Toggle";

export type NotificationCategoryKey =
  | "approvalsRequests"
  | "recordUpdates"
  | "systemAlerts"
  | "reminders";

const categoryLabels: Record<
  NotificationCategoryKey,
  { title: string; subtitle: string }
> = {
  approvalsRequests: {
    title: "Approvals & Requests",
    subtitle: "Leave requests, payment approvals, expense submissions",
  },
  recordUpdates: {
    title: "Record Updates",
    subtitle: "Employee profile edits, invoice status changes",
  },
  systemAlerts: {
    title: "System Alerts",
    subtitle: "Failed logins, overdue invoices, attendance anomalies",
  },
  reminders: {
    title: "Reminders",
    subtitle: "Invoice due dates, leave balance low, renewal notices",
  },
};

const categoryOrder: NotificationCategoryKey[] = [
  "approvalsRequests",
  "recordUpdates",
  "systemAlerts",
  "reminders",
];

export type ModulePrefs = Record<NotificationCategoryKey, boolean>;

export type NotificationModule = {
  name: string;
  prefs: ModulePrefs;
};

interface NotificationPrefsMatrixProps {
  modules: NotificationModule[];
  onChange: (
    moduleName: string,
    category: NotificationCategoryKey,
    value: boolean
  ) => void;
  onToggleAll: (moduleName: string, value: boolean) => void;
}

export default function NotificationPrefsMatrix({
  modules,
  onChange,
  onToggleAll,
}: NotificationPrefsMatrixProps) {
  return (
    <div className="space-y-6">
      {modules.map((mod) => {
        const allOn = categoryOrder.every((key) => mod.prefs[key]);
        return (
          <div key={mod.name}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                {mod.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">
                  All
                </span>
                <Toggle
                  checked={allOn}
                  onChange={(v) => onToggleAll(mod.name, v)}
                  ariaLabel={`${mod.name} all notifications`}
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 rounded-md border border-slate-100">
              {categoryOrder.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {categoryLabels[key].title}
                    </p>
                    <p className="text-sm text-slate-500">
                      {categoryLabels[key].subtitle}
                    </p>
                  </div>
                  <Toggle
                    checked={mod.prefs[key]}
                    onChange={(v) => onChange(mod.name, key, v)}
                    ariaLabel={`${mod.name} ${categoryLabels[key].title}`}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function useNotificationPrefs(
  initialModules: NotificationModule[]
): [
  NotificationModule[],
  (moduleName: string, category: NotificationCategoryKey, value: boolean) => void,
  (moduleName: string, value: boolean) => void,
] {
  const [modules, setModules] = useState<NotificationModule[]>(initialModules);

  const onChange = (
    moduleName: string,
    category: NotificationCategoryKey,
    value: boolean
  ) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.name === moduleName
          ? { ...mod, prefs: { ...mod.prefs, [category]: value } }
          : mod
      )
    );
  };

  const onToggleAll = (moduleName: string, value: boolean) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.name === moduleName
          ? {
              ...mod,
              prefs: Object.fromEntries(
                categoryOrder.map((key) => [key, value])
              ) as ModulePrefs,
            }
          : mod
      )
    );
  };

  return [modules, onChange, onToggleAll];
}