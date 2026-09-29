"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, RefreshCw } from "lucide-react";
import AttendanceClockBanner from "@/components/employee/attendance/AttendanceClockBanner";
import AttendanceCalendar from "@/components/employee/attendance/AttendanceCalender";
import AttendanceSummaryCards from "@/components/employee/attendance/AttendanceSummaryCards";
import AttendanceLogTable from "@/components/employee/attendance/AttendanceLogTable";
import { getEmployeeAttendance } from "@/lib/api/employee";
import { EmployeeAttendanceData } from "@/lib/api/types/employeeTypes";

export default function EmployeeAttendancePage() {
  // Default to present month in YYYY-MM format
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [data, setData] = useState<EmployeeAttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async (month: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getEmployeeAttendance({ month });
      setData(res);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const msg = err.response?.data?.message || err.response?.data?.error;

        if (status === 401) {
          setError("Your session has expired. Please log in again.");
        } else if (status === 403) {
          setError("HRIS entitlement required to view attendance.");
        } else if (status === 404) {
          setError("Authenticated user is not linked to a tenant employee.");
        } else {
          setError(msg || "Failed to load attendance data. Please try again.");
        }
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance(selectedMonth);
  }, [selectedMonth, fetchAttendance]);

  const [yearStr, monthStr] = selectedMonth.split("-");
  const monthDate = new Date(
    parseInt(yearStr, 10),
    parseInt(monthStr, 10) - 1,
    1,
  );
  const formattedMonthLabel = monthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Attendance
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your daily clock-in/out and attendance history
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="">
            <div className="h-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm animate-pulse" />
            <div className="h-80 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm animate-pulse" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm animate-pulse"
                />
              ))}
            </div>
            <div className="h-64 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm animate-pulse" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-red-800">
              Unable to load attendance data
            </h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => fetchAttendance(selectedMonth)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        )}

        {/* Live Attendance UI */}
        {!loading && !error && data && (
          <>
            {/* Currently Clocked In / Out Banner */}
            <AttendanceClockBanner
              today={data.today}
              onRefresh={() => fetchAttendance(selectedMonth)}
            />

            {/* Monthly Calendar View */}
            <AttendanceCalendar
              calendar={data.calendar}
              selectedMonth={selectedMonth}
              onMonthChange={(newMonth) => setSelectedMonth(newMonth)}
            />

            {/* Summary Stat Cards */}
            <AttendanceSummaryCards summary={data.summary} />

            {/* Attendance Log Table */}
            <AttendanceLogTable
              logs={data.attendanceLog}
              monthLabel={formattedMonthLabel}
              onDisputeSubmitted={() => fetchAttendance(selectedMonth)}
            />
          </>
        )}
      </div>
    </div>
  );
}
