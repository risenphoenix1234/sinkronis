"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

type RemittanceStatus = "Remitted" | "Pending";

type PfaRemittanceRecord = {
  id: number;
  pfa: string;
  members: number;
  employeeContribution: string;
  employerContribution: string;
  total: string;
  dueDate: string;
  status: RemittanceStatus;
};

const initialRemittances: PfaRemittanceRecord[] = [
  {
    id: 1,
    pfa: "ARM Pension",
    members: 4,
    employeeContribution: "₦163,280",
    employerContribution: "₦204,100",
    total: "₦367,380",
    dueDate: "Jul 7, 2026",
    status: "Remitted",
  },
  {
    id: 2,
    pfa: "Stanbic IBTC Pension",
    members: 4,
    employeeContribution: "₦151,840",
    employerContribution: "₦189,800",
    total: "₦341,640",
    dueDate: "Jul 7, 2026",
    status: "Remitted",
  },
  {
    id: 3,
    pfa: "AIICO Pension",
    members: 3,
    employeeContribution: "₦117,520",
    employerContribution: "₦146,900",
    total: "₦264,420",
    dueDate: "Jul 7, 2026",
    status: "Remitted",
  },
  {
    id: 4,
    pfa: "AXA Mansard Pension",
    members: 2,
    employeeContribution: "₦97,760",
    employerContribution: "₦122,200",
    total: "₦219,960",
    dueDate: "Jul 7, 2026",
    status: "Pending",
  },
  {
    id: 5,
    pfa: "Leadway Pensure",
    members: 1,
    employeeContribution: "₦37,440",
    employerContribution: "₦46,800",
    total: "₦84,240",
    dueDate: "Jul 7, 2026",
    status: "Pending",
  },
  {
    id: 6,
    pfa: "FCMB Pensions",
    members: 1,
    employeeContribution: "₦24,960",
    employerContribution: "₦31,200",
    total: "₦56,160",
    dueDate: "Jul 7, 2026",
    status: "Pending",
  },
  {
    id: 7,
    pfa: "Premium Pension",
    members: 3,
    employeeContribution: "₦108,160",
    employerContribution: "₦135,200",
    total: "₦243,360",
    dueDate: "Jul 7, 2026",
    status: "Pending",
  },
];

export default function PfaRemittance() {
  const [remittances, setRemittances] =
    useState<PfaRemittanceRecord[]>(initialRemittances);

  const handleMarkRemitted = (id: number) => {
    setRemittances((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Remitted",
            }
          : item,
      ),
    );
  };

  return (
    <section className="mt-5 w-full">
      {/* =====================================================
          INFORMATION BANNER
      ====================================================== */}

      <div
        className="
          mb-0
          border
          border-[#D9EAF8]
          bg-[#F1F8FF]
          px-5
          py-3
        "
      >
        <p className="text-sm font-medium leading-5 text-[#087FBD]">
          Pension contributions must be remitted to each employee&apos;s PFA by
          the 7th of the following month. Employer contributes 10%, employee
          contributes 8% of pensionable earnings.
        </p>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div
        className="
          w-full
          overflow-hidden
          border
          border-[#E1E6EB]
          border-t-0
          bg-white
        "
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse">
            {/* TABLE HEADER */}

            <thead>
              <tr className="h-9 border-b border-dashed border-[#E1E6EB]">
                <th className="w-[19%] px-3 text-left text-sm font-medium text-[#718096]">
                  PFA
                </th>

                <th className="w-[10%] px-3 text-left text-sm font-medium text-[#718096]">
                  Members
                </th>

                <th className="w-[13%] px-3 text-left text-sm font-medium text-[#718096]">
                  Emp (8%)
                </th>

                <th className="w-[13%] px-3 text-left text-sm font-medium text-[#718096]">
                  Employer (10%)
                </th>

                <th className="w-[11%] px-3 text-left text-sm font-medium text-[#718096]">
                  Total
                </th>

                <th className="w-[11%] px-3 text-left text-sm font-medium text-[#718096]">
                  Due Date
                </th>

                <th className="w-[12%] px-3 text-left text-sm font-medium text-[#718096]">
                  Status
                </th>

                <th className="w-[11%] px-3 text-left text-sm font-medium text-[#718096]">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>
              {remittances.map((remittance, index) => (
                <RemittanceRow
                  key={remittance.id}
                  remittance={remittance}
                  isEven={index % 2 === 1}
                  onMarkRemitted={handleMarkRemitted}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   REMITTANCE ROW
========================================================== */

type RemittanceRowProps = {
  remittance: PfaRemittanceRecord;
  isEven: boolean;
  onMarkRemitted: (id: number) => void;
};

function RemittanceRow({
  remittance,
  isEven,
  onMarkRemitted,
}: RemittanceRowProps) {
  const isRemitted = remittance.status === "Remitted";

  return (
    <tr
      className={`
        h-[43px]
        border-b
        border-[#EDF0F3]
        last:border-b-0
        ${isEven ? "bg-[#F3F4F8]" : "bg-white"}
      `}
    >
      {/* PFA */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-semibold text-[#263447]">
          {remittance.pfa}
        </span>
      </td>

      {/* MEMBERS */}

      <td className="px-3">
        <span className="text-sm font-medium text-[#617287]">
          {remittance.members}
        </span>
      </td>

      {/* EMPLOYEE CONTRIBUTION */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-bold text-[#087FBD]">
          {remittance.employeeContribution}
        </span>
      </td>

      {/* EMPLOYER CONTRIBUTION */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-bold text-[#927000]">
          {remittance.employerContribution}
        </span>
      </td>

      {/* TOTAL */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-bold text-[#263447]">
          {remittance.total}
        </span>
      </td>

      {/* DUE DATE */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-medium text-[#718096]">
          {remittance.dueDate}
        </span>
      </td>

      {/* STATUS */}

      <td className="px-3">
        <RemittanceStatusBadge status={remittance.status} />
      </td>

      {/* ACTION */}

      <td className="px-3">
        {isRemitted ? (
          <span className="text-sm font-medium text-[#91A0B0]">Done</span>
        ) : (
          <button
            type="button"
            onClick={() => onMarkRemitted(remittance.id)}
            className="
              inline-flex
              h-7
              items-center
              justify-center
              rounded
              bg-[#8224A8]
              px-3
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-[#701D92]
              focus:outline-none
              focus:ring-2
              focus:ring-[#8224A8]/20
            "
          >
            Mark Remitted
          </button>
        )}
      </td>
    </tr>
  );
}

/* ==========================================================
   STATUS BADGE
========================================================== */

function RemittanceStatusBadge({ status }: { status: RemittanceStatus }) {
  const isRemitted = status === "Remitted";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ${
          isRemitted
            ? "bg-[#D9F3DF] text-[#25803D]"
            : "bg-[#FFF1C9] text-[#927000]"
        }
      `}
    >
      {isRemitted && <CheckCircle2 size={12} strokeWidth={2} />}

      {status}
    </span>
  );
}
