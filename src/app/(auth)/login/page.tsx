// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // Static — no real auth yet. Sends you to the module picker.
    router.push("/modules");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E9F0] bg-white p-8">
        <h1 className="text-[28px] font-bold text-[#1F2937]">Sign in</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#667085]">
          Static form — no real auth yet.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
          </div>

          <button
            type="button"
            onClick={handleSignIn}
            className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90"
          >
            Sign in
          </button>
        </div>

        <div className="mt-5 flex justify-between text-[13px] text-[#667085]">
          <Link href="/forgot-password" className="hover:text-[#2388D0] hover:underline">
            Forgot password?
          </Link>
          <Link href="/register" className="hover:text-[#2388D0] hover:underline">
            Create account
          </Link>
        </div>

        <div className="mt-8 border-t border-[#E5E9F0] pt-5">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">
            Quick navigation
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/platform-admin/overview"
              className="rounded-full border border-[#E5E9F0] px-3 py-1.5 text-[12px] font-medium text-[#475467] transition hover:border-[#2388D0] hover:text-[#2388D0]"
            >
              Platform Admin
            </Link>
            <Link
              href="/tenant-admin/overview"
              className="rounded-full border border-[#E5E9F0] px-3 py-1.5 text-[12px] font-medium text-[#475467] transition hover:border-[#2388D0] hover:text-[#2388D0]"
            >
              Tenant Admin
            </Link>
            <Link
              href="/hris/overview"
              className="rounded-full border border-[#E5E9F0] px-3 py-1.5 text-[12px] font-medium text-[#475467] transition hover:border-[#2388D0] hover:text-[#2388D0]"
            >
              HRIS
            </Link>
            <Link
              href="/accounting/dashboard"
              className="rounded-full border border-[#E5E9F0] px-3 py-1.5 text-[12px] font-medium text-[#475467] transition hover:border-[#2388D0] hover:text-[#2388D0]"
            >
              Accounting
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}