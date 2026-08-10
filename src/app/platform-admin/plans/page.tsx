// src/app/platform-admin/pricing-plans/page.tsx
"use client";

import { Users, Zap, Calculator, Layers } from "lucide-react";

interface PlanCard {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  price: number;
  priceSuffix?: string;
  description: string;
  features: string[];
  tenants: number;
  monthlyRevenue: number;
  bestValue?: boolean;
}

const plans: PlanCard[] = [
  {
    id: "hris",
    name: "HRIS",
    subtitle: "Human Resource Information System",
    icon: Users,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    price: 80000,
    description:
      "Employee lifecycle, attendance, leave tracking, approvals, and conduct management.",
    features: [
      "Employee management & profiles",
      "Attendance & biometric integration",
      "Leave management & approvals",
      "Appraisal & OKR-based reviews",
      "Conduct & disciplinary tracking",
      "Organisation setup (departments, branches)",
    ],
    tenants: 18,
    monthlyRevenue: 1440000,
  },
  {
    id: "payroll",
    name: "Payroll",
    subtitle: "Payroll Processing",
    icon: Zap,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    price: 10000,
    priceSuffix: "+ ₦50 per employee",
    description: "Salary computation, PAYE & pension deductions, payslips, and disbursements.",
    features: [
      "Salary computation & pay runs",
      "PAYE & WHT tax management",
      "Pension & statutory remittances",
      "Payslip generation",
      "Deductions & loan management",
      "Wallet for disbursements",
    ],
    tenants: 12,
    monthlyRevenue: 480000,
  },
  {
    id: "accounting",
    name: "Accounting",
    subtitle: "Accounting & Finance",
    icon: Calculator,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    price: 80000,
    description:
      "Invoicing, VAT & WHT compliance, expense tracking, agents, and financial reports.",
    features: [
      "Client & invoice management",
      "VAT & WHT tax compliance",
      "Expense tracking",
      "Sales agent management",
      "Payment requests & approvals",
      "Financial reports & P&L",
    ],
    tenants: 14,
    monthlyRevenue: 1120000,
  },
  {
    id: "all-in-one",
    name: "All-in-One",
    subtitle: "Complete Suite — HRIS + Payroll + Accounting",
    icon: Layers,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    price: 150000,
    description:
      "The full Sinkronis platform. All three modules in one subscription at a bundled rate.",
    features: [
      "Everything in HRIS",
      "Everything in Payroll",
      "Everything in Accounting",
      "Single unified dashboard",
      "Cross-module reporting",
      "Priority support",
    ],
    tenants: 7,
    monthlyRevenue: 1050000,
    bestValue: true,
  },
];

const totalMonthlyRevenue = plans.reduce((sum, p) => sum + p.monthlyRevenue, 0);
const totalTenants = plans.reduce((sum, p) => sum + p.tenants, 0);

const distributionBarColors: Record<string, string> = {
  hris: "bg-green-500",
  payroll: "bg-blue-500",
  accounting: "bg-amber-500",
  "all-in-one": "bg-purple-500",
};

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function PricingPlansPage() {
  return (
    <section className="space-y-4 bg-slate-50 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Pricing & Plans
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage subscription tiers and module pricing
          </p>
        </div>
        <button className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Create Plan
        </button>
      </div>

      {/* Revenue summary bar */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Total Monthly Revenue</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatNaira(totalMonthlyRevenue)}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-2 sm:min-w-[320px]">
            <div className="flex h-2 w-full overflow-hidden rounded-full">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={distributionBarColors[plan.id]}
                  style={{
                    width: `${(plan.monthlyRevenue / totalMonthlyRevenue) * 100}%`,
                  }}
                  title={`${plan.name} — ${formatNaira(plan.monthlyRevenue)}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              {plans.map((plan) => (
                <span key={plan.id} className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${distributionBarColors[plan.id]}`}
                  />
                  {plan.name} — {formatNaira(plan.monthlyRevenue)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`overflow-hidden rounded-lg border bg-white shadow-sm ${
              plan.bestValue ? "border-purple-200" : "border-slate-200"
            }`}
          >
            {plan.bestValue && (
              <div className="bg-purple-600 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-white">
                Best Value — All-in-One
              </div>
            )}

            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${plan.iconBg}`}
                  >
                    <plan.icon className={`h-5 w-5 ${plan.iconColor}`} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500">{plan.subtitle}</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                  {plan.tenants} tenants
                </span>
              </div>

              <div className="mt-4">
                <span className="text-2xl font-bold text-slate-900">
                  {formatNaira(plan.price)}
                </span>
                <span className="text-sm text-slate-500">/month</span>
                {plan.priceSuffix && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {plan.priceSuffix}
                  </p>
                )}
              </div>

              <p className="mt-3 text-sm text-slate-600">{plan.description}</p>

              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="mt-0.5 text-green-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">
                  Monthly revenue —{" "}
                  <span className="font-medium text-slate-700">
                    {formatNaira(plan.monthlyRevenue)}
                  </span>
                </p>
                <button className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  Edit Price
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription distribution table */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          Subscription Distribution
        </h3>
        <p className="text-xs text-slate-500">
          Tenants per module and revenue contribution
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="py-2 font-medium">Module</th>
                <th className="py-2 font-medium">Base Price</th>
                <th className="py-2 font-medium">Per Employee</th>
                <th className="py-2 font-medium">Active Tenants</th>
                <th className="py-2 font-medium">Monthly Revenue</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b border-slate-50">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-md ${plan.iconBg}`}
                      >
                        <plan.icon className={`h-3.5 w-3.5 ${plan.iconColor}`} />
                      </span>
                      <span className="font-medium text-slate-800">
                        {plan.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600">
                    {formatNaira(plan.price)}/mo
                  </td>
                  <td className="py-3 text-slate-600">
                    {plan.priceSuffix ? "₦50/employee" : "—"}
                  </td>
                  <td className="py-3 text-slate-700">{plan.tenants}</td>
                  <td className="py-3 font-medium text-green-700">
                    {formatNaira(plan.monthlyRevenue)}/mo
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-3 font-semibold text-slate-800" colSpan={3}>
                  {totalTenants} total
                </td>
                <td />
                <td className="py-3 font-semibold text-brand-600">
                  {formatNaira(totalMonthlyRevenue)}/mo
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
