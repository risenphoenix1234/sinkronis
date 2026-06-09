// src/app/manager/attendance/page.tsx
export default function ManagerAttendancePage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Team Attendance</h1>
      <p className="text-sm text-slate-500">
        Static summary of attendance for your reportees.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm">
        <p className="text-slate-500">
          Later, this can show daily presence, absences and lateness per team
          member.
        </p>
      </div>
    </section>
  );
}
