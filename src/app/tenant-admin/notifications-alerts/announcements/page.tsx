"use client";

import { useEffect, useState } from "react";
import {
  getAnnouncements,
  markAnnouncementRead,
  markAllAnnouncementsRead,
} from "@/lib/api/admin";
import { Announcement } from "@/lib/api/types/admin.types";
import Loader from "@/components/ui/Loader";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const typeBadgeColor: Record<string, string> = {
  FEATURE: "bg-sky-50 text-sky-700",
  MAINTENANCE: "bg-amber-50 text-amber-700",
  SECURITY: "bg-rose-50 text-rose-600",
  UPDATE: "bg-emerald-50 text-emerald-700",
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnnouncements({ limit: 20 });
      setAnnouncements(res.data);
      setUnreadCount(res.metadata.unreadCount);
    } catch (err) {
      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const markAsRead = async (id: string) => {
    setMarkingId(id);
    try {
      await markAnnouncementRead(id);
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, readStatus: "READ" } : a))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError("Failed to mark announcement as read.");
    } finally {
      setMarkingId(null);
    }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllAnnouncementsRead();
      setAnnouncements((prev) => prev.map((a) => ({ ...a, readStatus: "READ" })));
      setUnreadCount(0);
    } catch (err) {
      setError("Failed to mark all as read.");
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {unreadCount} unread announcement{unreadCount === 1 ? "" : "s"}.
        </p>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            disabled={markingAll}
            className="text-sm font-medium text-sky-600 hover:underline disabled:opacity-60"
          >
            {markingAll ? "Marking..." : "Mark all read"}
          </button>
        )}
      </div>

      {loading && <Loader variant="section" label="Loading announcements" />}

      {!loading && (
        <div className="space-y-3">
          {announcements.map((a) => {
            const unread = a.readStatus === "UNREAD";
            return (
              <div
                key={a.id}
                className={`relative rounded-md border p-4 ${
                  unread ? "border-sky-200 bg-sky-50/30" : "border-slate-100"
                }`}
              >
                {unread && (
                  <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-sky-500" />
                )}

                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      typeBadgeColor[a.type] ?? "bg-slate-50 text-slate-600"
                    }`}
                  >
                    {a.type}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(a.publishedAt)}</span>
                </div>

                <p className="mt-2 font-medium text-slate-800">{a.title}</p>
                <p className="mt-1 text-sm text-slate-500">{a.body}</p>

                <div className="mt-3 flex items-center gap-4 text-sm">
                  {unread && (
                    <button
                      onClick={() => markAsRead(a.id)}
                      disabled={markingId === a.id}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-700 disabled:opacity-60"
                    >
                      ✓ {markingId === a.id ? "Marking..." : "Mark as read"}
                    </button>
                  )}
                  {a.learnMoreUrl && (
                    
                    <a href={a.learnMoreUrl}
                      className="flex items-center gap-1 text-sky-600 hover:underline"
                    >
                      Learn more ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {announcements.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">No announcements.</p>
          )}
        </div>
      )}
    </div>
  );
}