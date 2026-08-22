"use client";

import { AlertTriangle, CheckCircle2, Download } from "lucide-react";

type RemittanceStatus = "Remitted" | "Pending";

type Remittance = {
  period: string;
  state: string;
  authority: string;
  authorityCode: string;
  employees: number;
  amount: string;
  dueDate: string;
  status: RemittanceStatus;
};

const remittances: Remittance[] = [
  {
    period: "May 2026",
    state: "Lagos",
    authority: "Lagos Internal Revenue Service",
    authorityCode: "LIRS",
    employees: 9,
    amount: "₦658,011",
    dueDate: "Jun 21, 2026",
    status: "Remitted",
  },
  {
    period: "May 2026",
    state: "Abuja (FCT)",
    authority: "Federal Capital Territory Internal Revenue Service",
    authorityCode: "FCT-IRS",
    employees: 4,
    amount: "₦227,867",
    dueDate: "Jun 21, 2026",
    status: "Remitted",
  },
  {
    period: "May 2026",
    state: "Rivers",
    authority: "Rivers State Internal Revenue Service",
    authorityCode: "RIRS",
    employees: 3,
    amount: "₦173,935",
    dueDate: "Jun 21, 2026",
    status: "Remitted",
  },
  {
    period: "May 2026",
    state: "Kano",
    authority: "Kano State Internal Revenue Service",
    authorityCode: "KIRS",
    employees: 1,
    amount: "₦56,268",
    dueDate: "Jun 21, 2026",
    status: "Remitted",
  },
  {
    period: "May 2026",
    state: "Ogun",
    authority: "Ogun State Internal Revenue Service",
    authorityCode: "OGIRS",
    employees: 1,
    amount: "₦91,337",
    dueDate: "Jun 21, 2026",
    status: "Remitted",
  },
  {
    period: "April 2026",
    state: "Lagos",
    authority: "Lagos Internal Revenue Service",
    authorityCode: "LIRS",
    employees: 9,
    amount: "₦658,011",
    dueDate: "May 21, 2026",
    status: "Remitted",
  },
  {
    period: "April 2026",
    state: "Abuja (FCT)",
    authority: "Federal Capital Territory Internal Revenue Service",
    authorityCode: "FCT-IRS",
    employees: 4,
    amount: "₦227,867",
    dueDate: "May 21, 2026",
    status: "Remitted",
  },
];

const authorityStyles: Record<string, string> = {
  LIRS: "bg-[#e1f1ff] text-[#1680d0]",
  "FCT-IRS": "bg-[#f4e2fa] text-[#9b21bb]",
  RIRS: "bg-[#dcf5e3] text-[#16823b]",
  KIRS: "bg-[#fff2c9] text-[#927000]",
  OGIRS: "bg-[#ffe2e9] text-[#ed3c55]",
};

export default function MonthlyRemittance() {
  const handleDownload = (remittance: Remittance) => {
    console.log("Download receipt:", remittance);
  };

  return (
    <section className="w-full">
      {/* =====================================================
          REMITTANCE WARNING
      ====================================================== */}

      <div
        className="
          mb-4
          flex
          items-start
          gap-2
          rounded
          border
          border-[#ead4a5]
          bg-[#fff5df]
          px-4
          py-3
          text-sm
          font-medium
          leading-5
          text-[#8a6200]
        "
      >
        <AlertTriangle
          size={18}
          strokeWidth={1.8}
          className="mt-0.5 shrink-0"
        />

        <p>
          PAYE must be remitted to each State IRS by the 21st of the following
          month. Lagos employees are remitted to LIRS, Abuja employees to
          FCT-IRS, Rivers to RIRS, etc. Late remittance attracts 10% penalty
          plus interest.
        </p>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div
        className="
          w-full
          overflow-x-auto
          rounded
          border
          border-[#e1e6eb]
          bg-white
        "
      >
        <div className="min-w-[1050px]">
          {/* TABLE HEADER */}

          <div
            className="
              grid
              grid-cols-[1.05fr_1.05fr_1.35fr_1fr_1.15fr_1.15fr_1.05fr_1.25fr]
              items-center
              border-b
              border-[#e4e8ed]
              bg-[#fcfdfe]
              px-4
              py-3
              text-sm
              font-semibold
              text-[#718096]
            "
          >
            <span>Period</span>

            <span>State</span>

            <span>Authority</span>

            <span>Employees</span>

            <span>PAYE Amount</span>

            <span>Due Date</span>

            <span>Status</span>

            <span>Action</span>
          </div>

          {/* TABLE BODY */}

          {remittances.map((remittance, index) => (
            <RemittanceRow
              key={`${remittance.period}-${remittance.authorityCode}`}
              remittance={remittance}
              isEven={index % 2 === 1}
              onDownload={handleDownload}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   REMITTANCE ROW
===================================================== */

type RemittanceRowProps = {
  remittance: Remittance;
  isEven: boolean;
  onDownload: (remittance: Remittance) => void;
};

function RemittanceRow({ remittance, isEven, onDownload }: RemittanceRowProps) {
  return (
    <div
      className={`
        grid
        min-h-[48px]
        grid-cols-[1.05fr_1.05fr_1.35fr_1fr_1.15fr_1.15fr_1.05fr_1.25fr]
        items-center
        border-b
        border-[#edf0f3]
        px-4
        text-sm
        last:border-b-0
        hover:bg-[#f8fbfd]
        ${isEven ? "bg-[#f4f5f8]" : "bg-white"}
      `}
    >
      {/* PERIOD */}

      <span className="font-semibold text-[#263447]">{remittance.period}</span>

      {/* STATE */}

      <span className="font-medium text-[#617287]">{remittance.state}</span>

      {/* AUTHORITY */}

      <div>
        <AuthorityBadge code={remittance.authorityCode} />
      </div>

      {/* EMPLOYEES */}

      <span className="font-medium text-[#617287]">{remittance.employees}</span>

      {/* AMOUNT */}

      <span className="font-bold text-[#263447]">{remittance.amount}</span>

      {/* DUE DATE */}

      <span className="font-medium text-[#617287]">{remittance.dueDate}</span>

      {/* STATUS */}

      <div>
        <StatusBadge status={remittance.status} />
      </div>

      {/* ACTION */}

      <button
        type="button"
        onClick={() => onDownload(remittance)}
        className="
          flex
          w-fit
          items-center
          gap-1.5
          text-sm
          font-semibold
          text-[#087fbd]
          transition
          hover:text-[#076fa7]
        "
      >
        <Download size={16} strokeWidth={1.8} />

        <span>Download Receipt</span>
      </button>
    </div>
  );
}

/* =====================================================
   AUTHORITY BADGE
===================================================== */

function AuthorityBadge({ code }: { code: string }) {
  return (
    <span
      className={`
        inline-flex
        min-w-[50px]
        items-center
        justify-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ${authorityStyles[code] ?? "bg-gray-100 text-gray-600"}
      `}
    >
      {code}
    </span>
  );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({ status }: { status: RemittanceStatus }) {
  if (status === "Remitted") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1
          rounded-full
          bg-[#d9f3df]
          px-2.5
          py-1
          text-xs
          font-semibold
          text-[#25803d]
        "
      >
        <CheckCircle2 size={14} strokeWidth={1.8} />

        {status}
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        rounded-full
        bg-[#fff1c9]
        px-2.5
        py-1
        text-xs
        font-semibold
        text-[#927000]
      "
    >
      {status}
    </span>
  );
}
