// src/app/platform-admin/overview/page.tsx
export default function PlatformAdminOverviewPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Platform Overview</h1>
      <p className="text-sm text-slate-500">
        Static overview page. Use this area to display metrics for tenants,
        usage, revenue, etc.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Total Tenants
          </h2>
          <p className="mt-2 text-2xl font-bold">24</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Monthly Revenue (₦)
          </h2>
          <p className="mt-2 text-2xl font-bold">1,250,000</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500">
            Active Users
          </h2>
          <p className="mt-2 text-2xl font-bold">1,842</p>
        </div>
      </div>
    </section>
  );
}
