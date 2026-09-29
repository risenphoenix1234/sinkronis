"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AlertCircle, Download, Search } from "lucide-react";
import PfaRemittance from "@/components/payroll/pension/PfaRemitance";
import PfaTransfers from "@/components/payroll/pension/PfaTransfers";
import AvcContributions from "@/components/payroll/pension/AvcContributions";
import { toast } from "react-toastify";
import {
  exportPayrollPensionCsv,
  getPayrollPensionContributions,
  getPayrollPensionOverview,
  getPayrollPensionPfas,
  type PayrollPensionContributionItem,
  type PayrollPensionOverviewData,
} from "@/lib/api/payroll";

type PensionTab = "contributions" | "remittance" | "transfers" | "avc";

type PensionEmployee = {
  id: number | string;
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


function formatNaira(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === "") return "₦0";
  if (typeof value === "string" && (value.includes("₦") || value.includes("NGN"))) {
    return value;
  }
  const num =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.-]/g, ""));
  if (isNaN(num)) return "₦0";
  return `₦${num.toLocaleString("en-NG")}`;
}

export default function PensionPage() {
  const [activeTab, setActiveTab] = useState<PensionTab>("contributions");
  const [overview, setOverview] =
    useState<PayrollPensionOverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [contributions, setContributions] =
    useState<PayrollPensionContributionItem[] | null>(null);
  const [contributionsLoading, setContributionsLoading] = useState(true);
  const [apiPfas, setApiPfas] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handlePensionExport = async () => {
    try {
      setExporting(true);
      const blob = await exportPayrollPensionCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pension-export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Failed to export pension data.")
        : "Failed to export pension data.";
      toast.error(message);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchOverview() {
      try {
        setOverviewLoading(true);
        setError(null);
        const res = await getPayrollPensionOverview({
          period: "September 2026",
        });
        if (isMounted && res?.data) {
          setOverview(res.data);
        } else if (isMounted) {
          setOverview(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("[PensionPage] Failed to fetch pension overview:", err);
          const errorMsg =
            axios.isAxiosError(err)
              ? (err.response?.data?.message ?? "Failed to fetch pension overview.")
              : "Failed to fetch pension overview.";
          setError(errorMsg);
          toast.error(errorMsg);
          setOverview(null);
        }
      } finally {
        if (isMounted) {
          setOverviewLoading(false);
        }
      }
    }

    async function fetchContributions() {
      try {
        setContributionsLoading(true);
        const res = await getPayrollPensionContributions({
          period: "September 2026",
        });
        if (isMounted && res?.data) {
          setContributions(Array.isArray(res.data) ? res.data : []);
        } else if (isMounted) {
          setContributions([]);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error(
            "[PensionPage] Failed to fetch pension contributions:",
            err,
          );
          const errorMsg =
            axios.isAxiosError(err)
              ? (err.response?.data?.message ?? "Failed to fetch pension contributions.")
              : "Failed to fetch pension contributions.";
          toast.error(errorMsg);
          setContributions([]);
        }
      } finally {
        if (isMounted) {
          setContributionsLoading(false);
        }
      }
    }

    async function fetchPfas() {
      try {
        const res = await getPayrollPensionPfas();
        if (isMounted && res?.data && Array.isArray(res.data)) {
          const names = res.data
            .map((item) =>
              typeof item === "string"
                ? item
                : (item.name ?? item.pfa ?? item.pfaName ?? ""),
            )
            .filter(Boolean);
          setApiPfas(names);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("[PensionPage] Failed to fetch PFAs:", err);
          const errorMsg =
            axios.isAxiosError(err)
              ? (err.response?.data?.message ?? "Failed to fetch PFAs.")
              : "Failed to fetch PFAs.";
          toast.error(errorMsg);
        }
      }
    }

    fetchOverview();
    fetchContributions();
    fetchPfas();
    return () => {
      isMounted = false;
    };
  }, []);

  const employeeContribFormatted = useMemo(() => {
    if (!overview) return "₦0";
    const val =
      overview.summary?.employeeContribution ??
      overview.employeeContribution ??
      overview.employeePension ??
      overview.employeeContributions ??
      overview.totalEmployeePension ??
      overview.employee8Percent;
    return val !== undefined && val !== null ? formatNaira(val) : "₦0";
  }, [overview]);

  const employerContribFormatted = useMemo(() => {
    if (!overview) return "₦0";
    const val =
      overview.summary?.employerContribution ??
      overview.employerContribution ??
      overview.employerPension ??
      overview.employerContributions ??
      overview.totalEmployerPension ??
      overview.employer10Percent;
    return val !== undefined && val !== null ? formatNaira(val) : "₦0";
  }, [overview]);

  const totalPensionFormatted = useMemo(() => {
    if (!overview) return "₦0";
    const val =
      overview.summary?.totalMonthlyPension ??
      overview.totalMonthlyPension ??
      overview.totalPension ??
      overview.total ??
      overview.totalContributions;
    if (val !== undefined && val !== null) {
      return formatNaira(val);
    }
    const emp =
      Number(
        overview.summary?.employeeContribution ??
          overview.employeeContribution ??
          overview.employeePension ??
          0,
      ) || 0;
    const empyr =
      Number(
        overview.summary?.employerContribution ??
          overview.employerContribution ??
          overview.employerPension ??
          0,
      ) || 0;
    if (emp || empyr) return formatNaira(emp + empyr);
    return "₦0";
  }, [overview]);

  const activeAvcFormatted = useMemo(() => {
    if (!overview) return "₦0";
    const val =
      overview.summary?.activeAvcAmount ??
      overview.activeAvcAmount ??
      overview.avcAmount ??
      overview.totalAvc ??
      overview.avc ??
      overview.voluntaryContributions;
    return val !== undefined && val !== null ? formatNaira(val) : "₦0";
  }, [overview]);

  const [transfersCount, setTransfersCount] = useState<number>(0);

  const tabs = useMemo(() => {
    const avcCount =
      overview?.counts?.activeAvcs ??
      overview?.activeAvcCount ??
      overview?.avcCount;
    const activeTransfers =
      overview?.counts?.activeTransfers ?? transfersCount;
    return [
      {
        id: "contributions" as const,
        label: "Employee Contributions",
      },
      {
        id: "remittance" as const,
        label: "PFA Remittance",
      },
      {
        id: "transfers" as const,
        label: activeTransfers > 0 ? `PFA Transfers (${activeTransfers})` : "PFA Transfers",
      },
      {
        id: "avc" as const,
        label:
          avcCount !== undefined && avcCount > 0
            ? `AVC (${avcCount} active)`
            : "AVC",
      },
    ];
  }, [overview, transfersCount]);

  const mappedEmployees = useMemo<PensionEmployee[]>(() => {
    if (!contributions || contributions.length === 0) {
      return [];
    }
    return contributions.map((item, index) => {
      const name =
        item.name ?? item.employeeName ?? item.employee ?? `Employee ${index + 1}`;
      const initials =
        item.initials ??
        name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0] ?? "")
          .join("")
          .toUpperCase();
      const empVal = item.employeeContribution ?? item.employeePension ?? 0;
      const empyrVal = item.employerContribution ?? item.employerPension ?? 0;
      const avcVal = item.avc ?? item.voluntaryContribution ?? null;
      const totalVal =
        item.total ??
        item.totalContribution ??
        (Number(String(empVal).replace(/[^0-9.-]/g, "")) +
          Number(String(empyrVal).replace(/[^0-9.-]/g, "")) +
          (avcVal ? Number(String(avcVal).replace(/[^0-9.-]/g, "")) : 0));

      return {
        id: item.id ?? index + 1,
        initials,
        name,
        department: item.department ?? item.dept ?? "—",
        pfa: item.pfa ?? item.pfaName ?? "—",
        pensionPin: item.pensionPin ?? item.pin ?? item.rsaPin ?? "—",
        employeeContribution: formatNaira(empVal),
        employerContribution: formatNaira(empyrVal),
        avc: avcVal ? formatNaira(avcVal) : null,
        total: formatNaira(totalVal),
        period: item.period ?? item.month ?? "—",
      };
    });
  }, [contributions]);

  const [search, setSearch] = useState("");
  const [pfaFilter, setPfaFilter] = useState("All PFAs");

  const pfas = useMemo(() => {
    const fromEmployees = mappedEmployees
      .map((employee) => employee.pfa)
      .filter((p) => p && p !== "—");
    return Array.from(new Set([...apiPfas, ...fromEmployees]));
  }, [apiPfas, mappedEmployees]);

  const filteredEmployees = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return mappedEmployees.filter((employee) => {
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
  }, [mappedEmployees, search, pfaFilter, activeTab]);

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
          disabled={exporting}
          onClick={handlePensionExport}
          className="inline-flex h-10 w-fit items-center gap-2 rounded border border-[#E1E6EB] bg-white px-4 text-sm font-semibold text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#087FBD] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={16} strokeWidth={1.8} />
          {exporting ? "Exporting..." : "PENCOM Export"}
        </button>
      </header>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Employee Contributions"
          subTitle="(8%)"
          amount={employeeContribFormatted}
          amountClass="text-[#1683d8]"
          loading={overviewLoading}
        />

        <SummaryCard
          title="Employer Contributions"
          subTitle="(10%)"
          amount={employerContribFormatted}
          amountClass="text-[#A16207]"
          loading={overviewLoading}
        />

        <SummaryCard
          title="Total Monthly Pension"
          amount={totalPensionFormatted}
          amountClass="text-[#7C3AED]"
          loading={overviewLoading}
        />

        <SummaryCard
          title="Active AVC Amount"
          amount={activeAvcFormatted}
          amountClass="text-[#146C36]"
          loading={overviewLoading}
        />
      </section>

      {/* =====================================================
          TABS
      ====================================================== */}

      <section className="mt-7 border-b border-[#E1E6EB]">
        <div className="flex gap-8 overflow-x-auto overflow-y-hidden no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative whitespace-nowrap pb-3 text-sm font-semibold transition ${
                  active
                    ? "text-[#087FBD]"
                    : "text-[#718096] hover:text-[#263447]"
                }`}
              >
                {tab.label}

                {active && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#087FBD]" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          FILTERS (Shown on Contributions tab)
      ====================================================== */}

      {activeTab === "contributions" && (
        <section className="mt-5">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            {/* SEARCH */}

            <div className="relative w-full sm:w-[248px]">
              <Search
                size={17}
                strokeWidth={1.8}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B1]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employee or PFA..."
                className="h-10 w-full rounded border border-[#DCE2E8] bg-white pl-10 pr-3 text-sm font-medium text-[#344054] outline-none placeholder:text-[#8994A3] focus:border-[#087FBD] focus:ring-1 focus:ring-[#087FBD]/10"
              />
            </div>

            {/* PFA FILTER */}

            <select
              value={pfaFilter}
              onChange={(event) => setPfaFilter(event.target.value)}
              className="h-10 w-full rounded border border-[#DCE2E8] bg-white px-3 text-sm font-semibold text-[#344054] outline-none focus:border-[#087FBD] sm:w-[185px]"
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
      )}

      {/* =====================================================
          TAB CONTENT
      ====================================================== */}

      {activeTab === "contributions" && (
        <PensionTable
          employees={filteredEmployees}
          loading={contributionsLoading}
        />
      )}

      {activeTab === "remittance" && <PfaRemittance />}

      {activeTab === "transfers" && (
        <PfaTransfers onCountChange={setTransfersCount} />
      )}

      {activeTab === "avc" && <AvcContributions />}
    </main>
  );
}

/* ==========================================================
   SUMMARY CARD
========================================================== */

function SummaryCard({
  title,
  subTitle,
  amount,
  amountClass,
  loading,
}: {
  title: string;
  subTitle?: string;
  amount: string;
  amountClass: string;
  loading?: boolean;
}) {
  return (
    <div className="min-h-[84px] rounded-lg border border-dashed border-[#D0D5DD] bg-white px-4 py-3.5">
      <div className="text-xs sm:text-sm font-medium text-[#718096] leading-snug">
        <p>{title}</p>
        {subTitle && <p>{subTitle}</p>}
      </div>

      {loading ? (
        <div className="mt-2 h-7 w-28 animate-pulse rounded bg-gray-200" />
      ) : (
        <p className={`mt-2 text-xl font-bold ${amountClass}`}>{amount}</p>
      )}
    </div>
  );
}

/* ==========================================================
   PENSION TABLE
========================================================== */

function PensionTable({
  employees,
  loading,
}: {
  employees: PensionEmployee[];
  loading?: boolean;
}) {
  return (
    <section className="mt-4 w-full overflow-hidden rounded border border-[#E1E6EB] bg-white">
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
            {loading ? (
              <tr>
                <td colSpan={8} className="p-4">
                  <div className="h-36 animate-pulse rounded bg-gray-100" />
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <PensionRow
                  key={employee.id}
                  employee={employee}
                  isEven={index % 2 === 1}
                />
              ))
            )}
          </tbody>
        </table>

        {!loading && employees.length === 0 && (
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
      className={`h-[54px] border-b border-[#EDF0F3] last:border-b-0 ${isEven ? "bg-[#F3F4F8]" : "bg-white"}`}
    >
      {/* EMPLOYEE */}

      <td className="px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E5F2FF] text-xs font-bold text-[#3182CE]">
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
