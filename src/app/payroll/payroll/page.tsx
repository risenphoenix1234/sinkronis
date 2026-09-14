// src/app/payroll/payroll/page.tsx
export default function PayrollRunPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Payroll Runs</h1>
      <p className="text-sm text-slate-500">
        Static list of recent payroll runs and their status.
      </p>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Period</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Total (₦)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">May 2026</td>
              <td className="px-4 py-2">Completed</td>
              <td className="px-4 py-2">45,000,000</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">April 2026</td>
              <td className="px-4 py-2">Completed</td>
              <td className="px-4 py-2">43,200,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
