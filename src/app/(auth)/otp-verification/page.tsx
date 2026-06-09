// src/app/(auth)/otp-verification/page.tsx
export default function OtpVerificationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-semibold">OTP Verification</h1>
        <p className="mb-4 text-sm text-slate-500">
          Static OTP screen – no real validation.
        </p>
        <form className="space-y-3">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="w-full rounded bg-slate-900 py-2 text-sm font-medium text-white"
          >
            Verify (static)
          </button>
        </form>
      </div>
    </main>
  );
}
