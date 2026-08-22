// app/payroll/payslips/[id]/page.tsx

"use client";

import { ArrowLeft, Download, Printer } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  earningsBreakdown,
  employerContributions,
  parsePayslipRouteId,
  payReference,
  PayslipStatus,
  totalDeductions,
} from "@/types/payroll/pay-run-data";

import { payRuns, payslips } from "@/data/payroll/pay-run-data";

import { naira } from "@/types/payroll/payee-data";

/* =========================================================
   CONSTANTS
========================================================= */

const statusStyles: Record<PayslipStatus, string> = {
  Paid: "bg-[#d8f5dc] text-[#16823b]",
  Pending: "bg-[#fef9c3] text-[#a16207]",
};

/* =========================================================
   HELPERS
========================================================= */

const negative = (value: number) => `(${naira(value)})`;

/* =========================================================
   PAGE
========================================================= */

export default function PayslipView() {
  const router = useRouter();
  const params = useParams();

  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { runId, slipId } = parsePayslipRouteId(idParam ?? "");

  const run = payRuns.find((item) => item.id === runId);

  const slip = payslips.find((item) => item.id === slipId);

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!run || !slip) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f7f9fb]
         p-4
          text-[#263447]
        "
      >
        <button
          type="button"
          onClick={() => router.push("/payroll/payslips")}
          className="
            mb-6
            flex
            items-center
            gap-2
            text-[14px]
            font-medium
            text-[#526477]
            transition
            hover:text-[#1682bd]
          "
        >
          <ArrowLeft size={18} />
          Back to Payslips
        </button>

        <p className="text-[16px] text-[#9ca3af]">Payslip not found.</p>
      </div>
    );
  }

  /* =======================================================
     ACTIONS
  ======================================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const earningsSplit = earningsBreakdown(slip);
  const employer = employerContributions(slip);

  /*
   * A draft run has not paid employees yet,
   * therefore the payslip remains pending.
   */
  const status: PayslipStatus =
    run.status === "Disbursed" ? slip.status : "Pending";

  /* =======================================================
     EARNINGS
  ======================================================= */

  const earnings = [
    {
      label: "Basic Salary",
      amount: naira(earningsSplit.basic),
    },
    {
      label: "Housing Allowance",
      amount: naira(earningsSplit.housing),
    },
    {
      label: "Transport Allowance",
      amount: naira(earningsSplit.transport),
    },
    {
      label: "Other Allowance",
      amount: naira(earningsSplit.other),
    },
  ];

  /* =======================================================
     DEDUCTIONS
  ======================================================= */

  const deductions = [
    {
      label: "PAYE (Income Tax)",
      amount: negative(slip.paye),
      color: "text-red-500",
    },
    {
      label: "Pension (Employee 8%)",
      amount: negative(slip.pension),
      color: "text-[#9b7100]",
    },
    {
      label: "NHF (2.5%)",
      amount: negative(slip.nhf),
      color: "text-[#9b17bd]",
    },

    ...(slip.loans > 0
      ? [
          {
            label: "Loan Repayment",
            amount: negative(slip.loans),
            color: "text-[#c2410c]",
          },
        ]
      : []),

    {
      label: "Total Deductions",
      amount: negative(totalDeductions(slip)),
      color: "text-red-500",
    },
  ];

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-[#f7f9fb]
        text-[#263447]
      "
    >
      {/* ===================================================
          ACTION BAR
      ================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          p-4
          print:hidden
        "
      >
        {/* Back */}

        <button
          type="button"
          onClick={() => router.push("/payroll/payslips")}
          className="
            flex
            items-center
            gap-2
            text-[14px]
            font-medium
            text-[#526477]
            transition
            hover:text-[#1682bd]
          "
        >
          <ArrowLeft size={18} />
          Back to Payslips
        </button>

        {/* Actions */}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="
              flex
              h-11
              items-center
              gap-2
              rounded-md
              border
              border-[#d9e0e7]
              bg-white
              px-5
              text-[14px]
              font-medium
              text-[#536274]
              transition
              hover:bg-[#f8fafc]
            "
          >
            <Printer size={17} />
            Print
          </button>

          <button
            type="button"
            onClick={handlePrint}
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
            "
          >
            <Download size={17} />
            Download PDF
          </button>
        </div>
      </div>

      {/* ===================================================
          PAYSLIP CONTAINER
      ================================================== */}

      <main
        className="
          flex
          justify-center
          px-4
          pb-12
          sm:px-6
        "
      >
        <div
          id="payslip"
          className="
            w-full
            max-w-[720px]
            overflow-hidden
            rounded-md
            border
            border-[#e1e6eb]
            bg-white
            shadow-[0_4px_20px_rgba(0,0,0,0.06)]
            print:max-w-none
            print:rounded-none
            print:border-0
            print:shadow-none
          "
        >
          {/* =================================================
              COMPANY HEADER
          ================================================= */}

          <section
            className="
              flex
              min-h-[145px]
              items-center
              justify-between
              bg-gradient-to-r
              from-[#197db9]
              to-[#2087c5]
              px-8
              py-7
              text-white
              sm:px-10
            "
          >
            {/* Company */}

            <div>
              <h1
                className="
                  text-[24px]
                  font-bold
                  tracking-[-0.4px]
                "
              >
                Sinkronis Technologies Ltd
              </h1>

              <p
                className="
                  mt-2
                  text-[13px]
                  text-white/90
                "
              >
                14 Adeola Odeku Street, Victoria Island, Lagos
              </p>

              <p
                className="
                  mt-1
                  text-[13px]
                  text-white/90
                "
              >
                admin@sinkronis.com
              </p>
            </div>

            {/* Payslip */}

            <div className="text-right">
              <h2
                className="
                  text-[22px]
                  font-bold
                  tracking-wide
                "
              >
                PAYSLIP
              </h2>

              <p
                className="
                  mt-2
                  text-[13px]
                  text-white/90
                "
              >
                Pay Period: {run.period}
              </p>

              <span
                className={`
                  mt-3
                  inline-flex
                  rounded-full
                  px-4
                  py-1.5
                  text-[12px]
                  font-semibold
                  ${statusStyles[status]}
                `}
              >
                {status}
              </span>
            </div>
          </section>

          {/* =================================================
              EMPLOYEE INFORMATION
          ================================================= */}

          <section
            className="
              grid
              grid-cols-1
              gap-x-12
              gap-y-6
              border-b
              border-[#e5e9ed]
              px-8
              py-7
              sm:grid-cols-2
              sm:px-10
            "
          >
            <InfoItem label="EMPLOYEE NAME" value={slip.name} />

            <InfoItem label="DEPARTMENT" value={slip.dept} />

            <InfoItem label="ROLE / POSITION" value={slip.role} />

            <InfoItem
              label="BANK"
              value={`${slip.bankName} — ${slip.bankAccount}`}
            />

            <InfoItem label="PFA" value="Stanbic IBTC Pension" />

            <InfoItem label="PAY REFERENCE" value={payReference(run, slip)} />
          </section>

          {/* =================================================
              EARNINGS & DEDUCTIONS
          ================================================= */}

          <section
            className="
              grid
              grid-cols-1
              gap-10
              px-8
              py-8
              sm:grid-cols-2
              sm:px-10
            "
          >
            {/* =================================================
                EARNINGS
            ================================================= */}

            <BreakdownSection title="EARNINGS">
              {earnings.map((item) => (
                <BreakdownRow
                  key={item.label}
                  label={item.label}
                  amount={item.amount}
                />
              ))}

              {/* Gross Salary */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  pt-4
                "
              >
                <span
                  className="
                    text-[14px]
                    font-bold
                    text-[#263447]
                  "
                >
                  Gross Salary
                </span>

                <span
                  className="
                    text-[15px]
                    font-bold
                    text-[#087fbd]
                  "
                >
                  {naira(slip.gross)}
                </span>
              </div>
            </BreakdownSection>

            {/* =================================================
                DEDUCTIONS
            ================================================= */}

            <BreakdownSection title="DEDUCTIONS">
              {deductions.map((item) => (
                <BreakdownRow
                  key={item.label}
                  label={item.label}
                  amount={item.amount}
                  amountClass={item.color}
                />
              ))}
            </BreakdownSection>
          </section>

          {/* =================================================
              NET PAY
          ================================================= */}

          <section className="px-8 pb-6 sm:px-10">
            <div
              className="
                flex
                min-h-[90px]
                items-center
                justify-between
                rounded-md
                border
                border-[#bce6c7]
                bg-[#effbf2]
                px-6
              "
            >
              <span
                className="
                  text-[16px]
                  font-bold
                  tracking-wide
                  text-[#263447]
                "
              >
                NET PAY
              </span>

              <span
                className="
                  text-[28px]
                  font-bold
                  text-[#21843a]
                "
              >
                {naira(slip.netPay)}
              </span>
            </div>
          </section>

          {/* =================================================
              EMPLOYER CONTRIBUTIONS
          ================================================= */}

          <section className="px-8 pb-7 sm:px-10">
            <div
              className="
                rounded-md
                border
                border-[#e0e5e9]
                bg-[#fafbfc]
                px-5
                py-5
              "
            >
              <p
                className="
                  text-[11px]
                  font-bold
                  tracking-wide
                  text-[#92a0b0]
                "
              >
                EMPLOYER CONTRIBUTIONS
              </p>

              <p
                className="
                  mt-1
                  text-[12px]
                  text-[#92a0b0]
                "
              >
                Not deducted from employee salary
              </p>

              <div
                className="
                  mt-4
                  flex
                  flex-col
                  gap-3
                  text-[13px]
                  text-[#617287]
                  sm:flex-row
                  sm:gap-8
                "
              >
                <p>
                  Pension (10%):{" "}
                  <span
                    className="
                      font-semibold
                      text-[#263447]
                    "
                  >
                    {naira(employer.pension)}
                  </span>
                </p>

                <p>
                  NSITF (1%):{" "}
                  <span
                    className="
                      font-semibold
                      text-[#263447]
                    "
                  >
                    {naira(employer.nsitf)}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer
            className="
              border-t
              border-[#e4e8ec]
              px-8
              py-6
              text-center
              sm:px-10
            "
          >
            <p
              className="
                text-[11px]
                leading-5
                text-[#94a0ad]
              "
            >
              This is a computer-generated payslip and does not require a
              signature. For queries, contact HR at hr@sinkronis.com
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   BREAKDOWN SECTION
========================================================= */

type BreakdownSectionProps = {
  title: string;
  children: React.ReactNode;
};

function BreakdownSection({ title, children }: BreakdownSectionProps) {
  return (
    <div>
      <h3
        className="
          mb-4
          text-[14px]
          font-bold
          tracking-wide
          text-[#263447]
        "
      >
        {title}
      </h3>

      <div>{children}</div>
    </div>
  );
}

/* =========================================================
   BREAKDOWN ROW
========================================================= */

type BreakdownRowProps = {
  label: string;
  amount: string;
  amountClass?: string;
};

function BreakdownRow({
  label,
  amount,
  amountClass = "text-[#293544]",
}: BreakdownRowProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-dotted
        border-[#dfe4e9]
        py-3
        text-[13px]
      "
    >
      <span className="text-[#617287]">{label}</span>

      <span
        className={`
          font-semibold
          ${amountClass}
        `}
      >
        {amount}
      </span>
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p
        className="
          text-[11px]
          font-bold
          tracking-[0.6px]
          text-[#91a0b0]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-[14px]
          font-medium
          leading-5
          text-[#293544]
        "
      >
        {value}
      </p>
    </div>
  );
}
