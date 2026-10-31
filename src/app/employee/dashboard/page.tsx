"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import ActionList from "@/components/employee/dashboard/ActionList";
import ClockBanner from "@/components/employee/dashboard/ClockBanner";
import DashboardHeader from "@/components/employee/dashboard/DashboardHeader";
import StatsGrid from "@/components/employee/dashboard/StatsGrid";
import WelcomeCard from "@/components/employee/dashboard/welcomeCard";
import { clockIn, clockOut, getEmployeeDashboard } from "@/lib/api/employee";
import { DashboardData } from "@/lib/api/types/employeeTypes";
import Loader from "@/components/ui/Loader";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      const data = await getEmployeeDashboard();
      setDashboard(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) setError("Session expired. Please log in again.");
        else if (status === 403)
          setError("Your plan doesn't include HRIS access.");
        else if (status === 404)
          setError("No employee profile is linked to this account.");
        else setError("Couldn't load your dashboard. Please try again.");
      } else {
        setError("Couldn't load your dashboard. Please try again.");
      }
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadDashboard();
  }, []);

  async function handleClockIn() {
    try {
      const res = await clockIn();
      toast.success(res?.message || "Clocked in successfully");
      await loadDashboard();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to clock in";
      toast.error(msg);
    }
  }

  async function handleClockOut() {
    try {
      const res = await clockOut();
      toast.success(res?.message || "Clocked out successfully");
      await loadDashboard();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to clock out";
      toast.error(msg);
    }
  }

  if (loading) {
    return <Loader variant="page" label="Loading dashboard" />;
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
        {/* Header */}
        <DashboardHeader />

        {/* Welcome Card */}
        <WelcomeCard
          employee={dashboard.employee}
          currentDate={dashboard.currentDate}
        />

        {/* Clock In Banner */}
        <ClockBanner
          attendance={dashboard.attendanceToday}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
        />

        {/* Statistics */}
        <StatsGrid summary={dashboard.summary} />

        {/* Action Items */}
        <ActionList items={dashboard.actionItems} />
      </div>
    </main>
  );
}
