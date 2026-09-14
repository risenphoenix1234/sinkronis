// src/app/employee/settings/page.tsx
export default function EmployeeSettingsPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">My Settings</h1>
      <p className="text-sm text-slate-500">
        Static personal preferences for your account.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-3">
        <div>
          <div className="text-xs text-slate-500">Notification channel</div>
          <div className="font-medium">Email &amp; in-app</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Language</div>
          <div className="font-medium">English (Nigeria)</div>
        </div>
      </div>
    </section>
  );
}
