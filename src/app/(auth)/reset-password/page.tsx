// src/app/(auth)/reset-password/page.tsx
export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-semibold">Reset password</h1>
        <p className="mb-4 text-sm text-slate-500">
          Static password reset – no persistence.
        </p>
        <form className="space-y-3">
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="w-full rounded bg-slate-900 py-2 text-sm font-medium text-white"
          >
            Reset (static)
          </button>
        </form>
      </div>
    </main>
  );
}
