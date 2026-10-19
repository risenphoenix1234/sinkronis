// src/hooks/useAttendanceData.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { clockIn, clockOut } from "@/lib/api/employee";
import {
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
  MyTodayAttendance,
} from "@/lib/api/types/hrisTypes";

export type AttendanceView = "daily-log" | "monthly-report" | "disputes";

export interface MyTodayView {
  shift: MyTodayAttendance["shift"];
  clockInAt: string | null;
  clockOutAt: string | null;
}

function logApiError(label: string, err: unknown) {
  console.error(label, axios.isAxiosError(err) ? err.response?.data : err);
}

function errorMessage(err: unknown, fallback: string): string {
  return axios.isAxiosError(err)
    ? (err.response?.data?.message ?? fallback)
    : fallback;
}

function toYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shiftYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const next = new Date(y, m - 1, d + days);
  return toYmd(next);
}

/**
 * Owns every attendance-related API call and the state derived from it.
 * The page component should only be responsible for layout/interaction,
 * not for knowing which endpoint backs which piece of UI.
 */
export function useAttendanceData(view: AttendanceView) {
  const [dailyAttendance, setDailyAttendance] =
    useState<DailyAttendanceData | null>(null);
  const [dailyReportLoading, setDailyReportLoading] = useState(true);
  const [dailyReportError, setDailyReportError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    toYmd(new Date()),
  );

  const [overview, setOverview] = useState<AttendanceOverviewData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyAttendanceRecord[]>([]);
  const [departmentSummaryData, setDepartmentSummaryData] = useState<
    DepartmentAttendanceSummary[]
  >([]);

  const [disputes, setDisputes] = useState<AttendanceDispute[]>([]);
  const [disputesLoading, setDisputesLoading] = useState(false);
  const [disputesError, setDisputesError] = useState<string | null>(null);

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLogEntry[]>(
    [],
  );

  const [myTodayAttendance, setMyTodayAttendance] =
    useState<MyTodayView | null>(null);
  const [myTodayLoading, setMyTodayLoading] = useState(true);
  const [myTodayError, setMyTodayError] = useState<string | null>(null);
  const [linkedEmployeeId, setLinkedEmployeeId] = useState<
    string | null | undefined
  >(undefined);

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInError, setClockInError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const fetchDailyReport = useCallback(async (date?: string) => {
    setDailyReportLoading(true);
    setDailyReportError(null);
    try {
      const res = await getDailyAttendance(date ? { date } : undefined);
      setDailyAttendance(res.data);
    } catch (err) {
      logApiError("Daily attendance failed:", err);
      setDailyReportError(
        errorMessage(err, "Couldn't load the daily attendance report."),
      );
    } finally {
      setDailyReportLoading(false);
    }
  }, []);

  const fetchMyTodayAttendance = useCallback(async () => {
    setMyTodayLoading(true);
    setMyTodayError(null);
    try {
      const data = await getMyTodayAttendance();
      if (!data) {
        setMyTodayAttendance(null);
        setLinkedEmployeeId(null);
        setIsClockedIn(false);
        return;
      }
      const record = data.attendance;
      setMyTodayAttendance({
        shift: data.shift ?? null,
        clockInAt: record?.clockInAt ?? null,
        clockOutAt: record?.clockOutAt ?? null,
      });
      setLinkedEmployeeId(record?.employeeId ?? "");
      setIsClockedIn(Boolean(record?.clockInAt) && !record?.clockOutAt);
    } catch (err) {
      logApiError("Failed to load today's attendance:", err);
      setMyTodayError(errorMessage(err, "Couldn't load your attendance today."));
      setLinkedEmployeeId(null);
    } finally {
      setMyTodayLoading(false);
    }
  }, []);

  const refreshAttendanceLogs = useCallback(() => {
    return getAttendanceLogs()
      .then((res) => setAttendanceLogs(res.data))
      .catch((err) => logApiError("Attendance logs failed:", err));
  }, []);

  const refreshDisputes = useCallback(async () => {
    setDisputesLoading(true);
    setDisputesError(null);
    try {
      const res = await getAttendanceDisputes();
      setDisputes(res.data);
    } catch (err) {
      logApiError("Disputes failed:", err);
      setDisputesError(errorMessage(err, "Couldn't load attendance disputes."));
    } finally {
      setDisputesLoading(false);
    }
  }, []);

  const handleSelectDate = useCallback(
    (date: string) => {
      if (!date) return;
      setSelectedDate(date);
      fetchDailyReport(date);
    },
    [fetchDailyReport],
  );

  const handlePreviousDay = useCallback(() => {
    handleSelectDate(shiftYmd(selectedDate, -1));
  }, [handleSelectDate, selectedDate]);

  const handleNextDay = useCallback(() => {
    handleSelectDate(shiftYmd(selectedDate, 1));
  }, [handleSelectDate, selectedDate]);

  // Data that's always needed regardless of which tab is active.
  useEffect(() => {
    fetchDailyReport();
    fetchMyTodayAttendance();

    getAttendanceOverview()
      .then((res) => setOverview(res.data))
      .catch((err) => logApiError("Attendance overview failed:", err));

    getDepartmentAttendanceSummary()
      .then((res) => setDepartmentSummaryData(res.data))
      .catch((err) => logApiError("Department summary failed:", err));
  }, [fetchDailyReport, fetchMyTodayAttendance]);

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
    if (linkedEmployeeId === null) {
      setClockInError("Your account isn't linked to an employee record yet.");
      return;
    }
    try {
      await clockIn();
      await fetchMyTodayAttendance();
    } catch (err) {
      logApiError("Clock in failed:", err);
      setClockInError(errorMessage(err, "Couldn't clock in."));
    }
  }, [linkedEmployeeId, fetchMyTodayAttendance]);

  const handleClockOut = useCallback(async () => {
    setClockInError(null);
    try {
      await clockOut();
      await fetchMyTodayAttendance();
    } catch (err) {
      logApiError("Clock out failed:", err);
      setClockInError(errorMessage(err, "Couldn't clock out."));
    }
  }, [fetchMyTodayAttendance]);

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
    dailyReportLoading,
    dailyReportError,
    selectedDate,
    myTodayAttendance,
    myTodayLoading,
    myTodayError,
    overview,
    monthlyData,
    departmentSummaryData,
    disputes,
    disputesLoading,
    disputesError,
    attendanceLogs,
    linkedEmployeeId,
    isClockedIn,
    clockInError,
    exporting,
    // actions
    fetchMyTodayAttendance,
    fetchDailyReport,
    handlePreviousDay,
    handleNextDay,
    handleSelectDate,
    handleClockIn,
    handleClockOut,
    handleExportCsv,
    refreshAttendanceLogs,
    refreshDisputes,
  };
}