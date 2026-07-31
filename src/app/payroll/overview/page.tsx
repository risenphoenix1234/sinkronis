// src/app/payroll/overview/page.tsx
"use client";

import DashboardHeader from "@/components/payroll/overview/DashboardHeader";
import NotificationBanner from "@/components/payroll/overview/NotificationBanner";
import PayeeGroupChart from "@/components/payroll/overview/PayeeGroupChart";
import PayrollChart from "@/components/payroll/overview/PayrollChart";
import StatCard from "@/components/payroll/overview/StatCard";

export default function PayrollOverviewPage() {
  return (
    <section className="space-y-6 p-6">
      <main className="min-h-screen bg-[#F7F8FA] p-8">
        <DashboardHeader />

        <NotificationBanner />

        {/* Stat Cards */}

        <div className="mt-8 grid grid-cols-4 gap-5">
          <StatCard
            title="Total Payroll"
            amount="₦650,000"
            change="+2 since March"
            percentage="+8%"
            positive
          />

          <StatCard
            title="Total Employee"
            amount="60"
            change="+1 since March"
            percentage="+2.3%"
            positive
          />

          <StatCard
            title="Total Tax"
            amount="₦50,000"
            change="+3 since March"
            percentage="+12.2%"
            positive
          />

          <StatCard
            title="Total Pension"
            amount="₦70,000"
            change="-2 since March"
            percentage="-15%"
            positive={false}
          />
        </div>

        {/* Charts */}

        <div className="mt-10 grid grid-cols-3 gap-6">
          <div className="col-span-2 rounded-xl bg-white p-6 shadow-sm">
            <PayrollChart />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <PayeeGroupChart />
          </div>
        </div>
      </main>
    </section>
  );
}
