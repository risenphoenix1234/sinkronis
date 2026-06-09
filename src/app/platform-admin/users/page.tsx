// src/app/platform-admin/users/page.tsx
export default function PlatformAdminUsersPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="text-sm text-slate-500">
        Static user list for platform-level admins.
      </p>
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">Jane Doe</td>
              <td className="px-4 py-2">Super Admin</td>
              <td className="px-4 py-2">Active</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">John Smith</td>
              <td className="px-4 py-2">Support</td>
              <td className="px-4 py-2">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
