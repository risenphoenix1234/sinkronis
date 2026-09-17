"use client";

import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import LogExpenseModal from "@/components/modals/LogExpenseModal";
import EditExpenseModal from "@/components/modals/EditExpenseModal";
import DeleteExpenseModal from "@/components/modals/DeleteExpenseModal";

type Expense = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: string;
  reference: string;
  loggedBy: string;
};

const initialExpenses: Expense[] = [
  { id: "XPN-007", date: "20 May 2026", category: "Software & Subscriptions", description: "Slack Pro subscription – May 2026", amount: "₦12,000", reference: "RCT-051", loggedBy: "Admin" },
  { id: "XPN-006", date: "14 May 2026", category: "Travel & Transport", description: "BlueStar site visit – Apapa Road", amount: "₦22,000", reference: "RCT-049", loggedBy: "Emeka Okafor" },
  { id: "XPN-005", date: "8 May 2026", category: "Office Supplies", description: "Stationery restock for Q2", amount: "₦8,500", reference: "RCT-047", loggedBy: "Sade Williams" },
  { id: "XPN-004", date: "2 May 2026", category: "Software & Subscriptions", description: "Zoom annual subscription renewal", amount: "₦35,000", reference: "RCT-045", loggedBy: "Admin" },
  { id: "XPN-003", date: "18 Apr 2026", category: "Marketing & Advertising", description: "LinkedIn sponsored campaign – Apr 2026", amount: "₦120,000", reference: "RCT-041", loggedBy: "Admin" },
  { id: "XPN-002", date: "5 Apr 2026", category: "Agent Commissions", description: "Emeka Okafor commission – INV-001 (Zenith HRIS Deployment)", amount: "₦52,675", reference: "COM-001", loggedBy: "Admin" },
  { id: "XPN-001", date: "3 Apr 2026", category: "Travel & Transport", description: "Client visit to Zenith Technologies office, VI", amount: "₦15,000", reference: "RCT-038", loggedBy: "Emeka Okafor" },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [logOpen, setLogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeExpense, setActiveExpense] = useState<Expense | null>(null);

  const totalExpenses = expenses.reduce((sum, e) => {
    return sum + parseFloat(e.amount.replace(/[₦,]/g, ""));
  }, 0);

  const thisMonth = expenses
    .filter((e) => e.date.includes("May 2026"))
    .reduce((sum, e) => sum + parseFloat(e.amount.replace(/[₦,]/g, "")), 0);

  const topCategory = (() => {
    const counts: Record<string, number> = {};
    expenses.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + parseFloat(e.amount.replace(/[₦,]/g, ""));
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  })();

  const handleDelete = () => {
    if (activeExpense) {
      setExpenses((prev) => prev.filter((e) => e.id !== activeExpense.id));
    }
    setDeleteOpen(false);
    setActiveExpense(null);
  };

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Expenses</h1>
          <p className="mt-1 text-sm text-slate-500">
            {expenses.length} expense entries logged
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            ⬇ Export CSV
          </button>
          <button
            onClick={() => setLogOpen(true)}
            className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
          >
            + Log Expense
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            ₦{totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">This Month</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {thisMonth > 0 ? `₦${thisMonth.toLocaleString()}` : "₦0"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Total Entries</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {expenses.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Top Category</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 leading-tight">
            {topCategory}
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search description or reference…"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        </div>
        <select className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none">
          <option>All Categories</option>
          <option>Software & Subscriptions</option>
          <option>Travel & Transport</option>
          <option>Office Supplies</option>
          <option>Marketing & Advertising</option>
          <option>Agent Commissions</option>
        </select>
        <input type="date" className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none" />
        <input type="date" className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Reference</th>
              <th className="px-6 py-3 font-medium">Logged By</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {exp.id}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {exp.date}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {exp.category}
                </td>
                <td className="px-6 py-3 text-base text-slate-700 max-w-xs">
                  {exp.description}
                </td>
                <td className="px-6 py-3 text-base tabular-nums font-medium text-slate-800 whitespace-nowrap">
                  {exp.amount}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {exp.reference}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {exp.loggedBy}
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => { setActiveExpense(exp); setEditOpen(true); }}
                    className="mr-3 rounded p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-600"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => { setActiveExpense(exp); setDeleteOpen(true); }}
                    className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                  >
                    <RiDeleteBin6Line size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Footer total */}
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50">
              <td colSpan={4} className="px-6 py-3 text-sm font-medium text-slate-700">
                {expenses.length} entries shown
              </td>
              <td className="px-6 py-3 text-base tabular-nums font-semibold text-slate-900">
                ₦{totalExpenses.toLocaleString()}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modals */}
      <LogExpenseModal open={logOpen} onClose={() => setLogOpen(false)} />
      <EditExpenseModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        expense={activeExpense}
      />
      <DeleteExpenseModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        expenseId={activeExpense?.id ?? null}
        onConfirm={handleDelete}
      />
    </section>
  );
}