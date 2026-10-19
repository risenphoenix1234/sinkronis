"use client";

import { useEffect, useState } from "react";
import NotificationPrefsMatrix from "@/components/notifications/NotificationPrefsMatrix";
import {
  getNotificationPreferences,
  toggleNotificationModule,
  toggleNotificationCategory,
} from "@/lib/api/admin";
import { NotificationModulePrefs } from "@/lib/api/types/admin.types";

export default function InAppNotificationsPage() {
  const [modules, setModules] = useState<NotificationModulePrefs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const fetchPrefs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNotificationPreferences("IN_APP");
      setModules(res.data.modules);
    } catch (err) {
      setError("Failed to load notification preferences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrefs();
  }, []);

  const handleToggleAll = async (moduleKey: string, value: boolean) => {
    setPendingKey(`${moduleKey}:__all__`);
    setError(null);
    try {
      const res = await toggleNotificationModule("IN_APP", moduleKey, value);
      setModules(res.data.modules);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update module preferences.");
    } finally {
      setPendingKey(null);
    }
  };

  const handleToggleCategory = async (moduleKey: string, notificationId: string, value: boolean) => {
    setPendingKey(`${moduleKey}:${notificationId}`);
    setError(null);
    try {
      const res = await toggleNotificationCategory("IN_APP", moduleKey, notificationId, value);
      setModules(res.data.modules);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update preference.");
    } finally {
      setPendingKey(null);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      {loading && <p className="text-sm text-slate-400">Loading preferences...</p>}

      {!loading && error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      {!loading && (
        <NotificationPrefsMatrix
          modules={modules}
          onToggleAll={handleToggleAll}
          onToggleCategory={handleToggleCategory}
          pendingKey={pendingKey}
        />
      )}
    </div>
  );
}