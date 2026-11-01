// src/app/accounting/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiFilter,
  FiGrid,
  FiList,
  FiBriefcase,
  FiUser,
  FiFolder,
  FiChevronRight,
} from "react-icons/fi";
import {
  getReports,
  getCustomers,
  getAgents,
  getProjects,
  getCatalogueItems,
  naira,
} from "@/lib/api/accounting";
import { ReportFilters, ReportGroup, ReportSummary } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";

interface Option {
  id: string;
  label: string;
}

const STATUS_OPTIONS: Option[] = [
  { id: "ALL", label: "All statuses" },
  { id: "DRAFT", label: "Draft" },
  { id: "SENT", label: "Sent" },
  { id: "PARTIALLY_PAID", label: "Partially paid" },
  { id: "PAID", label: "Paid" },
  { id: "OVERDUE", label: "Overdue" },
  { id: "VOID", label: "Void" },
];

type FilterState = Record<keyof ReportFilters, string>;

const EMPTY_FILTERS: FilterState = {
  clientId: "",
  agentId: "",
  projectId: "",
  itemServiceId: "",
  status: "",
  fromDate: "",
  toDate: "",
};

const TREND_STYLES = {
  green: { icon: "bg-[#D8F3DC] text-[#1B7A34]", value: "text-[#1B7A34]" },
  blue: { icon: "bg-[#E3F2FD] text-[#1565C0]", value: "text-[#1565C0]" },
  red: { icon: "bg-[#FFE5E5] text-[#FF3B30]", value: "text-[#FF3B30]" },
  brand: { icon: "bg-[#E3F2FD] text-[#2183C6]", value: "text-[#2183C6]" },
} as const;

function SummaryCard({
  label,
  value,
  hint,
  trend,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  trend: "up" | "down";
  tone: keyof typeof TREND_STYLES;
}) {
  const style = TREND_STYLES[tone];
  return (
    <div className="rounded-md border border-[#E8EBED] bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#637381]">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${style.icon}`}>
          {trend === "up" ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
        </span>
      </div>
      <p className={`mt-4 text-2xl font-bold ${style.value}`}>{value}</p>
      <p className="mt-2 text-xs text-[#919EAB]">{hint}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute -top-2 left-3 z-10 bg-white px-1 text-[11px] text-[#8A96A0]">
        {label}
      </span>
      {children}
    </div>
  );
}

const DRILL_TONES = {
  blue: { icon: "text-[#1565C0]", chevron: "bg-[#E3F2FD] text-[#1565C0]" },
  green: { icon: "text-[#1B7A34]", chevron: "bg-[#D8F3DC] text-[#1B7A34]" },
  amber: { icon: "text-[#92400E]", chevron: "bg-[#FEF3C7] text-[#92400E]" },
} as const;

function DrillColumn({
  title,
  icon,
  entries,
  basePath,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  entries: ReportGroup[];
  basePath: string;
  tone: keyof typeof DRILL_TONES;
}) {
  const style = DRILL_TONES[tone];
  return (
    <div className="rounded-md border border-[#E8EBED] bg-white">
      <div className="flex items-center gap-2 border-b border-[#F2F3F5] px-4 py-3.5 text-sm font-semibold text-[#212B36]">
        <span className={style.icon}>{icon}</span>
        {title}
      </div>
      <div className="px-4">
        {entries.length === 0 && <p className="py-4 text-sm text-[#919EAB]">No data yet.</p>}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between border-b border-[#F2F3F5] py-3 last:border-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#212B36]">{entry.name}</p>
              <p className="text-xs text-[#919EAB]">{entry.invoiceCount} invoices</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-semibold text-[#212B36]">{naira(entry.invoiceValue)}</span>
              <Link
                href={`${basePath}/${entry.id}`}
                aria-label={`Drill into ${entry.name}`}
                className={`flex h-7 w-7 items-center justify-center rounded-full ${style.chevron}`}
              >
                <FiChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [byClient, setByClient] = useState<ReportGroup[]>([]);
  const [byAgent, setByAgent] = useState<ReportGroup[]>([]);
  const [byProject, setByProject] = useState<ReportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"cards" | "table">("cards");

  const [clientOptions, setClientOptions] = useState<Option[]>([]);
  const [agentOptions, setAgentOptions] = useState<Option[]>([]);
  const [projectOptions, setProjectOptions] = useState<Option[]>([]);
  const [itemOptions, setItemOptions] = useState<Option[]>([]);

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getReports({ groupBy: "CLIENT", limit: 1 }),
      getReports({ groupBy: "AGENT", limit: 1 }),
      getReports({ groupBy: "PROJECT", limit: 1 }),
      getCustomers({ limit: 100 }),
      getAgents({ limit: 100 }),
      getProjects({ limit: 100 }),
      getCatalogueItems({ limit: 100 }),
    ])
      .then(([clientRes, agentRes, projectRes, customersRes, agentsRes, projectsRes, itemsRes]) => {
        if (cancelled) return;
        setSummary(clientRes.data.summary);
        setByClient(clientRes.data.groups ?? []);
        setByAgent(agentRes.data.groups ?? []);
        setByProject(projectRes.data.groups ?? []);
        setClientOptions(customersRes.data.customers.map((c) => ({ id: c.id, label: c.companyName })));
        setAgentOptions(
          agentsRes.data.agents
            .filter((a) => a.userId)
            .map((a) => ({ id: a.userId as string, label: a.name }))
        );
        setProjectOptions(projectsRes.data.projects.map((p) => ({ id: p.id, label: p.name })));
        setItemOptions(itemsRes.data.items.map((i) => ({ id: i.id, label: i.name })));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load reports data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateFilter(key: keyof FilterState, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleGenerate() {
    const params = new URLSearchParams();
    const withLabel = (key: keyof FilterState, options: Option[]) => {
      const value = filters[key];
      if (!value) return;
      params.set(key, value);
      const label = options.find((o) => o.id === value)?.label;
      if (label) params.set(`${key}Label`, label);
    };
    withLabel("clientId", clientOptions);
    withLabel("agentId", agentOptions);
    withLabel("projectId", projectOptions);
    withLabel("itemServiceId", itemOptions);
    if (filters.status) params.set("status", filters.status);
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);
    router.push(`/accounting/reports/results?${params.toString()}`);
  }

  const allEntries: (ReportGroup & { type: "Client" | "Agent" | "Project"; basePath: string })[] = [
    ...byClient.map((e) => ({ ...e, type: "Client" as const, basePath: "/accounting/reports/clients" })),
    ...byProject.map((e) => ({ ...e, type: "Project" as const, basePath: "/accounting/reports/projects" })),
    ...byAgent.map((e) => ({ ...e, type: "Agent" as const, basePath: "/accounting/reports/agents" })),
  ];

  const revenue = summary?.totalRevenue ?? 0;
  const expenses = summary?.totalExpenses ?? 0;
  const total = revenue + expenses || 1;
  const revenuePct = (revenue / total) * 100;

  const fieldClass =
    "h-[50px] w-full rounded-md border border-[#DCE0E4] bg-white px-3 text-sm text-[#212B36] focus:border-[#2183C6] focus:outline-none";

  const profitPositive = (summary?.netProfit ?? 0) >= 0;

  return (
    <section className="min-h-[calc(100vh-5rem)] space-y-6 bg-[#F4F6F8] p-6">
      <div>
        <h1 className="text-4xl font-bold text-[#212B36]">Reports</h1>
        <p className="mt-2 text-sm text-[#637381]">Generate, filter, and download reports across all your billing data</p>
      </div>

      {error && (
        <div className="rounded-md border border-[#FBD9D9] bg-[#FFF5F5] p-4 text-sm text-[#FF3B30]">
          Couldn&apos;t load reports data: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Revenue"
          value={summary ? naira(summary.totalRevenue) : "—"}
          hint="From paid invoices"
          trend="up"
          tone="green"
        />
        <SummaryCard
          label="Outstanding"
          value={summary ? naira(summary.outstanding) : "—"}
          hint="Invoices sent, awaiting payment"
          trend="up"
          tone="blue"
        />
        <SummaryCard
          label="Overdue"
          value={summary ? naira(summary.overdue) : "—"}
          hint="Past due date"
          trend="down"
          tone="red"
        />
        <SummaryCard
          label="VAT Collected"
          value={summary ? naira(summary.vatCollected) : "—"}
          hint="Payment-proportional"
          trend="up"
          tone="brand"
        />
      </div>

      <div className="rounded-md border border-[#E8EBED] bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-[#212B36]">Profit / Loss</p>
            <p className="mt-1 text-xs text-[#637381]">Revenue − Expenses = Net Profit</p>
          </div>
          <span
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              profitPositive ? "bg-[#D8F3DC] text-[#1B7A34]" : "bg-[#FFE5E5] text-[#FF3B30]"
            }`}
          >
            {summary ? `${summary.netProfit >= 0 ? "+" : ""}${naira(summary.netProfit)}` : "—"}
          </span>
        </div>
        <div className="mt-4 flex h-8 w-full overflow-hidden rounded bg-[#EDEFF2]">
          <div
            className="flex items-center justify-end bg-[#1B7A34] px-2 text-[11px] font-bold text-white"
            style={{ width: `${revenuePct}%` }}
          >
            {revenuePct > 15 && "Rev"}
          </div>
          <div
            className="flex items-center justify-start bg-[#FF3B30] px-2 text-[11px] font-bold text-white"
            style={{ width: `${100 - revenuePct}%` }}
          >
            {100 - revenuePct > 15 && "Exp"}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-6 text-xs text-[#637381]">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[#1B7A34]" /> Revenue —{" "}
            <span className="font-semibold text-[#1B7A34]">{naira(revenue)}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[#FF3B30]" /> Expenses —{" "}
            <span className="font-semibold text-[#FF3B30]">{naira(expenses)}</span>
          </span>
        </div>
      </div>

      <div className="rounded-md border border-[#E8EBED] bg-white p-5">
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#212B36]">
          <FiFilter size={14} className="text-[#2183C6]" /> Filter Reports{" "}
          <span className="text-xs font-normal text-[#919EAB]">— apply any combination of filters</span>
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Client">
            <select className={fieldClass} value={filters.clientId} onChange={(e) => updateFilter("clientId", e.target.value)}>
              <option value="">All</option>
              {clientOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Agent">
            <select className={fieldClass} value={filters.agentId} onChange={(e) => updateFilter("agentId", e.target.value)}>
              <option value="">All</option>
              {agentOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Item / Service">
            <select
              className={fieldClass}
              value={filters.itemServiceId}
              onChange={(e) => updateFilter("itemServiceId", e.target.value)}
            >
              <option value="">All</option>
              {itemOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Project">
            <select className={fieldClass} value={filters.projectId} onChange={(e) => updateFilter("projectId", e.target.value)}>
              <option value="">All</option>
              {projectOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className={fieldClass} value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.id} value={o.id === "ALL" ? "" : o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date From">
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => updateFilter("fromDate", e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Date To">
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => updateFilter("toDate", e.target.value)}
              className={fieldClass}
            />
          </Field>
          <button
            type="button"
            onClick={handleGenerate}
            className="h-10 self-center rounded-md bg-[#2183C6] px-4 text-sm font-medium text-white hover:bg-[#1976B8]"
          >
            Generate
          </button>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#212B36]">Drill Into</h3>
          <div className="flex gap-1 rounded-md border border-[#E2E6EB] bg-[#F4F6F8] p-1">
            <button
              onClick={() => setView("cards")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs ${
                view === "cards" ? "bg-white font-medium text-[#212B36]" : "text-[#637381]"
              }`}
            >
              <FiGrid size={12} /> Cards
            </button>
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs ${
                view === "table" ? "bg-white font-medium text-[#212B36]" : "text-[#637381]"
              }`}
            >
              <FiList size={12} /> Table
            </button>
          </div>
        </div>

        {view === "cards" ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <DrillColumn title="By Client" icon={<FiBriefcase size={14} />} entries={byClient} basePath="/accounting/reports/clients" tone="blue" />
            <DrillColumn title="By Agent" icon={<FiUser size={14} />} entries={byAgent} basePath="/accounting/reports/agents" tone="green" />
            <DrillColumn title="By Project" icon={<FiFolder size={14} />} entries={byProject} basePath="/accounting/reports/projects" tone="amber" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-[#E8EBED] bg-white">
            <table className="min-w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-dotted border-[#EBEEF0] text-[#637381]">
                  <th className="px-3 py-3.5 font-normal">Type</th>
                  <th className="px-3 py-3.5 font-normal">Name</th>
                  <th className="px-3 py-3.5 font-normal">Details</th>
                  <th className="px-3 py-3.5 font-normal">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {allEntries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-10 text-center text-sm text-[#919EAB]">
                      No data yet.
                    </td>
                  </tr>
                )}
                {allEntries.map((entry) => (
                  <tr key={`${entry.type}-${entry.id}`} className="even:bg-[#F2F2F7]">
                    <td className="px-3 py-3.5 text-[#637381]">{entry.type}</td>
                    <td className="px-3 py-3.5 font-medium">
                      <Link href={`${entry.basePath}/${entry.id}`} className="text-[#2183C6] hover:underline">
                        {entry.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 text-[#637381]">{entry.invoiceCount} invoices</td>
                    <td className="px-3 py-3.5 font-semibold tabular-nums text-[#212B36]">
                      {naira(entry.invoiceValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {loading && <Loader variant="section" label="Loading reports" />}
    </section>
  );
}