// src/app/payroll/payees/page.tsx
export default function PayrollPayeesPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Payees</h1>
      <p className="text-sm text-slate-500">
        Static list of employees and other payees.
      </p>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Bank</th>
              <th className="px-4 py-2">Account</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">Bisi Adeyemi</td>
              <td className="px-4 py-2">Employee</td>
              <td className="px-4 py-2">GTBank</td>
              <td className="px-4 py-2">0123456789</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">XYZ Consulting</td>
              <td className="px-4 py-2">Contractor</td>
              <td className="px-4 py-2">Access Bank</td>
              <td className="px-4 py-2">9876543210</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
