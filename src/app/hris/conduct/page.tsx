// src/app/hris/conduct/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Search, Download, Plus, Filter, Pencil } from "lucide-react";

import { queries } from "@/data/hris/conduct";

import QueryDetailsDrawer from "@/components/hris/conduct/QueryDetailsDrawer";
import { TableHead } from "@/components/hris/conduct/TableHead";
import AddQueryModal from "@/components/modals/Hris/AddQueryModal";
import AddSuspensionModal from "@/components/modals/Hris/AddSuspensionModal";
import StatusBadge from "@/components/ui/StatusBadge";
import ConductSuspensionModal from "@/components/modals/Hris/ConductSuspensionModal";

export default function HRISConductPage() {
  const [activeTab, setActiveTab] = useState<"query" | "suspension">("query");
  const [search, setSearch] = useState("");
  const [isAddQueryOpen, setIsAddQueryOpen] = useState(false);
  const [isAddSuspensionOpen, setIsAddSuspensionOpen] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState<
    (typeof queries)[number] | null
  >(null);

  const filteredQueries = useMemo(() => {
    return queries.filter((item) => {
      const employeeName = item.employeeName?.toLowerCase() || "";

      const employeeId = item.employeeId?.toLowerCase() || "";

      const searchValue = search.toLowerCase();

      return (
        employeeName.includes(searchValue) || employeeId.includes(searchValue)
      );
    });
  }, [search]);

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab("query")}
                className={`px-4 pb-3 text-sm transition-colors ${
                  activeTab === "query"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-500"
                }`}
              >
                Query
              </button>

              <button
                onClick={() => setActiveTab("suspension")}
                className={`px-4 pb-3 text-sm transition-colors ${
                  activeTab === "suspension"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-500"
                }`}
              >
                Suspension
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex h-10 items-center gap-2 rounded-md border bg-white px-4 text-sm text-slate-600">
                Export CSV
                <Download size={15} />
              </button>
              {activeTab === "query" ? (
                <div>
                  <button
                    onClick={() => setIsAddQueryOpen(true)}
                    className="flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm text-white"
                  >
                    <Plus size={15} />
                    New Query
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setIsAddSuspensionOpen(true)}
                    className="flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm text-white"
                  >
                    <Plus size={15} />
                    New Suspension
                  </button>
                </div>
              )}
            </div>
            {isAddQueryOpen && (
              <AddQueryModal
                open={isAddQueryOpen}
                onClose={() => setIsAddQueryOpen(false)}
              />
            )}
            {isAddSuspensionOpen && (
              <AddSuspensionModal
                open={isAddSuspensionOpen}
                onClose={() => setIsAddSuspensionOpen(false)}
              />
            )}
          </div>

          {/* Search */}
          <div className="mt-5 flex items-center justify-between">
            <div className="relative w-[320px]">
              <Search
                size={16}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                placeholder="Search Employee"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-md border bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <button className="flex h-10 items-center gap-2 rounded-md border bg-white px-4 text-sm text-slate-600">
              <Filter size={14} />
              Filters
            </button>
          </div>

          {/* QUERY TAB */}
          {activeTab === "query" && (
            <>
              <div className="mt-4 overflow-hidden rounded-lg border bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-white">
                      <TableHead title="Employee ID" />
                      <TableHead title="Name" />
                      <TableHead title="Role" />
                      <TableHead title="Department" />
                      <TableHead title="Query Type" />
                      <TableHead title="Status" />

                      <th className="px-4 py-4 text-left text-xs font-medium text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredQueries.map((query, index) => (
                      <tr
                        key={query.id}
                        onClick={() => setSelectedQuery(query)}
                        className={`cursor-pointer border-b text-sm hover:bg-slate-50 ${
                          selectedQuery?.id === query.id
                            ? "bg-slate-100"
                            : index % 2 === 1
                              ? "bg-slate-50/60"
                              : ""
                        }`}
                      >
                        <td className="px-4 py-5">{query.employeeId}</td>

                        <td className="px-4 py-5">{query.employeeName}</td>

                        <td className="px-4 py-5">{query.role}</td>

                        <td className="px-4 py-5">{query.department}</td>

                        <td className="px-4 py-5">{query.queryType}</td>

                        <td className="px-4 py-5">
                          <StatusBadge status={query.status} />
                        </td>

                        <td className="px-4 py-5">
                          <button
                            onClick={(e) => {
                              () => setSelectedQuery(query);
                            }}
                            className="text-slate-500 hover:text-blue-600"
                          >
                            <Pencil size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredQueries.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-sm text-slate-500"
                        >
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-10 flex justify-end">
                <button className="rounded-md border bg-white px-5 py-2 text-sm text-slate-700">
                  Cancel
                </button>
              </div>
            </>
          )}
          {activeTab === "suspension" && (
            <>
              <ConductSuspensionModal />
            </>
          )}
        </div>
      </div>

      {/* RIGHT DRAWER */}
      {activeTab === "query" && selectedQuery && (
        <QueryDetailsDrawer query={selectedQuery} />
      )}
    </div>
  );
}
