"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { login, employeeLogin } from "@/lib/api/auth";

type LoginMode = "admin" | "employee";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("admin");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [needsCompanyId, setNeedsCompanyId] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "employee") setMode("employee");
      if (params.get("expired") === "true") {
        setError("Your session has expired. Please sign in again.");
      }
    }
  }, []);

  const switchMode = (next: LoginMode) => {
    if (loading || next === mode) return;
    setMode(next);
    setEmail("");
    setPassword("");
    setOrganizationSlug("");
    setShowPassword(false);
    setError(null);
    setEmailError(null);
    setPasswordError(null);
  };

  const validate = (): boolean => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setEmailError("Please enter a valid email address");
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setError(null);
    setLoading(true);

    try {
      const res =
        mode === "admin"
          ? await login({
              organizationSlug,
              email: email.trim(),
              password,
            })
               : await employeeLogin({
              ...(organizationSlug.trim()
                ? { organizationSlug: organizationSlug.trim() }
                : {}),
              email: email.trim(),
              password,
            });

      localStorage.setItem("accessToken", res.tokens.accessToken);
      localStorage.setItem("refreshToken", res.tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.user));

      if (mode === "admin") {
        if (res.user.accountType === "PLATFORM_ADMIN") {
          router.push("/platform-admin/tenants");
        } else {
          router.push("/tenant-admin/overview");
        }
      } else {
        if (res.user.accountType === "PLATFORM_ADMIN") {
          window.location.href = "/platform-admin/tenants";
        } else {
          window.location.href = "/employee/dashboard";
        }
      }
    } catch (err: any) {
      const apiMessage: string | undefined = err?.response?.data?.message;
      if (apiMessage && /multiple organizations/i.test(apiMessage)) {
        setNeedsCompanyId(true);
        setError(
          "This email is used in more than one company. Enter your Company ID below.",
        );
      } else {
        setError(apiMessage || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E9F0] bg-white p-8">
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-[#F7F9FC] p-1">
          <button
            type="button"
            onClick={() => switchMode("admin")}
            disabled={loading}
            className={`rounded-md py-2 text-[13px] font-medium transition disabled:cursor-not-allowed ${
              mode === "admin"
                ? "bg-white text-[#2183C6] shadow-sm"
                : "text-[#667085] hover:text-[#344054]"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => switchMode("employee")}
            disabled={loading}
            className={`rounded-md py-2 text-[13px] font-medium transition disabled:cursor-not-allowed ${
              mode === "employee"
                ? "bg-white text-[#2183C6] shadow-sm"
                : "text-[#667085] hover:text-[#344054]"
            }`}
          >
            Employee
          </button>
        </div>

        {mode === "employee" && (
          <span className="mb-2 inline-block rounded-md bg-[#2183C6]/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#2183C6]">
            Employee Portal
          </span>
        )}
        <h1 className="text-[28px] font-bold text-[#1F2937]">Sign in</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#667085]">
          {mode === "admin"
            ? "Sign in to your Sinkronis account."
            : "Sign in to your employee account to view your dashboard, attendance, and payslips."}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          {(mode === "admin" || needsCompanyId) && (
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
                Company ID
              </label>
              <input
                type="text"
                value={organizationSlug}
                onChange={(e) => setOrganizationSlug(e.target.value)}
                disabled={loading}
                placeholder="e.g. acme-logistics"
                className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              disabled={loading}
              placeholder="you@company.com"
              autoComplete="email"
              className={`w-full rounded-lg border px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                emailError
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                  : "border-[#E5E9F0] focus:border-[#2388D0] focus:ring-[#2388D0]/15"
              }`}
            />
            {emailError && (
              <p className="mt-1 text-[12px] text-red-500">{emailError}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                disabled={loading}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full rounded-lg border px-4 py-3 pr-11 text-[15px] text-[#1F2937] outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                  passwordError
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                    : "border-[#E5E9F0] focus:border-[#2388D0] focus:ring-[#2388D0]/15"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#475467] disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-[12px] text-red-500">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-5 flex justify-between text-[13px] text-[#667085]">
          <Link
            href="/forgot-password"
            className="hover:text-[#2388D0] hover:underline"
          >
            Forgot password?
          </Link>
          {mode === "admin" && (
            <Link
              href="/register"
              className="hover:text-[#2388D0] hover:underline"
            >
              Create account
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}