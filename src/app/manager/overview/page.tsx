// src/app/manager/overview/page.tsx
export default function ManagerOverviewPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Manager Overview</h1>
      <p className="text-sm text-slate-500">
        High-level summary of your team&apos;s activity (static).
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Direct reports
          </h2>
          <p className="mt-2 text-2xl font-bold">8</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Pending leave approvals
          </h2>
          <p className="mt-2 text-2xl font-bold">3</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Active appraisals
          </h2>
          <p className="mt-2 text-2xl font-bold">5</p>
        </div>
      </div>
    </section>
  );
}
