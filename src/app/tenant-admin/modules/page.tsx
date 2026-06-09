// src/app/tenant-admin/modules/page.tsx
export default function TenantModulesPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Modules</h1>
      <p className="text-sm text-slate-500">
        Static overview of enabled modules for this tenant.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { name: "HRIS", enabled: true },
          { name: "Payroll", enabled: true },
          { name: "Accounting", enabled: false },
          { name: "Performance", enabled: true },
          { name: "Compliance", enabled: false },
        ].map((mod) => (
          <div key={mod.name} className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold">{mod.name}</h2>
            <span
              className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                mod.enabled
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {mod.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
