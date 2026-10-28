"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiAlertTriangle,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from "react-icons/fi";
import { getEmployee, getEmployeeAttendance } from "@/lib/api/hris";
import type { EmployeeAttendanceRecord } from "@/lib/api/hris";
import type { GetEmployeeDetail } from "@/lib/api/types/hrisTypes";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

interface PageProps {
  params: { id: string };
}

export default function EmployeeAttendanceDetailPage({ params }: PageProps) {
  const router = useRouter();
  const employeeId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const [employee, setEmployee] = useState<GetEmployeeDetail | null>(null);
  const [records, setRecords] = useState<EmployeeAttendanceRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Month navigation for visual heatmap
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const loadData = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    setError(null);
    setIsNotFound(false);

    try {
      const [empData, attendanceRes] = await Promise.all([
        getEmployee(employeeId).catch((err) => {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setIsNotFound(true);
          }
          throw err;
        }),
        getEmployeeAttendance(employeeId, { page, limit: 25 }).catch((err) => {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setIsNotFound(true);
          }
          throw err;
        }),
      ]);

      setEmployee(empData);
      setRecords(attendanceRes?.data ?? []);
      if (attendanceRes?.pagination) {
        setTotalPages(attendanceRes.pagination.totalPages || 1);
        setTotalRecords(attendanceRes.pagination.total || 0);
      }
    } catch (err: unknown) {
      console.error("Failed to load employee attendance:", err);
      let errorMsg = "An unexpected error occurred while loading attendance.";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setIsNotFound(true);
          errorMsg = "Employee not found or no attendance profile available.";
        } else {
          errorMsg =
            err.response?.data?.message ||
            "Failed to load attendance records. Please try again.";
        }
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [employeeId, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derive stats from employee overview or real records
  const stats = useMemo(() => {
    const overview = employee?.attendanceOverview as
      | {
          presentDays?: number;
          lateArrivals?: number;
          absentDays?: number;
          overtimeHours?: number;
        }
      | undefined;

    const presentCount =
      overview?.presentDays ??
      records.filter((r) => r.status === "PRESENT" || r.status === "ON_TIME")
        .length;
    const lateCount =
      overview?.lateArrivals ??
      records.filter((r) => r.status === "LATE").length;
    const absentCount =
      overview?.absentDays ??
      records.filter((r) => r.status === "ABSENT").length;
    const overtimeHrs = overview?.overtimeHours ?? 0;

    const totalCalculated = presentCount + lateCount + absentCount;
    const attendanceRate =
      totalCalculated > 0
        ? Math.round(((presentCount + lateCount) / totalCalculated) * 100)
        : records.length > 0
          ? 100
          : 0;

    const totalHoursWorked = records.reduce((acc, r) => {
      const hrs = typeof r.workingHours === "number" ? r.workingHours : 0;
      return acc + hrs;
    }, 0);

    return {
      attendanceRate: `${attendanceRate}%`,
      presentCount,
      lateCount,
      absentCount,
      overtimeHrs,
      totalHours: `${totalHoursWorked.toFixed(1)}h`,
    };
  }, [employee, records]);

  // Employee Identity Details
  const employeeName: string =
    employee?.header?.name ||
    (employee?.personalInformation &&
    typeof employee.personalInformation === "object" &&
    "fullName" in employee.personalInformation &&
    typeof (employee.personalInformation as { fullName?: string }).fullName ===
      "string"
      ? (employee.personalInformation as { fullName?: string }).fullName!
      : "Employee Attendance");

  const departmentName: string =
    employee?.header?.department?.name ||
    (employee?.personalInformation &&
    typeof employee.personalInformation === "object" &&
    "department" in employee.personalInformation &&
    typeof (employee.personalInformation as { department?: { name?: string } })
      .department === "object" &&
    (employee.personalInformation as { department?: { name?: string } })
      .department?.name
      ? (employee.personalInformation as { department?: { name?: string } })
          .department!.name!
      : "General");

  const roleName: string =
    employee?.header?.role ||
    (employee?.personalInformation &&
    typeof employee.personalInformation === "object" &&
    "position" in employee.personalInformation &&
    typeof (employee.personalInformation as { position?: string }).position ===
      "string"
      ? (employee.personalInformation as { position?: string }).position!
      : "Staff");

  const empCode: string =
    employee?.header?.employeeId ||
    employee?.header?.id?.slice(-6).toUpperCase() ||
    employeeId?.slice(-6).toUpperCase() ||
    "";

  const employmentType: string =
    employee?.personalInformation &&
    typeof employee.personalInformation === "object" &&
    "employmentType" in employee.personalInformation &&
    typeof (employee.personalInformation as { employmentType?: string })
      .employmentType === "string"
      ? (employee.personalInformation as { employmentType?: string })
          .employmentType!
      : "Full Time";

  // Avatar Initials
  const initials = useMemo(() => {
    if (!employeeName) return "EA";
    const parts = employeeName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return employeeName.slice(0, 2).toUpperCase();
  }, [employeeName]);

  // Calendar Heatmap Helpers
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentDate]);

  const firstDayIndex = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = new Date(year, month, 1).getDay();
    // Adjust Sunday (0) to end (6), Monday is 0
    return day === 0 ? 6 : day - 1;
  }, [currentDate]);

  const monthYearDisplay = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  // Map attendance record dates to statuses for quick calendar lookup
  const attendanceDateMap = useMemo(() => {
    const map = new Map<string, string>();
    records.forEach((rec) => {
      if (rec.date) {
        // rec.date is "YYYY-MM-DD"
        map.set(rec.date, rec.status);
      }
    });
    return map;
  }, [records]);

  // Format record dates for display
  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTimeDisplay = (timeStr?: string | null) => {
    if (!timeStr) return "—";
    try {
      const d = new Date(timeStr);
      if (isNaN(d.getTime())) return timeStr;
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeStr;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <FiRefreshCw className="h-8 w-8 animate-spin text-primary" />
        <Loader variant="section" label="Loading employee attendance history" />
      </div>
    );
  }

  if (isNotFound || error) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6">
        <button
          onClick={() => router.push("/hris/attendance")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <FiArrowLeft size={16} /> Back to Attendance
        </button>

        <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <FiAlertTriangle size={24} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            {isNotFound ? "Employee Not Found" : "Unable to Load Attendance"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {error || "The requested employee record could not be found."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/hris/attendance")}
            >
              Return to Attendance List
            </Button>
            <Button variant="primary" size="sm" onClick={loadData}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f7f7f7] p-6">
      {/* Back to Attendance navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/hris/attendance")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <FiArrowLeft size={14} /> Back to Attendance
        </button>

        <button
          onClick={loadData}
          title="Refresh Data"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Employee Header */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-slate-900">
            {employeeName}
          </h1>
          <p className="text-xs text-slate-500">
            {roleName} • {departmentName} • {employmentType} • ID: {empCode}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Attendance Rate</p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-600">
            {stats.attendanceRate}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Present Days</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            {stats.presentCount}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Days Absent</p>
          <h2 className="mt-2 text-2xl font-bold text-rose-500">
            {stats.absentCount}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Late Clock-In</p>
          <h2 className="mt-2 text-2xl font-bold text-amber-500">
            {stats.lateCount}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Overtime Logged</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            {stats.overtimeHrs > 0 ? `${stats.overtimeHrs}h` : "0h"}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Hours</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            {stats.totalHours}
          </h2>
        </div>
      </div>

      {/* Overtime Alert Banner */}
      {stats.overtimeHrs > 0 && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800">
          <FiAlertTriangle size={15} className="text-amber-600" />
          <span>
            {stats.overtimeHrs}h overtime logged this period for {employeeName}
          </span>
        </div>
      )}

      {/* Main Content Grid: Heatmap + Recent Records */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Heatmap / Calendar View */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{monthYearDisplay}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                      1,
                    ),
                  )
                }
                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      1,
                    ),
                  )
                }
                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-400">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="mt-2 grid grid-cols-7 gap-2">
            {/* Empty offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-10 rounded-lg bg-slate-50/50"
              />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const y = currentDate.getFullYear();
              const m = String(currentDate.getMonth() + 1).padStart(2, "0");
              const dStr = String(dayNum).padStart(2, "0");
              const dateKey = `${y}-${m}-${dStr}`;

              const status = attendanceDateMap.get(dateKey);

              let cellStyle = "bg-slate-50 text-slate-600 hover:bg-slate-100";
              if (status === "PRESENT" || status === "ON_TIME") {
                cellStyle = "bg-emerald-100 text-emerald-700 font-semibold";
              } else if (status === "LATE") {
                cellStyle = "bg-amber-100 text-amber-700 font-semibold";
              } else if (status === "ABSENT") {
                cellStyle = "bg-rose-100 text-rose-700 font-semibold";
              } else if (status === "ON_LEAVE") {
                cellStyle = "bg-blue-100 text-blue-700 font-semibold";
              }

              return (
                <div
                  key={dateKey}
                  title={status ? `${dateKey}: ${status}` : dateKey}
                  className={`flex h-10 items-center justify-center rounded-lg text-xs transition ${cellStyle}`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>

          {/* Heatmap Legend */}
          <div className="mt-8 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Present / On Time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">Late</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-600">Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-600">Leave</span>
            </div>
          </div>
        </div>

        {/* Live Recent Attendance Records */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Attendance Log</h3>
            <span className="text-xs font-medium text-slate-500">
              {records.length} of {totalRecords} records
            </span>
          </div>

          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-12 text-center">
              <FiCalendar className="mb-2 h-8 w-8 text-slate-300" />
              <p className="text-xs font-medium text-slate-500">
                No attendance logs found for this employee.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {records.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-medium text-slate-800">
                      {formatDateDisplay(item.date)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      In: {formatTimeDisplay(item.clockIn)} • Out:{" "}
                      {item.clockOut
                        ? formatTimeDisplay(item.clockOut)
                        : "Active"}
                      {typeof item.workingHours === "number" &&
                      item.workingHours > 0
                        ? ` • ${item.workingHours}h`
                        : ""}
                    </p>
                    {item.flags && item.flags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.flags.map((flag) => (
                          <span
                            key={flag}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                          >
                            {flag.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <StatusBadge
                      status={
                        item.status === "PRESENT"
                          ? "Approved"
                          : item.status === "LATE"
                            ? "Pending"
                            : item.status === "ABSENT"
                              ? "Rejected"
                              : item.status
                      }
                      variant="pill"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-slate-200 px-2.5 py-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded border border-slate-200 px-2.5 py-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
