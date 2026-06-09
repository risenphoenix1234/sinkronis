// src/app/tenant-admin/general-settings/page.tsx
export default function TenantGeneralSettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">General Settings</h1>
      <p className="text-sm text-slate-500">
        Tenant-wide defaults such as locale and working days (static).
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-3">
        <div>
          <div className="text-xs text-slate-500">Company name</div>
          <div className="font-medium">Acme Nigeria Ltd</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Default currency</div>
          <div className="font-medium">NGN</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Work week</div>
          <div className="font-medium">Monday - Friday</div>
        </div>
      </div>
    </section>
  );
}
