// src/app/platform-admin/plans/page.tsx
export default function PlatformAdminPlansPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Plans</h1>
      <p className="text-sm text-slate-500">
        Static subscription plans – you can wire billing later.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {["Starter", "Growth", "Enterprise"].map((name, idx) => (
          <div key={name} className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="mt-1 text-xs text-slate-500">Static description.</p>
            <p className="mt-3 text-2xl font-bold">
              ₦{[50000, 150000, 500000][idx].toLocaleString()}
              <span className="text-xs font-normal text-slate-500">
                /month
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
