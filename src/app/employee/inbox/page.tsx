"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Inbox, AlertCircle, RefreshCw } from "lucide-react";
import InboxCard from "@/components/employee/inbox/InboxCard";
import { getEmployeeInbox } from "@/lib/api/employee";
import { EmployeeInboxData } from "@/lib/api/types/employeeTypes";

type TabType = "All" | "Pending" | "Done";

export default function InboxPage() {
  const [tab, setTab] = useState<TabType>("All");
  const [inboxData, setInboxData] = useState<EmployeeInboxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInbox = useCallback(async (currentTab: TabType) => {
    setLoading(true);
    setError(null);

    const statusParam = currentTab.toLowerCase() as "all" | "pending" | "done";

    try {
      const data = await getEmployeeInbox({ status: statusParam });
      setInboxData(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const msg =
          err.response?.data?.message || err.response?.data?.error;

        if (status === 401) {
          setError("Your session has expired. Please log in again.");
        } else if (status === 403) {
          setError("HRIS entitlement required to view inbox.");
        } else if (status === 404) {
          setError("Authenticated user is not linked to a tenant employee.");
        } else {
          setError(msg || "Failed to retrieve your inbox. Please try again.");
        }
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInbox(tab);
  }, [tab, fetchInbox]);

  const counts = inboxData?.counts;
  const items = inboxData?.items ?? [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900">My Inbox</h1>
      <p className="mt-2 text-gray-500">
        Tasks and notifications requiring your attention
      </p>

      {/* Tabs */}
      <div className="mt-8 inline-flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {(["All", "Pending", "Done"] as const).map((item) => {
          const isActive = tab === item;
          const badgeCount =
            item === "All"
              ? counts?.all
              : item === "Pending"
              ? counts?.pending
              : counts?.done;

          return (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{item}</span>
              {badgeCount !== undefined && badgeCount > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Section */}
      <div className="mt-6 space-y-4">
        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 rounded bg-gray-200" />
                    <div className="h-3 w-72 rounded bg-gray-200" />
                    <div className="h-2.5 w-24 rounded bg-gray-200" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="h-5 w-16 rounded-full bg-gray-200" />
                  <div className="h-4 w-12 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-red-800">
              Unable to load inbox
            </h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <button
              onClick={() => fetchInbox(tab)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {tab === "All"
                ? "Your inbox is clear"
                : `No ${tab.toLowerCase()} items`}
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
              {tab === "All"
                ? "You don't have any pending or completed tasks at the moment."
                : tab === "Pending"
                ? "Great job! You have no pending action items requiring your attention."
                : "No completed inbox items yet."}
            </p>
          </div>
        )}

        {/* Items List */}
        {!loading &&
          !error &&
          items.length > 0 &&
          items.map((item) => <InboxCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
