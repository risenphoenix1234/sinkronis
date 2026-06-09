// src/app/tenant-admin/user-management/page.tsx
export default function TenantUserManagementPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">User Management</h1>
      <p className="text-sm text-slate-500">
        Static list of users within this tenant. Later you can hook this to your
        real user directory.
      </p>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">Ngozi Okafor</td>
              <td className="px-4 py-2">ngozi.okafor@example.com</td>
              <td className="px-4 py-2">HR Admin</td>
              <td className="px-4 py-2">Active</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Tunde Balogun</td>
              <td className="px-4 py-2">tunde.balogun@example.com</td>
              <td className="px-4 py-2">Manager</td>
              <td className="px-4 py-2">Invited</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
