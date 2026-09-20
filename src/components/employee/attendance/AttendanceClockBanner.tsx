"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { clockIn as apiClockIn, clockOut as apiClockOut } from "@/lib/api/employee";
import { AttendanceTodayData } from "@/lib/api/types/employeeTypes";

interface AttendanceClockBannerProps {
  today?: AttendanceTodayData | null;
  onRefresh?: () => void;
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return "8:47 AM";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "8:47 AM";
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "8:47 AM";
  }
}

function formatMinutes(minutes: number | undefined): string {
  const m = minutes ?? 433; // 433m = 7h 13m default
  const h = Math.floor(m / 60);
  const remainingM = m % 60;
  return `${h}h ${remainingM}m`;
}

export default function AttendanceClockBanner({
  today,
  onRefresh,
}: AttendanceClockBannerProps) {
  const [loading, setLoading] = useState(false);

  const isClockedIn = today
    ? today.clockState === "CLOCKED_IN"
    : true; // default demo fallback

  const canAction = today
    ? isClockedIn
      ? today.canClockOut
      : today.canClockIn
    : true;

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isClockedIn) {
        const res = await apiClockOut();
        toast.success(res?.message || "Clocked out successfully");
      } else {
        const res = await apiClockIn();
        toast.success(res?.message || "Clocked in successfully");
      }
      onRefresh?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update clock status";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const titleText = isClockedIn
    ? `Currently Clocked In · since ${formatTime(today?.clockInAt)}`
    : today?.clockState === "CLOCKED_OUT"
    ? `Clocked Out · at ${formatTime(today?.clockOutAt)}`
    : "Not clocked in yet";

  const subtitleText = isClockedIn
    ? `Today's summary: ${formatMinutes(today?.workedMinutes)} worked so far`
    : today?.clockState === "CLOCKED_OUT"
    ? `Today's summary: ${formatMinutes(today?.workedMinutes)} worked`
    : "Start your day when you're ready";

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{titleText}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitleText}</p>
      </div>

      <button
        type="button"
        disabled={loading || !canAction}
        onClick={handleToggle}
        className="inline-flex items-center justify-center rounded-xl bg-[#1976D2] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1565C0] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : isClockedIn
          ? "Clock Out"
          : "Clock In"}
      </button>
    </div>
  );
}
