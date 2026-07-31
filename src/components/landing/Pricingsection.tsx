"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

type Plan = {
  name: string;
  subtitle: string;
  price: string;
  features: string[];
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "HRIS",
    subtitle: "Human Resource Information System",
    price: "₦80,000",
    features: [
      "Employee management & profiles",
      "Attendance & biometric integration",
      "Leave management & approvals",
      "Appraisal & OKR-based reviews",
      "Conduct & disciplinary tracking",
      "Organisation setup (departments, branches)",
    ],
  },
  {
    name: "Payroll",
    subtitle: "Payroll Processing",
    price: "₦10,000",
    features: [
      "Salary computation & pay runs",
      "PAYE & WHT tax management",
      "Pension & statutory remittances",
      "Payslip generation",
      "Deductions & loan management",
      "Wallet for disbursements",
    ],
  },
  {
    name: "Accounting",
    subtitle: "Accounting & Finance",
    price: "₦80,000",
    features: [
      "Client & invoice management",
      "VAT & WHT tax compliance",
      "Expense tracking",
      "Sales agent management",
      "Payment requests & approvals",
      "Financial reports & P&L",
    ],
  },
  {
    name: "All-in-One",
    subtitle: "Complete Suite — HRIS + Payroll + Accounting",
    price: "₦150,000",
    highlight: true,
    features: [
      "Everything in HRIS",
      "Everything in Payroll",
      "Everything in Accounting",
      "Single unified dashboard",
      "Cross-module reporting",
      "Priority support",
    ],
  },
];

export default function Pricing() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const togglePlan = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

 const handleProceed = () => {
  if (selected.length === 0) return;
  const params = encodeURIComponent(selected.join(","));
  router.push(`/register?plans=${params}`);
};

  return (
    <section id="pricing" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-[1440px] lg:px-[80px]">
        {/* Heading */}
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[44px] font-bold leading-[52px] text-[#1F2937]">
            Simple, transparent pricing
          </h2>
          <p className="mt-5 text-[18px] leading-[28px] text-[#667085]">
            No set up fee, no hidden charge, subscribe based on your business
            need
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const isSelected = selected.includes(plan.name);
            return (
              <div
                key={plan.name}
                className={`flex h-full flex-col rounded-2xl bg-white transition ${
                  plan.highlight
                    ? "border-2 border-[#2388D0] pt-0"
                    : isSelected
                    ? "border-2 border-[#2388D0] p-8"
                    : "border border-[#E5E9F0] p-8"
                } ${isSelected ? "ring-2 ring-[#2388D0]/20" : ""}`}
              >
                {/* Best value badge */}
                {plan.highlight && (
                  <div className="rounded-t-xl bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] py-2.5 text-center">
                    <span className="text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                      Best Value — All-in-One
                    </span>
                  </div>
                )}

                <div className={plan.highlight ? "flex flex-1 flex-col p-8" : "flex flex-1 flex-col"}>
                  {/* Name + subtitle */}
                  <h3 className="text-[22px] font-bold text-[#2388D0]">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-[14px] text-[#98A2B3]">
                    {plan.subtitle}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-[36px] font-extrabold text-[#1F2937]">
                      {plan.price}
                    </span>
                    <span className="text-[15px] text-[#98A2B3]">/month</span>
                  </div>

                  {/* Features */}
                  <div className="mt-7 flex flex-col gap-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[#2388D0]">
                          <Check className="h-3 w-3 text-[#2388D0]" strokeWidth={3} />
                        </span>
                        <span className="text-[15px] leading-[22px] text-[#475467]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Select toggle — pinned to bottom via mt-auto so all four align */}
                  <button
                    type="button"
                    onClick={() => togglePlan(plan.name)}
                    aria-pressed={isSelected}
                    className="mt-auto pt-8"
                  >
                    <span
                      className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-lg border-2 font-semibold transition ${
                        isSelected
                          ? "border-[#2388D0] bg-[#2388D0] text-white"
                          : "border-[#2388D0] text-[#2388D0] hover:bg-[#2388D0] hover:text-white"
                      }`}
                    >
                      {isSelected && <Check className="h-4 w-4" strokeWidth={3} />}
                      {isSelected ? "Selected" : "Select"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unified proceed CTA */}
        <div className="mt-12 flex flex-col items-center gap-3">
          {selected.length > 0 && (
            <p className="text-[14px] text-[#667085]">
              {selected.length} plan{selected.length > 1 ? "s" : ""} selected:{" "}
              <span className="font-semibold text-[#1F2937]">
                {selected.join(", ")}
              </span>
            </p>
          )}
          <button
            type="button"
            onClick={handleProceed}
            disabled={selected.length === 0}
            className={`flex h-[56px] w-full max-w-[400px] items-center justify-center rounded-lg px-8 font-semibold text-white transition ${
              selected.length === 0
                ? "cursor-not-allowed bg-[#98A2B3]"
                : "bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] hover:opacity-90"
            }`}
          >
            Proceed to Get Started
          </button>
        </div>
      </div>
    </section>
  );
}