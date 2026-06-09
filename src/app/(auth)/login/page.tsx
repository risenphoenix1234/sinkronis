// src/app/(auth)/login/page.tsx
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-1 text-2xl font-semibold">Login</h1>
        <p className="mb-4 text-sm text-slate-500">
          Static form – no real auth. Navigate to any dashboard via links.
        </p>

        <form className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="w-full rounded bg-slate-900 py-2 text-sm font-medium text-white"
          >
            Sign in (static)
          </button>
        </form>

        <div className="mt-4 flex justify-between text-xs text-slate-500">
          <Link href="/(auth)/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
          <Link href="/(auth)/register" className="hover:underline">
            Create account
          </Link>
        </div>

        <div className="mt-6 space-y-1 text-xs">
          <p className="font-semibold">Quick navigation:</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/platform-admin/overview"
              className="rounded bg-slate-100 px-2 py-1"
            >
              Platform Admin
            </Link>
            <Link
              href="/tenant-admin/overview"
              className="rounded bg-slate-100 px-2 py-1"
            >
              Tenant Admin
            </Link>
            <Link
              href="/hris/overview"
              className="rounded bg-slate-100 px-2 py-1"
            >
              HRIS
            </Link>
            <Link
              href="/accounting/dashboard"
              className="rounded bg-slate-100 px-2 py-1"
            >
              Accounting
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
