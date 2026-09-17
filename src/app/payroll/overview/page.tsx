// src/app/payroll/overview/page.tsx
export default function PayrollOverviewPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Payroll Overview</h1>
      <p className="text-sm text-slate-500">
        Static snapshot of recent payroll runs and totals.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Last run (month)
          </h2>
          <p className="mt-2 text-2xl font-bold">May 2026</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Total net pay (₦)
          </h2>
          <p className="mt-2 text-2xl font-bold">45,000,000</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Employees paid
          </h2>
          <p className="mt-2 text-2xl font-bold">178</p>
        </div>
      </div>
    </section>
  );
}
