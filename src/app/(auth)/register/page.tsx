// src/app/(auth)/register/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plans = searchParams.get("plans")?.split(",").filter(Boolean) ?? [];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = () => {
    const params = encodeURIComponent(plans.join(","));
    router.push(`/checkout?plans=${params}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E9F0] bg-white p-8">
        <h1 className="text-[28px] font-bold text-[#1F2937]">Create your account</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#667085]">
          Just a few details to get you started.
        </p>

        {plans.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {plans.map((plan) => (
              <span
                key={plan}
                className="flex items-center gap-1.5 rounded-full border border-[#2388D0]/30 bg-[#EAF3FB] px-3 py-1.5 text-[12px] font-medium text-[#2388D0]"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
                {plan}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
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
            onClick={handleCreateAccount}
            className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}