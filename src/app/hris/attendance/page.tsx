"use client";

import { useMemo, useState } from "react";
import { attendanceData, staticAttendance } from "@/data/hris/attendance";
import { Attendance } from "@/types/hris/attendance";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import ManualOverrideModal from "@/components/modals/ManualOverideModal";
import { FiEdit2 } from "react-icons/fi";
import RaiseAttendanceDisputeModal from "@/components/modals/Hris/RaiseAttendanceDisputeModal";
import { useRouter } from "next/navigation";
import AttendanceTable from "@/components/modals/Hris/AttendanceTable";
import DisputesList from "@/components/hris/attendance/DisputesList";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<
    "attendance-log" | "department-summary"
  >("attendance-log");

  const [view, setView] = useState<"daily-log" | "monthly-report" | "disputes">(
    "daily-log",
  );

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All");
  const [isClockedIn, setIsClockedIn] = useState(false);

  const filteredAttendance = useMemo(() => {
    return staticAttendance.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.id.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        department === "All Departments" || employee.department === department;

      const matchesStatus = status === "All" || employee.status === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [search, department, status]);

  const departmentSummary = useMemo(() => {
    return Object.values(
      staticAttendance.reduce((acc: any, employee) => {
        if (!acc[employee.department]) {
          acc[employee.department] = {
            department: employee.department,
            employees: 0,
            onTime: 0,
            late: 0,
            absent: 0,
            onLeave: 0,
          };
        }

        acc[employee.department].employees++;

        switch (employee.status) {
          case "On Time":
            acc[employee.department].onTime++;
            break;
          case "Late":
            acc[employee.department].late++;
            break;
          case "Absent":
            acc[employee.department].absent++;
            break;
          case "On Leave":
            acc[employee.department].onLeave++;
            break;
        }

        return acc;
      }, {}),
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] space-y-6 p-6">
      <div className="mx-auto">
        {/* Header */}

        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-bold">Attendance</h1>

            <p className="text-sm text-gray-500 mt-1">
              12 employees • 1 Jun 2026
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
              View Department Summary
            </button>

            <button className="border px-4 py-2 rounded-md flex items-center gap-2 text-sm">
              <Download size={16} />
              Export CSV
            </button>

            <button className="border rounded-md px-3 flex items-center gap-2">
              <ChevronLeft size={16} />
              <span className="text-sm">1 Jun 2026</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Top Tabs */}

        <div className="flex gap-8 mt-8 border-b">
          <button
            onClick={() => setView("daily-log")}
            className={`pb-3 text-sm ${
              view === "daily-log"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Daily Log
          </button>

          <button
            onClick={() => setView("monthly-report")}
            className={`pb-3 text-sm ${
              view === "monthly-report"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Monthly Report
          </button>

          <button
            onClick={() => setView("disputes")}
            className={`pb-3 text-sm ${
              view === "disputes"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Disputes
          </button>
        </div>
        {/* Attendance Today */}
        {view === "daily-log" && (
          <>
            <div className="bg-white border rounded-lg mt-6 p-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Your Attendance Today</h3>

                <p className="text-sm text-gray-500 mt-1">
                  11:56:04 • Day Shift (09:00-17:00)
                </p>
              </div>

              <button
                onClick={() => setIsClockedIn((prev) => !prev)}
                className={`px-5 py-2 rounded-md text-white ${
                  isClockedIn ? "bg-red-500" : "bg-blue-600"
                }`}
              >
                {isClockedIn ? "Clock Out" : "Clock In"}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-6 gap-4 mt-5">
              {[
                ["On Time", 5],
                ["Late", 1],
                ["Absent", 1],
                ["On Leave", 2],
                ["No Clock-out", 1],
                ["Overtime", 1],
              ].map(([title, value]) => (
                <div key={title} className="bg-white border rounded-lg p-4">
                  <p className="text-xs text-gray-500">{title}</p>

                  <h2 className="text-3xl font-bold mt-2">{value}</h2>
                </div>
              ))}
            </div>

            {/* KPI Row */}

            <div className="bg-white border rounded-lg mt-4 p-4">
              <div className="grid grid-cols-5">
                <Metric title="Total Hours Worked" value="65.4h" />

                <Metric
                  title="Total Overtime"
                  value="1.9h"
                  color="text-red-500"
                />

                <Metric
                  title="Attendance Rate"
                  value="67%"
                  color="text-green-500"
                />

                <Metric title="Shifts Active" value="3" />

                <Metric
                  title="Pending Disputes"
                  value="2"
                  color="text-yellow-500"
                />
              </div>
            </div>

            {/* Bottom Tabs */}

            <div className="flex gap-8 mt-8 border-b">
              <button
                onClick={() => setActiveTab("attendance-log")}
                className={`pb-3 text-sm ${
                  activeTab === "attendance-log"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Attendance Log
              </button>

              <button
                onClick={() => setActiveTab("department-summary")}
                className={`pb-3 text-sm ${
                  activeTab === "department-summary"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Department Summary
              </button>
            </div>

            {/* Filters */}

            <div className="flex gap-4 mt-5">
              <div className="relative w-[300px]">
                <Search size={16} className="absolute left-3 top-3" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or ID..."
                  className="w-full border rounded-md pl-10 pr-4 py-2  bg-transparent"
                />
              </div>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border rounded-md px-4 py-2"
              >
                <option>All Departments</option>
                <option>Human Resources</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>IT & Technology</option>
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded-md px-4 py-2"
              >
                <option>All</option>
                <option>On Time</option>
                <option>Late</option>
                <option>On Leave</option>
                <option>Absent</option>
              </select>
            </div>
            {/* Daily Log Content */}
            {activeTab === "attendance-log" ? (
              <AttendanceLogTable attendance={filteredAttendance} />
            ) : (
              <DepartmentSummaryTable data={departmentSummary} />
            )}
          </>
        )}

        {/* Content */}
        {view === "monthly-report" && (
          <div className="mt-6">
            <AttendanceTable data={attendanceData} />
          </div>
        )}

        {view === "disputes" && (
          <div className="mt-6 space-y-4">
            <DisputesList />
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

function AttendanceLogTable({ attendance }: { attendance: Attendance[] }) {
  const [selectedEmployee, setSelectedEmployee] = useState<Attendance | null>(
    null,
  );
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="bg-white border rounded-lg mt-5 overflow-hidden space-y-6">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-24 px-4 py-3 text-left text-xs font-medium text-slate-500">
                Employee ID
              </th>

              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-slate-500">
                Name
              </th>

              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-slate-500">
                Department
              </th>

              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-slate-500">
                Shift
              </th>

              <th className="w-24 px-4 py-3 text-left text-xs font-medium text-slate-500">
                Clock In
              </th>

              <th className="w-24 px-4 py-3 text-left text-xs font-medium text-slate-500">
                Clock Out
              </th>

              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-slate-500">
                Hours
              </th>

              <th className="w-16 px-4 py-3 text-left text-xs font-medium text-slate-500">
                OT
              </th>

              <th className="w-28 px-4 py-3 text-left text-xs font-medium text-slate-500">
                Status
              </th>

              <th className="w-24 px-4 py-3 text-center text-xs font-medium text-slate-500"></th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((employee) => (
              <tr
                key={employee.id}
                className="border-t cursor-pointer"
                onClick={() => router.push(`/hris/attendance/${employee.id}`)}
              >
                <td className="px-4 py-3 text-blue-600">{employee.id}</td>

                <td className="px-4 py-3">{employee.name}</td>

                <td className="px-4 py-3">{employee.department}</td>

                <td className="px-4 py-3">{employee.shift}</td>

                <td className="px-4 py-3">{employee.clockIn}</td>

                <td className="px-4 py-3">{employee.clockOut}</td>

                <td className="px-4 py-3">{employee.hours}</td>

                <td className="px-4 py-3">{employee.ot}</td>

                <td className="px-4 py-3">{employee.status}</td>

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
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
      <RaiseAttendanceDisputeModal
        isOpen={showDisputeModal}
        employee={selectedEmployee}
        onClose={() => {
          setShowDisputeModal(false);
          setSelectedEmployee(null);
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </>
  );
}

function DepartmentSummaryTable({ data }: { data: any[] }) {
  return (
    <div className="bg-white border rounded-lg mt-5 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Department",
              "Employees",
              "On Time",
              "Late",
              "Absent",
              "On Leave",
              "Hours",
              "Rate",
            ].map((head) => (
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
