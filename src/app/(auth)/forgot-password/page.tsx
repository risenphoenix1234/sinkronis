// src/app/(auth)/forgot-password/page.tsx
export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-semibold">Forgot password</h1>
        <p className="mb-4 text-sm text-slate-500">
          Enter your email to receive a static OTP link.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="w-full rounded bg-slate-900 py-2 text-sm font-medium text-white"
          >
            Send OTP (static)
          </button>
        </form>
      </div>
    </main>
  );
}
