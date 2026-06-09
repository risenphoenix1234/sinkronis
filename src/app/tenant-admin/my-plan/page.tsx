// src/app/tenant-admin/my-plan/page.tsx
export default function TenantMyPlanPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">My Plan</h1>
      <p className="text-sm text-slate-500">
        Static subscription details for this tenant.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm space-y-3">
        <div>
          <div className="text-xs text-slate-500">Current plan</div>
          <div className="font-medium">Growth</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Billing cycle</div>
          <div className="font-medium">Monthly</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Seats</div>
          <div className="font-medium">200</div>
        </div>
      </div>
    </section>
  );
}
