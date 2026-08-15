"use client";

import CycleOverview from "@/components/hris/appraisal/CycleOverview";
import EmployeeTable from "@/components/hris/appraisal/EmployeeTable";
import StatsCard from "@/components/hris/appraisal/StatsCard";
import AppraisalCyclePage from "@/components/modals/Hris/AppraisalCyclePage";
import AppraisalModal from "@/components/modals/Hris/AppraisalModal";
import AppraisalReviewPage from "@/components/modals/Hris/AppraisalReviewPage";
import AppraisalSettingPage from "@/components/modals/Hris/AppraisalSettingPage";
import { Users, CheckCircle2, Clock3, Shield } from "lucide-react";
import { useState } from "react";

export default function AppraisalPage() {
  const [view, setView] = useState<
    "overview" | "reviews" | "cycles" | "settings"
  >("overview");
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-[#f8f9fb] space-y-6 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Appraisal</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage performance review cycles, templates and employee
              appraisals.
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="rounded-md  bg-[#2388D0]  px-4 py-2 text-white"
          >
            New Cycle
          </button>

          <AppraisalModal isOpen={open} onClose={() => setOpen(false)} />
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
            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              1
            </span>
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
                value="6"
                icon={<Users size={18} />}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
              />

              <StatsCard
                title="Completed"
                value="1"
                icon={<CheckCircle2 size={18} />}
                iconBg="bg-green-100"
                iconColor="text-green-600"
              />

              <StatsCard
                title="In Progress"
                value="3"
                icon={<Clock3 size={18} />}
                iconBg="bg-yellow-100"
                iconColor="text-yellow-600"
              />

              <StatsCard
                title="Pending HR"
                value="1"
                icon={<Shield size={18} />}
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
              />
            </div>

            <CycleOverview />

            <EmployeeTable />
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
      </div>
    </>
  );
}
