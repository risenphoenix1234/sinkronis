// src/app/tenant-admin/security/active-sessions/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getActiveSessions,
  revokeSession,
  revokeAllOtherSessions,
} from "@/lib/api/admin";
import { SecuritySession } from "@/lib/api/types/admin.types";

function formatRelative(dateStr: string) {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;

  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState<SecuritySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getActiveSessions({ status: "ACTIVE", limit: 100 });
      setSessions(res.data);
    } catch (err) {
      setError("Failed to load active sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (id: string) => {
    setActionError(null);
    setRevokingId(id);
    try {
      await revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setActionError(err?.response?.data?.message || "Failed to revoke session.");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAllOthers = async () => {
    setActionError(null);
    setRevokingAll(true);
    try {
      await revokeAllOtherSessions();
      setSessions((prev) => prev.filter((s) => s.status === "CURRENT"));
    } catch (err: any) {
      setActionError(err?.response?.data?.message || "Failed to revoke other sessions.");
    } finally {
      setRevokingAll(false);
    }
  };

  const otherSessionsCount = sessions.filter((s) => s.status !== "CURRENT").length;

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="py-8 text-center text-sm text-slate-400">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}
      {actionError && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {actionError}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {sessions.length} active session{sessions.length === 1 ? "" : "s"} across all
          devices.
        </p>
        {otherSessionsCount > 0 && (
          <button
            onClick={handleRevokeAllOthers}
            disabled={revokingAll}
            className="text-sm font-medium text-rose-600 hover:underline disabled:opacity-60"
          >
            {revokingAll ? "Revoking..." : "Revoke All Others"}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sessions.map((session) => {
          const isCurrent = session.status === "CURRENT";
          const locationLabel =
            [session.location.state, session.location.country].filter(Boolean).join(", ") ||
            "Unknown location";

          return (
            <div
              key={session.id}
              className={`flex items-center justify-between rounded-md border px-4 py-3 ${
                isCurrent ? "border-sky-200 bg-sky-50/50" : "border-slate-100"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-800">{session.userName}</p>
                  {isCurrent && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-slate-500">
                  {session.device} · {session.ipAddress} · {locationLabel}
                </p>
                <p className="text-xs text-slate-400">
                  Last seen: {formatRelative(session.lastSeenAt)}
                </p>
              </div>

              {!isCurrent && (
                <button
                  onClick={() => handleRevoke(session.id)}
                  disabled={revokingId === session.id}
                  className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                >
                  {revokingId === session.id ? "Revoking..." : "Revoke"}
                </button>
              )}
            </div>
          );
        })}

        {sessions.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No active sessions.</p>
        )}
      </div>
    </div>
  );
}