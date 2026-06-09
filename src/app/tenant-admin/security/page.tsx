// src/app/tenant-admin/security/page.tsx
export default function TenantSecurityPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Security</h1>
      <p className="text-sm text-slate-500">
        Static security preferences such as MFA and password policies.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Multi-factor authentication</div>
            <div className="text-xs text-slate-500">
              Require OTP on every login.
            </div>
          </div>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
            Enabled
          </span>
        </div>

        <div>
          <div className="font-medium">Password policy</div>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-500">
            <li>Minimum 8 characters</li>
            <li>At least one number and symbol</li>
            <li>Expires every 90 days</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
