// src/app/(auth)/setup-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { acceptTenantInvitation } from "@/lib/api/auth";

export default function SetupPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!token) {
      setError("This link is invalid or missing a token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await acceptTenantInvitation({ token, password, confirmPassword });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const validationErrors = err?.response?.data?.validationErrors;
      if (validationErrors && validationErrors.length > 0) {
        setError(validationErrors.map((v: any) => v.message).join(" "));
      } else {
        setError(
          err?.response?.data?.message || "This link may be invalid or expired."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E9F0] bg-white p-8">
        <h1 className="text-[28px] font-bold text-[#1F2937]">Set your password</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#667085]">
          Create a password to activate your Sinkronis workspace.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-[13px] text-emerald-600">
            Password created successfully. Redirecting to login...
          </div>
        )}

        {!success && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 pr-11 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#475467]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Setting password..." : "Set Password"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}