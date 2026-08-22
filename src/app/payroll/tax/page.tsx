"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Download, Search } from "lucide-react";

import MonthlyRemittance from "@/components/payroll/tax/MonthlyRemitance";
import AnnualReturns from "@/components/payroll/tax/AnnualReturns";
import PayeBandsAndCra from "@/components/payroll/tax/PayeBandsAnd";

type Tab = "employees" | "remittance" | "returns" | "bands";

type StateColor = "blue" | "purple" | "green" | "yellow" | "red";

type StateAuthority = {
  id: number;
  shortName: string;
  name: string;
  state: string;
  employees: number;
  amount: string;
  color: StateColor;
};

const stateAuthorities: StateAuthority[] = [
  {
    id: 1,
    shortName: "LIRS",
    name: "Lagos Internal Revenue Service (LIRS)",
    state: "Lagos",
    employees: 9,
    amount: "₦658,011",
    color: "blue",
  },
  {
    id: 2,
    shortName: "FCT-IRS",
    name: "FCT Internal Revenue Service (FCT-IRS)",
    state: "Abuja (FCT)",
    employees: 4,
    amount: "₦227,867",
    color: "purple",
  },
  {
    id: 3,
    shortName: "RIRS",
    name: "Rivers State Internal Revenue Service (RIRS)",
    state: "Rivers",
    employees: 3,
    amount: "₦173,935",
    color: "green",
  },
  {
    id: 4,
    shortName: "KIRS",
    name: "Kano State Internal Revenue Service (KIRS)",
    state: "Kano",
    employees: 1,
    amount: "₦56,268",
    color: "yellow",
  },
  {
    id: 5,
    shortName: "OGIRS",
    name: "Ogun State Internal Revenue Service (OGIRS)",
    state: "Ogun",
    employees: 1,
    amount: "₦91,337",
    color: "red",
  },
];

const badgeStyles: Record<
  StateColor,
  {
    badge: string;
    text: string;
    amount: string;
  }
> = {
  blue: {
    badge: "bg-[#e2f2ff] text-[#087fbd]",
    text: "text-[#087fbd]",
    amount: "text-[#087fbd]",
  },

  purple: {
    badge: "bg-[#f4e5fb] text-[#9b17bd]",
    text: "text-[#9b17bd]",
    amount: "text-[#9b17bd]",
  },

  green: {
    badge: "bg-[#dff5e3] text-[#16823b]",
    text: "text-[#16823b]",
    amount: "text-[#16823b]",
  },

  yellow: {
    badge: "bg-[#fff2c9] text-[#927000]",
    text: "text-[#927000]",
    amount: "text-[#927000]",
  },

  red: {
    badge: "bg-[#ffe4e7] text-[#ed3650]",
    text: "text-[#ed3650]",
    amount: "text-[#ed3650]",
  },
};

export default function TaxPage() {
  const [activeTab, setActiveTab] = useState<Tab>("employees");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");

  const filteredAuthorities = useMemo(() => {
    return stateAuthorities.filter((authority) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        authority.name.toLowerCase().includes(searchValue) ||
        authority.state.toLowerCase().includes(searchValue) ||
        authority.shortName.toLowerCase().includes(searchValue);

      const matchesState =
        stateFilter === "All States" || authority.state === stateFilter;

      return matchesSearch && matchesState;
    });
  }, [search, stateFilter]);

  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 text-[#263447] sm:px-6 sm:py-7">
      {/* HEADER */}
      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            Tax (PAYE)
          </h1>

          <p className="mt-2 text-sm font-medium leading-5 text-[#718096]">
            State-based PAYE — employees are grouped by state of residence and
            remitted to respective State IRS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton>
            <Download size={16} strokeWidth={1.8} />
            Form H1
          </ActionButton>

          <ActionButton>
            <Download size={16} strokeWidth={1.8} />
            Annual Returns
          </ActionButton>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="State Authorities"
          value="5"
          valueClass="text-[#087fbd]"
        />

        <SummaryCard
          title="YTD PAYE Deducted"
          value="₦2,055,718"
          valueClass="text-[#ff3b3b]"
        />

        <SummaryCard
          title="YTD Remitted"
          value="₦2,414,836"
          valueClass="text-[#16823b]"
        />

        <SummaryCard
          title="Next Due Date"
          value="Jul 21, 2026"
          valueClass="text-[#927000]"
        />
      </section>

      {/* STATE SUMMARY CARDS */}
      <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stateAuthorities.map((authority) => (
          <StateSummaryCard key={authority.id} authority={authority} />
        ))}
      </section>

      {/* TABS */}
      <section className="mt-7 border-b border-[#dce2e8]">
        <div className="flex gap-7 overflow-x-auto">
          <TabButton
            active={activeTab === "employees"}
            onClick={() => setActiveTab("employees")}
          >
            Employees by State
          </TabButton>

          <TabButton
            active={activeTab === "remittance"}
            onClick={() => setActiveTab("remittance")}
          >
            Monthly Remittance
          </TabButton>

          <TabButton
            active={activeTab === "returns"}
            onClick={() => setActiveTab("returns")}
          >
            Annual Returns (YTD)
          </TabButton>

          <TabButton
            active={activeTab === "bands"}
            onClick={() => setActiveTab("bands")}
          >
            PAYE Bands & Rates
          </TabButton>
        </div>
      </section>

      {/* TAB CONTENT */}
      {activeTab === "employees" && (
        <EmployeesByState
          search={search}
          setSearch={setSearch}
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
          authorities={filteredAuthorities}
        />
      )}

      {activeTab === "remittance" && <MonthlyRemittance />}

      {activeTab === "returns" && <AnnualReturns />}

      {activeTab === "bands" && <PayeBandsAndCra />}
    </main>
  );
}

/* =====================================================
   ACTION BUTTON
===================================================== */

function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="
        inline-flex
        h-9
        items-center
        gap-2
        rounded
        border
        border-[#dce2e8]
        bg-white
        px-3
        text-sm
        font-semibold
        text-[#526477]
        transition
        hover:bg-[#f8fafc]
        hover:text-[#087fbd]
      "
    >
      {children}
    </button>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  title,
  value,
  valueClass,
}: {
  title: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div
      className="
        min-h-[90px]
        rounded
        border
        border-[#dce2e8]
        bg-white
        px-4
        py-4
      "
    >
      <p className="text-sm font-semibold text-[#718096]">{title}</p>

      <p
        className={`
          mt-3
          text-xl
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

/* =====================================================
   STATE SUMMARY CARD
===================================================== */

function StateSummaryCard({ authority }: { authority: StateAuthority }) {
  const styles = badgeStyles[authority.color];

  return (
    <div
      className="
        min-h-[135px]
        rounded
        border
        border-[#dce2e8]
        bg-white
        px-4
        py-4
      "
    >
      <span
        className={`
          inline-flex
          rounded-full
          px-2
          py-1
          text-xs
          font-semibold
          ${styles.badge}
        `}
      >
        {authority.shortName}
      </span>

      <h3 className="mt-3 text-sm font-semibold text-[#263447]">
        {authority.state}
      </h3>

      <p className="mt-1 text-xs font-medium text-[#91a0b0]">
        {authority.employees}{" "}
        {authority.employees === 1 ? "employee" : "employees"}
      </p>

      <p
        className={`
          mt-2
          text-base
          font-bold
          ${styles.amount}
        `}
      >
        {authority.amount}
      </p>

      <p className="mt-1 text-xs font-medium text-[#91a0b0]">May 2026 PAYE</p>
    </div>
  );
}

/* =====================================================
   TAB BUTTON
===================================================== */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        whitespace-nowrap
        pb-3
        text-sm
        font-semibold
        transition
        ${active ? "text-[#087fbd]" : "text-[#718096] hover:text-[#263447]"}
      `}
    >
      {children}

      {active && (
        <span
          className="
            absolute
            bottom-[-1px]
            left-0
            h-0.5
            w-full
            bg-[#087fbd]
          "
        />
      )}
    </button>
  );
}

/* =====================================================
   EMPLOYEES BY STATE
===================================================== */

function EmployeesByState({
  search,
  setSearch,
  stateFilter,
  setStateFilter,
  authorities,
}: {
  search: string;
  setSearch: (value: string) => void;
  stateFilter: string;
  setStateFilter: (value: string) => void;
  authorities: StateAuthority[];
}) {
  return (
    <section className="mt-5">
      {/* FILTER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative w-full sm:w-[280px]">
          <Search
            size={16}
            strokeWidth={1.8}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-[#9aa5b1]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee..."
            className="
              h-10
              w-full
              rounded
              border
              border-[#dce2e8]
              bg-white
              pl-10
              pr-3
              text-sm
              font-medium
              text-[#344054]
              outline-none
              placeholder:text-[#8994a3]
              focus:border-[#087fbd]
            "
          />
        </div>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="
            h-10
            w-full
            rounded
            border
            border-[#dce2e8]
            bg-white
            px-3
            text-sm
            font-semibold
            text-[#344054]
            outline-none
            focus:border-[#087fbd]
            sm:w-[130px]
          "
        >
          <option>All States</option>

          {stateAuthorities.map((authority) => (
            <option key={authority.id} value={authority.state}>
              {authority.state}
            </option>
          ))}
        </select>
      </div>

      {/* AUTHORITY LIST */}
      <div className="mt-4 space-y-3">
        {authorities.map((authority) => (
          <AuthorityRow key={authority.id} authority={authority} />
        ))}

        {authorities.length === 0 && (
          <div
            className="
              rounded
              border
              border-[#dce2e8]
              bg-white
              py-12
              text-center
            "
          >
            <p className="text-sm font-semibold text-[#526477]">
              No state authority found.
            </p>

            <p className="mt-1 text-xs font-medium text-[#94a0ad]">
              Try changing your search or state filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* =====================================================
   AUTHORITY ROW
===================================================== */

function AuthorityRow({ authority }: { authority: StateAuthority }) {
  const styles = badgeStyles[authority.color];

  return (
    <button
      type="button"
      className="
        group
        grid
        min-h-[72px]
        w-full
        grid-cols-[auto_1fr_auto_auto]
        items-center
        gap-4
        rounded
        border
        border-[#dce2e8]
        bg-white
        px-5
        text-left
        transition
        hover:border-[#c9dce7]
        hover:bg-[#fcfeff]
      "
    >
      {/* BADGE */}
      <span
        className={`
          inline-flex
          min-w-[52px]
          justify-center
          rounded-full
          px-2
          py-1
          text-xs
          font-semibold
          ${styles.badge}
        `}
      >
        {authority.shortName}
      </span>

      {/* NAME */}
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-[#263447]">
          {authority.name}
        </h3>

        <p className="mt-1 text-xs font-medium text-[#8190a2]">
          {authority.employees}{" "}
          {authority.employees === 1 ? "employee" : "employees"} in{" "}
          {authority.state}
        </p>
      </div>

      {/* AMOUNT */}
      <div className="text-right">
        <p className="text-xs font-medium text-[#91a0b0]">May 2026 PAYE</p>

        <p
          className={`
            mt-1
            text-base
            font-bold
            ${styles.amount}
          `}
        >
          {authority.amount}
        </p>
      </div>

      {/* ARROW */}
      <ChevronRight
        size={18}
        strokeWidth={1.8}
        className="
          text-[#64748b]
          transition
          group-hover:translate-x-0.5
          group-hover:text-[#087fbd]
        "
      />
    </button>
  );
}
