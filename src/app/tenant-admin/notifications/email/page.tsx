// src/app/tenant-admin/notifications-alerts/email/page.tsx
"use client";

import NotificationPrefsMatrix, {
  useNotificationPrefs,
  type NotificationModule,
} from "@/components/notifications/NotificationPrefsMatrix";

const initialModules: NotificationModule[] = [
  {
    name: "HRIS",
    prefs: {
      approvalsRequests: true,
      recordUpdates: false,
      systemAlerts: true,
      reminders: true,
    },
  },
  {
    name: "Accounting",
    prefs: {
      approvalsRequests: true,
      recordUpdates: false,
      systemAlerts: true,
      reminders: true,
    },
  },
];

export default function EmailNotificationsPage() {
  const [modules, onChange, onToggleAll] = useNotificationPrefs(initialModules);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <NotificationPrefsMatrix
        modules={modules}
        onChange={onChange}
        onToggleAll={onToggleAll}
      />
    </div>
  );
}