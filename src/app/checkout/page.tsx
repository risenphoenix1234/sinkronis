// src/app/checkout/page.tsx
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, CreditCard } from "lucide-react";

const PLAN_PRICES: Record<string, string> = {
  HRIS: "₦80,000",
  Payroll: "₦10,000",
  Accounting: "₦80,000",
  "All-in-One": "₦150,000",
};

// Maps pricing-plan names to dashboard module ids
const PLAN_TO_MODULES: Record<string, string[]> = {
  HRIS: ["hris"],
  Payroll: ["payroll"],
  Accounting: ["accounting"],
  "All-in-One": ["hris", "payroll", "accounting"],
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plans = searchParams.get("plans")?.split(",").filter(Boolean) ?? [];

  const moduleIds = Array.from(
    new Set(plans.flatMap((p) => PLAN_TO_MODULES[p] ?? []))
  );

  const total = plans.reduce((sum, p) => {
    const price = PLAN_PRICES[p];
    if (!price) return sum;
    return sum + Number(price.replace(/[₦,]/g, ""));
  }, 0);

  const handlePay = () => {
    // Mock payment — no backend. Straight to the dashboard with paid modules.
    router.push(`/dashboard?modules=${encodeURIComponent(moduleIds.join(","))}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E9F0] bg-white p-8">
        <h1 className="text-[28px] font-bold text-[#1F2937]">Complete payment</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#667085]">
          Static checkout — no card is actually charged.
        </p>

        {/* Order summary */}
        <div className="mb-6 rounded-xl border border-[#E5E9F0] p-5">
          {plans.map((plan) => (
            <div key={plan} className="flex items-center justify-between py-1.5">
              <span className="flex items-center gap-2 text-[14px] text-[#475467]">
                <Check className="h-3.5 w-3.5 text-[#2388D0]" strokeWidth={3} />
                {plan}
              </span>
              <span className="text-[14px] font-medium text-[#1F2937]">
                {PLAN_PRICES[plan] ?? "—"}
              </span>
            </div>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-[#E5E9F0] pt-3">
            <span className="text-[15px] font-semibold text-[#1F2937]">Total</span>
            <span className="text-[18px] font-bold text-[#2388D0]">
              ₦{total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Static card fields */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
              Card number
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-[#E5E9F0] px-4 py-3">
              <CreditCard className="h-4 w-4 text-[#98A2B3]" />
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full text-[15px] text-[#1F2937] outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
            <input
              type="text"
              placeholder="CVC"
              className="w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15"
            />
          </div>

          <button
            type="button"
            onClick={handlePay}
            className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90"
          >
            Pay ₦{total.toLocaleString()}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}