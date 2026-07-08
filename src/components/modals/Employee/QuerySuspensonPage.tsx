
import { DetailPanel } from "@/components/employee/conduct/DetailPanel";
import { QueryTable } from "@/components/employee/conduct/QueryTable";
import { SuspensionTable } from "@/components/employee/conduct/SuspensionTable";
import { queryData, suspensionData } from "@/data/employee/conduct";
import { AnyEmployee, Tab } from "@/types/employee/conduct";
import { Search } from "lucide-react";
import { useState } from "react";

export default function QuerySuspensionPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Query");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AnyEmployee | null>(queryData[0]);

  // When switching tabs, clear selection and search
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelected(null);
    setSearch("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-gray-900">
      {/* ── Left: table area ── */}
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

      {/* ── Right: detail panel ── */}
      {selected && (
        <DetailPanel emp={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
