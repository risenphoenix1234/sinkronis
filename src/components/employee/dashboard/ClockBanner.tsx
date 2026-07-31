"use client";

import { useState } from "react";

interface Props {
  onClockOut?: () => void;
}

export default function AttendanceHeader({ onClockOut }: Props) {
  const [viewTab, setViewTab] = useState<"clockout" | "seeyoutomorrow">(
    "clockout",
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-xl border bg-white p-5">
        {viewTab === "clockout" ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">
                Currently Clocked In • since 8:47 AM
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Today's summary: 7h 13m worked so far
              </p>
            </div>

            <button
              onClick={() => {
                setViewTab("seeyoutomorrow");
                onClockOut?.();
              }}
              className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-700"
            >
              Clock Out
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">
                Clocked Out • 12:14 PM
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Today's summary: Total 8h+ worked
              </p>
            </div>

            <div className="border border-green-500 text-green-600 text-xs font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
              See you tomorrow!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
