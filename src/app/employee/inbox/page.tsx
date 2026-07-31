"use client";

import { useMemo, useState } from "react";

import InboxCard from "@/components/employee/inbox/InboxCard";
import { inboxData } from "@/data/employee/inbox";

export default function InboxPage() {
  const [tab, setTab] = useState("All");

  const items = useMemo(() => {
    if (tab === "Pending")
      return inboxData.filter((i) => i.status === "Pending");

    if (tab === "Done") return inboxData.filter((i) => i.status === "Done");

    return inboxData;
  }, [tab]);

  const pending = inboxData.filter((i) => i.status === "Pending").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <h1 className="text-4xl font-bold text-gray-900">My Inbox</h1>

      <p className="text-gray-400 mt-2">
        Tasks and notifications requiring your attention
      </p>

      <div className="inline-flex bg-white rounded-xl border mt-8 overflow-hidden">
        {["All", "Pending", "Done"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-6 py-3 text-sm font-medium ${
              tab === item ? "bg-blue-600 text-white" : "text-gray-500"
            }`}
          >
            {item}

            {item === "Pending" && (
              <span className="ml-2 rounded-full bg-white/30 px-2 py-0.5 text-xs">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <InboxCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
