export default function PayrollSettingsPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Payroll Settings</h1>
      <p className="text-sm text-slate-500">
        Static configuration for payroll rules and defaults.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-3">
        <div>
          <div className="text-xs text-slate-500">Pay cycle</div>
          <div className="font-medium">Monthly</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Default bank</div>
          <div className="font-medium">First Bank of Nigeria</div>
        </div>
      </div>
    </section>
  );
}
