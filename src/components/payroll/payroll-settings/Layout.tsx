import Link from "next/link";
import { ReactNode } from "react";

const menuItems = [
  {
    label: "Pay Periods",
    href: "/payroll-settings/pay-periods",
  },
  {
    label: "Allowance Types",
    href: "/payroll-settings/allowance-types",
  },
  {
    label: "Deduction Types",
    href: "/payroll-settings/deduction-types",
  },
  {
    label: "Statutory Rates",
    href: "/payroll-settings/statutory-rates",
  },
];

export default function PayrollSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#53677a]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[212px] shrink-0 px-5 pt-7">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9aa9b7]">
            Payroll Settings
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-9 w-[169px] items-center rounded-md px-3 text-sm font-medium text-[#5d7184] transition-colors hover:bg-[#eef5f9]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Page content */}
        <section className="flex-1 pr-6 pt-7">{children}</section>
      </div>
    </main>
  );
}
