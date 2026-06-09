// src/app/payroll/tax/page.tsx
export default function PayrollTaxPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Tax</h1>
      <p className="text-sm text-slate-500">
        Static placeholder for PAYE and other payroll taxes.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm">
        <p className="text-slate-500">
          Use this later to show tax computations, remittance status and state
          breakdowns.
        </p>
      </div>
    </section>
  );
}
