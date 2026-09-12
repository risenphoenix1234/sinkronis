"use client";

import { useMemo, useState } from "react";
import type {
  AttendanceLogEntry,
  DepartmentAttendanceSummary,
  MonthlyAttendanceRecord,
} from "@/lib/api/types/hrisTypes";
import type { AttendanceRecord } from "@/types/hris/attendance";
import { Search, Download, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import ManualOverrideModal from "@/components/modals/ManualOverideModal";
import { FiEdit2 } from "react-icons/fi";
import RaiseAttendanceDisputeModal from "@/components/modals/Hris/RaiseAttendanceDisputeModal";
import { useRouter } from "next/navigation";
import AttendanceTable from "@/components/modals/Hris/AttendanceTable";
import DisputesList from "@/components/hris/attendance/DisputesList";
import { AttendanceView, useAttendanceData } from "@/hooks/useAttendanceData";

const DEPARTMENTS = [
  "All Departments",
  "Human Resources",
  "Finance",
  "Operations",
  "IT & Technology",
] as const;

const STATUSES = ["All", "On Time", "Late", "On Leave", "Absent"] as const;

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<"attendance-log" | "department-summary">(
    "attendance-log",
  );
  const [view, setView] = useState<AttendanceView>("daily-log");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<(typeof DEPARTMENTS)[number]>(
    "All Departments",
  );
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");

  const {
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
          <p className="text-sm text-gray-500 mt-1">
            {dailyAttendance
              ? `${dailyAttendance.employeeCount} employees • ${dailyAttendance.selectedDate}`
              : "— employees • —"}
          </p>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
              View Department Summary
            </button>

            <button
              className="border px-4 py-2 rounded-md flex items-center gap-2 text-sm disabled:opacity-50"
              onClick={handleExportCsv}
              disabled={exporting}
            >
              <Download size={16} />
              {exporting ? "Exporting..." : "Export CSV"}
            </button>

            <button className="border rounded-md px-3 flex items-center gap-2">
              <ChevronLeft size={16} />
              <span className="text-sm">{dailyAttendance?.selectedDate ?? "—"}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

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
              className={`pb-3 text-sm ${
                view === key
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
                <h3 className="font-semibold">Your Attendance Today</h3>
                <p className="text-sm text-gray-500 mt-1">Day Shift (09:00-17:00)</p>
                {clockInError && (
                  <p className="text-sm text-red-500 mt-1">{clockInError}</p>
                )}
              </div>

              <button
                onClick={isClockedIn ? handleClockOut : handleClockIn}
                disabled={linkedEmployeeId === null}
                className={`px-5 py-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                  isClockedIn ? "bg-red-500" : "bg-blue-600"
                }`}
              >
                {linkedEmployeeId === null
                  ? "No linked employee"
                  : isClockedIn
                    ? "Clock Out"
                    : "Clock In"}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-6 gap-4 mt-5">
              {[
                ["On Time", dailyAttendance?.analytics.onTime ?? "--"],
                ["Late", dailyAttendance?.analytics.late ?? "--"],
                ["Absent", dailyAttendance?.analytics.absent ?? "--"],
                ["On Leave", dailyAttendance?.analytics.onLeave ?? "--"],
                ["No Clock-out", dailyAttendance?.analytics.noClockOut ?? "--"],
                // TODO: backend has no "overtime" field on analytics yet.
                ["Overtime", "--"],
              ].map(([title, value]) => (
                <div key={title} className="bg-white border rounded-lg p-4">
                  <p className="text-xs text-gray-500">{title}</p>
                  <h2 className="text-3xl font-bold mt-2">{value}</h2>
                </div>
              ))}
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-5">
              <Metric
                title="Total Hours Worked"
                value={overview ? `${overview.totalHours}h` : "—"}
              />
              <Metric title="Total Overtime" value="—" color="text-red-500" />
              <Metric
                title="Attendance Rate"
                value={overview ? `${overview.attendanceRate}%` : "—"}
                color="text-green-500"
              />
              <Metric title="Shifts Active" value="—" />
              <Metric title="Pending Disputes" value="—" color="text-yellow-500" />
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
                  className={`pb-3 text-sm ${
                    activeTab === key
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
                onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])}
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
            <AttendanceTable data={monthlyData as unknown as AttendanceRecord[]} />
          </div>
        )}

        {/* Disputes */}
        {view === "disputes" && (
          <div className="mt-6 space-y-4">
          <DisputesList disputes={disputes} />
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
  const [selectedEmployee, setSelectedEmployee] = useState<AttendanceLogEntry | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const router = useRouter();

  const columns = [
    ["Employee ID", "w-24"],
    ["Name", "w-40"],
    ["Department", "w-40"],
    ["Shift", "w-40"],
    ["Clock In", "w-24"],
    ["Clock Out", "w-24"],
    ["Hours", "w-20"],
    ["OT", "w-16"],
    ["Status", "w-28"],
    ["", "w-24"],
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
            {attendance.map((employee, idx) => (
              <tr
                key={String(employee.id ?? idx)}
                className="border-t cursor-pointer"
                onClick={() => employee.id && router.push(`/hris/attendance/${employee.id}`)}
              >
                <td className="px-4 py-3 text-blue-600">{String(employee.id ?? "")}</td>
                <td className="px-4 py-3">{String(employee.name ?? "")}</td>
                <td className="px-4 py-3">{String(employee.department ?? "")}</td>
                <td className="px-4 py-3">{String(employee.shift ?? "")}</td>
                <td className="px-4 py-3">{String(employee.clockIn ?? "")}</td>
                <td className="px-4 py-3">{String(employee.clockOut ?? "")}</td>
                <td className="px-4 py-3">{String(employee.hours ?? "")}</td>
                <td className="px-4 py-3">{String(employee.ot ?? "")}</td>
                <td className="px-4 py-3">{String(employee.status ?? "")}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployee(employee);
                      }}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployee(employee);
                        setShowDisputeModal(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ManualOverrideModal
        isOpen={!!selectedEmployee}
        employee={selectedEmployee as any}
        onClose={() => setSelectedEmployee(null)}
        onSaved={onAttendanceLogsRefresh}
      />
      <RaiseAttendanceDisputeModal
        isOpen={showDisputeModal}
        employee={selectedEmployee as any}
        onClose={() => {
          setShowDisputeModal(false);
          setSelectedEmployee(null);
        }}
        onSubmitted={() => {
          onAttendanceLogsRefresh();
        }}
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
              <th key={head} className="px-4 py-3 text-left text-xs text-gray-500">
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((dept) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}