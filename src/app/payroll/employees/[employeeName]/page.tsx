"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddToPayrollModal from "@/components/payroll/employee/AddToPayroll";
import BIK from "@/components/payroll/employee/BIK";
import DeductionsLoans from "@/components/payroll/employee/DeductionsLoans";
import EmployeeOverview from "@/components/payroll/employee/EmployeeOverview";
import PayBreakdown from "@/components/payroll/employee/PayBreakdown";
import PayrollHistory from "@/components/payroll/employee/PayrollHistory";
import RemoveFromPayrollModal from "@/components/payroll/employee/RemoveFromPayroll";
import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  enrollPayrollEmployee,
  getPayrollEmployeeOverview,
  PayrollEmployeeOverviewData,
  removePayrollEmployeeEnrollment,
} from "@/lib/api/payroll";

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

export default function EmployeePayrollDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [addToPayRollOpen, setAddToPayRollOpen] = useState(false);
  const [removeFromPayrollOpen, setRemoveFromPayrollOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isOnPayroll, setIsOnPayroll] = useState(false);

  // Enrollment action loading states
  const [enrolling, setEnrolling] = useState(false);
  const [removing, setRemoving] = useState(false);

  // ── API State ───────────────────────────────────────────
  const [apiData, setApiData] = useState<PayrollEmployeeOverviewData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safely get employeeName/employeeId from the URL
  const employeeNameParam = params?.employeeName;

  const employeeName = Array.isArray(employeeNameParam)
    ? decodeURIComponent(employeeNameParam[0] ?? "")
    : decodeURIComponent(employeeNameParam ?? "Employee");

  const fetchEmployeeData = useCallback(async () => {
    if (!employeeNameParam) return;
    const id = Array.isArray(employeeNameParam)
      ? employeeNameParam[0]
      : employeeNameParam;

    setLoading(true);
    setError(null);
    try {
      const res = await getPayrollEmployeeOverview(id);
      if (res.data) {
        setApiData(res.data);
        if (res.data.employee?.payrollStatus) {
          setIsOnPayroll(res.data.employee.payrollStatus === "ON_PAYROLL");
        }
      }
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number;
          data?: { message?: string };
        };
      };
      const errorMsg =
        axiosErr.response?.data?.message ??
        "Could not load employee payroll profile. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [employeeNameParam]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  // Shared employee details used by modals
  const employeeSummary = {
    name: apiData?.employee?.fullName || employeeName || "",
    role: apiData?.employee?.role || "",
    department: apiData?.employee?.department?.name || "",
    grossPay: apiData
      ? `₦${(apiData.paySummary?.gross || apiData.employee?.grossPay || 0).toLocaleString("en-NG")}`
      : "",
    netPay: apiData
      ? `₦${(apiData.paySummary?.netPay || apiData.employee?.netPay || 0).toLocaleString("en-NG")}`
      : "",
  };

  const handleConfirmAddToPayroll = async () => {
    const id = Array.isArray(employeeNameParam)
      ? employeeNameParam[0]
      : employeeNameParam;
    if (!id) return;

    setEnrolling(true);
    try {
      await enrollPayrollEmployee(id);
      setIsOnPayroll(true);
      setAddToPayRollOpen(false);
      toast.success("Employee enrolled in payroll successfully.");
      // Refresh to get the latest payroll status from the server
      fetchEmployeeData();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; missingFields?: string[] } };
      };
      const msg =
        axiosErr.response?.data?.message ??
        "Failed to enroll employee in payroll.";
      toast.error(msg);
    } finally {
      setEnrolling(false);
    }
  };

  const handleConfirmRemoveFromPayroll = async () => {
    const id = Array.isArray(employeeNameParam)
      ? employeeNameParam[0]
      : employeeNameParam;
    if (!id) return;

    setRemoving(true);
    try {
      await removePayrollEmployeeEnrollment(id);
      setIsOnPayroll(false);
      setRemoveFromPayrollOpen(false);
      toast.success("Employee removed from payroll successfully.");
      // Refresh to get the latest payroll status from the server
      fetchEmployeeData();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      const msg =
        axiosErr.response?.data?.message ??
        "Failed to remove employee from payroll.";
      toast.error(msg);
    } finally {
      setRemoving(false);
    }
  };

  const displayName =
    apiData?.employee?.fullName || employeeName || "";

  const initials =
    apiData?.employee?.initials ||
    (apiData?.employee?.fullName
      ? apiData.employee.fullName
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : (displayName ? displayName.slice(0, 2).toUpperCase() : "EM"));

  const displayStatus =
    apiData?.employee?.employeeStatus === "ACTIVE"
      ? "Active"
      : apiData?.employee?.employeeStatus || "Inactive";

  const role = apiData?.employee?.role || "—";
  const deptName = apiData?.employee?.department?.name || "—";
  const empType = apiData?.employee?.employmentType || "Full-time";
  const subtitle = `${role} · ${deptName} · ${empType}`;

  const grossFormatted = apiData?.paySummary?.gross || apiData?.employee?.grossPay
    ? `₦${(apiData.paySummary?.gross || apiData.employee?.grossPay || 0).toLocaleString("en-NG")}`
    : "₦0";

  const netPayFormatted = apiData?.paySummary?.netPay || apiData?.employee?.netPay
    ? `₦${(apiData.paySummary?.netPay || apiData.employee?.netPay || 0).toLocaleString("en-NG")}`
    : "₦0";

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-4 text-[#263342] sm:px-6">
      {/* ================================================================ */}
      {/* BACK BUTTON */}
      {/* ================================================================ */}

      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#667085] transition hover:text-[#1683D8]"
        >
          <ChevronLeft size={16} />
          Back to Employees
        </button>

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#1683D8]">
            <Loader2 size={14} className="animate-spin" />
            Loading employee details...
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded border border-[#FEDF89] bg-[#FFFAEB] px-4 py-2.5 text-xs text-[#B54708]">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* ================================================================ */}
      {/* EMPLOYEE HEADER */}
      {/* ================================================================ */}

      <section className="rounded border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* Employee information */}

          <div className="flex items-center gap-4">
            {/* Avatar */}

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E0F2FE] text-base font-semibold text-[#1683D8]">
              {initials}
            </div>

            {/* Name + role */}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-semibold text-[#263342] sm:text-lg">
                  {displayName}
                </h1>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    displayStatus === "Active"
                      ? "bg-[#DCF7DF] text-[#15803D]"
                      : "bg-[#F2F4F7] text-[#667085]"
                  }`}
                >
                  {displayStatus}
                </span>
              </div>

              <p className="mt-1 text-xs text-[#667085] sm:text-sm">
                {subtitle}
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
                {grossFormatted}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#98A2B3]">
                Net Pay
              </p>

              <p className="mt-1 text-base font-bold text-[#15803D] sm:text-lg">
                {netPayFormatted}
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

      {activeTab === "Overview" && (
        <EmployeeOverview
          overviewData={apiData || undefined}
          employeeId={
            Array.isArray(employeeNameParam)
              ? (employeeNameParam[0] ?? undefined)
              : (employeeNameParam ?? undefined)
          }
          onRefresh={fetchEmployeeData}
        />
      )}

      {activeTab === "Pay Breakdown" && (
        <PayBreakdown
          employeeId={
            Array.isArray(employeeNameParam)
              ? (employeeNameParam[0] ?? undefined)
              : (employeeNameParam ?? undefined)
          }
          overviewData={apiData || undefined}
        />
      )}

      {activeTab === "Deductions & Loans" && (
        <DeductionsLoans
          employeeId={
            Array.isArray(employeeNameParam)
              ? (employeeNameParam[0] ?? undefined)
              : (employeeNameParam ?? undefined)
          }
          overviewData={apiData || undefined}
          onRefresh={fetchEmployeeData}
        />
      )}

      {activeTab === "BIK" && (
        <BIK
          employeeId={
            Array.isArray(employeeNameParam)
              ? (employeeNameParam[0] ?? undefined)
              : (employeeNameParam ?? undefined)
          }
        />
      )}

      {activeTab === "Payroll History" && (
        <PayrollHistory
          employeeId={
            Array.isArray(employeeNameParam)
              ? (employeeNameParam[0] ?? undefined)
              : (employeeNameParam ?? undefined)
          }
        />
      )}

      <AddToPayrollModal
        isOpen={addToPayRollOpen}
        onClose={() => setAddToPayRollOpen(false)}
        onConfirm={handleConfirmAddToPayroll}
        employeeName={employeeSummary.name}
        employeeId={
          Array.isArray(employeeNameParam)
            ? (employeeNameParam[0] ?? undefined)
            : (employeeNameParam ?? undefined)
        }
        employee={employeeSummary}
        isLoading={enrolling}
      />

      <RemoveFromPayrollModal
        open={removeFromPayrollOpen}
        onClose={() => setRemoveFromPayrollOpen(false)}
        onConfirm={handleConfirmRemoveFromPayroll}
        isLoading={removing}
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
