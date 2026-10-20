// src/app/(auth)/reset-password/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { resetPassword } from "@/lib/api/auth";

const RESET_TOKEN_KEY = "passwordResetToken";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem(RESET_TOKEN_KEY)) {
      router.replace("/forgot-password");
    }
  }, [router]);

  const handleReset = async () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    const resetToken = sessionStorage.getItem(RESET_TOKEN_KEY);
    if (!resetToken) {
      router.replace("/forgot-password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword({ resetToken, password, confirmPassword });
      sessionStorage.removeItem(RESET_TOKEN_KEY);
      router.push("/login");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Couldn't reset your password.")
          : "Couldn't reset your password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E9F0] bg-white p-8">
        <h1 className="text-[28px] font-bold text-[#1F2937]">Reset password</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#667085]">
          Choose a new password for your account.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </div>
      </div>
    </main>
  );
}