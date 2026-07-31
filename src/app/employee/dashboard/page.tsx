"use client";

import ActionList from "@/components/employee/dashboard/ActionList";
import ClockBanner from "@/components/employee/dashboard/ClockBanner";
import DashboardHeader from "@/components/employee/dashboard/DashboardHeader";
import StatsGrid from "@/components/employee/dashboard/StatsGrid";
import WelcomeCard from "@/components/employee/dashboard/welcomeCard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] md:p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* Welcome Card */}
        <WelcomeCard />

        {/* Clock In Banner */}
        <ClockBanner />

        {/* Statistics */}
        <StatsGrid />

        {/* Action Items */}
        <ActionList />
      </div>
    </main>
  );
}
