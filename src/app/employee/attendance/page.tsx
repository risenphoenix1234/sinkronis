// src/app/employee/attendance/page.tsx
export default function EmployeeAttendancePage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">My Attendance</h1>
      <p className="text-sm text-slate-500">
        Static placeholder for your personal attendance history.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm">
        <p className="text-slate-500">
          Later, show check-in/check-out times, days present, absences and
          overtime here.
        </p>
      </div>
    </section>
  );
}
