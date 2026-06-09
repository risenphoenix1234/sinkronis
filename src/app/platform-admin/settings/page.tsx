// src/app/platform-admin/settings/page.tsx
export default function PlatformAdminSettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-slate-500">
        Platform-wide static settings page.
      </p>
      <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-3">
        <div>
          <div className="text-xs text-slate-500">Brand name</div>
          <div className="font-medium">Acme HR Platform</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Primary color</div>
          <div className="font-medium">Slate</div>
        </div>
      </div>
    </section>
  );
}
