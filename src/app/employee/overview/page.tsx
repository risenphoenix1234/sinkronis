// src/app/employee/overview/page.tsx
"use client";

import { ActivitySection } from "@/components/employee/overview/activitySection";
import { ProfileHeader } from "@/components/employee/overview/profileHeader";
import { StatsSection } from "@/components/employee/overview/statsSection";
import { WorkDetailsSection } from "@/components/employee/overview/workDetailsSection";

export default function EmployeeOverviewPage() {
  return (
    <section className="space-y-6 p-6">
      <div className="min-h-screen bg-[#FAFAFA]">
        <ProfileHeader />

        <section>
          <h2 className="text-2xl font-semibold text-[#1F2937]">Overview</h2>

          <p className="mt-2 text-sm text-[#9CA3AF]">
            Date Joined: 13 May 2021
          </p>
        </section>

        <StatsSection />

        <WorkDetailsSection />

        <ActivitySection />
      </div>
    </section>
  );
}
