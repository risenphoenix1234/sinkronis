"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import PfaRemittance from "@/components/payroll/pension/PfaRemitance";
import AvcContributions from "@/components/payroll/pension/AvcContributions";

type PensionTab = "contributions" | "remittance" | "avc";

type PensionEmployee = {
  id: number;
  initials: string;
  name: string;
  department: string;
  pfa: string;
  pensionPin: string;
  employeeContribution: string;
  employerContribution: string;
  avc: string | null;
  total: string;
  period: string;
};

const pensionEmployees: PensionEmployee[] = [
  {
    id: 1,
    initials: "AO",
    name: "Amara Okafor",
    department: "Human Resources",
    pfa: "Stanbic IBTC Pension",
    pensionPin: "PEN100012345",
    employeeContribution: "₦46,800",
    employerContribution: "₦58,500",
    avc: null,
    total: "₦105,300",
    period: "May 2026",
  },
  {
    id: 2,
    initials: "CA",
    name: "Chukwuemeka Adeyemi",
    department: "Finance",
    pfa: "ARM Pension",
    pensionPin: "PEN100023456",
    employeeContribution: "₦54,080",
    employerContribution: "₦67,600",
    avc: "₦50,000",
    total: "₦171,680",
    period: "May 2026",
  },
  {
    id: 3,
    initials: "TB",
    name: "Tunde Babatunde",
    department: "IT & Technology",
    pfa: "Premium Pension",
    pensionPin: "PEN100045678",
    employeeContribution: "₦39,520",
    employerContribution: "₦49,400",
    avc: null,
    total: "₦88,920",
    period: "May 2026",
  },
  {
    id: 4,
    initials: "NE",
    name: "Ngozi Eze",
    department: "Sales & Marketing",
    pfa: "Stanbic IBTC Pension",
    pensionPin: "PEN100056789",
    employeeContribution: "₦43,680",
    employerContribution: "₦54,600",
    avc: null,
    total: "₦98,280",
    period: "May 2026",
  },
  {
    id: 5,
    initials: "BL",
    name: "Babajide Lawson",
    department: "Legal & Compliance",
    pfa: "AXA Mansard Pension",
    pensionPin: "PEN100067890",
    employeeContribution: "₦62,400",
    employerContribution: "₦78,000",
    avc: "₦80,000",
    total: "₦220,400",
    period: "May 2026",
  },
  {
    id: 6,
    initials: "JM",
    name: "Jide Mensah",
    department: "Finance",
    pfa: "ARM Pension",
    pensionPin: "PEN100089012",
    employeeContribution: "₦29,120",
    employerContribution: "₦36,400",
    avc: null,
    total: "₦65,520",
    period: "May 2026",
  },
  {
    id: 7,
    initials: "CO",
    name: "Chiamaka Obi",
    department: "Human Resources",
    pfa: "Premium Pension",
    pensionPin: "PEN100101234",
    employeeContribution: "₦27,040",
    employerContribution: "₦33,800",
    avc: null,
    total: "₦60,840",
    period: "May 2026",
  },
  {
    id: 8,
    initials: "EN",
    name: "Emeka Nwosu",
    department: "IT & Technology",
    pfa: "Leadway Pensure",
    pensionPin: "PEN100112345",
    employeeContribution: "₦37,440",
    employerContribution: "₦46,800",
    avc: null,
    total: "₦84,240",
    period: "May 2026",
  },
];

const tabs: {
  id: PensionTab;
  label: string;
}[] = [
  {
    id: "contributions",
    label: "Employee Contributions",
  },
  {
    id: "remittance",
    label: "PFA Remittance",
  },
  {
    id: "avc",
    label: "AVC (2 active)",
  },
];

export default function PensionPage() {
  const [activeTab, setActiveTab] = useState<PensionTab>("contributions");

  const [search, setSearch] = useState("");
  const [pfaFilter, setPfaFilter] = useState("All PFAs");

  const pfas = useMemo(() => {
    return Array.from(
      new Set(pensionEmployees.map((employee) => employee.pfa)),
    );
  }, []);

  const filteredEmployees = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return pensionEmployees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchValue) ||
        employee.department.toLowerCase().includes(searchValue) ||
        employee.pfa.toLowerCase().includes(searchValue) ||
        employee.pensionPin.toLowerCase().includes(searchValue);

      const matchesPfa = pfaFilter === "All PFAs" || employee.pfa === pfaFilter;

      if (activeTab === "avc") {
        return matchesSearch && matchesPfa && employee.avc !== null;
      }

      return matchesSearch && matchesPfa;
    });
  }, [search, pfaFilter, activeTab]);

  return (
    <main className="min-h-screen bg-[#FAFBFC] p-4 text-[#263447] sm:px-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#263238]">
            Pension
          </h1>

          <p className="mt-2 text-sm font-medium text-[#718096]">
            Track contributions, PFA remittances, transfers, and voluntary
            contributions.
          </p>
        </div>

        <button
          type="button"
          className="
            inline-flex
            h-10
            w-fit
            items-center
            gap-2
            rounded
            border
            border-[#E1E6EB]
            bg-white
            px-4
            text-sm
            font-semibold
            text-[#64748B]
            transition
            hover:bg-[#F8FAFC]
            hover:text-[#087FBD]
          "
        >
          <Download size={16} strokeWidth={1.8} />
          PENCOM Export
        </button>
      </header>

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Employee Contributions (8%)"
          amount="₦603,200"
          amountClass="text-[#087FBD]"
        />

        <SummaryCard
          title="Employer Contributions (10%)"
          amount="₦754,000"
          amountClass="text-[#927000]"
        />

        <SummaryCard
          title="Total Monthly Pension"
          amount="₦1,357,200"
          amountClass="text-[#9B21BB]"
        />

        <SummaryCard
          title="Active AVC Amount"
          amount="₦130,000"
          amountClass="text-[#16823B]"
        />
      </section>

      {/* =====================================================
          TABS
      ====================================================== */}

      <section className="mt-7 border-b border-[#E1E6EB]">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative
                  whitespace-nowrap
                  pb-3
                  text-sm
                  font-semibold
                  transition
                  ${
                    active
                      ? "text-[#087FBD]"
                      : "text-[#718096] hover:text-[#263447]"
                  }
                `}
              >
                {tab.label}

                {active && (
                  <span
                    className="
                      absolute
                      bottom-[-1px]
                      left-0
                      h-0.5
                      w-full
                      bg-[#087FBD]
                    "
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <section className="mt-5">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          {/* SEARCH */}

          <div className="relative w-full sm:w-[248px]">
            <Search
              size={17}
              strokeWidth={1.8}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[#9AA5B1]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employee or PFA..."
              className="
                h-10
                w-full
                rounded
                border
                border-[#DCE2E8]
                bg-white
                pl-10
                pr-3
                text-sm
                font-medium
                text-[#344054]
                outline-none
                placeholder:text-[#8994A3]
                focus:border-[#087FBD]
                focus:ring-1
                focus:ring-[#087FBD]/10
              "
            />
          </div>

          {/* PFA FILTER */}

          <select
            value={pfaFilter}
            onChange={(event) => setPfaFilter(event.target.value)}
            className="
              h-10
              w-full
              rounded
              border
              border-[#DCE2E8]
              bg-white
              px-3
              text-sm
              font-semibold
              text-[#344054]
              outline-none
              focus:border-[#087FBD]
              sm:w-[185px]
            "
          >
            <option>All PFAs</option>

            {pfas.map((pfa) => (
              <option key={pfa} value={pfa}>
                {pfa}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* =====================================================
          TABLE
      ====================================================== */}

      {activeTab === "contributions" && (
        <PensionTable employees={filteredEmployees} />
      )}

      {activeTab === "remittance" && <PfaRemittance />}

      {activeTab === "avc" && <AvcContributions />}
    </main>
  );
}

/* ==========================================================
   SUMMARY CARD
========================================================== */

function SummaryCard({
  title,
  amount,
  amountClass,
}: {
  title: string;
  amount: string;
  amountClass: string;
}) {
  return (
    <div
      className="
        min-h-[84px]
        rounded
        border
        border-[#E1E6EB]
        bg-white
        px-4
        py-4
      "
    >
      <p className="text-sm font-medium text-[#8290A3]">{title}</p>

      <p
        className={`
          mt-2
          text-xl
          font-bold
          ${amountClass}
        `}
      >
        {amount}
      </p>
    </div>
  );
}

/* ==========================================================
   PENSION TABLE
========================================================== */

function PensionTable({ employees }: { employees: PensionEmployee[] }) {
  return (
    <section
      className="
        mt-4
        w-full
        overflow-hidden
        rounded
        border
        border-[#E1E6EB]
        bg-white
      "
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse">
          {/* TABLE HEADER */}

          <thead>
            <tr className="h-9 border-b border-dashed border-[#E1E6EB] bg-white">
              <th className="w-[23%] px-4 text-left text-sm font-semibold text-[#8290A3]">
                Employee
              </th>

              <th className="w-[16%] px-3 text-left text-sm font-semibold text-[#8290A3]">
                PFA
              </th>

              <th className="w-[13%] px-3 text-left text-sm font-semibold text-[#8290A3]">
                Pension PIN
              </th>

              <th className="w-[11%] px-3 text-left text-sm font-semibold text-[#8290A3]">
                Emp (8%)
              </th>

              <th className="w-[13%] px-3 text-left text-sm font-semibold text-[#8290A3]">
                Employer (10%)
              </th>

              <th className="w-[10%] px-3 text-left text-sm font-semibold text-[#8290A3]">
                AVC
              </th>

              <th className="w-[10%] px-3 text-left text-sm font-semibold text-[#8290A3]">
                Total
              </th>

              <th className="w-[10%] px-3 text-left text-sm font-semibold text-[#8290A3]">
                Period
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}

          <tbody>
            {employees.map((employee, index) => (
              <PensionRow
                key={employee.id}
                employee={employee}
                isEven={index % 2 === 1}
              />
            ))}
          </tbody>
        </table>

        {employees.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-[#526477]">
              No pension records found.
            </p>

            <p className="mt-1 text-xs font-medium text-[#94A0AD]">
              Try changing your search or PFA filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================================
   PENSION ROW
========================================================== */

function PensionRow({
  employee,
  isEven,
}: {
  employee: PensionEmployee;
  isEven: boolean;
}) {
  return (
    <tr
      className={`
        h-[54px]
        border-b
        border-[#EDF0F3]
        last:border-b-0
        ${isEven ? "bg-[#F3F4F8]" : "bg-white"}
      `}
    >
      {/* EMPLOYEE */}

      <td className="px-4">
        <div className="flex items-center gap-2.5">
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#E5F2FF]
              text-xs
              font-bold
              text-[#3182CE]
            "
          >
            {employee.initials}
          </div>

          <div className="min-w-0">
            <p className="whitespace-nowrap text-sm font-semibold text-[#263447]">
              {employee.name}
            </p>

            <p className="mt-0.5 whitespace-nowrap text-xs font-medium text-[#91A0B0]">
              {employee.department}
            </p>
          </div>
        </div>
      </td>

      {/* PFA */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-medium text-[#617287]">
          {employee.pfa}
        </span>
      </td>

      {/* PENSION PIN */}

      <td className="px-3">
        <span className="whitespace-nowrap font-mono text-xs font-medium tracking-wide text-[#718096]">
          {employee.pensionPin}
        </span>
      </td>

      {/* EMPLOYEE CONTRIBUTION */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-bold text-[#168BD0]">
          {employee.employeeContribution}
        </span>
      </td>

      {/* EMPLOYER CONTRIBUTION */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-bold text-[#927000]">
          {employee.employerContribution}
        </span>
      </td>

      {/* AVC */}

      <td className="px-3">
        {employee.avc ? (
          <span className="whitespace-nowrap text-sm font-semibold text-[#16823B]">
            {employee.avc}
          </span>
        ) : (
          <span className="text-sm font-medium text-[#A0AAB5]">—</span>
        )}
      </td>

      {/* TOTAL */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-bold text-[#263447]">
          {employee.total}
        </span>
      </td>

      {/* PERIOD */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-medium text-[#617287]">
          {employee.period}
        </span>
      </td>
    </tr>
  );
}

/* ==========================================================
   CURRENCY HELPER
========================================================== */

function parseCurrency(value: string) {
  return Number(value.replace("₦", "").replace(/,/g, ""));
}
