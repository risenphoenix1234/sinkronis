"use client";

import AddToPayrollModal from "@/components/payroll/employee/AddToPayroll";
import BIK from "@/components/payroll/employee/BIK";
import DeductionsLoans from "@/components/payroll/employee/DeductionsLoans";
import EmployeeOverview from "@/components/payroll/employee/EmployeeOverview";
import PayBreakdown from "@/components/payroll/employee/PayBreakdown";
import PayrollHistory from "@/components/payroll/employee/PayrollHistory";
import RemoveFromPayrollModal from "@/components/payroll/employee/RemoveFromPayroll";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type DetailRowProps = {
  label: string;
  value: string;
};

type PayRowProps = {
  label: string;
  value: string;
  valueClassName?: string;
  bold?: boolean;
};

const tabs = [
  "Overview",
  "Pay Breakdown",
  "Deductions & Loans",
  "BIK",
  "Payroll History",
];

const personalDetails = [
  {
    label: "Employee ID",
    value: "CS-004",
  },
  {
    label: "Email",
    value: "a.nwachukwu@sinkronis.com",
  },
  {
    label: "Phone",
    value: "+234 803 100 0007",
  },
  {
    label: "Join Date",
    value: "2022-02-28",
  },
  {
    label: "Tax State",
    value: "Lagos",
  },
  {
    label: "Tax Status",
    value: "Permanent — PAYE",
  },
  {
    label: "Bank",
    value: "Zenith Bank — 2109876543",
  },
  {
    label: "TIN",
    value: "1234567-0007",
  },
  {
    label: "Pension PIN",
    value: "PENI00078901",
  },
  {
    label: "PFA",
    value: "Leadway Pension",
  },
  {
    label: "NHF No.",
    value: "NHF/007/2022",
  },
];

const paySummary = [
  {
    label: "Basic Salary",
    value: "₦180,000",
  },
  {
    label: "Housing Allowance",
    value: "₦36,000",
  },
  {
    label: "Transport Allowance",
    value: "₦18,000",
  },
  {
    label: "Other Allowance",
    value: "₦9,000",
  },
];

const deductions = [
  {
    label: "PAYE",
    value: "(₦13,177)",
    className: "text-[#EF4444]",
  },
  {
    label: "Employee Pension (8%)",
    value: "(₦18,720)",
    className: "text-[#A16207]",
  },
  {
    label: "NHF (2.5%)",
    value: "(₦4,500)",
    className: "text-[#9333EA]",
  },
];

export default function EmployeePayrollDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [addToPayRollOpen, setAddToPayRollOpen] = useState(false);
  const [removeFromPayrollOpen, setRemoveFromPayrollOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isOnPayroll, setIsOnPayroll] = useState(false);

  // Safely get employeeName from the URL
  const employeeNameParam = params?.employeeName;

  const employeeName = Array.isArray(employeeNameParam)
    ? decodeURIComponent(employeeNameParam[0] ?? "")
    : decodeURIComponent(employeeNameParam ?? "Employee");

  // Shared employee details used by both modals — replace with real data
  // from your API/state once this page is wired to a data source.
  const employeeSummary = {
    name: employeeName || "Adaeze Nwachukwu",
    role: "Support Lead",
    department: "Customer Support",
    grossPay: "₦243,000",
    netPay: "₦206,603",
  };

  const handleConfirmAddToPayroll = () => {
    setIsOnPayroll(true);
    setAddToPayRollOpen(false);
  };

  const handleConfirmRemoveFromPayroll = () => {
    setIsOnPayroll(false);
    setRemoveFromPayrollOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-4 text-[#263342] sm:px-6">
      {/* ================================================================ */}
      {/* BACK BUTTON */}
      {/* ================================================================ */}

      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-[#667085] transition hover:text-[#1683D8]"
      >
        <ChevronLeft size={16} />
        Back to Employees
      </button>

      {/* ================================================================ */}
      {/* EMPLOYEE HEADER */}
      {/* ================================================================ */}

      <section className="rounded border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* Employee information */}

          <div className="flex items-center gap-4">
            {/* Avatar */}

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E0F2FE] text-base font-semibold text-[#1683D8]">
              AN
            </div>

            {/* Name + role */}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-semibold text-[#263342] sm:text-lg">
                  {employeeName}
                </h1>

                <span className="rounded-full bg-[#F2F4F7] px-2.5 py-1 text-[11px] font-medium text-[#667085]">
                  Inactive
                </span>
              </div>

              <p className="mt-1 text-xs text-[#667085] sm:text-sm">
                Support Lead · Customer Support · Full-time
              </p>
            </div>
          </div>

          {/* Salary summary */}

          <div className="flex items-center justify-between gap-8 sm:gap-10">
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#98A2B3]">
                Gross
              </p>

              <p className="mt-1 text-base font-bold text-[#1683D8] sm:text-lg">
                ₦243,000
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#98A2B3]">
                Net Pay
              </p>

              <p className="mt-1 text-base font-bold text-[#15803D] sm:text-lg">
                ₦206,603
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium text-[#98A2B3]">
                {isOnPayroll ? "On Payroll" : "Off Payroll"}
              </p>

              {isOnPayroll ? (
                <button
                  type="button"
                  onClick={() => setRemoveFromPayrollOpen(true)}
                  className="mt-1 rounded bg-[#78350F] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#5C2A0A]"
                >
                  Remove from Payroll
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddToPayRollOpen(true)}
                  className="mt-1 rounded bg-[#1683D8] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#0D6EBA]"
                >
                  Add to Payroll
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TABS */}
      {/* ================================================================ */}

      <div className="mt-5 overflow-x-auto">
        <div className="flex min-w-max border-b border-[#E5E7EB]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-3 text-sm font-medium transition ${
                  isActive
                    ? "text-[#1683D8]"
                    : "text-[#667085] hover:text-[#263342]"
                }`}
              >
                {tab}

                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#1683D8]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* TAB CONTENT */}
      {/* ================================================================ */}

      {activeTab === "Overview" && <EmployeeOverview />}

      {activeTab === "Pay Breakdown" && <PayBreakdown />}

      {activeTab === "Deductions & Loans" && <DeductionsLoans />}

      {activeTab === "BIK" && <BIK />}

      {activeTab === "Payroll History" && <PayrollHistory />}

      <AddToPayrollModal
        isOpen={addToPayRollOpen}
        onClose={() => setAddToPayRollOpen(false)}
        onConfirm={handleConfirmAddToPayroll}
        employeeName={employeeSummary.name}
      />

      <RemoveFromPayrollModal
        open={removeFromPayrollOpen}
        onClose={() => setRemoveFromPayrollOpen(false)}
        onConfirm={handleConfirmRemoveFromPayroll}
        employee={employeeSummary}
      />
    </main>
  );
}

/* ======================================================================== */
/* PERSONAL DETAIL ROW */
/* ======================================================================== */

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center border-b border-dashed border-[#E5E7EB] py-2.5 last:border-b-0 sm:grid-cols-[130px_1fr]">
      <span className="text-xs font-medium text-[#98A2B3] sm:text-sm">
        {label}
      </span>

      <span className="text-right text-xs font-medium text-[#263342] sm:text-sm">
        {value}
      </span>
    </div>
  );
}

/* ======================================================================== */
/* PAY SUMMARY ROW */
/* ======================================================================== */

function PayRow({
  label,
  value,
  valueClassName = "text-[#263342]",
  bold = false,
}: PayRowProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-dashed border-[#E5E7EB] py-2.5 ${
        bold ? "font-semibold" : ""
      }`}
    >
      <span
        className={`text-xs sm:text-sm ${
          bold ? "text-[#52647A]" : "text-[#667085]"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-xs sm:text-sm ${
          bold ? "font-bold" : "font-medium"
        } ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}
