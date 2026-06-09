// src/app/platform-admin/profile/page.tsx
export default function PlatformAdminProfilePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="text-sm text-slate-500">
        Static profile settings for the platform admin.
      </p>
      <div className="rounded-lg bg-white p-4 shadow-sm space-y-3 text-sm">
        <div>
          <div className="text-xs text-slate-500">Name</div>
          <div className="font-medium">Platform Super Admin</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Email</div>
          <div className="font-medium">admin@example.com</div>
        </div>
      </div>
    </section>
  );
}
