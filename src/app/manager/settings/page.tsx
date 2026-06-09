// src/app/manager/settings/page.tsx
export default function ManagerSettingsPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Manager Settings</h1>
      <p className="text-sm text-slate-500">
        Static preferences specific to your manager workspace.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-3">
        <div>
          <div className="text-xs text-slate-500">Notification level</div>
          <div className="font-medium">Only approvals &amp; escalations</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Default view</div>
          <div className="font-medium">Team overview</div>
        </div>
      </div>
    </section>
  );
}
