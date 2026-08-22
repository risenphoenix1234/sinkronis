"use client";

import AllowanceTypes from "@/components/payroll/payroll-settings/AllowanceTypes";
import DeductionTypes from "@/components/payroll/payroll-settings/DeductionTypes";
import PayPeriods from "@/components/payroll/payroll-settings/PayPeriods";
import StatutoryRates from "@/components/payroll/payroll-settings/StatutoryRates";
import { useState } from "react";

const menuItems = [
  "Pay Periods",
  "Allowance Types",
  "Deduction Types",
  "Statutory Rates",
];

export default function PayrollSettingsPage() {
  const [activeItem, setActiveItem] = useState("Pay Periods");

  const renderContent = () => {
    switch (activeItem) {
      case "Allowance Types":
        return <AllowanceTypes />;

      case "Pay Periods":
        return <PayPeriods />;

      case "Deduction Types":
        return <DeductionTypes />;

      case "Statutory Rates":
        return <StatutoryRates />;

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen  bg-[#f8f9fa] text-[#53677a]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[212px] shrink-0 px-8 pt-11">
          <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#9aa9b7]">
            Payroll Settings
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeItem === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className={`flex h-9 w-[172px] items-center rounded-md px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#e2f2fc] text-[#2089cc]"
                      : "text-[#5d7184] hover:bg-[#eef5f9]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1 px-1 pr-5 pt-11">{renderContent()}</section>
      </div>
    </main>
  );
}
