// app/reports/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiChevronRight, FiFilter } from "react-icons/fi";
import { LuLayoutGrid, LuTable } from "react-icons/lu";

type DrillRow = {
  type: "Client" | "Agent" | "Project";
  name: string;
  detail: string;
  totalValue: number;
  sharePct: number;
  href: string;
};

const drillData: DrillRow[] = [
  { type: "Client", name: "Zenith Technologies Ltd", detail: "2 invoices", totalValue: 612750, sharePct: 100, href: "/reports/client/zenith-technologies" },
  { type: "Project", name: "Zenith HRIS Deployment", detail: "Zenith Technologies Ltd", totalValue: 612750, sharePct: 100, href: "/reports/project/zenith-hris-deployment" },
  { type: "Agent", name: "Emeka Okafor", detail: "3 invoices", totalValue: 526750, sharePct: 86, href: "/reports/agent/emeka-okafor" },
  { type: "Client", name: "BlueStar Logistics", detail: "1 invoice", totalValue: 129000, sharePct: 21, href: "/reports/client/bluestar-logistics" },
  { type: "Project", name: "BlueStar Annual Contract", detail: "BlueStar Logistics", totalValue: 129000, sharePct: 21, href: "/reports/project/bluestar-annual-contract" },
  { type: "Client", name: "Prestige Global Services", detail: "1 invoice", totalValue: 15250, sharePct: 2, href: "/reports/client/prestige-global-services" },
];

const typeStyles: Record<DrillRow["type"], { badge: string; bar: string }> = {
  Client: { badge: "bg-sky-50 text-sky-700", bar: "bg-sky-500" },
  Agent: { badge: "bg-emerald-50 text-emerald-700", bar: "bg-emerald-500" },
  Project: { badge: "bg-amber-50 text-amber-700", bar: "bg-amber-500" },
};

const naira = (n: number) => `₦${n.toLocaleString()}`;

export default function ReportsPage() {
  const [view, setView] = useState<"cards" | "table">("table");

  const [client, setClient] = useState("");
  const [agent, setAgent] = useState("");
  const [itemService, setItemService] = useState("");
  const [project, setProject] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const grouped = useMemo(() => {
    return {
      Client: drillData.filter((d) => d.type === "Client"),
      Agent: drillData.filter((d) => d.type === "Agent"),
      Project: drillData.filter((d) => d.type === "Project"),
    };
  }, []);

  const handleGenerate = () => {
    const params = new URLSearchParams();
    if (client) params.set("client", client);
    if (agent) params.set("agent", agent);
    if (itemService) params.set("item", itemService);
    if (project) params.set("project", project);
    if (status) params.set("status", status);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    window.location.href = `/reports/results?${params.toString()}`;
  };

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Generate, filter, and download reports across all your billing data
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <span className="text-emerald-500">↗</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-slate-900">₦526,750</p>
          <p className="mt-1 text-xs text-slate-400">From paid invoices</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Outstanding</p>
            <span className="text-sky-500">↗</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-slate-900">₦15,250</p>
          <p className="mt-1 text-xs text-slate-400">Invoices sent, awaiting payment</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Overdue</p>
            <span className="text-rose-500">⚠</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-rose-600">₦129,000</p>
          <p className="mt-1 text-xs text-slate-400">Past due date</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">VAT Collected</p>
            <span className="text-emerald-500">↗</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-slate-900">₦46,500</p>
          <p className="mt-1 text-xs text-slate-400">7.5% HRIS standard rate</p>
        </div>
      </div>

      {/* Filter Reports */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
          <FiFilter size={15} className="text-slate-400" />
          Filter Reports
          <span className="font-normal text-slate-400">— apply any combination of filters</span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Client</label>
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
            >
              <option value="">All Clients</option>
              <option value="zenith-technologies">Zenith Technologies Ltd</option>
              <option value="bluestar-logistics">BlueStar Logistics</option>
              <option value="prestige-global-services">Prestige Global Services</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Agent</label>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
            >
              <option value="">All Agents</option>
              <option value="emeka-okafor">Emeka Okafor</option>
              <option value="sade-williams">Sade Williams</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Item / Service</label>
            <select
              value={itemService}
              onChange={(e) => setItemService(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
            >
              <option value="">All Items / Service</option>
              <option value="hr-software-license">HR Software License</option>
              <option value="payroll-processing">Payroll Processing</option>
              <option value="annual-maintenance">Annual Maintenance</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
            >
              <option value="">All Projects</option>
              <option value="zenith-hris-deployment">Zenith HRIS Deployment</option>
              <option value="bluestar-annual-contract">BlueStar Annual Contract</option>
              <option value="prestige-payroll-setup">Prestige Payroll Setup</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-4">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="sent">Sent</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="dd/mm/yyyy"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="dd/mm/yyyy"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              className="w-full rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Drill Into */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-700">Drill Into</h2>
          <div className="flex items-center rounded-md border border-slate-200 bg-white p-0.5">
            <button
              onClick={() => setView("cards")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium ${
                view === "cards" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LuLayoutGrid size={14} /> Cards
            </button>
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium ${
                view === "table" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LuTable size={14} /> Table
            </button>
          </div>
        </div>

        {view === "cards" ? (
          <div className="grid grid-cols-3 gap-4">
            {(["Client", "Agent", "Project"] as const).map((type) => (
              <div key={type} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-medium text-slate-700">By {type}</p>
                <div className="space-y-3">
                  {grouped[type].map((row) => (
                    <Link
                      key={row.name}
                      href={row.href}
                      className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">{row.name}</p>
                        <p className="text-xs text-slate-400">{row.detail}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium tabular-nums text-slate-800">
                          {naira(row.totalValue)}
                        </p>
                        <FiChevronRight size={14} className="text-slate-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
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
                  <th className="px-6 py-3 font-medium">Share</th>
                  <th className="px-6 py-3 font-medium text-right">Drill In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {drillData.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${typeStyles[row.type].badge}`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">
                      {row.detail}
                    </td>
                    <td className="px-6 py-3 text-sm tabular-nums font-medium text-slate-800 whitespace-nowrap">
                      {naira(row.totalValue)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${typeStyles[row.type].bar}`}
                            style={{ width: `${row.sharePct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{row.sharePct}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right whitespace-nowrap">
                      <Link
                        href={row.href}
                        className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
                      >
                        Drill In <FiChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}