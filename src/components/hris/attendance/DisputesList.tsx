"use client";

import { useState } from "react";
import type { AttendanceDispute } from "@/lib/api/types/hrisTypes";
import { DisputeCard } from "./DisputeCard";

interface DisputesListProps {
  disputes: AttendanceDispute[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export default function DisputesList({
  disputes,
  loading = false,
  error = null,
  onRefresh,
}: DisputesListProps) {
  const [filter, setFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");

  const pendingCount = disputes.filter(
    (item) => item.status?.toUpperCase() === "PENDING",
  ).length;

  const filteredDisputes = disputes.filter((item: AttendanceDispute) => {
    if (filter === "All") return true;
    return item.status?.toUpperCase() === filter.toUpperCase();
  });

  const tabs: { key: "All" | "Pending" | "Approved" | "Rejected"; label: string }[] =
    [
      { key: "All", label: "All" },
      {
        key: "Pending",
        label: pendingCount > 0 ? `Pending (${pendingCount})` : "Pending",
      },
      { key: "Approved", label: "Approved" },
      { key: "Rejected", label: "Rejected" },
    ];

  return (
    <div className="mt-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Attendance Disputes
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Employees raise disputes when their records don&apos;t match actual
            attendance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tabs.map(({ key, label }) => {
            const isSelected = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-[#0369A1] text-white shadow-xs"
                    : "border border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 space-y-3.5">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
            Loading disputes...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-700">
            <p>{error}</p>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="mt-3 rounded bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Retry
              </button>
            )}
          </div>
        ) : filteredDisputes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-xs text-slate-400">
            No disputes found.
          </div>
        ) : (
          filteredDisputes.map((dispute: AttendanceDispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              onResolved={onRefresh}
            />
          ))
        )}
      </div>
    </div>
  );
}
