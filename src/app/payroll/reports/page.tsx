"use client";

import { useState, type ComponentType } from "react";
import { Download } from "lucide-react";

import PayrollSummary from "@/components/payroll/reports/PayrollSummary";
import CostByDepartment from "@/components/payroll/reports/CostByDepartment";
import MonthOnMonthVariance from "@/components/payroll/reports/MonthOnMonthVariance";
import BankPaymentSchedule from "@/components/payroll/reports/BankPaymentSchedule";
import YearToDateEarnings from "@/components/payroll/reports/YearToDateEarnings";

import ReportTabs, {
  ReportTab,
  tabId,
  tabPanelId,
} from "@/components/payroll/reports/ReportsTabs";
import { CURRENT_PERIOD, exportReport } from "@/lib/payroll-reports";

// =====================================================
// TAB COMPONENTS
// =====================================================

const tabComponents: Record<ReportTab, ComponentType> = {
  "Payroll Summary": PayrollSummary,
  "Cost by Department": CostByDepartment,
  "Month-on-Month Variance": MonthOnMonthVariance,
  "Bank Payment Schedule": BankPaymentSchedule,
  "Year-to-Date Earnings": YearToDateEarnings,
};

// =====================================================
// PAGE
// =====================================================

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("Payroll Summary");

  const ActiveComponent = tabComponents[activeTab];

  return (
    // A div, not <main>: DashboardLayout already renders the page's <main>, and
    // nesting a second one gives the document two main landmarks.
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:px-6">
      <div className="flex w-full flex-col gap-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Reports
            </h1>

            <p className="mt-1 text-base text-gray-500">
              Payroll analytics, cost breakdowns, and exportable schedules.
            </p>
          </div>

          {/* This button had no onClick at all, so the page's primary action was
              inert. It now exports whichever report is on screen. */}
          <button
            type="button"
            onClick={() => exportReport(activeTab)}
            aria-label={`Export ${activeTab} for ${CURRENT_PERIOD} as CSV`}
            className="
              flex
              w-fit
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-gray-200
              bg-white
              px-5
              py-2.5
              text-sm
              font-medium
              text-gray-900
              shadow-sm
              transition
              hover:bg-gray-50
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500/40
            "
          >
            <Download className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            Export
          </button>
        </div>

        {/* =================================================
            TABS
        ================================================= */}

        <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* =================================================
            ACTIVE TAB CONTENT
        ================================================= */}

        <div
          role="tabpanel"
          id={tabPanelId(activeTab)}
          aria-labelledby={tabId(activeTab)}
          tabIndex={0}
        >
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
