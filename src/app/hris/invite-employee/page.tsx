// src/app/hris/invite-employee/page.tsx
export default function HRISInviteEmployeePage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Invite Employee</h1>
      <p className="text-sm text-slate-500">
        Static placeholder for sending invitation emails to new employees.
      </p>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm">
        <p className="text-slate-500">
          Later, you can hook this to your auth service to send real invites and
          track statuses.
        </p>
      </div>
    </section>
  );
}
