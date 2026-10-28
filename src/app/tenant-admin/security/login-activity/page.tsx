// src/app/tenant-admin/security/login-activity/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getLoginActivity } from "@/lib/api/admin";
import { LoginActivityEvent } from "@/lib/api/types/admin.types";
import Loader from "@/components/ui/Loader";

const statusStyles: Record<string, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-700",
  FAILED: "bg-rose-50 text-rose-600",
  BLOCKED: "bg-amber-50 text-amber-700",
};

const statusLabels: Record<string, string> = {
  SUCCESS: "Success",
  FAILED: "Failed",
  BLOCKED: "Blocked",
};

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function LoginActivityPage() {
  const [events, setEvents] = useState<LoginActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getLoginActivity({ limit: 50 });
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load login activity.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      {loading && (
        <Loader variant="section" label="Loading login activity" />
      )}

      {!loading && error && (
        <p className="py-8 text-center text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">User</th>
                <th className="px-4 py-2.5 font-medium">IP Address</th>
                <th className="px-4 py-2.5 font-medium">Device</th>
                <th className="px-4 py-2.5 font-medium">Location</th>
                <th className="px-4 py-2.5 font-medium">Time</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const locationLabel =
                  [event.location.state, event.location.country].filter(Boolean).join(", ") ||
                  "Unknown";

                return (
                  <tr key={event.id} className="border-b border-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {event.user?.name ?? event.emailAttempted}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {event.ipAddress}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{event.device}</td>
                    <td className="px-4 py-3 text-slate-600">{locationLabel}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDateTime(event.occurredAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[event.status] ?? "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {statusLabels[event.status] ?? event.status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                    No login activity recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}