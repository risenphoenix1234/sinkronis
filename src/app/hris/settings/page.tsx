// src/app/hris/settings/page.tsx
export default function HRISSettingsPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">HRIS Settings</h1>
      <p className="text-sm text-slate-500">
        Static placeholder for HRIS-specific configuration.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-3">
        <p className="text-slate-500">
          Configure things like default work schedules, probation periods and HR
          workflows here later.
        </p>
      </div>
    </section>
  );
}
