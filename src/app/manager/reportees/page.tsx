// src/app/manager/reportees/page.tsx
export default function ManagerReporteesPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Reportees</h1>
      <p className="text-sm text-slate-500">
        Static list of team members who report to you.
      </p>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">Chika Nwosu</td>
              <td className="px-4 py-2">Software Engineer</td>
              <td className="px-4 py-2">Technology</td>
              <td className="px-4 py-2">Active</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Emeka Uche</td>
              <td className="px-4 py-2">Product Designer</td>
              <td className="px-4 py-2">Product</td>
              <td className="px-4 py-2">On leave</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
