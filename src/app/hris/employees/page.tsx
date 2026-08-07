"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import { staticEmployees } from "@/data/hris/employees";
import { EmployeeStatus } from "@/types/hris/employee";
import InviteEmployeeModal from "@/components/modals/Hris/InviteEmployeeModal";
import FilterEmployeeModal from "@/components/modals/Hris/FilterEmployeeModal";
import { Search } from "lucide-react";

const statusStyles: Record<EmployeeStatus, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700",
  Probation: "bg-amber-50 text-amber-700",
  Exited: "bg-rose-50 text-rose-700",
};

type Tab = EmployeeStatus;

export default function EmployeesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Confirmed");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDept, setFilterDept] = useState("");

  const tabs: Tab[] = ["Confirmed", "Probation", "Exited"];

  const filtered = staticEmployees.filter(
    (e) =>
      e.status === activeTab &&
      (filterDept === "" || e.department === filterDept),
  );

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Employee List</h1>
        <button
          onClick={() => setInviteOpen(true)}
          className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
        >
          + New Employee
        </button>
      </div>
      {/* { search + filter} */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 border-b border-slate-300 pb-2">
          <Search className="text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search Employee"
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          ⚙ Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-sky-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Employee ID</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Department</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Contact</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              <th className="px-6 py-3 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => router.push(`/hris/employees/${emp.id}`)}
              >
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {emp.id}
                </td>
                <td className="px-6 py-3 text-base font-medium text-slate-800 whitespace-nowrap">
                  {emp.name}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {emp.role}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {emp.department}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[emp.status]}`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {emp.contact}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {emp.dateAdded}
                </td>
                <td
                  className="px-6 py-3 text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      router.push(`/hris/employees/${emp.id}/edit`)
                    }
                    className="rounded p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-600"
                  >
                    <FiEdit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InviteEmployeeModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
      <FilterEmployeeModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={({ department }) => setFilterDept(department)}
      />
    </section>
  );
}
