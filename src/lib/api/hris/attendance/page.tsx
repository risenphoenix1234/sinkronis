"use client";

import { useMemo, useState } from "react";
import type {
  AttendanceLogEntry,
  DepartmentAttendanceSummary,
  MonthlyAttendanceRecord,
} from "@/lib/api/types/hrisTypes";
import type { AttendanceRecord } from "@/types/hris/attendance";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Loader2,
  AlertCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { FiEdit2 } from "react-icons/fi";
import RaiseAttendanceDisputeModal from "@/components/modals/Hris/RaiseAttendanceDisputeModal";
import { useRouter } from "next/navigation";
import AttendanceTable from "@/components/modals/Hris/AttendanceTable";
import DisputesList from "@/components/hris/attendance/DisputesList";
import { AttendanceView, useAttendanceData } from "@/hooks/useAttendanceData";
import ManualOverrideModal from "@/components/modals/ManualOverideModal";

const DEPARTMENTS = [
  "All Departments",
  "Human Resources",
  "Finance",
  "Operations",
  "IT & Technology",
] as const;

const STATUSES = ["All", "On Time", "Late", "On Leave", "Absent"] as const;

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<
    "attendance-log" | "department-summary"
  >("attendance-log");
  const [view, setView] = useState<AttendanceView>("daily-log");
  const [search, setSearch] = useState("");
  const [department, setDepartment] =
    useState<(typeof DEPARTMENTS)[number]>("All Departments");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");

  const {
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
  } = useAttendanceData(view);

  const filteredAttendance = useMemo(() => {
    const searchLower = search.toLowerCase();
    return attendanceLogs.filter((employee) => {
      const name = (employee.name ?? "") as string;
      const id = (employee.id ?? "") as string;
      const matchesSearch =
        name.toLowerCase().includes(searchLower) ||
        id.toLowerCase().includes(searchLower);
      const matchesDepartment =
        department === "All Departments" || employee.department === department;
      const matchesStatus = status === "All" || employee.status === status;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [attendanceLogs, search, department, status]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] space-y-6 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h3 className="text-3xl font-bold text-[#1F2937]">Attendance</h3>
            <p className="text-sm text-gray-500 mt-1">
              {dailyAttendance
                ? `${dailyAttendance.employeeCount} employees • ${dailyAttendance.selectedDate}`
                : "— employees • —"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="border px-4 py-2 rounded-md flex items-center gap-2 text-sm disabled:opacity-50"
              onClick={handleExportCsv}
              disabled={exporting}
            >
              <Download size={16} />
              {exporting ? "Exporting..." : "Export CSV"}
            </button>

            <div className="flex items-center rounded-md border bg-white px-2 py-1 shadow-sm">
              <button
                type="button"
                onClick={handlePreviousDay}
                aria-label="Previous day"
                className="rounded p-1 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronLeft size={16} />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleSelectDate(e.target.value)}
                className="cursor-pointer border-none bg-transparent px-2 text-sm font-medium text-slate-700 outline-none"
              />
              <button
                type="button"
                onClick={handleNextDay}
                aria-label="Next day"
                className="rounded p-1 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {dailyReportError && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600" />
              <span>{dailyReportError}</span>
            </div>
            <button
              type="button"
              onClick={() => fetchDailyReport()}
              className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          </div>
        )}

        {/* Top Tabs */}
        <div className="flex gap-8 mt-8 border-b">
          {(
            [
              ["daily-log", "Daily Log"],
              ["monthly-report", "Monthly Report"],
              ["disputes", "Disputes"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`pb-3 text-sm ${view === key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Daily Log */}
        {view === "daily-log" && (
          <>
            <div className="bg-white border rounded-lg mt-6 p-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-slate-800">
                  Your Attendance Today
                </h3>
                {myTodayLoading ? (
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Loader2 size={14} className="animate-spin text-blue-600" />
                    <span>Checking attendance status...</span>
                  </div>
                ) : linkedEmployeeId === null ? (
                  <p className="text-sm text-amber-600 mt-1">
                    No linked employee record for this account
                  </p>
                ) : myTodayAttendance?.shift ? (
                  <p className="text-sm text-gray-500 mt-1">
                    {myTodayAttendance.shift.name} (
                    {myTodayAttendance.shift.startTime} -{" "}
                    {myTodayAttendance.shift.endTime})
                    {myTodayAttendance.clockInAt && (
                      <span className="ml-2 text-green-600 font-medium">
                        • Clocked in at{" "}
                        {new Date(
                          myTodayAttendance.clockInAt,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    {isClockedIn ? "Currently Clocked In" : "Not Clocked In"}
                  </p>
                )}

                {clockInError && (
                  <p className="text-sm text-red-500 mt-1">{clockInError}</p>
                )}
                {myTodayError && (
                  <p className="text-sm text-red-500 mt-1">{myTodayError}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {myTodayError && (
                  <button
                    type="button"
                    onClick={() => fetchMyTodayAttendance()}
                    className="border px-3 py-1.5 rounded-md text-xs text-slate-600 hover:bg-slate-50 transition"
                  >
                    Retry
                  </button>
                )}
                <button
                  onClick={isClockedIn ? handleClockOut : handleClockIn}
                  disabled={linkedEmployeeId === null || myTodayLoading}
                  className={`px-5 py-2 rounded-md text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${isClockedIn
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-sky-600 hover:bg-sky-700"
                    }`}
                >
                  {myTodayLoading
                    ? "Checking..."
                    : linkedEmployeeId === null
                      ? "No linked employee"
                      : isClockedIn
                        ? "Clock Out"
                        : "Clock In"}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="relative mt-5">
              {dailyReportLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-xs">
                  <Loader2 className="animate-spin text-blue-600" size={24} />
                </div>
              )}
              <div className="grid grid-cols-6 gap-4">
                {[
                  ["On Time", dailyAttendance?.analytics.onTime ?? "--"],
                  ["Late", dailyAttendance?.analytics.late ?? "--"],
                  ["Absent", dailyAttendance?.analytics.absent ?? "--"],
                  ["On Leave", dailyAttendance?.analytics.onLeave ?? "--"],
                  [
                    "No Clock-out",
                    dailyAttendance?.analytics.noClockOut ?? "--",
                  ],
                  [
                    "Overtime",
                    dailyAttendance?.analytics.overtime ??
                    dailyAttendance?.analytics.totalOvertimeHours ??
                    0,
                  ],
                ].map(([title, value]) => (
                  <div key={title} className="bg-white border rounded-lg p-4">
                    <p className="text-xs text-gray-500">{title}</p>
                    <h2 className="text-3xl font-bold mt-2">{value}</h2>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-5 mt-5">
              <Metric
                title="Total Hours Worked"
                value={
                  dailyAttendance?.analytics.totalHoursWorked != null
                    ? `${dailyAttendance.analytics.totalHoursWorked}h`
                    : overview
                      ? `${overview.totalHours}h`
                      : "—"
                }
              />
              <Metric
                title="Total Overtime"
                value={
                  dailyAttendance?.analytics.totalOvertimeHours != null
                    ? `${dailyAttendance.analytics.totalOvertimeHours}h`
                    : "—"
                }
                color="text-red-500"
              />
              <Metric
                title="Attendance Rate"
                value={
                  dailyAttendance?.analytics.attendanceRate != null
                    ? `${dailyAttendance.analytics.attendanceRate}%`
                    : overview
                      ? `${overview.attendanceRate}%`
                      : "—"
                }
                color="text-green-500"
              />
              <Metric
                title="Shifts Active"
                value={
                  dailyAttendance?.analytics.shiftsActive != null
                    ? String(dailyAttendance.analytics.shiftsActive)
                    : "—"
                }
              />
              <Metric
                title="Pending Disputes"
                value={
                  dailyAttendance?.analytics.pendingDisputes != null
                    ? String(dailyAttendance.analytics.pendingDisputes)
                    : "—"
                }
                color="text-yellow-500"
              />
            </div>

            {/* Bottom Tabs */}
            <div className="flex gap-8 mt-8 border-b">
              {(
                [
                  ["attendance-log", "Attendance Log"],
                  ["department-summary", "Department Summary"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`pb-3 text-sm ${activeTab === key
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-4 mt-5">
              <div className="relative w-[300px]">
                <Search size={16} className="absolute left-3 top-3" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or ID..."
                  className="w-full border rounded-md pl-10 pr-4 py-2 bg-transparent"
                />
              </div>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value as (typeof DEPARTMENTS)[number])
                }
                className="border rounded-md px-4 py-2"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as (typeof STATUSES)[number])
                }
                className="border rounded-md px-4 py-2"
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Daily Log Content */}
            {activeTab === "attendance-log" ? (
              <AttendanceLogTable
                attendance={filteredAttendance}
                onAttendanceLogsRefresh={refreshAttendanceLogs}
              />
            ) : (
              <DepartmentSummaryTable data={departmentSummaryData} />
            )}
          </>
        )}

        {/* Monthly Report */}
        {view === "monthly-report" && (
          <div className="mt-6">
            <AttendanceTable
              data={monthlyData as unknown as AttendanceRecord[]}
            />
          </div>
        )}

        {/* Disputes */}
        {view === "disputes" && (
          <div className="mt-6 space-y-4">
            <DisputesList
              disputes={disputes}
              loading={disputesLoading}
              error={disputesError}
              onRefresh={refreshDisputes}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  color = "text-black",
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="border-r last:border-none px-4">
      <p className="text-xs text-gray-500">{title}</p>
      <h4 className={`font-bold mt-1 ${color}`}>{value}</h4>
    </div>
  );
}

function AttendanceLogTable({
  attendance,
  onAttendanceLogsRefresh,
}: {
  attendance: AttendanceLogEntry[];
  onAttendanceLogsRefresh: () => void;
}) {
  const [selectedEmployee, setSelectedEmployee] =
    useState<AttendanceLogEntry | null>(null);
  const router = useRouter();
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);


  const columns = [
    ["Employee ID", "w-28"],
    ["Name", "w-36"],
    ["Department", "w-36"],
    ["Shift", "w-36"],
    ["Clock In", "w-24"],
    ["Clock Out", "w-24"],
    ["Hours", "w-20"],
    ["OT", "w-16"],
    ["Status", "w-28"],
    ["Actions", "w-36"],
  ] as const;

  return (
    <>
      <div className="bg-white border rounded-lg mt-5 overflow-hidden space-y-6">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(([label, width]) => (
                <th
                  key={label || "actions"}
                  className={`${width} px-4 py-3 text-left text-xs font-medium text-slate-500`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-slate-400"
                >
                  No attendance logs found for the selected date and filters.
                </td>
              </tr>
            ) : (
              attendance.map((employee, idx) => {
                const targetEmpId = (employee.employeeRecordId ||
                  employee.employeeId ||
                  employee.id) as string;
                const displayId = String(
                  employee.employeeId || employee.id || "",
                );

                return (
                  <tr
                    key={String(employee.id ?? idx)}
                    className="border-t cursor-pointer hover:bg-slate-50/70 transition"
                    onClick={() =>
                      targetEmpId &&
                      router.push(`/hris/attendance/${targetEmpId}`)
                    }
                  >
                    <td className="px-4 py-3 text-blue-600 font-medium">
                      {displayId}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {String(employee.name ?? "")}
                    </td>
                    <td className="px-4 py-3">
                      {String(employee.department ?? "")}
                    </td>
                    <td className="px-4 py-3">{String(employee.shift ?? "")}</td>
                    <td className="px-4 py-3">
                      {String(employee.clockIn ?? "")}
                    </td>
                    <td className="px-4 py-3">
                      {String(employee.clockOut ?? "")}
                    </td>
                    <td className="px-4 py-3">{String(employee.hours ?? "")}</td>
                    <td className="px-4 py-3">{String(employee.ot ?? "")}</td>
                    <td className="px-4 py-3">{String(employee.status ?? "")}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployee(employee);
                            setShowOverrideModal(true);
                          }}
                          title="Manual Override"
                          className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        >
                          <FiEdit2 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployee(employee);
                            setShowDisputeModal(true);
                          }}
                          title="Raise Dispute"
                          className="rounded p-1 text-blue-600 transition hover:bg-blue-50"
                        >
                          <MessageSquare size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ManualOverrideModal
        isOpen={showOverrideModal}
        employee={selectedEmployee as any}
        onClose={() => {
          setShowOverrideModal(false);
          setSelectedEmployee(null);
        }}
        onSaved={onAttendanceLogsRefresh}
      />

      <RaiseAttendanceDisputeModal
        isOpen={showDisputeModal}
        employee={selectedEmployee as any}
        onClose={() => {
          setShowDisputeModal(false);
          setSelectedEmployee(null);
        }}
        onSubmitted={onAttendanceLogsRefresh}
      />
    </>
  );
}

function DepartmentSummaryTable({
  data,
}: {
  data: DepartmentAttendanceSummary[];
}) {
  const headers = [
    "Department",
    "Employees",
    "On Time",
    "Late",
    "Absent",
    "On Leave",
    "Hours",
    "Rate",
  ];

  return (
    <div className="bg-white border rounded-lg mt-5 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((head) => (
              <th
                key={head}
                className="px-4 py-3 text-left text-xs text-gray-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-12 text-center text-sm text-slate-400"
              >
                No department attendance summary records available.
              </td>
            </tr>
          ) : (
            data.map((dept) => (
              <tr key={dept.department} className="border-t">
                <td className="px-4 py-3">{dept.department}</td>
                <td className="px-4 py-3">{dept.employees}</td>
                <td className="px-4 py-3 text-green-600">{dept.onTime}</td>
                <td className="px-4 py-3 text-yellow-600">{dept.late}</td>
                <td className="px-4 py-3 text-red-600">{dept.absent}</td>
                <td className="px-4 py-3">{dept.onLeave}</td>
                <td className="px-4 py-3">{dept.hours}</td>
                <td className="px-4 py-3">{dept.rate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
