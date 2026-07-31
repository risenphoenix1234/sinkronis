"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    router.push("/reset-password");
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
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-center text-[20px] tracking-[0.4em] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
          </div>

          <button
            type="button"
            onClick={handleVerify}
            className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90"
          >
            Verify code
          </button>
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