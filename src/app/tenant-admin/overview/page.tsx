// src/app/tenant-admin/overview/page.tsx
export default function TenantAdminOverviewPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Tenant Overview</h1>
      <p className="text-sm text-slate-500">
        High-level static summary of this organisation.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Total Employees
          </h2>
          <p className="mt-2 text-2xl font-bold">180</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Active Modules
          </h2>
          <p className="mt-2 text-2xl font-bold">5</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Pending Invites
          </h2>
          <p className="mt-2 text-2xl font-bold">7</p>
        </div>
      </div>
    </section>
  );
}
