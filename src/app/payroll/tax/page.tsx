"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Download, Loader2, Search } from "lucide-react";
import { toast } from "react-toastify";

import MonthlyRemittance from "@/components/payroll/tax/MonthlyRemitance";
import AnnualReturns from "@/components/payroll/tax/AnnualReturns";
import PayeBandsAndCra from "@/components/payroll/tax/PayeBandsAnd";
import {
  getPayrollTaxOverview,
  PayrollTaxOverviewData,
  getPayrollTaxEmployeesByState,
  PayrollTaxEmployeesByStateData,
  StateTaxGroup,
  exportPayrollTaxAnnualReturnsCsv,
} from "@/lib/api/payroll";

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
  period?: string;
};


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
  const [overview, setOverview] = useState<PayrollTaxOverviewData | null>(null);
  const [loadingOverview, setLoadingOverview] = useState<boolean>(true);
  const [employeesByStateData, setEmployeesByStateData] = useState<
    PayrollTaxEmployeesByStateData | StateTaxGroup[] | null
  >(null);
  const [loadingEmployeesByState, setLoadingEmployeesByState] =
    useState<boolean>(true);
  const [exportingAnnualReturns, setExportingAnnualReturns] = useState(false);

  const handleExportAnnualReturns = async () => {
    if (exportingAnnualReturns) return;
    try {
      setExportingAnnualReturns(true);
      const blob = await exportPayrollTaxAnnualReturnsCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const today = new Date().toISOString().split("T")[0];
      link.download = `paye-annual-returns-${today}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PAYE annual returns exported successfully.");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: Blob | { message?: string };
        };
      };
      let errorMsg = "Failed to export annual returns.";
      if (axiosErr.response?.data instanceof Blob) {
        try {
          const text = await axiosErr.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed.message) errorMsg = parsed.message;
        } catch {
          // not json
        }
      } else if (
        typeof axiosErr.response?.data === "object" &&
        axiosErr.response?.data?.message
      ) {
        errorMsg = axiosErr.response.data.message;
      }
      toast.error(errorMsg);
    } finally {
      setExportingAnnualReturns(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchTaxOverview() {
      try {
        setLoadingOverview(true);
        const res = await getPayrollTaxOverview();
        console.log("[TaxPage] Overview API response:", res);
        if (isMounted && res && res.data) {
          setOverview(res.data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("[TaxPage] Failed to load tax overview:", err);
          const axiosErr = err as { response?: { data?: { message?: string } } };
          const errMsg =
            axiosErr.response?.data?.message ??
            "Failed to load PAYE tax overview.";
          toast.error(errMsg);
        }
      } finally {
        if (isMounted) {
          setLoadingOverview(false);
        }
      }
    }

    fetchTaxOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchEmployeesByState() {
      try {
        setLoadingEmployeesByState(true);
        const res = await getPayrollTaxEmployeesByState();
        console.log("[TaxPage] Employees by state API response:", res);
        if (isMounted && res && res.data) {
          setEmployeesByStateData(res.data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("[TaxPage] Failed to load employees by state:", err);
          const axiosErr = err as { response?: { data?: { message?: string } } };
          const errMsg =
            axiosErr.response?.data?.message ??
            "Failed to load employees by state.";
          toast.error(errMsg);
        }
      } finally {
        if (isMounted) {
          setLoadingEmployeesByState(false);
        }
      }
    }

    fetchEmployeesByState();

    return () => {
      isMounted = false;
    };
  }, []);

  const authoritiesList: StateAuthority[] = useMemo(() => {
    if (!employeesByStateData) {
      return [];
    }

    let rawGroups: StateTaxGroup[] = [];
    if (Array.isArray(employeesByStateData)) {
      rawGroups = employeesByStateData;
    } else if (
      employeesByStateData &&
      typeof employeesByStateData === "object"
    ) {
      if (Array.isArray(employeesByStateData.groups)) {
        rawGroups = employeesByStateData.groups;
      } else if (Array.isArray(employeesByStateData.stateAuthorities)) {
        rawGroups = employeesByStateData.stateAuthorities;
      } else if (Array.isArray(employeesByStateData.items)) {
        rawGroups = employeesByStateData.items as StateTaxGroup[];
      } else if (Array.isArray(employeesByStateData.data)) {
        rawGroups = employeesByStateData.data as StateTaxGroup[];
      }
    }

    if (rawGroups.length === 0) {
      return [];
    }

    const COLOR_CYCLE: StateColor[] = [
      "blue",
      "purple",
      "green",
      "yellow",
      "red",
    ];

    return rawGroups.map((g, idx) => {
      const stateName = g.state || g.stateName || "State";
      const shortName =
        g.shortName ||
        `${stateName.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase()}IRS`;
      const name =
        g.name ||
        g.authorityName ||
        `${stateName} Internal Revenue Service (${shortName})`;

      let employeeCount = 0;
      if (typeof g.employees === "number") {
        employeeCount = g.employees;
      } else if (Array.isArray(g.employees)) {
        employeeCount = g.employees.length;
      } else if (typeof g.employeeCount === "number") {
        employeeCount = g.employeeCount;
      }

      let formattedAmount = "₦0";
      const rawAmount = g.amount ?? g.totalAmount ?? g.totalPaye;
      if (rawAmount !== undefined && rawAmount !== null) {
        if (typeof rawAmount === "number") {
          formattedAmount = `₦${rawAmount.toLocaleString("en-NG")}`;
        } else {
          const str = String(rawAmount).trim();
          if (str.startsWith("₦")) {
            formattedAmount = str;
          } else {
            const num = Number(str);
            formattedAmount = !isNaN(num)
              ? `₦${num.toLocaleString("en-NG")}`
              : str;
          }
        }
      }

      const validColors: StateColor[] = [
        "blue",
        "purple",
        "green",
        "yellow",
        "red",
      ];
      const color: StateColor =
        g.color && validColors.includes(g.color as StateColor)
          ? (g.color as StateColor)
          : COLOR_CYCLE[idx % COLOR_CYCLE.length];

      return {
        id: typeof g.id === "number" ? g.id : idx + 1,
        shortName,
        name,
        state: stateName,
        employees: employeeCount,
        amount: formattedAmount,
        color,
        period: typeof g.period === "string" ? g.period : undefined,
      };
    });
  }, [employeesByStateData]);

  const stateAuthoritiesCount = useMemo(() => {
    if (!overview && !employeesByStateData) {
      return "0";
    }

    const dataObj = overview as PayrollTaxOverviewData;

    const val =
      dataObj?.stateAuthorityCount ??
      dataObj?.stateAuthoritiesCount ??
      dataObj?.totalStateAuthorities ??
      dataObj?.stateAuthorities ??
      dataObj?.authoritiesCount;

    if (val !== undefined && val !== null) {
      return String(val);
    }
    return String(authoritiesList.length);
  }, [overview, employeesByStateData, authoritiesList]);

  const formattedYtdDeducted = useMemo(() => {
    if (!overview) {
      return "₦0";
    }

    const dataObj = overview as PayrollTaxOverviewData;

    const raw =
      dataObj?.ytdPayeDeducted ??
      dataObj?.ytdDeducted ??
      dataObj?.totalYtdDeducted ??
      dataObj?.payeDeducted ??
      dataObj?.totalDeducted;

    if (raw !== undefined && raw !== null) {
      if (typeof raw === "number") {
        return `₦${raw.toLocaleString("en-NG")}`;
      }
      const str = String(raw).trim();
      if (str.startsWith("₦")) return str;
      const num = Number(str);
      if (!isNaN(num)) return `₦${num.toLocaleString("en-NG")}`;
      return str;
    }
    return "₦0";
  }, [overview]);

  const formattedYtdRemitted = useMemo(() => {
    if (!overview) {
      return "₦0";
    }

    const dataObj = overview as PayrollTaxOverviewData;

    const raw =
      dataObj?.ytdRemitted ??
      dataObj?.ytdPayeRemitted ??
      dataObj?.totalYtdRemitted ??
      dataObj?.payeRemitted ??
      dataObj?.totalRemitted;

    if (raw !== undefined && raw !== null) {
      if (typeof raw === "number") {
        return `₦${raw.toLocaleString("en-NG")}`;
      }
      const str = String(raw).trim();
      if (str.startsWith("₦")) return str;
      const num = Number(str);
      if (!isNaN(num)) return `₦${num.toLocaleString("en-NG")}`;
      return str;
    }
    return "₦0";
  }, [overview]);

  const formattedNextDueDate = useMemo(() => {
    if (!overview) {
      return "—";
    }

    const dataObj = overview as PayrollTaxOverviewData;

    const raw =
      dataObj?.nextDueDate ??
      dataObj?.dueDate ??
      dataObj?.nextRemittanceDueDate ??
      dataObj?.nextDue;

    if (raw) {
      try {
        const date = new Date(raw as string);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        }
      } catch {
        // fallback
      }
      return String(raw);
    }
    return "—";
  }, [overview]);

  const filteredAuthorities = useMemo(() => {
    return authoritiesList.filter((authority) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        authority.name.toLowerCase().includes(searchValue) ||
        authority.state.toLowerCase().includes(searchValue) ||
        authority.shortName.toLowerCase().includes(searchValue);

      const matchesState =
        stateFilter === "All States" || authority.state === stateFilter;

      return matchesSearch && matchesState;
    });
  }, [authoritiesList, search, stateFilter]);

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

          <ActionButton
            onClick={handleExportAnnualReturns}
            disabled={exportingAnnualReturns}
          >
            {exportingAnnualReturns ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} strokeWidth={1.8} />
            )}
            <span>
              {exportingAnnualReturns ? "Exporting..." : "Annual Returns"}
            </span>
          </ActionButton>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="State Authorities"
          value={stateAuthoritiesCount}
          valueClass="text-[#087fbd]"
          loading={loadingOverview}
        />

        <SummaryCard
          title="YTD PAYE Deducted"
          value={formattedYtdDeducted}
          valueClass="text-[#ff3b3b]"
          loading={loadingOverview}
        />

        <SummaryCard
          title="YTD Remitted"
          value={formattedYtdRemitted}
          valueClass="text-[#16823b]"
          loading={loadingOverview}
        />

        <SummaryCard
          title="Next Due Date"
          value={formattedNextDueDate}
          valueClass="text-[#927000]"
          loading={loadingOverview}
        />
      </section>

      {/* STATE SUMMARY CARDS */}
      <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {authoritiesList.map((authority) => (
          <StateSummaryCard key={authority.id} authority={authority} />
        ))}
      </section>

      {/* TABS */}
      <section className="mt-7 border-b border-[#dce2e8]">
        <div className="flex gap-7 overflow-x-auto overflow-y-hidden no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          allAuthorities={authoritiesList}
        />
      )}

      {activeTab === "remittance" && <MonthlyRemittance />}

      {activeTab === "returns" && (
        <AnnualReturns search={search} setSearch={setSearch} />
      )}

      {activeTab === "bands" && <PayeBandsAndCra />}
    </main>
  );
}

/* =====================================================
   ACTION BUTTON
===================================================== */

function ActionButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-9 items-center gap-2 rounded border border-[#dce2e8] bg-white px-3 text-sm font-semibold text-[#526477] transition hover:bg-[#f8fafc] hover:text-[#087fbd] disabled:cursor-not-allowed disabled:opacity-50"
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
  loading = false,
}: {
  title: string;
  value: string;
  valueClass: string;
  loading?: boolean;
}) {
  return (
    <div className="min-h-[90px] rounded border border-[#dce2e8] bg-white px-4 py-4">
      <p className="text-sm font-semibold text-[#718096]">{title}</p>

      {loading ? (
        <div className="mt-3 h-5 w-24 animate-pulse rounded bg-slate-200" />
      ) : (
        <p className={`mt-3 text-xl font-bold leading-none ${valueClass}`}>
          {value}
        </p>
      )}
    </div>
  );
}

/* =====================================================
   STATE SUMMARY CARD
===================================================== */

function StateSummaryCard({ authority }: { authority: StateAuthority }) {
  const styles = badgeStyles[authority.color];

  return (
    <div className="min-h-[135px] rounded border border-[#dce2e8] bg-white px-4 py-4">
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles.badge}`}
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

      <p className={`mt-2 text-base font-bold ${styles.amount}`}>
        {authority.amount}
      </p>

      <p className="mt-1 text-xs font-medium text-[#91a0b0]">
        {authority.period || "PAYE"}
      </p>
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
      className={`relative whitespace-nowrap pb-3 text-sm font-semibold transition ${active ? "text-[#087fbd]" : "text-[#718096] hover:text-[#263447]"}`}
    >
      {children}

      {active && (
        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#087fbd]" />
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
  allAuthorities = authorities,
}: {
  search: string;
  setSearch: (value: string) => void;
  stateFilter: string;
  setStateFilter: (value: string) => void;
  authorities: StateAuthority[];
  allAuthorities?: StateAuthority[];
}) {
  return (
    <section className="mt-5">
      {/* FILTER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative w-full sm:w-[280px]">
          <Search
            size={16}
            strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee..."
            className="h-10 w-full rounded border border-[#dce2e8] bg-white pl-10 pr-3 text-sm font-medium text-[#344054] outline-none placeholder:text-[#8994a3] focus:border-[#087fbd]"
          />
        </div>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="h-10 w-full rounded border border-[#dce2e8] bg-white px-3 text-sm font-semibold text-[#344054] outline-none focus:border-[#087fbd] sm:w-[130px]"
        >
          <option>All States</option>

          {allAuthorities.map((authority) => (
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
          <div className="rounded border border-[#dce2e8] bg-white py-12 text-center">
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
      className="group grid min-h-[72px] w-full grid-cols-[auto_1fr_auto_auto] items-center gap-4 rounded border border-[#dce2e8] bg-white px-5 text-left transition hover:border-[#c9dce7] hover:bg-[#fcfeff]"
    >
      {/* BADGE */}
      <span
        className={`inline-flex min-w-[52px] justify-center rounded-full px-2 py-1 text-xs font-semibold ${styles.badge}`}
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
        <p className="text-xs font-medium text-[#91a0b0]">
          {authority.period || "PAYE"}
        </p>

        <p className={`mt-1 text-base font-bold ${styles.amount}`}>
          {authority.amount}
        </p>
      </div>

      {/* ARROW */}
      <ChevronRight
        size={18}
        strokeWidth={1.8}
        className="text-[#64748b] transition group-hover:translate-x-0.5 group-hover:text-[#087fbd]"
      />
    </button>
  );
}
