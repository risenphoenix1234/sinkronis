// src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Enter your email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const slug = organizationSlug.trim();
      await forgotPassword({
        email: trimmedEmail,
        ...(slug ? { organizationSlug: slug } : {}),
      });
      const params = new URLSearchParams({ email: trimmedEmail });
      if (slug) params.set("org", slug);
      router.push(`/otp-verification?${params.toString()}`);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Couldn't send the reset code.")
          : "Couldn't send the reset code.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E9F0] bg-white p-8">
        <h1 className="text-[28px] font-bold text-[#1F2937]">Forgot password</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#667085]">
          Enter your email and we'll send a code to reset your password.
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
              Organization
            </label>
            <input
              type="text"
              value={organizationSlug}
              onChange={(e) => setOrganizationSlug(e.target.value)}
              placeholder="your-organization"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
            <p className="mt-1.5 text-[12px] text-[#667085]">
              Required only if your email belongs to more than one organization.
            </p>
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handleSendCode}
            disabled={loading}
            className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset code"}
          </button>
        </div>

        <p className="mt-5 text-center text-[13px] text-[#667085]">
          <Link href="/login" className="hover:text-[#2388D0] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}