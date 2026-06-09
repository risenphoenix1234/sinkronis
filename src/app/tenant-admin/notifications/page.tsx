// src/app/tenant-admin/notifications/page.tsx
export default function TenantNotificationsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <p className="text-sm text-slate-500">
        Static notification settings and sample notifications.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-3">
          <h2 className="text-sm font-semibold">Preferences</h2>
          <div className="flex items-center justify-between">
            <span>Email notifications</span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
              Enabled
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>In-app alerts</span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
              Enabled
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-2">
          <h2 className="text-sm font-semibold">Recent notifications</h2>
          <div className="rounded border border-slate-100 px-3 py-2">
            New employee invite sent to <b>chika@example.com</b>.
          </div>
          <div className="rounded border border-slate-100 px-3 py-2">
            Payroll run for May 2026 completed.
          </div>
        </div>
      </div>
    </section>
  );
}
