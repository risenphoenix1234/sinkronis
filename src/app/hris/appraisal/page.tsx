"use client";

import CycleOverview from "@/components/hris/appraisal/CycleOverview";
import EmployeeTable from "@/components/hris/appraisal/EmployeeTable";
import StatsCard from "@/components/hris/appraisal/StatsCard";
import AppraisalCyclePage from "@/components/modals/Hris/AppraisalCyclePage";
import AppraisalModal from "@/components/modals/Hris/AppraisalModal";
import AppraisalReviewPage from "@/components/modals/Hris/AppraisalReviewPage";
import AppraisalSettingPage from "@/components/modals/Hris/AppraisalSettingPage";
import {
  getActiveAppraisalCycle,
  getAppraisalsOverview,
  getAppraisalReviews,
} from "@/lib/api/hris";
import {
  ActiveAppraisalCycle,
  AppraisalsOverviewData,
  AppraisalReview,
} from "@/lib/api/types/hrisTypes";
import axios from "axios";
import { Users, CheckCircle2, Clock3, Shield } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AppraisalPage() {
  const [view, setView] = useState<
    "overview" | "reviews" | "cycles" | "settings"
  >("overview");
  const [open, setOpen] = useState(false);

  const [overview, setOverview] = useState<AppraisalsOverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [activeCycle, setActiveCycle] = useState<ActiveAppraisalCycle | null>(
    null,
  );
  const [cycleLoading, setCycleLoading] = useState(true);
  const [overviewReviews, setOverviewReviews] = useState<AppraisalReview[]>([]);
  const [overviewReviewsLoading, setOverviewReviewsLoading] = useState(true);

  const fetchOverviewAndCycle = useCallback(() => {
    setOverviewLoading(true);
    setCycleLoading(true);
    setOverviewReviewsLoading(true);

    getAppraisalsOverview()
      .then((res) => setOverview(res.data))
      .catch((err) => {
        console.error(
          "Appraisals overview failed:",
          axios.isAxiosError(err) ? err.response?.data : err,
        );
      })
      .finally(() => setOverviewLoading(false));

    getActiveAppraisalCycle()
      .then((res) => setActiveCycle(res))
      .catch((err) => {
        console.error("Active cycle failed:", err);
      })
      .finally(() => setCycleLoading(false));

    getAppraisalReviews({ limit: 5 })
      .then((res) => {
        setOverviewReviews(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Overview reviews failed:", err);
        setOverviewReviews([]);
      })
      .finally(() => setOverviewReviewsLoading(false));
  }, []);

  useEffect(() => {
    fetchOverviewAndCycle();
  }, [fetchOverviewAndCycle]);

  return (
    <section className="space-y-6 p-6">
      <div className="flex justify-between items-center">
         <div>
          <h1 className="text-2xl font-semibold">Appraisal</h1>
          <p className="text-sm text-slate-500">
             Manage performance reviews Cycles, template and employee appraisals.
          </p>
         </div>
          
          <div> 
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              className="rounded-md  bg-[#2388D0] flex px-4 py-2 text-white"
            >
              New Cycle
          </button>

          <AppraisalModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onSuccess={fetchOverviewAndCycle}
          />
        </div>

         
      </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-8 border-b">
          <button
            onClick={() => setView("overview")}
            className={`pb-3 text-sm ${
              view === "overview"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setView("reviews")}
            className={`pb-3 text-sm ${
              view === "reviews"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Reviews
          </button>

          <button
            onClick={() => setView("cycles")}
            className={`pb-3 text-sm ${
              view === "cycles"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Cycles
          </button>

          <button
            onClick={() => setView("settings")}
            className={`pb-3 text-sm ${
              view === "settings"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Stats */}
        {view === "overview" && (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              <StatsCard
                title="Total Employees"
                value={
                  overviewLoading
                    ? "—"
                    : String(overview?.analytics.totalEmployees ?? 0)
                }
                icon={<Users size={18} />}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
              />

              <StatsCard
                title="Completed"
                value={
                  overviewLoading
                    ? "—"
                    : String(overview?.analytics.completed ?? 0)
                }
                icon={<CheckCircle2 size={18} />}
                iconBg="bg-green-100"
                iconColor="text-green-600"
              />

              <StatsCard
                title="In Progress"
                value={
                  overviewLoading
                    ? "—"
                    : String(overview?.analytics.inProgress ?? 0)
                }
                icon={<Clock3 size={18} />}
                iconBg="bg-yellow-100"
                iconColor="text-yellow-600"
              />

              <StatsCard
                title="Pending HR"
                value={
                  overviewLoading
                    ? "—"
                    : String(overview?.analytics.pendingHR ?? 0)
                }
                icon={<Shield size={18} />}
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
              />
            </div>
            <CycleOverview
              cycle={activeCycle}
              loading={cycleLoading}
              onCreateCycle={() => setOpen(true)}
            />

            <EmployeeTable
              reviews={overviewReviews}
              loading={overviewReviewsLoading}
            />
          </>
        )}
        {view === "reviews" && (
          <div className="mt-6">
            <AppraisalReviewPage />
          </div>
        )}
        {view === "cycles" && (
          <div className="mt-6">
            <AppraisalCyclePage />
          </div>
        )}
        {view === "settings" && (
          <div className="mt-6">
            <AppraisalSettingPage />
          </div>
        )}
    </section>
  );
}
