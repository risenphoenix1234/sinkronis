// src/app/payroll/payees/page.tsx

"use client";

import ActionMenu from "@/components/payroll/payee/actionMenu";
import { payees } from "@/data/payroll/payee";
import { Payee, PayeeTab } from "@/types/payroll/payee";
import { useState, useRef, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

// ── Mock data ──────────────────────────────────────────────────────────────

// ── Icons ──────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9ca3af"
      strokeWidth={1.8}
      className="w-4 h-4 shrink-0"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <polyline points="8 17 12 21 16 17" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-3.5 h-3.5 inline ml-1 text-gray-400"
    >
      <path d="m8 9 4-4 4 4M16 15l-4 4-4-4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={2.5}
      className="w-4 h-4"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function PayrollPayeesPage() {
  const [activeTab, setActiveTab] = useState<PayeeTab>("Active Payee");
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [data, setData] = useState<Payee[]>(payees);

  const tabs: PayeeTab[] = ["Active Payee", "Inactive Payee", "Pending Payee"];

  const filtered = data.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDeactivate = (id: number) => {
    setData((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section className="space-y-6">
      <div className="min-h-screen bg-white font-sans text-gray-900 px-8 py-7">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Payee List</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              Export CSV <ExportIcon />
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
              <PlusIcon /> New Payee
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-6 border-b border-gray-200 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Total Salaries ── */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-0.5">Total Salaries</p>
          <p className="text-xl font-bold text-gray-900">₦4,140,000</p>
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-72 bg-white">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Payee"
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <FilterIcon /> Filters
          </button>
        </div>

        {/* ── Table ── */}
        <div className="w-full overflow-auto rounded-lg border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">
                  Name <SortIcon />
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                  Phone
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                  Group
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((payee, i) => (
                <tr
                  key={payee.id}
                  className={`border-b border-gray-50 transition-colors ${
                    i % 2 === 1 ? "bg-gray-50/70" : "bg-white"
                  } hover:bg-blue-50/20`}
                >
                  <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                    {payee.name}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{payee.email}</td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {payee.phone}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{payee.group}</td>
                  <td className="px-5 py-3.5 text-right relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === payee.id ? null : payee.id)
                      }
                      className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded"
                    >
                      <EditIcon />
                    </button>

                    {openMenuId === payee.id && (
                      <ActionMenu
                        onEdit={() => alert(`Edit ${payee.name}`)}
                        onDeactivate={() => handleDeactivate(payee.id)}
                        onClose={() => setOpenMenuId(null)}
                      />
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    No payees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
