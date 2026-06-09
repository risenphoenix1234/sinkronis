// src/app/tenant-admin/roles-permissions/page.tsx
export default function TenantRolesPermissionsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Roles &amp; Permissions</h1>
      <p className="text-sm text-slate-500">
        Static view of roles and their access levels. Wire this to your RBAC
        engine later.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Tenant Admin</h2>
          <p className="mt-1 text-xs text-slate-500">
            Full access to all modules and settings.
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">HR</h2>
          <p className="mt-1 text-xs text-slate-500">
            Manages employees, attendance, leave and appraisals.
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Manager</h2>
          <p className="mt-1 text-xs text-slate-500">
            Manages reportees and approvals for leave and appraisals.
          </p>
        </div>
      </div>
    </section>
  );
}
