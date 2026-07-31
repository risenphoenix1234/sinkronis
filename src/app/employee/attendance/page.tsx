import AttendanceCalendar from "@/components/employee/attendance/AttendanceCalender";
import AttendanceHeader from "@/components/employee/attendance/AttendanceHeader";
import AttendanceLogTable from "@/components/employee/attendance/AttendanceLogTable";
import AttendanceSummary from "@/components/employee/attendance/AttendanceSummary";

export default function AttendancePage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto space-y-6 p-6">
        <AttendanceHeader />

        <AttendanceCalendar />

        <AttendanceSummary />

        <AttendanceLogTable />
      </div>
    </main>
  );
}
