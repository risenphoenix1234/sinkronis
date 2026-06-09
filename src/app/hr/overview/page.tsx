// src/app/hr/overview/page.tsx
export default function HROverviewPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">HR Overview</h1>
      <p className="text-sm text-slate-500">
        Static snapshot of key HR metrics for this tenant.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Total employees
          </h2>
          <p className="mt-2 text-2xl font-bold">180</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Open positions
          </h2>
          <p className="mt-2 text-2xl font-bold">6</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Pending approvals
          </h2>
          <p className="mt-2 text-2xl font-bold">11</p>
        </div>
      </div>
    </section>
  );
}
