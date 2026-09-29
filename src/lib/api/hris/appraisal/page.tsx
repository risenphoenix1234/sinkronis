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
  getAppraisals,
  getAppraisalReviews,
} from "@/lib/api/hris";
import {
  ActiveAppraisalCycle,
  AppraisalsOverviewData,
  AppraisalReview,
} from "@/lib/api/types/hrisTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { Users, CheckCircle2, Clock3, Shield, AlertCircle, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AppraisalPage() {
  const [view, setView] = useState<
    "overview" | "reviews" | "cycles" | "settings"
  >("overview");
  const [open, setOpen] = useState(false);

  const [overview, setOverview] = useState<AppraisalsOverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [activeCycle, setActiveCycle] = useState<ActiveAppraisalCycle | null>(
    null,
  );
  const [cycleLoading, setCycleLoading] = useState(true);
  const [cycleError, setCycleError] = useState<string | null>(null);
  const [overviewReviews, setOverviewReviews] = useState<AppraisalReview[]>([]);
  const [overviewReviewsLoading, setOverviewReviewsLoading] = useState(true);

  const fetchOverviewAndCycle = useCallback(() => {
    setOverviewLoading(true);
    setOverviewError(null);
    setCycleLoading(true);
    setCycleError(null);
    setOverviewReviewsLoading(true);

    getAppraisalsOverview()
      .then((res) => setOverview(res.data))
      .catch((err) => {
        console.error(
          "Appraisals overview failed:",
          axios.isAxiosError(err) ? err.response?.data : err,
        );
        const apiMsg = axios.isAxiosError(err)
          ? err.response?.data?.message
          : null;
        const msg =
          apiMsg ||
          (err instanceof Error
            ? err.message
            : "Failed to load appraisal overview.");
        setOverviewError(msg);
        toast.error(msg);
      })
      .finally(() => setOverviewLoading(false));

    getActiveAppraisalCycle()
      .then((res) => {
        setActiveCycle(res);
        setCycleError(null);
      })
      .catch((err) => {
        console.error("Active cycle failed:", err);
        const apiMsg = axios.isAxiosError(err)
          ? err.response?.data?.message
          : null;
        const msg =
          apiMsg ||
          (err instanceof Error
            ? err.message
            : "Failed to load active appraisal cycle.");
        setCycleError(msg);
        toast.error(msg);
      })
      .finally(() => setCycleLoading(false));

    getAppraisals({ limit: 5 })
      .then((res) => {
        setOverviewReviews(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Overview reviews failed:", err);
        toast.error("Failed to load recent appraisal reviews.");
        setOverviewReviews([]);
      })
      .finally(() => setOverviewReviewsLoading(false));
  }, []);

  useEffect(() => {
    fetchOverviewAndCycle();
  }, [fetchOverviewAndCycle]);

  const reviewsBadgeCount =
    overview?.analytics?.pendingHR && overview.analytics.pendingHR > 0
      ? overview.analytics.pendingHR
      : 1;

  const currentCycleName =
    activeCycle?.name ?? overview?.activeCycle?.name ?? null;

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appraisal</h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage performance review cycles, templates, and employee appraisals.
          </p>
        </div>

        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[#2183C6] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#1a6fa8] transition"
          >
            <Plus size={16} />
            <span>New Cycle</span>
          </button>

          <AppraisalModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onSuccess={fetchOverviewAndCycle}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-8 border-b border-gray-200">
        <button
          onClick={() => setView("overview")}
          className={`pb-3 text-sm font-medium transition ${
            view === "overview"
              ? "border-b-2 border-[#2183C6] text-[#2183C6]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setView("reviews")}
          className={`flex items-center gap-1.5 pb-3 text-sm font-medium transition ${
            view === "reviews"
              ? "border-b-2 border-[#2183C6] text-[#2183C6]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>Reviews</span>
          {reviewsBadgeCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {reviewsBadgeCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setView("cycles")}
          className={`pb-3 text-sm font-medium transition ${
            view === "cycles"
              ? "border-b-2 border-[#2183C6] text-[#2183C6]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Cycles
        </button>

        <button
          onClick={() => setView("settings")}
          className={`pb-3 text-sm font-medium transition ${
            view === "settings"
              ? "border-b-2 border-[#2183C6] text-[#2183C6]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Settings
        </button>
      </div>

      {/* Stats */}
      {view === "overview" && (
        <>
          {overviewError && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{overviewError}</span>
              </div>
              <button
                type="button"
                onClick={fetchOverviewAndCycle}
                className="font-semibold underline hover:text-red-900"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Employees"
              value={
                overviewLoading
                  ? "—"
                  : String(overview?.analytics.totalEmployees ?? 0)
              }
              icon={<Users size={16} />}
              iconBg="bg-sky-50"
              iconColor="text-sky-500"
            />

            <StatsCard
              title="Completed"
              value={
                overviewLoading
                  ? "—"
                  : String(overview?.analytics.completed ?? 0)
              }
              icon={<CheckCircle2 size={16} />}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-500"
            />

            <StatsCard
              title="In Progress"
              value={
                overviewLoading
                  ? "—"
                  : String(overview?.analytics.inProgress ?? 0)
              }
              icon={<Clock3 size={16} />}
              iconBg="bg-amber-50"
              iconColor="text-amber-500"
            />

            <StatsCard
              title="Pending HR"
              value={
                overviewLoading
                  ? "—"
                  : String(overview?.analytics.pendingHR ?? 0)
              }
              icon={<Shield size={16} />}
              iconBg="bg-purple-50"
              iconColor="text-purple-500"
            />
          </div>

          <CycleOverview
            cycle={activeCycle ?? overview?.activeCycle ?? null}
            overview={overview}
            loading={cycleLoading}
            error={cycleError}
            onRetry={fetchOverviewAndCycle}
            onCreateCycle={() => setOpen(true)}
            onViewAll={() => setView("cycles")}
          />

          <EmployeeTable
            reviews={overviewReviews}
            loading={overviewReviewsLoading}
            cycleName={currentCycleName}
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
