"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Loader2, AlertCircle } from "lucide-react";

import AddLoanModal, {
  LoanFormData,
} from "@/components/payroll/deductions/AddLoans";

import AddCustomDeductionModal, {
  CustomDeductionFormData,
} from "@/components/payroll/deductions/AddCustomDeduction";

import CustomDeductions from "@/components/payroll/deductions/CustomDeduction";

import {
  CustomDeduction,
  initials,
} from "@/types/payroll/deduction-data";


import { naira } from "@/types/payroll/payee-data";
import { toast } from "react-toastify";
import {
  getTenantLoans,
  createTenantLoan,
  getPayrollEmployees,
  getTenantCustomDeductions,
  deleteTenantCustomDeduction,
  GetTenantLoansData,
  PayrollLoanStatus,
  GetTenantLoansParams,
  PayrollEmployeeItem,
  CreateTenantLoanBody,
  TenantCustomDeductionItem,
  createTenantCustomDeduction,
  getPayrollDeductionTypes,
  createPayrollDeductionType,
  CreateTenantCustomDeductionBody,
} from "@/lib/api/payroll";

/* =========================================================
   TYPES
========================================================= */

type ActiveTab = "loans" | "custom";

export type NormalizedLoan = {
  id: string;
  employee: string;
  purpose: string;
  principal: number;
  outstanding: number;
  repaid: number;
  repaidPercent: number;
  monthly: number;
  status: string;
};

const badgeStyles: Record<string, string> = {
  Active: "bg-[#d8f1de] text-[#25803d]",
  ACTIVE: "bg-[#d8f1de] text-[#25803d]",
  Paused: "bg-[#fff1c9] text-[#927000]",
  PAUSED: "bg-[#fff1c9] text-[#927000]",
  Closed: "bg-[#eef1f4] text-[#697586]",
  COMPLETED: "bg-[#eef1f4] text-[#697586]",
  CLOSED_EARLY: "bg-[#fef2f2] text-[#b91c1c]",
  CANCELLED: "bg-[#fee2e2] text-[#b91c1c]",
};

/* =========================================================
   PAGE
========================================================= */

export default function DeductionsPage() {
  const router = useRouter();



  const [activeTab, setActiveTab] = useState<ActiveTab>("loans");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All Status");

  const [customSearch, setCustomSearch] = useState("");

  const [customType, setCustomType] = useState("All Types");

  const [showAddLoanModal, setShowAddLoanModal] = useState(false);

  const [showAddDeductionModal, setShowAddDeductionModal] = useState(false);

  const [apiData, setApiData] = useState<GetTenantLoansData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingLoan, setIsCreatingLoan] = useState(false);
  const [payrollEmployees, setPayrollEmployees] = useState<
    PayrollEmployeeItem[]
  >([]);

  const [apiCustomDeductions, setApiCustomDeductions] = useState<
    TenantCustomDeductionItem[] | null
  >(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [isCreatingCustomDeduction, setIsCreatingCustomDeduction] =
    useState(false);
  const [deletingCustomDeductionId, setDeletingCustomDeductionId] = useState<
    string | null
  >(null);

  /* =======================================================
     FETCH PAYROLL EMPLOYEES
  ======================================================= */

  useEffect(() => {
    let isMounted = true;
    const loadEmployees = async () => {
      try {
        const res = await getPayrollEmployees({ limit: 100 });
        if (isMounted && res?.data) {
          setPayrollEmployees(res.data);
        }
      } catch (err) {
        console.error(
          "Failed to load payroll employees for loan deductions:",
          err,
        );
      }
    };
    loadEmployees();
    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     FETCH LIVE LOANS
  ======================================================= */

  const mapStatusParam = (uiStatus: string): PayrollLoanStatus | undefined => {
    switch (uiStatus) {
      case "Active":
        return "ACTIVE";
      case "Paused":
        return "PAUSED";
      case "Completed":
        return "COMPLETED";
      case "Closed Early":
        return "CLOSED_EARLY";
      default:
        return undefined;
    }
  };

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: GetTenantLoansParams = {
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(mapStatusParam(status) ? { status: mapStatusParam(status) } : {}),
      };
      const res = await getTenantLoans(params);
      setApiData(res.data);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosErr.response?.status === 403) {
        setError(
          "You do not have permission to view tenant loans (payroll:loans:view required).",
        );
      } else {
        setError(
          axiosErr.response?.data?.message || "Failed to load tenant loans.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLoans();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchLoans]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const liveSummary = apiData?.summary;

  const activeLoansCount = liveSummary ? liveSummary.activeLoans : 0;
  const monthlyTotal = liveSummary ? liveSummary.monthlyLoanDeductions : 0;
  const outstandingTotal = liveSummary ? liveSummary.totalOutstanding : 0;

  /* =======================================================
     DISPLAY LOANS
  ======================================================= */

  const displayLoans: NormalizedLoan[] = useMemo(() => {
    if (apiData?.loans) {
      return apiData.loans.map((item) => ({
        id: item.id,
        employee: item.employee?.fullName || "Employee",
        purpose: item.purpose,
        principal: item.principalAmount,
        outstanding: item.outstandingAmount,
        repaid: item.repaidAmount,
        repaidPercent: item.repaymentProgressPercent,
        monthly: item.monthlyRepayment,
        status: item.status,
      }));
    }

    return [];
  }, [apiData]);

  /* =======================================================
     FETCH LIVE CUSTOM DEDUCTIONS
  ======================================================= */

  const fetchCustomDeductions = useCallback(async () => {
    try {
      setCustomLoading(true);
      setCustomError(null);
      const params = {
        ...(customSearch.trim() ? { search: customSearch.trim() } : {}),
      };
      const res = await getTenantCustomDeductions(params);
      setApiCustomDeductions(res.data);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      setCustomError(
        axiosErr.response?.data?.message ||
          "Failed to load custom deductions.",
      );
    } finally {
      setCustomLoading(false);
    }
  }, [customSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomDeductions();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchCustomDeductions]);

  /* =======================================================
     FILTERED CUSTOM DEDUCTIONS
  ======================================================= */

  const displayCustomDeductions: CustomDeduction[] = useMemo(() => {
    if (apiCustomDeductions) {
      return apiCustomDeductions
        .filter(
          (item) =>
            item.active !== false &&
            item.status !== "INACTIVE" &&
            item.status !== "DEACTIVATED",
        )
        .map((item) => ({
          id: item.id,
          employee: item.employee?.fullName || "Employee",
          employeeId: item.employee?.id,
          deductionName: item.name,
          monthlyAmount: item.amount,
          type: (item.type === "ONE_OFF" ? "One-off" : "Recurring") as
            | "One-off"
            | "Recurring",
        }))
        .filter((deduction) => {
          return (
            customType === "All Types" || deduction.type === customType
          );
        });
    }

    return [];
  }, [apiCustomDeductions, customType]);

  /* =======================================================
     ADD LOAN
  ======================================================= */

  const handleAddLoan = async (data: LoanFormData) => {
    // 1. Resolve employeeId to actual backend CUID
    let employeeId = data.employee.trim();
    const matchedEmployee = payrollEmployees.find(
      (emp) =>
        emp.employeeId === employeeId ||
        emp.fullName.toLowerCase() === employeeId.toLowerCase() ||
        (emp.employeeCode &&
          emp.employeeCode.toLowerCase() === employeeId.toLowerCase()),
    );
    if (matchedEmployee) {
      employeeId = matchedEmployee.employeeId;
    }

    if (!employeeId) {
      toast.error("Please select a valid enrolled employee.");
      return;
    }

    // 2. Parse numbers cleanly so they are always valid numbers and never NaN
    const rawPrincipal = String(data.principal || "")
      .replace(/,/g, "")
      .trim();
    const principalAmount = parseFloat(rawPrincipal);
    if (isNaN(principalAmount) || principalAmount <= 0) {
      toast.error("Please enter a valid principal amount greater than 0.");
      return;
    }

    const rawMonthly = String(data.monthlyRepayment || "")
      .replace(/,/g, "")
      .trim();
    const monthlyRepayment = parseFloat(rawMonthly);
    if (isNaN(monthlyRepayment) || monthlyRepayment <= 0) {
      toast.error(
        "Please enter a valid monthly repayment amount greater than 0.",
      );
      return;
    }

    // 3. Ensure startDate is in YYYY-MM-DD format
    let startDate = data.startDate ? data.startDate.trim() : "";
    if (!startDate) {
      startDate = new Date().toISOString().slice(0, 10);
    } else if (startDate.includes("T")) {
      startDate = startDate.split("T")[0];
    }

    // 4. Construct payload matching exact Swagger schema (no 'principal', no 'type')
    const payload: CreateTenantLoanBody = {
      employeeId,
      purpose: data.purpose.trim(),
      principalAmount,
      monthlyRepayment,
      startDate,
    };

    // 5. Inspect/log final payload before submission to verify Swagger adherence
    console.log(
      "[PAYROLL API] Submitting POST /payroll/deductions/loans payload:",
      payload,
    );

    try {
      setIsCreatingLoan(true);
      const res = await createTenantLoan(payload);
      toast.success(res.message || "Loan created successfully");
      setShowAddLoanModal(false);
      fetchLoans();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosErr.response?.data?.message || "Failed to create loan.");
    } finally {
      setIsCreatingLoan(false);
    }
  };

  /* =======================================================
     ADD CUSTOM DEDUCTION
  ======================================================= */

  const handleAddCustomDeduction = async (
    data: CustomDeductionFormData,
  ) => {
    // 1. Resolve employeeId — the select stores the CUID directly;
    //    if the field is a free-text entry, try to match by fullName.
    let employeeId = data.employee.trim();
    if (payrollEmployees.length > 0) {
      const matchedEmp = payrollEmployees.find(
        (emp) =>
          emp.employeeId === employeeId ||
          (emp as unknown as { id?: string }).id === employeeId ||
          emp.fullName.toLowerCase() === employeeId.toLowerCase() ||
          (emp.employeeCode &&
            emp.employeeCode.toLowerCase() === employeeId.toLowerCase()),
      );
      if (matchedEmp) employeeId = matchedEmp.employeeId || (matchedEmp as unknown as { id?: string }).id || employeeId;
    }

    if (!employeeId) {
      toast.error("Please select a valid enrolled employee.");
      return;
    }

    // 2. Parse amount cleanly
    const rawAmount = String(data.monthlyAmount || "").replace(/,/g, "").trim();
    const amount = parseFloat(rawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid monthly amount greater than 0.");
      return;
    }

    // 3. Resolve deductionTypeId by matching deductionName against voluntary types
    let deductionTypeId: string | undefined;
    const deductionName = data.deductionName.trim();

    try {
      const typesRes = await getPayrollDeductionTypes();
      const matched = (typesRes.data || []).find(
        (t) =>
          t.category === "VOLUNTARY" &&
          t.name.toLowerCase() === deductionName.toLowerCase(),
      );
      if (matched) {
        deductionTypeId = matched.id;
      }
    } catch {
      // non-blocking — will attempt to auto-provision below
    }

    // 4. Auto-provision a new voluntary deduction type if none matched
    if (!deductionTypeId) {
      try {
        const newType = await createPayrollDeductionType({
          name: deductionName,
        });
        deductionTypeId = newType?.data?.id;
      } catch (provisionErr: unknown) {
        const axiosProvErr = provisionErr as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosProvErr.response?.data?.message ||
            "Failed to provision deduction type.",
        );
        return;
      }
    }

    if (!deductionTypeId) {
      toast.error("Could not resolve a deduction type. Please try again.");
      return;
    }

    // 5. Build Swagger-compliant payload
    const payload: CreateTenantCustomDeductionBody = {
      employeeId,
      deductionTypeId,
      amount,
      name: deductionName,
      type: data.type === "One-off" ? "ONE_OFF" : "RECURRING",
    };

    console.log(
      "[PAYROLL API] Submitting POST /payroll/deductions/custom payload:",
      payload,
    );

    try {
      setIsCreatingCustomDeduction(true);
      const res = await createTenantCustomDeduction(payload);
      toast.success(res.message || "Custom deduction created successfully.");
      setShowAddDeductionModal(false);
      fetchCustomDeductions();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            message?: string;
            validationErrors?: Array<{ message?: string }>;
          };
        };
      };
      const validationMsg =
        axiosErr.response?.data?.validationErrors?.[0]?.message;
      toast.error(
        validationMsg ||
          axiosErr.response?.data?.message ||
          "Failed to create custom deduction.",
      );
    } finally {
      setIsCreatingCustomDeduction(false);
    }
  };

  /* =======================================================
     REMOVE CUSTOM DEDUCTION
  ======================================================= */

  const handleRemoveCustomDeduction = async (
    deduction: CustomDeduction,
  ) => {
    // Prevent concurrent deletes
    if (deletingCustomDeductionId) return;

    const deductionId = deduction.id;

    if (!deductionId) {
      toast.error("Cannot remove deduction: missing ID.");
      return;
    }

    try {
      setDeletingCustomDeductionId(deductionId);

      // Live path — call DELETE /api/v1/payroll/deductions/custom/{deductionId}
      const res = await deleteTenantCustomDeduction(deductionId);
      toast.success(res?.message || "Custom deduction removed successfully.");

      // Optimistically remove from state so the table immediately updates
      setApiCustomDeductions((prev) =>
        prev ? prev.filter((item) => item.id !== deductionId) : prev
      );

      fetchCustomDeductions();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosErr.response?.data?.message || "Failed to remove deduction.",
      );
    } finally {
      setDeletingCustomDeductionId(null);
    }
  };

  /* =======================================================
     VIEW LOAN
  ======================================================= */

  const handleViewLoan = (loan: NormalizedLoan) => {
    router.push(`/payroll/deductions/${loan.id}`);
  };

  /* =======================================================
     HEADER ACTION
  ======================================================= */

  /* The header button adds to whichever tab is being looked at. */
  const isLoansTab = activeTab === "loans";

  const addLabel = isLoansTab ? "Add Loan" : "Add Deduction";

  const handleHeaderAdd = () => {
    if (isLoansTab) {
      setShowAddLoanModal(true);
      return;
    }

    setShowAddDeductionModal(true);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 text-[#263447]">
      {/* ===================================================
          HEADER
      ================================================== */}

      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-[34px] font-bold leading-tight tracking-[-0.8px] text-[#263447]">
            Deductions
          </h1>

          <p className="mt-2 text-[14px] leading-5 text-[#718096]">
            Manage employee loans, advances, and recurring custom deductions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleHeaderAdd}
          className="flex h-11 items-center gap-2 rounded-md bg-[#087fbd] px-5 text-[14px] font-semibold text-white transition hover:bg-[#076fa7] focus:outline-none focus:ring-2 focus:ring-[#087fbd]/30"
        >
          <Plus size={18} strokeWidth={2} />

          <span>{addLabel}</span>
        </button>
      </header>

      {/* ===================================================
          SUMMARY CARDS
      ================================================== */}

      <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <SummaryCard
          title="Active Loans"
          value={String(activeLoansCount)}
          valueClass="text-[#087fbd]"
        />

        <SummaryCard
          title="Monthly Loan Deductions"
          value={naira(monthlyTotal)}
          valueClass="text-[#ff3b3b]"
        />

        <SummaryCard
          title="Total Outstanding"
          value={naira(outstandingTotal)}
          valueClass="text-[#927000]"
        />
      </section>

      {/* ===================================================
          TABS
      ================================================== */}

      <section className="mt-8 flex h-12 items-end border-b border-[#dce2e8]">
        <TabButton
          active={activeTab === "loans"}
          onClick={() => setActiveTab("loans")}
          count={displayLoans.length}
        >
          Loans & Advances
        </TabButton>

        <TabButton
          active={activeTab === "custom"}
          onClick={() => setActiveTab("custom")}
          count={displayCustomDeductions.length}
        >
          Custom Deductions
        </TabButton>
      </section>

      {/* ===================================================
          CONTENT
      ================================================== */}

      {activeTab === "loans" ? (
        <LoansContent
          loans={displayLoans}
          search={search}
          status={status}
          loading={loading}
          error={error}
          onRetry={fetchLoans}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onViewLoan={handleViewLoan}
        />
      ) : (
        <CustomDeductions
          deductions={displayCustomDeductions}
          search={customSearch}
          type={customType}
          loading={customLoading}
          error={customError}
          deletingId={deletingCustomDeductionId}
          onRetry={fetchCustomDeductions}
          onSearchChange={setCustomSearch}
          onTypeChange={setCustomType}
          onRemove={handleRemoveCustomDeduction}
        />
      )}

      {/* ===================================================
          ADD LOAN MODAL
      ================================================== */}

      <AddLoanModal
        isOpen={showAddLoanModal}
        onClose={() => setShowAddLoanModal(false)}
        onSubmit={handleAddLoan}
        isSubmitting={isCreatingLoan}
        employees={payrollEmployees}
      />

      {/* ===================================================
          ADD CUSTOM DEDUCTION MODAL
      ================================================== */}

      <AddCustomDeductionModal
        isOpen={showAddDeductionModal}
        onClose={() => setShowAddDeductionModal(false)}
        onSubmit={handleAddCustomDeduction}
        isSubmitting={isCreatingCustomDeduction}
        employees={payrollEmployees.map((emp) => ({
          employeeId: emp.employeeId || (emp as unknown as { id?: string }).id || "",
          fullName: emp.fullName,
          employeeCode: emp.employeeId,
        }))}
      />
    </main>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

type SummaryCardProps = {
  title: string;
  value: string;
  valueClass: string;
};

function SummaryCard({ title, value, valueClass }: SummaryCardProps) {
  return (
    <div className="min-h-[105px] rounded-lg border border-[#dce2e8] bg-white px-5 py-5">
      <p className="text-[14px] font-medium text-[#718096]">{title}</p>

      <p className={`mt-3 text-[25px] font-bold leading-none ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   TAB BUTTON
========================================================= */

type TabButtonProps = {
  children: React.ReactNode;
  active: boolean;
  count: number;
  onClick: () => void;
};

function TabButton({ children, active, count, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-12 items-center gap-2 px-5 text-[14px] font-medium transition ${active ? "text-[#087fbd]" : "text-[#718096] hover:text-[#344054]"}`}
    >
      {children}

      <span
        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${active ? "bg-[#2388c1] text-white" : "bg-[#f1f3f5] text-[#9aa4af]"}`}
      >
        {count}
      </span>

      {active && (
        <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#087fbd]" />
      )}
    </button>
  );
}

/* =========================================================
   LOANS CONTENT
========================================================= */

type LoansContentProps = {
  loans: NormalizedLoan[];
  search: string;
  status: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onViewLoan: (loan: NormalizedLoan) => void;
};

function LoansContent({
  loans,
  search,
  status,
  loading,
  error,
  onRetry,
  onSearchChange,
  onStatusChange,
  onViewLoan,
}: LoansContentProps) {
  return (
    <section className="mt-6">
      {/* =================================================
          FILTER BAR
      ================================================= */}

      <div className="flex items-center gap-3">
        {/* Search */}

        <div className="relative w-[300px]">
          <Search
            size={17}
            strokeWidth={1.8}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a9b4]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search employee or purpose..."
            className="h-11 w-full rounded-md border border-[#dce2e8] bg-white pl-10 pr-4 text-[14px] text-[#344054] outline-none placeholder:text-[#8994a3] focus:border-[#087fbd] focus:ring-2 focus:ring-[#087fbd]/10"
          />
        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-11 w-[135px] rounded-md border border-[#dce2e8] bg-white px-4 text-[14px] font-medium text-[#344054] outline-none focus:border-[#087fbd] focus:ring-2 focus:ring-[#087fbd]/10"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Paused</option>
          <option>Completed</option>
          <option>Closed Early</option>
        </select>

        {/* Export */}

        <button
          type="button"
          className="h-11 rounded-md border border-[#dce2e8] bg-white px-5 text-[14px] font-medium text-[#607083] transition hover:bg-[#f8fafc] hover:text-[#344054]"
        >
          Export
        </button>
      </div>

      {/* =================================================
          TABLE & STATES
      ================================================= */}

      {loading ? (
        <div className="mt-5 flex flex-col items-center justify-center rounded-lg border border-[#dce2e8] bg-white py-20 text-[#8994a3]">
          <Loader2 className="h-7 w-7 animate-spin text-[#087fbd]" />
          <p className="mt-2 text-[14px] font-medium text-[#718096]">
            Loading loans...
          </p>
        </div>
      ) : error && loans.length === 0 ? (
        <div className="mt-5 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-6 text-center text-sm text-[#991b1b]">
          <AlertCircle className="mx-auto mb-2 h-6 w-6 text-[#ef4444]" />
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-md bg-[#ef4444] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Retry
          </button>
        </div>
      ) : (
        <LoanTable loans={loans} onViewLoan={onViewLoan} />
      )}
    </section>
  );
}

/* =========================================================
   LOAN TABLE
========================================================= */

type LoanTableProps = {
  loans: NormalizedLoan[];
  onViewLoan: (loan: NormalizedLoan) => void;
};

function LoanTable({ loans, onViewLoan }: LoanTableProps) {
  return (
    <section className="mt-5 overflow-x-auto rounded-lg border border-[#dce2e8] bg-white">
      {/* Table Header */}

      <div className="grid min-w-[1050px] grid-cols-[2.2fr_1.5fr_1.2fr_1.2fr_1.1fr_1.1fr_1.1fr_0.8fr] items-center border-b border-[#e5e9ed] bg-[#fcfdfe] px-5 py-4">
        <TableHeader>Employee</TableHeader>
        <TableHeader>Purpose</TableHeader>
        <TableHeader>Principal</TableHeader>
        <TableHeader>Outstanding</TableHeader>
        <TableHeader>Repaid</TableHeader>
        <TableHeader>Monthly</TableHeader>
        <TableHeader>Status</TableHeader>
        <TableHeader>Action</TableHeader>
      </div>

      {/* Table Rows */}

      {loans.map((loan) => (
        <LoanRow key={loan.id} loan={loan} onView={() => onViewLoan(loan)} />
      ))}

      {/* Empty State */}

      {loans.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[15px] font-semibold text-[#344054]">
            No loans found
          </p>

          <p className="mt-1 text-[14px] text-[#8994a3]">
            Try changing your search or status filter.
          </p>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[13px] font-semibold text-[#718096]">{children}</span>
  );
}

/* =========================================================
   LOAN ROW
========================================================= */

type LoanRowProps = {
  loan: NormalizedLoan;
  onView: () => void;
};

function LoanRow({ loan, onView }: LoanRowProps) {
  const percent = Math.min(100, Math.max(0, Math.round(loan.repaidPercent)));

  return (
    <div className="grid min-h-[64px] min-w-[1050px] grid-cols-[2.2fr_1.5fr_1.2fr_1.2fr_1.1fr_1.1fr_1.1fr_0.8fr] items-center border-b border-[#edf0f3] px-5 last:border-b-0 hover:bg-[#fafcff]">
      {/* Employee */}

      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4f3fc] text-[11px] font-bold text-[#087fbd]">
          {initials(loan.employee)}
        </div>

        <span className="truncate text-[14px] font-semibold text-[#263447]">
          {loan.employee}
        </span>
      </div>

      {/* Purpose */}

      <span className="truncate text-[14px] text-[#617287]">
        {loan.purpose}
      </span>

      {/* Principal */}

      <span className="text-[14px] font-medium text-[#344054]">
        {naira(loan.principal)}
      </span>

      {/* Outstanding */}

      <span className="text-[14px] font-semibold text-[#ff3b3b]">
        {naira(loan.outstanding)}
      </span>

      {/* Repaid */}

      <div className="flex items-center gap-2.5">
        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-[#e8edf0]">
          <div
            className="h-full rounded-full bg-[#16823b]"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>

        <span className="text-[13px] text-[#718096]">{percent}%</span>
      </div>

      {/* Monthly */}

      <span className="text-[14px] font-semibold text-[#087fbd]">
        {naira(loan.monthly)}
      </span>

      {/* Status */}

      <div>
        <StatusBadge status={loan.status} />
      </div>

      {/* Action */}

      <button
        type="button"
        onClick={onView}
        className="h-9 w-[55px] rounded-md bg-[#e5f3fb] text-[13px] font-medium text-[#087fbd] transition hover:bg-[#d8edf8]"
      >
        View
      </button>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }: { status: string }) {
  const displayLabel =
    status === "ACTIVE"
      ? "Active"
      : status === "PAUSED"
        ? "Paused"
        : status === "COMPLETED"
          ? "Completed"
          : status === "CLOSED_EARLY"
            ? "Closed Early"
            : status === "CANCELLED"
              ? "Cancelled"
              : status;

  const style =
    badgeStyles[status] ||
    badgeStyles[displayLabel] ||
    "bg-[#eef1f4] text-[#697586]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold ${style}`}
    >
      {displayLabel}
    </span>
  );
}
