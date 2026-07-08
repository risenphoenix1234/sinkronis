// src/app/employee/attendance/page.tsx

import AttendanceFilters from "@/components/employee/attendance/AttendanceFilters";
import SummaryCards from "@/components/employee/attendance/SummaryCards";
import AttendanceTable from "@/components/employee/attendance/AttendanceTable";
import { presentSummary, totalSummary } from "@/data/employee/attendance";
import Pagination from "@/components/employee/attendance/Pagination";

export default function AttendancePage() {
  return (
    <section className="space-y-6 p-6">
      <div className="min-h-screen bg-[#FAFAFA]">
        <h1 className="text-5xl font-bold">Attendance</h1>
        <div className="w-full justify-between grid grid-cols-2 gap-20 mt-6">
          <div>
            <SummaryCards title="Present Summary" data={presentSummary} />
          </div>
          <div>
            <SummaryCards title="Total Summary" data={totalSummary} />
          </div>
        </div>

        <AttendanceFilters />

        <AttendanceTable />

        <Pagination />
      </div>
    </section>
  );
}
