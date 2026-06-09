// src/app/(auth)/register/page.tsx
export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-1 text-2xl font-semibold">Register</h1>
        <p className="mb-4 text-sm text-slate-500">
          Static registration form – no backend.
        </p>
        <form className="space-y-3">
          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
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
            Create account (static)
          </button>
        </form>
      </div>
    </main>
  );
}
