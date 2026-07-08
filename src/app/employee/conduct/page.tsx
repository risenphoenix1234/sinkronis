"use client";

import { useState } from "react";

import { DetailPanel } from "@/components/employee/conduct/DetailPanel";
import { SuspensionTable } from "@/components/employee/conduct/SuspensionTable";
import { QueryTable } from "@/components/employee/conduct/QueryTable";

import { AnyEmployee, Tab } from "@/types/employee/conduct";

import { queryData, suspensionData } from "@/data/employee/conduct";
import { Search } from "lucide-react";

// ── Icons ───────────────────────────────────────────────────────────────

export function SortIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="inline h-3.5 w-3.5 ml-1 text-gray-400"
    >
      <path d="m8 9 4-4 4 4M16 15l-4 4-4-4" />
    </svg>
  );
}

// ── Shared Field Component ──────────────────────────────────────────────

export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-0.5 text-[11px] text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────

export default function EmployeeConductPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Query");
  const [selected, setSelected] = useState<AnyEmployee | null>(null);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelected(null);
    setSearch("");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-6 px-6 pt-5 border-b border-gray-200">
          {(["Query", "Suspension"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-64 bg-white">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Employee"
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Table (swaps on tab change) */}
        <div className="flex-1 overflow-auto">
          {activeTab === "Query" ? (
            <QueryTable
              data={queryData}
              search={search}
              selected={selected}
              onSelect={(emp) => setSelected(selected === emp ? null : emp)}
            />
          ) : (
            <SuspensionTable
              data={suspensionData}
              search={search}
              selected={selected}
              onSelect={(emp) => setSelected(selected === emp ? null : emp)}
            />
          )}
        </div>
      </div>

      {selected && (
        <DetailPanel emp={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
