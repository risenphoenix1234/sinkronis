// src/app/platform-admin/wallet/page.tsx
export default function PlatformAdminWalletPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Wallet</h1>
      <p className="text-sm text-slate-500">
        Static wallet balance and transactions.
      </p>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="text-xs text-slate-500">Current Balance</div>
        <div className="mt-1 text-3xl font-bold">₦2,450,000</div>
      </div>
    </section>
  );
}
