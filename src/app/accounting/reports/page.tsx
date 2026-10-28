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

function SummaryCard({
  label,
  value,
  hint,
  trend,
  valueClassName = "text-slate-900",
}: {
  label: string;
  value: string;
  hint: string;
  trend: "up" | "down";
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full ${
            trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          {trend === "up" ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
        </span>
      </div>
      <p className={`mt-3 text-2xl font-semibold ${valueClassName}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

function DrillColumn({
  title,
  icon,
  entries,
  basePath,
}: {
  title: string;
  icon: React.ReactNode;
  entries: ReportGroup[];
  basePath: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon}
        {title}
      </div>
      <div className="space-y-3">
        {entries.length === 0 && <p className="text-sm text-slate-400">No data yet.</p>}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium text-slate-800">{entry.name}</p>
              <p className="text-xs text-slate-400">{entry.invoiceCount} invoices</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-800">{naira(entry.invoiceValue)}</span>
              <Link
                href={`${basePath}/${entry.id}`}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-sky-600 hover:bg-sky-50"
              >
                Drill In &gt;
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

  const selectClass =
    "rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-sky-400 focus:outline-none bg-white";

  const allEntries: (ReportGroup & { type: "Client" | "Agent" | "Project"; basePath: string })[] = [
    ...byClient.map((e) => ({ ...e, type: "Client" as const, basePath: "/accounting/reports/clients" })),
    ...byProject.map((e) => ({ ...e, type: "Project" as const, basePath: "/accounting/reports/projects" })),
    ...byAgent.map((e) => ({ ...e, type: "Agent" as const, basePath: "/accounting/reports/agents" })),
  ];

  const revenue = summary?.totalRevenue ?? 0;
  const expenses = summary?.totalExpenses ?? 0;
  const total = revenue + expenses || 1;
  const revenuePct = (revenue / total) * 100;

  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500">Generate, filter, and download reports across all your billing data</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          Couldn&apos;t load reports data: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Revenue"
          value={summary ? naira(summary.totalRevenue) : "—"}
          hint="From paid invoices"
          trend="up"
        />
        <SummaryCard
          label="Outstanding"
          value={summary ? naira(summary.outstanding) : "—"}
          hint="Invoices sent, awaiting payment"
          trend="up"
        />
        <SummaryCard
          label="Overdue"
          value={summary ? naira(summary.overdue) : "—"}
          hint="Past due date"
          trend="down"
          valueClassName="text-rose-600"
        />
        <SummaryCard
          label="VAT Collected"
          value={summary ? naira(summary.vatCollected) : "—"}
          hint="Payment-proportional"
          trend="up"
          valueClassName="text-sky-600"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Profit / Loss</p>
            <p className="text-xs text-slate-400">Revenue − Expenses = Net Profit</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              (summary?.netProfit ?? 0) >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}
          >
            {summary ? `${summary.netProfit >= 0 ? "+" : ""}${naira(summary.netProfit)}` : "—"}
          </span>
        </div>
        <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="flex items-center justify-end bg-emerald-500 px-2 text-[10px] text-white"
            style={{ width: `${revenuePct}%` }}
          >
            {revenuePct > 15 && "Rev"}
          </div>
          <div
            className="flex items-center justify-end bg-rose-500 px-2 text-[10px] text-white"
            style={{ width: `${100 - revenuePct}%` }}
          >
            {100 - revenuePct > 15 && "Exp"}
          </div>
        </div>
        <div className="mt-2 flex gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Revenue — {naira(revenue)}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Expenses — {naira(expenses)}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
          <FiFilter size={14} /> Filter Reports{" "}
          <span className="text-xs font-normal text-slate-400">— apply any combination of filters</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select className={selectClass} value={filters.clientId} onChange={(e) => updateFilter("clientId", e.target.value)}>
            <option value="">Client</option>
            {clientOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <select className={selectClass} value={filters.agentId} onChange={(e) => updateFilter("agentId", e.target.value)}>
            <option value="">Agent</option>
            {agentOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={filters.itemServiceId}
            onChange={(e) => updateFilter("itemServiceId", e.target.value)}
          >
            <option value="">Item / Service</option>
            {itemOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <select className={selectClass} value={filters.projectId} onChange={(e) => updateFilter("projectId", e.target.value)}>
            <option value="">Project</option>
            {projectOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <select className={selectClass} value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.id} value={o.id === "ALL" ? "" : o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => updateFilter("fromDate", e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-sky-400 focus:outline-none"
          />
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => updateFilter("toDate", e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-sky-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
          >
            Generate
          </button>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-700">Drill Into</h3>
          <div className="flex overflow-hidden rounded-md border border-slate-200">
            <button
              onClick={() => setView("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs ${
                view === "cards" ? "bg-sky-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <FiGrid size={12} /> Cards
            </button>
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs ${
                view === "table" ? "bg-sky-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <FiList size={12} /> Table
            </button>
          </div>
        </div>

        {view === "cards" ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <DrillColumn title="By Client" icon={<FiBriefcase size={14} />} entries={byClient} basePath="/accounting/reports/clients" />
            <DrillColumn title="By Agent" icon={<FiUser size={14} />} entries={byAgent} basePath="/accounting/reports/agents" />
            <DrillColumn title="By Project" icon={<FiFolder size={14} />} entries={byProject} basePath="/accounting/reports/projects" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Details</th>
                  <th className="px-6 py-3 font-medium">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allEntries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">
                      No data yet.
                    </td>
                  </tr>
                )}
                {allEntries.map((entry) => (
                  <tr key={`${entry.type}-${entry.id}`} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm text-slate-500">{entry.type}</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-800">
                      <Link href={`${entry.basePath}/${entry.id}`} className="text-sky-600 hover:underline">
                        {entry.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-500">{entry.invoiceCount} invoices</td>
                    <td className="px-6 py-3 text-sm font-medium tabular-nums text-slate-800">
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