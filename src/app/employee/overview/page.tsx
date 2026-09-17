// src/app/employee/overview/page.tsx
export default function EmployeeOverviewPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">My Overview</h1>
      <p className="text-sm text-slate-500">
        Static snapshot of your profile, leave balance and upcoming events.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">Leave balance</h2>
          <p className="mt-2 text-2xl font-bold">12 days</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Next appraisal
          </h2>
          <p className="mt-2 text-2xl font-bold">Q4 2026</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Attendance rate
          </h2>
          <p className="mt-2 text-2xl font-bold">96%</p>
        </div>
      </div>
    </section>
  );
}
