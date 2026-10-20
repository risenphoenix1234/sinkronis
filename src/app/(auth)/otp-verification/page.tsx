// src/app/(auth)/otp-verification/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { forgotPassword, verifyResetOtp } from "@/lib/api/auth";

const RESET_TOKEN_KEY = "passwordResetToken";

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const organizationSlug = searchParams.get("org") ?? "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleVerify = async () => {
    if (!email) {
      setError("Start again from the forgot password page.");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code.");
      return;
    }
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await verifyResetOtp({
        email,
        otp,
        ...(organizationSlug ? { organizationSlug } : {}),
      });
      sessionStorage.setItem(RESET_TOKEN_KEY, res.resetToken);
      router.push("/reset-password");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Couldn't verify the code.")
          : "Couldn't verify the code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError("");
    setInfo("");
    setResending(true);
    try {
      await forgotPassword({
        email,
        ...(organizationSlug ? { organizationSlug } : {}),
      });
      setInfo("A new code has been sent.");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Couldn't resend the code.")
          : "Couldn't resend the code.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E9F0] bg-white p-8">
        <h1 className="text-[28px] font-bold text-[#1F2937]">Verify your email</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#667085]">
          {email
            ? `Enter the 6-digit code sent to ${email}.`
            : "Enter the 6-digit code sent to your email."}
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              Verification code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-center text-[20px] tracking-[0.4em] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}
          {info && <p className="text-[13px] text-green-600">{info}</p>}

          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>

          <p className="text-center text-[13px] text-[#667085]">
            Didn't get a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-medium text-[#2388D0] hover:underline disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={null}>
      <OtpForm />
    </Suspense>
  );
}