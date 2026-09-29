// src/app/hr/employee/page.tsx
export default function HREmployeePage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Employees</h1>
      <p className="text-sm text-slate-500">
        Static employee directory view managed by HR.
      </p>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">Adaeze Obi</td>
              <td className="px-4 py-2">HR Business Partner</td>
              <td className="px-4 py-2">HR</td>
              <td className="px-4 py-2">Active</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Kunle Adebayo</td>
              <td className="px-4 py-2">Accountant</td>
              <td className="px-4 py-2">Finance</td>
              <td className="px-4 py-2">Probation</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
