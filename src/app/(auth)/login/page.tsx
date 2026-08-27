"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const handleSignIn = async () => {
  setError(null);
  setLoading(true);
  try {
    const res = await login({ organizationSlug, email, password });
    localStorage.setItem("accessToken", res.tokens.accessToken);
    localStorage.setItem("refreshToken", res.tokens.refreshToken);

    if (res.user.accountType === "PLATFORM_ADMIN") {
      router.push("/platform-admin/tenants");
    } else {
      router.push("/tenant-admin/overview");
    }
  } catch (err: any) {
    setError(
      err?.response?.data?.message || "Invalid credentials. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E9F0] bg-white p-8">
        <h1 className="text-[28px] font-bold text-[#1F2937]">Sign in</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#667085]">
          Sign in to your Sinkronis account.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              Organization
            </label>
            <input
              type="text"
              value={organizationSlug}
              onChange={(e) => setOrganizationSlug(e.target.value)}
              placeholder="acme-logistics"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
          </div> */}

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              Company ID
            </label>
            <input
              type="text"
              value={organizationSlug}
              onChange={(e) => setOrganizationSlug(e.target.value)}
              placeholder="e.g. acme-logistics"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
          </div>

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

          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="mt-5 flex justify-between text-[13px] text-[#667085]">
          <Link
            href="/forgot-password"
            className="hover:text-[#2388D0] hover:underline"
          >
            Forgot password?
          </Link>
          <Link
            href="/register"
            className="hover:text-[#2388D0] hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
