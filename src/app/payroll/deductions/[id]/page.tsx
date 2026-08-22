// app/payroll/deductions/[id]/page.tsx

"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  amortizationSchedule,
  initials,
  LoanStatus,
  monthsRemaining,
  repaid,
  repaidPercent,
  termMonths,
} from "@/types/payroll/deduction-data";

import { useDeductions } from "@/context/payroll/DeductionContext";

import { naira } from "@/types/payroll/payee-data";

/* =========================================================
   CONSTANTS
========================================================= */

const statusStyles: Record<LoanStatus, string> = {
  Active: "bg-[#d8f1de] text-[#25803d]",
  Paused: "bg-[#fff1c9] text-[#927000]",
  Closed: "bg-[#eef1f4] text-[#697586]",
};

/* =========================================================
   PAGE
========================================================= */

export default function LoanDetailPage() {
  const router = useRouter();
  const params = useParams();

  const { getLoanById, setLoanStatus, updateLoan } = useDeductions();

  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const loan = getLoanById(idParam ?? "");

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!loan) {
    return (
      <main
        className="
          min-h-screen
          bg-[#f8fafc]
          p-4
          text-[#263447]
        "
      >
        <BackLink onClick={() => router.push("/payroll/deductions")} />

        <p className="text-[15px] text-[#8994a3]">Loan not found.</p>
      </main>
    );
  }

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const percent = repaidPercent(loan);
  const schedule = amortizationSchedule(loan);

  /*
   * The caption reports the full term rather than what is left, matching
   * how the loan was originally agreed.
   */
  const caption = [
    `${percent}% repaid`,
    `${termMonths(loan)} months remaining`,
    `Started ${loan.startDate}`,
  ].join(" · ");

  /* =======================================================
     ACTIONS
  ======================================================= */

  const handleAdjustRepayment = () => {
    const next = window.prompt(
      "New monthly repayment (₦)",
      String(loan.monthly),
    );

    if (next === null) return;

    const amount = Number(next);

    if (!Number.isFinite(amount) || amount <= 0) return;

    updateLoan(loan.id, { monthly: amount });
  };

  const handleTogglePause = () => {
    setLoanStatus(loan.id, loan.status === "Paused" ? "Active" : "Paused");
  };

  const handleCloseEarly = () => {
    const confirmed = window.confirm(
      `Close this loan early? The remaining ${naira(
        loan.outstanding,
      )} will be written off.`,
    );

    if (confirmed) {
      setLoanStatus(loan.id, "Closed");
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-[#f8fafc]
        px-6
        py-7
        text-[#263447]
        lg:px-8
      "
    >
      <BackLink onClick={() => router.push("/payroll/deductions")} />

      {/* ===================================================
          EMPLOYEE CARD
      ================================================== */}

      <section
        className="
          flex
          items-center
          justify-between
          gap-4
          rounded-lg
          border
          border-[#dce2e8]
          bg-white
          px-6
          py-5
        "
      >
        <div className="flex min-w-0 items-center gap-4">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#e4f3fc]
              text-[13px]
              font-bold
              text-[#087fbd]
            "
          >
            {initials(loan.employee)}
          </div>

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-[19px]
                font-bold
                leading-tight
                tracking-[-0.2px]
                text-[#263447]
              "
            >
              {loan.employee}
            </h1>

            <p
              className="
                mt-1
                text-[13px]
                text-[#8994a3]
              "
            >
              {loan.purpose}
            </p>
          </div>
        </div>

        <span
          className={`
            inline-flex
            shrink-0
            items-center
            rounded-full
            px-4
            py-1.5
            text-[12px]
            font-semibold
            ${statusStyles[loan.status]}
          `}
        >
          {loan.status}
        </span>
      </section>

      {/* ===================================================
          STAT CARDS
      ================================================== */}

      <section
        className="
          mt-5
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <StatCard label="Principal" value={naira(loan.principal)} />

        <StatCard
          label="Outstanding"
          value={naira(loan.outstanding)}
          valueClass="text-[#ff3b3b]"
        />

        <StatCard
          label="Repaid"
          value={naira(repaid(loan))}
          valueClass="text-[#16823b]"
        />

        <StatCard
          label="Monthly Repay"
          value={naira(loan.monthly)}
          valueClass="text-[#087fbd]"
        />
      </section>

      {/* ===================================================
          PROGRESS
      ================================================== */}

      <section className="mt-6">
        <div
          className="
            h-2
            w-full
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
              transition-all
            "
            style={{ width: `${percent}%` }}
          />
        </div>

        <p
          className="
            mt-2.5
            text-[13px]
            text-[#8994a3]
          "
        >
          {caption}
        </p>
      </section>

      {/* ===================================================
          ACTIONS
      ================================================== */}

      <section
        className="
          mt-5
          flex
          flex-wrap
          items-center
          gap-3
        "
      >
        <ActionButton
          onClick={handleAdjustRepayment}
          className="
            bg-[#e5f3fb]
            text-[#087fbd]
            hover:bg-[#d8edf8]
          "
        >
          Adjust Repayment
        </ActionButton>

        <ActionButton
          onClick={handleTogglePause}
          className="
            bg-[#fdf3d3]
            text-[#927000]
            hover:bg-[#fbebbd]
          "
        >
          {loan.status === "Paused" ? "Resume Repayment" : "Pause Repayment"}
        </ActionButton>

        <ActionButton
          onClick={handleCloseEarly}
          className="
            bg-[#fde7ea]
            text-[#e8384f]
            hover:bg-[#fbd7dc]
          "
        >
          Close Early
        </ActionButton>

        <ActionButton
          className="
            border
            border-[#dce2e8]
            bg-white
            text-[#607083]
            hover:bg-[#f8fafc]
            hover:text-[#344054]
          "
        >
          Export Schedule
        </ActionButton>
      </section>

      {/* ===================================================
          AMORTIZATION SCHEDULE
      ================================================== */}

      <section
        className="
          mt-6
          overflow-hidden
          rounded-lg
          border
          border-[#dce2e8]
          bg-white
        "
      >
        <header
          className="
            border-b
            border-[#e5e9ed]
            px-6
            py-4
          "
        >
          <h2
            className="
              text-[15px]
              font-bold
              text-[#263447]
            "
          >
            Amortization Schedule
          </h2>
        </header>

        <div className="overflow-x-auto">
          <table
            className="
              w-full
              min-w-[820px]
              border-collapse
              text-left
            "
          >
            <thead>
              <tr
                className="
                  border-b
                  border-[#e5e9ed]
                  text-[13px]
                  font-semibold
                  text-[#718096]
                "
              >
                <th className="px-6 py-3.5 font-semibold">Month</th>
                <th className="px-6 py-3.5 font-semibold">Date</th>
                <th className="px-6 py-3.5 font-semibold">Opening Balance</th>
                <th className="px-6 py-3.5 font-semibold">Repayment</th>
                <th className="px-6 py-3.5 font-semibold">Closing Balance</th>
              </tr>
            </thead>

            <tbody>
              {schedule.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="
                      px-6
                      py-14
                      text-center
                      text-[14px]
                      text-[#8994a3]
                    "
                  >
                    No repayment schedule for this loan.
                  </td>
                </tr>
              ) : (
                schedule.map((row, index) => (
                  <tr
                    key={row.month}
                    className={`
                      border-b
                      border-[#edf0f3]
                      text-[13.5px]
                      last:border-b-0
                      ${
                        row.isCurrent
                          ? "bg-[#eff8fe]"
                          : index % 2 === 1
                            ? "bg-[#f5f6fa]"
                            : "bg-white"
                      }
                    `}
                  >
                    <td
                      className={`
                        px-6
                        py-3.5
                        ${
                          row.isCurrent
                            ? "font-semibold text-[#087fbd]"
                            : "text-[#344054]"
                        }
                      `}
                    >
                      {row.month}
                      {row.isCurrent && " ← Current"}
                    </td>

                    <td className="px-6 py-3.5 text-[#617287]">{row.date}</td>

                    <td className="px-6 py-3.5 text-[#344054]">
                      {naira(row.opening)}
                    </td>

                    <td
                      className="
                        px-6
                        py-3.5
                        font-medium
                        text-[#087fbd]
                      "
                    >
                      {naira(row.repayment)}
                    </td>

                    <td
                      className="
                        px-6
                        py-3.5
                        font-medium
                        text-[#ff3b3b]
                      "
                    >
                      {naira(row.closing)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Remaining term, for context under a long schedule. */}
      {schedule.length > 0 && (
        <p
          className="
            mt-4
            text-[13px]
            text-[#8994a3]
          "
        >
          {monthsRemaining(loan)} of {termMonths(loan)} instalments outstanding.
        </p>
      )}
    </main>
  );
}

/* =========================================================
   BACK LINK
========================================================= */

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        mb-5
        flex
        items-center
        gap-1.5
        text-[14px]
        font-medium
        text-[#526477]
        transition
        hover:text-[#1682bd]
      "
    >
      <ChevronLeft size={17} />
      Back to Deductions
    </button>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

type StatCardProps = {
  label: string;
  value: string;
  valueClass?: string;
};

function StatCard({
  label,
  value,
  valueClass = "text-[#263447]",
}: StatCardProps) {
  return (
    <div
      className="
        rounded-lg
        border
        border-[#dce2e8]
        bg-white
        px-5
        py-4
      "
    >
      <p
        className="
          text-[13px]
          text-[#8994a3]
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-2
          text-[21px]
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
   ACTION BUTTON
========================================================= */

type ActionButtonProps = {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
};

function ActionButton({ children, className, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        h-10
        rounded-md
        px-4
        text-[13.5px]
        font-semibold
        transition
        ${className}
      `}
    >
      {children}
    </button>
  );
}
