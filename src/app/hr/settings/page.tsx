// src/app/hr/settings/page.tsx
export default function HRSettingsPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">HR Settings</h1>
      <p className="text-sm text-slate-500">
        Static configuration specific to HR processes.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-3">
        <div>
          <div className="text-xs text-slate-500">Default probation period</div>
          <div className="font-medium">3 months</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Leave year</div>
          <div className="font-medium">January – December</div>
        </div>
      </div>
    </section>
  );
}
