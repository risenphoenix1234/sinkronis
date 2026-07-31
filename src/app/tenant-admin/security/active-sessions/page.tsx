// src/app/tenant-admin/security/active-sessions/page.tsx
"use client";

import { useState } from "react";

type Session = {
  id: string;
  user: string;
  deviceLine: string;
  locationLine: string;
  isCurrent: boolean;
};

const initialSessions: Session[] = [
  {
    id: "sess-1",
    user: "Chukwuemeka Obi",
    deviceLine: "Chrome / Windows 11 · 197.210.45.12 · Lagos, Nigeria",
    locationLine: "Last seen: Now",
    isCurrent: true,
  },
  {
    id: "sess-2",
    user: "Chukwuemeka Obi",
    deviceLine: "Safari / iPhone 15 · 197.210.45.12 · Lagos, Nigeria",
    locationLine: "Last seen: 2 hours ago",
    isCurrent: false,
  },
  {
    id: "sess-3",
    user: "Amara Nwosu",
    deviceLine: "Chrome / macOS · 105.112.85.34 · Abuja, Nigeria",
    locationLine: "Last seen: Today, 8:23 AM",
    isCurrent: false,
  },
  {
    id: "sess-4",
    user: "Tunde Adeyemi",
    deviceLine: "Edge / Windows 10 · 41.184.07.123 · Ibadan, Nigeria",
    locationLine: "Last seen: Yesterday",
    isCurrent: false,
  },
];

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  const handleRevoke = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRevokeAllOthers = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
  };

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {sessions.length} active session{sessions.length === 1 ? "" : "s"}{" "}
          across all devices.
        </p>
        {otherSessionsCount > 0 && (
          <button
            onClick={handleRevokeAllOthers}
            className="text-sm font-medium text-rose-600 hover:underline"
          >
            Revoke All Others
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between rounded-md border px-4 py-3 ${
              session.isCurrent
                ? "border-sky-200 bg-sky-50/50"
                : "border-slate-100"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-800">{session.user}</p>
                {session.isCurrent && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-slate-500">
                {session.deviceLine}
              </p>
              <p className="text-xs text-slate-400">{session.locationLine}</p>
            </div>

            {!session.isCurrent && (
              <button
                onClick={() => handleRevoke(session.id)}
                className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Revoke
              </button>
            )}
          </div>
        ))}

        {sessions.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            No active sessions.
          </p>
        )}
      </div>
    </div>
  );
}