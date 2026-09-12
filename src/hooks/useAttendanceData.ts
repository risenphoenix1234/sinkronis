"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  clockIn,
  clockOut,
  exportAttendanceCsv,
  getAttendanceDisputes,
  getAttendanceLogs,
  getAttendanceOverview,
  getDailyAttendance,
  getDepartmentAttendanceSummary,
  getMonthlyAttendance,
  getMyTodayAttendance,
} from "@/lib/api/hris";
import { DailyAttendanceData } from "@/lib/api/types/hrisTypes";
import type {
  AttendanceDispute,
  AttendanceLogEntry,
  AttendanceOverviewData,
  DepartmentAttendanceSummary,
  MonthlyAttendanceRecord,
} from "@/lib/api/types/hrisTypes";

export type AttendanceView = "daily-log" | "monthly-report" | "disputes";

function logApiError(label: string, err: unknown) {
  console.error(label, axios.isAxiosError(err) ? err.response?.data : err);
}

/**
 * Owns every attendance-related API call and the state derived from it.
 * The page component should only be responsible for layout/interaction,
 * not for knowing which endpoint backs which piece of UI.
 */
export function useAttendanceData(view: AttendanceView) {
  const [dailyAttendance, setDailyAttendance] =
    useState<DailyAttendanceData | null>(null);
  const [overview, setOverview] = useState<AttendanceOverviewData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyAttendanceRecord[]>([]);
  const [departmentSummaryData, setDepartmentSummaryData] = useState<
    DepartmentAttendanceSummary[]
  >([]);
  const [disputes, setDisputes] = useState<AttendanceDispute[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLogEntry[]>(
    [],
  );

  const [linkedEmployeeId, setLinkedEmployeeId] = useState<
    string | null | undefined
  >(undefined);
  const [myAttendanceId, setMyAttendanceId] = useState<string | null>(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInError, setClockInError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const refreshAttendanceLogs = useCallback(() => {
    return getAttendanceLogs()
      .then((res) => setAttendanceLogs(res.data))
      .catch((err) => logApiError("Attendance logs failed:", err));
  }, []);

  const refreshDisputes = useCallback(() => {
    return getAttendanceDisputes()
      .then((res) => setDisputes(res.data))
      .catch((err) => logApiError("Disputes failed:", err));
  }, []);

  // Data that's always needed regardless of which tab is active.
  useEffect(() => {
    getDailyAttendance()
      .then((res) => setDailyAttendance(res.data))
      .catch((err) => logApiError("Daily attendance failed:", err));

    getAttendanceOverview()
      .then((res) => setOverview(res.data))
      .catch((err) => logApiError("Attendance overview failed:", err));

    getDepartmentAttendanceSummary()
      .then((res) => setDepartmentSummaryData(res.data))
      .catch((err) => logApiError("Department summary failed:", err));

    getMyTodayAttendance()
      .then((data) => setLinkedEmployeeId(data?.employeeId ?? null))
      .catch((err) => {
        logApiError("Failed to check employee link:", err);
        setLinkedEmployeeId(null);
      });
  }, []);

  // Tab-specific data, only fetched when that tab is active.
  useEffect(() => {
    if (view === "daily-log") {
      refreshAttendanceLogs();
    }
  }, [view, refreshAttendanceLogs]);

  useEffect(() => {
    if (view !== "monthly-report") return;
    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    getMonthlyAttendance({ month: currentMonth })
      .then((res) => setMonthlyData(res.data))
      .catch((err) => logApiError("Monthly attendance failed:", err));
  }, [view]);

  useEffect(() => {
    if (view === "disputes") {
      refreshDisputes();
    }
  }, [view, refreshDisputes]);

  const handleClockIn = useCallback(async () => {
    setClockInError(null);
    if (!linkedEmployeeId) {
      setClockInError("Your account isn't linked to an employee record yet.");
      return;
    }
    try {
      await clockIn({ employeeId: linkedEmployeeId });
      setIsClockedIn(true);
    } catch (err) {
      logApiError("Clock in failed:", err);
      setClockInError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Couldn't clock in.")
          : "Couldn't clock in.",
      );
    }
  }, [linkedEmployeeId]);

  const handleClockOut = useCallback(async () => {
    setClockInError(null);
    if (!myAttendanceId) {
      setClockInError("No active clock-in found.");
      return;
    }
    try {
      await clockOut(myAttendanceId);
      setIsClockedIn(false);
      setMyAttendanceId(null);
    } catch (err) {
      logApiError("Clock out failed:", err);
      setClockInError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Couldn't clock out.")
          : "Couldn't clock out.",
      );
    }
  }, [myAttendanceId]);

  const handleExportCsv = useCallback(async () => {
    setExporting(true);
    try {
      const blob = await exportAttendanceCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      logApiError("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }, []);

  return {
    // data
    dailyAttendance,
    overview,
    monthlyData,
    departmentSummaryData,
    disputes,
    attendanceLogs,
    linkedEmployeeId,
    isClockedIn,
    clockInError,
    exporting,
    // actions
    handleClockIn,
    handleClockOut,
    handleExportCsv,
    refreshAttendanceLogs,
    refreshDisputes,
  };
}