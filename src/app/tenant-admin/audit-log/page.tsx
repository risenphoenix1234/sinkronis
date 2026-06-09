// src/app/tenant-admin/audit-log/page.tsx
export default function TenantAuditLogPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Audit Log</h1>
      <p className="text-sm text-slate-500">
        Static example of key actions performed by users.
      </p>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Module</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">2026-06-01 10:12</td>
              <td className="px-4 py-2">Ngozi Okafor</td>
              <td className="px-4 py-2">Updated organisation settings</td>
              <td className="px-4 py-2">Tenant Admin</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">2026-06-01 09:35</td>
              <td className="px-4 py-2">Tunde Balogun</td>
              <td className="px-4 py-2">Invited new employee</td>
              <td className="px-4 py-2">HRIS</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
