// src/app/tenant-admin/settings/page.tsx
export default function TenantSettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-slate-500">
        Miscellaneous static configuration for this tenant.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-3">
        <div>
          <div className="text-xs text-slate-500">Timezone</div>
          <div className="font-medium">Africa/Lagos</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Date format</div>
          <div className="font-medium">DD/MM/YYYY</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Demo mode</div>
          <div className="font-medium">Enabled (static)</div>
        </div>
      </div>
    </section>
  );
}
