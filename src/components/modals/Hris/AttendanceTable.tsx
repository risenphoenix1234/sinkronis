import { AttendanceRecord } from "@/types/hris/attendance";
import RateBar from "../../hris/attendance/RateBar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AttendanceTableProps {
  data: AttendanceRecord[];
}

const columns = [
  "Employee",
  "Department",
  "Present",
  "Absent",
  "On Leave",
  "Late",
  "Hours",
  "OT",
  "Rate",
];

export default function AttendanceTable({ data }: AttendanceTableProps) {
  return (
    <section className="mt-6">
      {/* Header */}
      <div className="mb-4 justify-between flex items center">
        <h2 className="text-sm font-semibold text-slate-900">
          Monthly Report — May 2026 (21 working days)
        </h2>

        <p className="text-xs text-slate-500"></p>
        <button className="border rounded-md px-3 flex items-center gap-2">
          <ChevronLeft size={16} />
          <span className="text-sm">1 May 2026</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-5 py-4 text-left text-xs font-medium text-slate-500"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                  >
                    {/* Employee */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {employee.employee}
                        </p>

                        <p className="text-xs text-slate-400">
                          {employee.employeeCode}
                        </p>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-4 text-slate-600">
                      {employee.department}
                    </td>

                    {/* Present */}
                    <td className="px-5 py-4 font-medium text-green-600">
                      {employee.present}
                    </td>

                    {/* Absent */}
                    <td className="px-5 py-4 font-medium text-red-500">
                      {employee.absent}
                    </td>

                    {/* Leave */}
                    <td className="px-5 py-4 text-slate-600">
                      {employee.leave}
                    </td>

                    {/* Late */}
                    <td className="px-5 py-4 font-medium text-amber-500">
                      {employee.late}
                    </td>

                    {/* Hours */}
                    <td className="px-5 py-4 text-slate-700">
                      {employee.hours}h
                    </td>

                    {/* Overtime */}
                    <td className="px-5 py-4 font-medium text-orange-500">
                      {employee.overtime}
                    </td>

                    {/* Rate */}
                    <td className="px-5 py-4 min-w-[160px]">
                      <RateBar value={employee.rate} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
