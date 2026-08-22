"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";

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
  Loan,
  LoanStatus,
  loanSummary,
  repaidPercent,
} from "@/types/payroll/deduction-data";

import { useDeductions } from "@/context/payroll/DeductionContext";

import { naira } from "@/types/payroll/payee-data";

/* =========================================================
   TYPES
========================================================= */

type ActiveTab = "loans" | "custom";

const badgeStyles: Record<LoanStatus, string> = {
  Active: "bg-[#d8f1de] text-[#25803d]",
  Paused: "bg-[#fff1c9] text-[#927000]",
  Closed: "bg-[#eef1f4] text-[#697586]",
};

/* =========================================================
   PAGE
========================================================= */

export default function DeductionsPage() {
  const router = useRouter();

  const {
    loans,
    addLoan,
    customDeductions,
    addCustomDeduction,
    deleteCustomDeduction,
  } = useDeductions();

  const [activeTab, setActiveTab] = useState<ActiveTab>("loans");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All Status");

  const [customSearch, setCustomSearch] = useState("");

  const [customType, setCustomType] = useState("All Types");

  const [showAddLoanModal, setShowAddLoanModal] = useState(false);

  const [showAddDeductionModal, setShowAddDeductionModal] = useState(false);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary = loanSummary(loans);

  /* =======================================================
     FILTERED LOANS
  ======================================================= */

  const filteredLoans = loans.filter((loan) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch =
      loan.employee.toLowerCase().includes(searchTerm) ||
      loan.purpose.toLowerCase().includes(searchTerm);

    const matchesStatus = status === "All Status" || loan.status === status;

    return matchesSearch && matchesStatus;
  });

  /* =======================================================
     FILTERED CUSTOM DEDUCTIONS
  ======================================================= */

  const filteredCustomDeductions = customDeductions.filter((deduction) => {
    const searchTerm = customSearch.toLowerCase().trim();

    const matchesSearch =
      deduction.employee.toLowerCase().includes(searchTerm) ||
      deduction.deductionName.toLowerCase().includes(searchTerm);

    const matchesType =
      customType === "All Types" || deduction.type === customType;

    return matchesSearch && matchesType;
  });

  /* =======================================================
     ADD LOAN
  ======================================================= */

  const handleAddLoan = (data: LoanFormData) => {
    const principal = Number(data.principal) || 0;

    /* A new loan starts with nothing repaid, so it is fully outstanding. */
    addLoan({
      id: crypto.randomUUID(),
      employee: data.employee,
      purpose: data.purpose,
      principal,
      outstanding: principal,
      monthly: Number(data.monthlyRepayment) || 0,
      startDate: data.startDate || new Date().toISOString().slice(0, 10),
      status: "Active",
    });
  };

  /* =======================================================
     ADD CUSTOM DEDUCTION
  ======================================================= */

  const handleAddCustomDeduction = (data: CustomDeductionFormData) => {
    addCustomDeduction({
      id: crypto.randomUUID(),
      employee: data.employee,
      deductionName: data.deductionName,
      monthlyAmount: Number(data.monthlyAmount) || 0,
      type: data.type,
    });
  };

  /* =======================================================
     REMOVE CUSTOM DEDUCTION
  ======================================================= */

  const handleRemoveCustomDeduction = (deduction: CustomDeduction) => {
    deleteCustomDeduction(deduction.id);
  };

  /* =======================================================
     VIEW LOAN
  ======================================================= */

  const handleViewLoan = (loan: Loan) => {
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
    <main
      className="
        min-h-screen
        bg-[#f8fafc]
        p-4
        text-[#263447]
        
      "
    >
      {/* ===================================================
          HEADER
      ================================================== */}

      <header className="flex items-start justify-between">
        <div>
          <h1
            className="
              text-[34px]
              font-bold
              leading-tight
              tracking-[-0.8px]
              text-[#263447]
            "
          >
            Deductions
          </h1>

          <p
            className="
              mt-2
              text-[14px]
              leading-5
              text-[#718096]
            "
          >
            Manage employee loans, advances, and recurring custom deductions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleHeaderAdd}
          className="
            flex
            h-11
            items-center
            gap-2
            rounded-md
            bg-[#087fbd]
            px-5
            text-[14px]
            font-semibold
            text-white
            transition
            hover:bg-[#076fa7]
            focus:outline-none
            focus:ring-2
            focus:ring-[#087fbd]/30
          "
        >
          <Plus size={18} strokeWidth={2} />

          <span>{addLabel}</span>
        </button>
      </header>

      {/* ===================================================
          SUMMARY CARDS
      ================================================== */}

      <section
        className="
          mt-8
          grid
          grid-cols-1
          gap-5
          md:grid-cols-3
        "
      >
        <SummaryCard
          title="Active Loans"
          value={String(summary.activeCount)}
          valueClass="text-[#087fbd]"
        />

        <SummaryCard
          title="Monthly Loan Deductions"
          value={naira(summary.monthlyTotal)}
          valueClass="text-[#ff3b3b]"
        />

        <SummaryCard
          title="Total Outstanding"
          value={naira(summary.outstandingTotal)}
          valueClass="text-[#927000]"
        />
      </section>

      {/* ===================================================
          TABS
      ================================================== */}

      <section
        className="
          mt-8
          flex
          h-12
          items-end
          border-b
          border-[#dce2e8]
        "
      >
        <TabButton
          active={activeTab === "loans"}
          onClick={() => setActiveTab("loans")}
          count={loans.length}
        >
          Loans & Advances
        </TabButton>

        <TabButton
          active={activeTab === "custom"}
          onClick={() => setActiveTab("custom")}
          count={customDeductions.length}
        >
          Custom Deductions
        </TabButton>
      </section>

      {/* ===================================================
          CONTENT
      ================================================== */}

      {activeTab === "loans" ? (
        <LoansContent
          loans={filteredLoans}
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onViewLoan={handleViewLoan}
        />
      ) : (
        <CustomDeductions
          deductions={filteredCustomDeductions}
          search={customSearch}
          type={customType}
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
      />

      {/* ===================================================
          ADD CUSTOM DEDUCTION MODAL
      ================================================== */}

      <AddCustomDeductionModal
        isOpen={showAddDeductionModal}
        onClose={() => setShowAddDeductionModal(false)}
        onSubmit={handleAddCustomDeduction}
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
    <div
      className="
        min-h-[105px]
        rounded-lg
        border
        border-[#dce2e8]
        bg-white
        px-5
        py-5
      "
    >
      <p
        className="
          text-[14px]
          font-medium
          text-[#718096]
        "
      >
        {title}
      </p>

      <p
        className={`
          mt-3
          text-[25px]
          font-bold
          leading-none
          ${valueClass}
        `}
      >
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
      className={`
        relative
        flex
        h-12
        items-center
        gap-2
        px-5
        text-[14px]
        font-medium
        transition
        ${active ? "text-[#087fbd]" : "text-[#718096] hover:text-[#344054]"}
      `}
    >
      {children}

      <span
        className={`
          flex
          h-5
          min-w-5
          items-center
          justify-center
          rounded-full
          px-1.5
          text-[11px]
          font-semibold
          ${active ? "bg-[#2388c1] text-white" : "bg-[#f1f3f5] text-[#9aa4af]"}
        `}
      >
        {count}
      </span>

      {active && (
        <span
          className="
            absolute
            bottom-[-1px]
            left-0
            h-[2px]
            w-full
            bg-[#087fbd]
          "
        />
      )}
    </button>
  );
}

/* =========================================================
   LOANS CONTENT
========================================================= */

type LoansContentProps = {
  loans: Loan[];
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onViewLoan: (loan: Loan) => void;
};

function LoansContent({
  loans,
  search,
  status,
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
            className="
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              text-[#a0a9b4]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search employee or purpose..."
            className="
              h-11
              w-full
              rounded-md
              border
              border-[#dce2e8]
              bg-white
              pl-10
              pr-4
              text-[14px]
              text-[#344054]
              outline-none
              placeholder:text-[#8994a3]
              focus:border-[#087fbd]
              focus:ring-2
              focus:ring-[#087fbd]/10
            "
          />
        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="
            h-11
            w-[135px]
            rounded-md
            border
            border-[#dce2e8]
            bg-white
            px-4
            text-[14px]
            font-medium
            text-[#344054]
            outline-none
            focus:border-[#087fbd]
            focus:ring-2
            focus:ring-[#087fbd]/10
          "
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Paused</option>
        </select>

        {/* Export */}

        <button
          type="button"
          className="
            h-11
            rounded-md
            border
            border-[#dce2e8]
            bg-white
            px-5
            text-[14px]
            font-medium
            text-[#607083]
            transition
            hover:bg-[#f8fafc]
            hover:text-[#344054]
          "
        >
          Export
        </button>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <LoanTable loans={loans} onViewLoan={onViewLoan} />
    </section>
  );
}

/* =========================================================
   LOAN TABLE
========================================================= */

type LoanTableProps = {
  loans: Loan[];
  onViewLoan: (loan: Loan) => void;
};

function LoanTable({ loans, onViewLoan }: LoanTableProps) {
  return (
    <section
      className="
        mt-5
        overflow-x-auto
        rounded-lg
        border
        border-[#dce2e8]
        bg-white
      "
    >
      {/* Table Header */}

      <div
        className="
          grid
          min-w-[1050px]
          grid-cols-[2.2fr_1.5fr_1.2fr_1.2fr_1.1fr_1.1fr_1.1fr_0.8fr]
          items-center
          border-b
          border-[#e5e9ed]
          bg-[#fcfdfe]
          px-5
          py-4
        "
      >
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
          <p
            className="
              text-[15px]
              font-semibold
              text-[#344054]
            "
          >
            No loans found
          </p>

          <p
            className="
              mt-1
              text-[14px]
              text-[#8994a3]
            "
          >
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
    <span
      className="
        text-[13px]
        font-semibold
        text-[#718096]
      "
    >
      {children}
    </span>
  );
}

/* =========================================================
   LOAN ROW
========================================================= */

type LoanRowProps = {
  loan: Loan;
  onView: () => void;
};

function LoanRow({ loan, onView }: LoanRowProps) {
  const percent = repaidPercent(loan);

  return (
    <div
      className="
        grid
        min-h-[64px]
        min-w-[1050px]
        grid-cols-[2.2fr_1.5fr_1.2fr_1.2fr_1.1fr_1.1fr_1.1fr_0.8fr]
        items-center
        border-b
        border-[#edf0f3]
        px-5
        last:border-b-0
        hover:bg-[#fafcff]
      "
    >
      {/* Employee */}

      <div className="flex min-w-0 items-center gap-3">
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#e4f3fc]
            text-[11px]
            font-bold
            text-[#087fbd]
          "
        >
          {initials(loan.employee)}
        </div>

        <span
          className="
            truncate
            text-[14px]
            font-semibold
            text-[#263447]
          "
        >
          {loan.employee}
        </span>
      </div>

      {/* Purpose */}

      <span
        className="
          truncate
          text-[14px]
          text-[#617287]
        "
      >
        {loan.purpose}
      </span>

      {/* Principal */}

      <span
        className="
          text-[14px]
          font-medium
          text-[#344054]
        "
      >
        {naira(loan.principal)}
      </span>

      {/* Outstanding */}

      <span
        className="
          text-[14px]
          font-semibold
          text-[#ff3b3b]
        "
      >
        {naira(loan.outstanding)}
      </span>

      {/* Repaid */}

      <div className="flex items-center gap-2.5">
        <div
          className="
            h-1.5
            w-12
            overflow-hidden
            rounded-full
            bg-[#e8edf0]
          "
        >
          <div
            className="
              h-full
              rounded-full
              bg-[#16823b]
            "
            style={{
              width: `${percent}%`,
            }}
          />
        </div>

        <span
          className="
            text-[13px]
            text-[#718096]
          "
        >
          {percent}%
        </span>
      </div>

      {/* Monthly */}

      <span
        className="
          text-[14px]
          font-semibold
          text-[#087fbd]
        "
      >
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
        className="
          h-9
          w-[55px]
          rounded-md
          bg-[#e5f3fb]
          text-[13px]
          font-medium
          text-[#087fbd]
          transition
          hover:bg-[#d8edf8]
        "
      >
        View
      </button>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1.5
        text-[12px]
        font-semibold
        ${badgeStyles[status]}
      `}
    >
      {status}
    </span>
  );
}
