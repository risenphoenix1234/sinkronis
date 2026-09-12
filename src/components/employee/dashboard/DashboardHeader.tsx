"use client";

import { useEffect, useState } from "react";
import axios from "axios";


import ActionList from "@/components/employee/dashboard/ActionList";
import ClockBanner from "@/components/employee/dashboard/ClockBanner";
import DashboardHeader from "@/components/employee/dashboard/DashboardHeader";
import StatsGrid from "@/components/employee/dashboard/StatsGrid";
import WelcomeCard from "@/components/employee/dashboard/welcomeCard";
import { getEmployeeDashboard } from "@/lib/api/employee";
import { DashboardData } from "@/lib/api/types/employeeTypes";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getEmployeeDashboard()
      .then(setDashboard)
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 401) setError("Your session has expired. Please log in again.");
          else if (status === 403) setError("Your plan doesn't include HRIS access.");
          else if (status === 404) setError("No employee profile is linked to this account.");
          else setError("Couldn't load your dashboard. Please try again.");
        } else {
          setError("Couldn't load your dashboard. Please try again.");
        }
        console.error("Dashboard fetch failed:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-6 text-center text-sm text-gray-500">
        Loading dashboard…
      </main>
    );
  }

  if (error || !dashboard) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-6 text-center text-sm text-red-600">
        {error ?? "Something went wrong."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] md:p-6">
      <div className="mx-auto space-y-6">
        <DashboardHeader />
        <WelcomeCard employee={dashboard.employee} currentDate={dashboard.currentDate} />
        <ClockBanner attendance={dashboard.attendanceToday} />
        <StatsGrid summary={dashboard.summary} />
        <ActionList items={dashboard.actionItems} />
      </div>
    </main>
  );
}