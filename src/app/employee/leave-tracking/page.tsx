// src/app/employee/leave-tracking/page.tsx
export default function EmployeeLeaveTrackingPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">My Leave</h1>
      <p className="text-sm text-slate-500">
        Static placeholder for your leave requests and balances.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm">
        <p className="text-slate-500">
          Here you can later submit new leave requests and see their approval
          status.
        </p>
      </div>
    </section>
  );
}
